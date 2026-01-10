'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Target,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubjectOverviewTabProps {
  subject: {
    id: string;
    name: string;
    description: string | null;
    priority: number;
    topic_count: number;
    quiz_count: number;
  };
}

export function SubjectOverviewTab({ subject }: SubjectOverviewTabProps) {
  // Calculate progress (50% default as per requirements, but can be enhanced later)
  const progress = 50;
  
  // Priority badge color
  const getPriorityColor = (priority: number) => {
    if (priority >= 5) return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
    if (priority >= 3) return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
    return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="border-2 bg-gradient-to-br from-card via-card to-card/95 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{subject.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getPriorityColor(subject.priority))}
                    >
                      <Target className="h-3 w-3 mr-1" />
                      Priority {subject.priority}
                    </Badge>
                  </div>
                </div>
              </div>
              {subject.description && (
                <p className="text-muted-foreground leading-relaxed max-w-2xl">
                  {subject.description}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-lg">Overall Progress</h3>
            </div>
            <span className="text-2xl font-bold text-blue-600">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2">
            Based on topics completed and quiz performance
          </p>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-500/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Total Topics
                  </span>
                </div>
                <p className="text-4xl font-bold text-foreground mt-2">
                  {subject.topic_count}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Topics available in this subject
                </p>
              </div>
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-500/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <HelpCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Total Quizzes
                  </span>
                </div>
                <p className="text-4xl font-bold text-foreground mt-2">
                  {subject.quiz_count}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Quizzes available for practice
                </p>
              </div>
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                <HelpCircle className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{subject.topic_count}</div>
            <div className="text-xs text-muted-foreground mt-1">Topics</div>
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{subject.quiz_count}</div>
            <div className="text-xs text-muted-foreground mt-1">Quizzes</div>
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{progress}%</div>
            <div className="text-xs text-muted-foreground mt-1">Progress</div>
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{subject.priority}</div>
            <div className="text-xs text-muted-foreground mt-1">Priority</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

