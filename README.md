# GanttFlow

Upload a spreadsheet. Get a professional Gantt chart.

## Overview

GanttFlow is a SaaS platform that allows construction project managers to download an Excel template, fill it with task data, re-upload it, and get a beautiful, exportable Gantt chart.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (via Supabase)
- **Auth**: NextAuth.js with JWT + credentials
- **Gantt Library**: dhtmlx-gantt
- **Excel Parsing**: SheetJS (xlsx)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (use Supabase for easy setup)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual values:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate a random string (e.g., `openssl rand -base64 32`)
- `NEXTAUTH_URL`: `http://localhost:3000` for local development

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Features

- **Excel Template Download**: Pre-formatted template with all required columns
- **Excel Parsing**: Supports .xlsx and .xls files with multiple date formats
- **Interactive Gantt Chart**: Drag, resize, and edit tasks
- **Task Dependencies**: Visual dependency arrows between tasks
- **Color Coding**: Automatic color assignment by resource
- **Export Options**: Export as PDF or PNG
- **Public Sharing**: Generate shareable links for your charts
- **Plan Limits**: Free, Pro, and Business tiers with different limits

## Project Structure

```
ganttflow/
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── (dashboard)/     # Protected dashboard pages
│   ├── share/           # Public share pages
│   └── api/             # API routes
├── components/
│   ├── gantt/           # Gantt chart components
│   ├── ui/              # shadcn/ui components
│   └── upload/          # Upload flow components
├── lib/
│   ├── prisma.ts        # Prisma client
│   ├── auth.ts          # NextAuth configuration
│   ├── excel-parser.ts  # Excel parsing logic
│   └── template-generator.ts  # Excel template generation
├── prisma/
│   └── schema.prisma    # Database schema
└── types/
    └── index.ts         # TypeScript types
```

## Database Schema

- **User**: User accounts with plan tiers
- **Project**: Projects belonging to users
- **Task**: Tasks within projects with dates, dependencies, and progress
- **Account/Session**: NextAuth authentication models

## Excel Template Columns

| Column | Description | Format |
|--------|-------------|---------|
| ID | Unique task identifier | Number |
| Task Name | Name of the task | Text |
| Duration (days) | How long the task takes | Number |
| Start Date | When the task begins | DD-MM-YY |
| Finish Date | When the task ends | DD-MM-YY |
| Predecessors | Task IDs that must finish first | Comma-separated |
| Resource Names | Who is responsible | Text |
| Progress (%) | Completion percentage | 0-100 |

## API Routes

- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth authentication
- `GET /api/template` - Download Excel template
- `POST /api/upload` - Upload and parse Excel file
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get specific project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project
- `GET /api/share/[token]` - Get public project

## Deployment

The application is designed to be deployed on Vercel with Supabase as the database provider.

### Environment Variables for Production

Set these in your Vercel project settings:
- All variables from `.env.local.example`
- `NEXTAUTH_URL` should be your production domain
- `DATABASE_URL` should be your Supabase connection string

## License

MIT
