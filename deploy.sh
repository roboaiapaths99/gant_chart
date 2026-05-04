#!/bin/bash
# ============================================
# GanttFlow VPS Deployment Script
# For Hostinger VPS (Ubuntu/Debian)
# ============================================
set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; exit 1; }
info() { echo -e "${BLUE}[i]${NC} $1"; }

DOMAIN="${1:-}"
APP_DIR="/var/www/ganttflow"
REPO_URL="${2:-}"

echo ""
echo "================================================"
echo "  GanttFlow Production Deployment"
echo "  Hostinger VPS Setup Script"
echo "================================================"
echo ""

# ---- Check if running as root ----
if [ "$EUID" -ne 0 ]; then
  error "Please run as root: sudo bash deploy.sh yourdomain.com"
fi

if [ -z "$DOMAIN" ]; then
  error "Usage: sudo bash deploy.sh yourdomain.com [git-repo-url]"
fi

log "Starting deployment for domain: $DOMAIN"

# =============================================
# STEP 1: System Updates & Dependencies
# =============================================
info "Step 1: Installing system dependencies..."

apt-get update -qq
apt-get upgrade -y -qq
apt-get install -y -qq \
  curl \
  git \
  ufw \
  fail2ban \
  nginx \
  certbot \
  python3-certbot-nginx \
  ca-certificates \
  gnupg \
  lsb-release

log "System dependencies installed"

# =============================================
# STEP 2: Install Docker
# =============================================
if ! command -v docker &>/dev/null; then
  info "Step 2: Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
  log "Docker installed"
else
  log "Docker already installed"
fi

# Install Docker Compose plugin if not present
if ! docker compose version &>/dev/null; then
  info "Installing Docker Compose plugin..."
  apt-get install -y docker-compose-plugin
  log "Docker Compose plugin installed"
else
  log "Docker Compose already available"
fi

# =============================================
# STEP 3: Install Node.js 20 LTS (for Prisma CLI)
# =============================================
if ! command -v node &>/dev/null; then
  info "Step 3: Installing Node.js 20 LTS..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
  log "Node.js installed: $(node -v)"
else
  log "Node.js already installed: $(node -v)"
fi

# =============================================
# STEP 4: Firewall Configuration
# =============================================
info "Step 4: Configuring firewall..."

ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

log "Firewall configured (SSH, HTTP, HTTPS allowed)"

# =============================================
# STEP 5: Fail2Ban Configuration
# =============================================
info "Step 5: Configuring Fail2Ban..."

cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
maxretry = 3

[nginx-http-auth]
enabled = true
port = http,https
logpath = %(nginx_error_log)s

[nginx-limit-req]
enabled = true
port = http,https
logpath = %(nginx_error_log)s
maxretry = 10
EOF

systemctl enable fail2ban
systemctl restart fail2ban
log "Fail2Ban configured"

# =============================================
# STEP 6: Create App Directory & Clone
# =============================================
info "Step 6: Setting up application directory..."

mkdir -p "$APP_DIR"
mkdir -p /var/log/ganttflow

if [ -n "$REPO_URL" ]; then
  if [ -d "$APP_DIR/.git" ]; then
    cd "$APP_DIR"
    git pull origin main
    log "Repository updated"
  else
    git clone "$REPO_URL" "$APP_DIR"
    log "Repository cloned"
  fi
else
  warn "No git repo URL provided. Copy your project files to $APP_DIR manually."
fi

cd "$APP_DIR"

# =============================================
# STEP 7: Environment Configuration
# =============================================
info "Step 7: Setting up environment..."

if [ ! -f "$APP_DIR/.env" ]; then
  # Generate a secure NEXTAUTH_SECRET
  NEXTAUTH_SECRET=$(openssl rand -base64 32)
  DB_PASSWORD=$(openssl rand -base64 24 | tr -d '=/+')

  cat > "$APP_DIR/.env" << EOF
# Auto-generated on $(date)
NEXT_PUBLIC_APP_URL=https://$DOMAIN

DB_USER=ganttflow
DB_PASSWORD=$DB_PASSWORD
DATABASE_URL=postgresql://ganttflow:$DB_PASSWORD@db:5432/ganttflow

NEXTAUTH_SECRET=$NEXTAUTH_SECRET
NEXTAUTH_URL=https://$DOMAIN

# Fill in these values manually:
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
STRIPE_BUSINESS_PRICE_ID=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
EOF

  chmod 600 "$APP_DIR/.env"
  log "Environment file created with auto-generated secrets"
  warn "Edit $APP_DIR/.env to add Google/Stripe keys if needed"
else
  log "Environment file already exists"
fi

# =============================================
# STEP 8: Nginx Configuration
# =============================================
info "Step 8: Configuring Nginx..."

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Create Nginx config (replace domain placeholder)
if [ -f "$APP_DIR/nginx/ganttflow.conf" ]; then
  sed "s/YOUR_DOMAIN.com/$DOMAIN/g" "$APP_DIR/nginx/ganttflow.conf" > /etc/nginx/sites-available/ganttflow.conf
