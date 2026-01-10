import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function CalendarPage() {
  return (
    <div className="h-full">
      <DashboardHeader
        title={
          <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent flex items-center gap-2">
            <CalendarIcon className="h-6 w-6" />
            Calendar
          </span>
        }
        subtitle="View your schedule, deadlines, and important dates"
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Month
            </Button>
            <Button variant="outline" size="sm">
              Week
            </Button>
            <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" size="sm">
              Today
            </Button>
          </div>
        }
      />

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar View */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>December 2024</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid Placeholder */}
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 35 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="aspect-square p-2 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer flex items-center justify-center text-sm"
                    >
                      {idx < 31 ? idx + 1 : ''}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Events Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { title: 'Math Exam', date: 'Dec 15', time: '10:00 AM', type: 'exam' },
                      { title: 'Project Deadline', date: 'Dec 18', time: '11:59 PM', type: 'deadline' },
                      { title: 'Study Session', date: 'Dec 20', time: '2:00 PM', type: 'study' },
                    ].map((event, idx) => (
                      <Card key={idx} className="hover:bg-accent/50 transition-colors">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-medium text-sm">{event.title}</h3>
                            {event.type === 'exam' && (
                              <AlertCircle className="h-4 w-4 text-orange-500" />
                            )}
                            {event.type === 'deadline' && (
                              <Clock className="h-4 w-4 text-red-500" />
                            )}
                            {event.type === 'study' && (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{event.date} • {event.time}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                <CardHeader>
                  <CardTitle>This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">Events</span>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-500/20 bg-green-500/10">
                        12
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="text-sm text-muted-foreground">Deadlines</span>
                      </div>
                      <Badge variant="outline" className="text-orange-600 border-orange-500/20 bg-orange-500/10">
                        5
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-muted-foreground">Study Sessions</span>
                      </div>
                      <Badge variant="outline" className="text-blue-600 border-blue-500/20 bg-blue-500/10">
                        8
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

