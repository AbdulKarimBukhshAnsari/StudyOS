import { getCurrentUser } from '@/lib/auth-server';
import { 
  BookOpen, 
  FileText, 
  Brain, 
  TrendingUp, 
  Clock, 
  Target, 
  ArrowUpRight,
  GraduationCap,
  Calendar,
  User,
  Plus,
  CheckCircle,
  Edit
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="h-full">
      <DashboardHeader
        title="Dashboard Overview"
        subtitle={`Welcome back, ${user?.name || 'Student'}! 👋`}
      />

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-500/20 bg-blue-500/10">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +12%
                </Badge>
              </div>
              <CardDescription>Active Semesters</CardDescription>
              <CardTitle className="text-3xl font-bold text-blue-600 mt-1">3</CardTitle>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <Badge variant="outline" className="text-purple-600 border-purple-500/20 bg-purple-500/10">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +8%
                </Badge>
              </div>
              <CardDescription>Total Notes</CardDescription>
              <CardTitle className="text-3xl font-bold text-purple-600 mt-1">127</CardTitle>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <Badge variant="outline" className="text-green-600 border-green-500/20 bg-green-500/10">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +24%
                </Badge>
              </div>
              <CardDescription>Topics Studied</CardDescription>
              <CardTitle className="text-3xl font-bold text-green-600 mt-1">48</CardTitle>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <Badge variant="outline" className="text-orange-600 border-orange-500/20 bg-orange-500/10">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +15%
                </Badge>
              </div>
              <CardDescription>Study Streak</CardDescription>
              <CardTitle className="text-3xl font-bold text-orange-600 mt-1">12 days</CardTitle>
            </CardContent>
          </Card>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Created new note', subject: 'Mathematics - Calculus', time: '2 hours ago', icon: Plus },
                  { action: 'Updated semester', subject: 'Fall 2024', time: '5 hours ago', icon: Edit },
                  { action: 'Completed topic', subject: 'Linear Algebra', time: '1 day ago', icon: CheckCircle },
                ].map((activity, idx) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-primary/10 mt-0.5">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.subject}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Study Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Study Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { goal: 'Complete 5 topics this week', progress: 60 },
                  { goal: 'Study 2 hours daily', progress: 75 },
                  { goal: 'Review 10 notes', progress: 40 },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.goal}</span>
                      <span className="text-muted-foreground">{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Overview */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle>Application Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Semester Management</CardTitle>
                  </div>
                  <CardDescription>
                    Organize your academic semesters, track courses, and manage your study schedule efficiently.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Calendar Integration</CardTitle>
                  </div>
                  <CardDescription>
                    View your study schedule, deadlines, and important dates in a beautiful calendar interface.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Profile & Settings</CardTitle>
                  </div>
                  <CardDescription>
                    Manage your account settings, preferences, and personalize your StudyOS experience.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