else
  # Create inline if nginx dir wasn't copied
  cat > /etc/nginx/sites-available/ganttflow.conf << NGINX_EOF
limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone \$binary_remote_addr zone=login:10m rate=5r/m;

upstream ganttflow_app {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://ganttflow_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX_EOF
fi

ln -sf /etc/nginx/sites-available/ganttflow.conf /etc/nginx/sites-enabled/ganttflow.conf

# Test Nginx config
nginx -t
systemctl reload nginx

log "Nginx configured"

# =============================================
# STEP 9: SSL Certificate (Let's Encrypt)
# =============================================
info "Step 9: Setting up SSL certificate..."

mkdir -p /var/www/certbot

# Get SSL certificate
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email "admin@$DOMAIN" --redirect || {
  warn "SSL certificate setup failed. You can retry manually:"
  warn "  sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
}

# Set up auto-renewal
(crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'") | sort -u | crontab -

log "SSL configured with auto-renewal"

# =============================================
# STEP 10: Build & Deploy with Docker
# =============================================
info "Step 10: Building and deploying application..."

cd "$APP_DIR"

# Build and start
docker compose --env-file .env build --no-cache
docker compose --env-file .env up -d

# Wait for DB to be healthy
info "Waiting for database to be ready..."
sleep 10

# Run Prisma migrations
docker compose exec -T app npx prisma migrate deploy 2>/dev/null || {
  warn "Prisma migrate deploy failed, trying db push..."
  docker compose exec -T app npx prisma db push
}

log "Application deployed and running"

# =============================================
# STEP 11: Create Update Script
# =============================================
info "Step 11: Creating update script..."

cat > "$APP_DIR/update.sh" << 'UPDATE_EOF'
#!/bin/bash
set -euo pipefail
cd /var/www/ganttflow

echo "Pulling latest changes..."
git pull origin main

echo "Rebuilding Docker image..."
docker compose --env-file .env build --no-cache

echo "Restarting services..."
docker compose --env-file .env up -d

echo "Running database migrations..."
sleep 5
docker compose exec -T app npx prisma migrate deploy 2>/dev/null || \
  docker compose exec -T app npx prisma db push

echo "Cleaning up old images..."
docker image prune -f

echo "✓ Update complete!"
docker compose ps
UPDATE_EOF

chmod +x "$APP_DIR/update.sh"
log "Update script created at $APP_DIR/update.sh"

# =============================================
# STEP 12: Create Backup Script
# =============================================
info "Step 12: Creating backup script..."

mkdir -p /var/backups/ganttflow

cat > "$APP_DIR/backup.sh" << 'BACKUP_EOF'
#!/bin/bash
set -euo pipefail
BACKUP_DIR="/var/backups/ganttflow"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "Backing up database..."
docker compose -f /var/www/ganttflow/docker-compose.yml exec -T db \
  pg_dump -U ganttflow ganttflow | gzip > "$BACKUP_DIR/db_$TIMESTAMP.sql.gz"

echo "Cleaning old backups (keeping last 7)..."
ls -t "$BACKUP_DIR"/db_*.sql.gz | tail -n +8 | xargs -r rm

echo "✓ Backup complete: $BACKUP_DIR/db_$TIMESTAMP.sql.gz"
ls -lh "$BACKUP_DIR"/db_*.sql.gz
BACKUP_EOF

chmod +x "$APP_DIR/backup.sh"

# Add daily backup cron job
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/ganttflow/backup.sh >> /var/log/ganttflow/backup.log 2>&1") | sort -u | crontab -

log "Backup script created with daily cron job"

# =============================================
# FINAL SUMMARY
# =============================================
echo ""
echo "================================================"
echo -e "  ${GREEN}✓ DEPLOYMENT COMPLETE!${NC}"
echo "================================================"
echo ""
echo "  Domain:     https://$DOMAIN"
echo "  App Dir:    $APP_DIR"
echo "  Env File:   $APP_DIR/.env"
echo ""
echo "  Useful Commands:"
echo "  ─────────────────────────────────────────────"
echo "  View logs:      docker compose -f $APP_DIR/docker-compose.yml logs -f"
echo "  Restart app:    docker compose -f $APP_DIR/docker-compose.yml restart"
echo "  Update app:     bash $APP_DIR/update.sh"
echo "  Backup DB:      bash $APP_DIR/backup.sh"
echo "  App status:     docker compose -f $APP_DIR/docker-compose.yml ps"
echo "  DB shell:       docker compose -f $APP_DIR/docker-compose.yml exec db psql -U ganttflow"
echo ""
echo -e "  ${YELLOW}[!] Remember to edit $APP_DIR/.env for Google/Stripe keys${NC}"
echo ""
