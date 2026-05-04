'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Palette, 
  Database,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Key,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  Moon,
  Sun,
  Monitor,
  Volume2,
  Wifi,
  Lock,
  Eye,
  EyeOff,
  Save
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState<Record<string, any>>({
    name: 'John Doe',
    email: 'john.anderson@ganttflow.com',
    company: 'Construction Corp',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    timezone: 'UTC-5',
    language: 'English',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12-hour',
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    projectUpdates: true,
    teamInvites: true,
    twoFactorAuth: false,
    sessionTimeout: '24 hours',
    dataExport: true,
    apiAccess: false,
    theme: 'light',
    compactView: false,
    showWeekends: true,
    autoSave: true,
    soundEnabled: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast({
      title: 'Settings Saved',
      description: 'Your settings have been updated successfully',
    });
  };

  const handlePasswordChange = async () => {
    toast({
      title: 'Password Changed',
      description: 'Your password has been updated successfully',
    });
  };

  const handleExportData = async () => {
    toast({
      title: 'Data Export Started',
      description: 'Your data is being prepared for download',
    });
  };

  const handleDeleteAccount = async () => {
    toast({
      variant: 'destructive',
      title: 'Account Deletion',
      description: 'This action is irreversible. Please confirm to proceed.',
    });
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'preferences', name: 'Preferences', icon: Globe },
    { id: 'advanced', name: 'Advanced', icon: Settings }
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Personal Information</CardTitle>
          <CardDescription className="text-gray-600 font-medium">Update your personal details and contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="text-sm font-bold text-gray-700">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white/50 backdrop-blur-xl border-gray-200/50 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-bold text-gray-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="bg-white/50 backdrop-blur-xl border-gray-200/50 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="company" className="text-sm font-bold text-gray-700">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="bg-white/50 backdrop-blur-xl border-gray-200/50 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm font-bold text-gray-700">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-white/50 backdrop-blur-xl border-gray-200/50 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="location" className="text-sm font-bold text-gray-700">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="bg-white/50 backdrop-blur-xl border-gray-200/50 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="timezone" className="text-sm font-bold text-gray-700">Timezone</Label>
              <select
                id="timezone"
                value={formData.timezone}
                onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-xl focus:ring-2 focus:ring-purple-500"
              >
                <option value="UTC-8">Pacific Time (UTC-8)</option>
                <option value="UTC-5">Eastern Time (UTC-5)</option>
                <option value="UTC+0">London (UTC+0)</option>
                <option value="UTC+1">Paris (UTC+1)</option>
                <option value="UTC+8">Beijing (UTC+8)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Change Password</CardTitle>
          <CardDescription className="text-gray-600 font-medium">Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-password" className="text-sm font-bold text-gray-700">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  className="bg-white/50 backdrop-blur-xl border-gray-200/50 focus:ring-2 focus:ring-purple-500"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="new-password" className="text-sm font-bold text-gray-700">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                className="bg-white/50 backdrop-blur-xl border-gray-200/50 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password" className="text-sm font-bold text-gray-700">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                className="bg-white/50 backdrop-blur-xl border-gray-200/50 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <Button onClick={handlePasswordChange} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transition-all shadow-lg shadow-blue-500/30">
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Email Notifications</CardTitle>
          <CardDescription className="text-gray-600 font-medium">Choose what email notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 hover:shadow-lg transition-all">
              <div>
                <h4 className="font-bold text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600 font-medium">Receive email updates about your projects</p>
              </div>
              <input
                type="checkbox"
                checked={formData.emailNotifications}
                onChange={(e) => setFormData(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                className="rounded w-5 h-5 accent-purple-500"
              />
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 hover:shadow-lg transition-all">
              <div>
                <h4 className="font-bold text-gray-900">Weekly Reports</h4>
                <p className="text-sm text-gray-600 font-medium">Get weekly summaries of your project activity</p>
              </div>
              <input
                type="checkbox"
                checked={formData.weeklyReports}
                onChange={(e) => setFormData(prev => ({ ...prev, weeklyReports: e.target.checked }))}
                className="rounded w-5 h-5 accent-purple-500"
              />
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 hover:shadow-lg transition-all">
              <div>
                <h4 className="font-bold text-gray-900">Project Updates</h4>
                <p className="text-sm text-gray-600 font-medium">Notifications when projects are updated</p>
              </div>
              <input
                type="checkbox"
                checked={formData.projectUpdates}
                onChange={(e) => setFormData(prev => ({ ...prev, projectUpdates: e.target.checked }))}
                className="rounded w-5 h-5 accent-purple-500"
              />
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 hover:shadow-lg transition-all">
              <div>
                <h4 className="font-bold text-gray-900">Team Invites</h4>
                <p className="text-sm text-gray-600 font-medium">When someone invites you to a project</p>
              </div>
              <input
                type="checkbox"
                checked={formData.teamInvites}
                onChange={(e) => setFormData(prev => ({ ...prev, teamInvites: e.target.checked }))}
                className="rounded w-5 h-5 accent-purple-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Push Notifications</CardTitle>
          <CardDescription className="text-gray-600 font-medium">Manage browser push notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 hover:shadow-lg transition-all">
            <div>
              <h4 className="font-bold text-gray-900">Push Notifications</h4>
              <p className="text-sm text-gray-600 font-medium">Receive browser notifications for important updates</p>
            </div>
            <input
              type="checkbox"
              checked={formData.pushNotifications}
              onChange={(e) => setFormData(prev => ({ ...prev, pushNotifications: e.target.checked }))}
              className="rounded w-5 h-5 accent-purple-500"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Two-Factor Authentication</CardTitle>
          <CardDescription className="text-gray-600 font-medium">Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 hover:shadow-lg transition-all">
            <div>
              <h4 className="font-bold text-gray-900">Enable 2FA</h4>
              <p className="text-sm text-gray-600 font-medium">Require authentication code when signing in</p>
            </div>
            <input
              type="checkbox"
              checked={formData.twoFactorAuth}
              onChange={(e) => setFormData(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
              className="rounded w-5 h-5 accent-purple-500"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Session Management</CardTitle>
          <CardDescription className="text-gray-600 font-medium">Control how long you stay signed in</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="session-timeout" className="text-sm font-bold text-gray-700">Session Timeout</Label>
            <select
              id="session-timeout"
              value={formData.sessionTimeout}
              onChange={(e) => setFormData(prev => ({ ...prev, sessionTimeout: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-xl focus:ring-2 focus:ring-purple-500"
            >
              <option value="1 hour">1 hour</option>
              <option value="8 hours">8 hours</option>
              <option value="24 hours">24 hours</option>
              <option value="1 week">1 week</option>
              <option value="never">Never</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">API Access</CardTitle>
          <CardDescription className="text-gray-600 font-medium">Manage API keys and access permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 hover:shadow-lg transition-all">
            <div>
              <h4 className="font-bold text-gray-900">API Access</h4>
              <p className="text-sm text-gray-600 font-medium">Allow third-party applications to access your data</p>
            </div>
            <input
              type="checkbox"
              checked={formData.apiAccess}
              onChange={(e) => setFormData(prev => ({ ...prev, apiAccess: e.target.checked }))}
              className="rounded w-5 h-5 accent-purple-500"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Appearance</CardTitle>
          <CardDescription className="text-gray-600 font-medium">Customize the look and feel of your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-bold text-gray-700">Theme</Label>
              <div className="flex gap-3 mt-2">
                <Button
                  variant={formData.theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setFormData(prev => ({ ...prev, theme: 'light' }))}
                  className={formData.theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all'}
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </Button>
                <Button
                  variant={formData.theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setFormData(prev => ({ ...prev, theme: 'dark' }))}
                  className={formData.theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all'}
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </Button>
                <Button
                  variant={formData.theme === 'system' ? 'default' : 'outline'}
                  onClick={() => setFormData(prev => ({ ...prev, theme: 'system' }))}
                  className={formData.theme === 'system' ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all'}
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  System
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 hover:shadow-lg transition-all">
              <div>
                <h4 className="font-bold text-gray-900">Compact View</h4>
                <p className="text-sm text-gray-600 font-medium">Use a more compact layout</p>
              </div>
              <input
                type="checkbox"
                checked={formData.compactView}
                onChange={(e) => setFormData(prev => ({ ...prev, compactView: e.target.checked }))}
                className="rounded w-5 h-5 accent-purple-500"
              />
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 hover:shadow-lg transition-all">
              <div>
                <h4 className="font-bold text-gray-900">Show Weekends</h4>
                <p className="text-sm text-gray-600 font-medium">Display weekends in Gantt charts</p>
              </div>
              <input
                type="checkbox"
                checked={formData.showWeekends}
                onChange={(e) => setFormData(prev => ({ ...prev, showWeekends: e.target.checked }))}
                className="rounded w-5 h-5 accent-purple-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Language & Region</CardTitle>
          <CardDescription className="text-gray-600 font-medium">Set your language and regional preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="language" className="text-sm font-bold text-gray-700">Language</Label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-xl focus:ring-2 focus:ring-purple-500"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Chinese">Chinese</option>
              </select>
            </div>
            <div>
              <Label htmlFor="date-format" className="text-sm font-bold text-gray-700">Date Format</Label>
              <select
                id="date-format"
                value={formData.dateFormat}
                onChange={(e) => setFormData(prev => ({ ...prev, dateFormat: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-xl focus:ring-2 focus:ring-purple-500"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <Label htmlFor="time-format" className="text-sm font-bold text-gray-700">Time Format</Label>
              <select
                id="time-format"
                value={formData.timeFormat}
                onChange={(e) => setFormData(prev => ({ ...prev, timeFormat: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200/50 rounded-xl bg-white/50 backdrop-blur-xl focus:ring-2 focus:ring-purple-500"
              >
                <option value="12-hour">12-hour</option>
                <option value="24-hour">24-hour</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Data Management</CardTitle>
          <CardDescription className="text-gray-600 font-medium">Export or delete your account data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 hover:shadow-lg transition-all">
              <div>
                <h4 className="font-bold text-gray-900">Data Export</h4>
                <p className="text-sm text-gray-600 font-medium">Download all your project data</p>
              </div>
              <input
                type="checkbox"
                checked={formData.dataExport}
                onChange={(e) => setFormData(prev => ({ ...prev, dataExport: e.target.checked }))}
                className="rounded w-5 h-5 accent-purple-500"
              />
            </div>
            <Button onClick={handleExportData} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transition-all shadow-lg shadow-blue-500/30">
              <Download className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Auto-Save</CardTitle>
          <CardDescription className="text-gray-600 font-medium">Configure automatic saving of your work</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-gray-200/50 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 hover:shadow-lg transition-all">
            <div>
              <h4 className="font-bold text-gray-900">Enable Auto-Save</h4>
              <p className="text-sm text-gray-600 font-medium">Automatically save your work every 5 minutes</p>
            </div>
            <input
              type="checkbox"
              checked={formData.autoSave}
              onChange={(e) => setFormData(prev => ({ ...prev, autoSave: e.target.checked }))}
              className="rounded w-5 h-5 accent-purple-500"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-xl border border-red-200/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-red-600">Danger Zone</CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            Irreversible actions that will affect your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-red-200/50 rounded-xl bg-gradient-to-r from-red-50 to-orange-50">
              <div>
                <h4 className="font-bold text-gray-900">Delete Account</h4>
                <p className="text-sm text-gray-600 font-medium">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="destructive" onClick={handleDeleteAccount} className="bg-gradient-to-r from-red-500 to-orange-500 hover:shadow-xl transition-all shadow-lg shadow-red-500/30">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'security':
        return renderSecurityTab();
      case 'preferences':
        return renderPreferencesTab();
      case 'advanced':
        return renderAdvancedTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-8 py-4 shadow-xl">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:shadow-lg transition-all">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Settings</h1>
              <p className="text-gray-600 font-medium">Manage your account settings and preferences</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                            activeTab === tab.id
                              ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 shadow-lg shadow-blue-500/20 border border-blue-200/50'
                              : 'text-gray-700 hover:bg-gradient-to-r from-gray-50 to-blue-50 hover:shadow-lg'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-bold">{tab.name}</span>
                        </button>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {renderTabContent()}
              
              {/* Save Button */}
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveSettings} disabled={isSaving} className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:shadow-xl transition-all shadow-lg shadow-purple-500/30">
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
