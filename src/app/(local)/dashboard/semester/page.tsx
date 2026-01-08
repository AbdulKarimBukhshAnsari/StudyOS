import { GraduationCap, Plus, BookOpen, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SemesterPage() {
  return (
    <div className="h-full">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
                <GraduationCap className="h-6 w-6" />
                Semester Management
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Organize and manage your academic semesters
              </p>
            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <Plus className="h-4 w-4" />
              New Semester
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Empty State */}
          <Card>
            <CardContent className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center">
                  <GraduationCap className="h-10 w-10 text-purple-600" />
                </div>
                <CardTitle className="text-2xl mb-2">No Semesters Yet</CardTitle>
                <CardDescription className="mb-6">
                  Get started by creating your first semester. Organize your courses, track your progress, and stay on top of your academic goals.
                </CardDescription>
                <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <Plus className="h-5 w-5" />
                  Create Your First Semester
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
              <CardContent className="p-6">
                <BookOpen className="h-8 w-8 text-purple-600 mb-4" />
                <CardTitle className="text-base mb-2">Course Management</CardTitle>
                <CardDescription>
                  Add and organize all your courses for each semester with ease.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
              <CardContent className="p-6">
                <CalendarIcon className="h-8 w-8 text-purple-600 mb-4" />
                <CardTitle className="text-base mb-2">Schedule Tracking</CardTitle>
                <CardDescription>
                  Keep track of important dates, exams, and deadlines.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
              <CardContent className="p-6">
                <GraduationCap className="h-8 w-8 text-purple-600 mb-4" />
                <CardTitle className="text-base mb-2">Progress Monitoring</CardTitle>
                <CardDescription>
                  Monitor your academic progress and achievements.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

