import { requireCachedUser } from '@/context/userContext';
import { 
  User, 
  Mail, 
  Calendar, 
  Settings, 
  LogOut,
  Bell,
  Moon,
  Clock
} from 'lucide-react';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default async function ProfilePage() {
  const user = await requireCachedUser();

  return (
    <div className="h-full">
      <DashboardHeader
        title={
          <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent flex items-center gap-2">
            <User className="h-6 w-6" />
            Profile
          </span>
        }
        subtitle="Manage your account settings and preferences"
      />

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <Avatar className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600">
                  <AvatarFallback className="text-3xl font-bold text-white bg-gradient-to-br from-orange-500 to-orange-600">
                    {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <CardTitle className="text-2xl mb-2">{user?.name || 'User'}</CardTitle>
                  <CardDescription className="mb-4">{user?.email}</CardDescription>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Member since 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <label className="text-sm font-medium mb-2 block">Display Name</label>
                <input
                  type="text"
                  defaultValue={user?.name || ''}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your name"
                />
              </div>
              <Separator />
              <div className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <label className="text-sm font-medium mb-2 block">Email Address</label>
                <input
                  type="email"
                  defaultValue={user?.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                />
                <CardDescription className="mt-1">Email cannot be changed</CardDescription>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <CardDescription>Receive updates via email</CardDescription>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Moon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <CardDescription>Switch to dark theme</CardDescription>
                  </div>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Study Reminders</p>
                    <CardDescription>Get reminders for study sessions</CardDescription>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Sign Out Section */}
          <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="mb-1 flex items-center gap-2 text-red-600">
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </CardTitle>
                  <CardDescription>
                    Sign out of your StudyOS account
                  </CardDescription>
                </div>
                <SignOutButton />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

