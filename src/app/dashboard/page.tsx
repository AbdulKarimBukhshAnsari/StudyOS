import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { BookOpen, FileText, Brain, GraduationCap } from 'lucide-react';
import { SignOutButton } from '@/components/auth/SignOutButton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  // This should be handled by middleware, but adding as a safety check
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">StudyOS</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.name || user.email}
              </span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {user.name || 'Student'}! 👋
            </h2>
            <p className="text-muted-foreground text-lg">
              Ready to continue your learning journey?
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Semesters</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Notes</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Topics Studied</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                asChild
                variant="outline"
                className="h-auto p-6 flex flex-col items-start gap-2"
              >
                <Link href="/dashboard/semesters">
                  <BookOpen className="h-6 w-6 mb-2" />
                  <span className="font-semibold">Create Semester</span>
                  <span className="text-sm text-muted-foreground">
                    Start organizing your academic year
                  </span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto p-6 flex flex-col items-start gap-2"
              >
                <Link href="/dashboard/notes">
                  <FileText className="h-6 w-6 mb-2" />
                  <span className="font-semibold">Add Notes</span>
                  <span className="text-sm text-muted-foreground">
                    Create and organize your study notes
                  </span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              More features coming soon! 🚀
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

