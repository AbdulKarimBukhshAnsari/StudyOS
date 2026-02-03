'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, CreditCard, HelpCircle, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUpdateTopicStatus } from '@/hooks/useSemesterQueries';
import { useToast } from '@/context/toastContext';
import { routeHelpers } from '@/constants/routes';
import type { Topic } from '@/types/semester';

interface TopicWorkspaceProps {
  topic: Topic;
  topicId: string;
  semesterId: string;
  subjectId: string;
  allTopics: Topic[];
}

export function TopicWorkspace({ 
  topic, 
  topicId, 
  semesterId, 
  subjectId, 
  allTopics 
}: TopicWorkspaceProps) {
  const router = useRouter();
  const toast = useToast();
  const [currentStatus, setCurrentStatus] = useState(topic.status);

  // TanStack Query mutation - handles loading state and cache invalidation automatically
  const updateStatusMutation = useUpdateTopicStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Clear':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
      case 'Somewhat Clear':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
    }
  };

  const handleTopicChange = (newTopicId: string) => {
    router.push(routeHelpers.topic(semesterId, subjectId, newTopicId));
  };

  const handleStatusChange = async (newStatus: 'Not Clear' | 'Somewhat Clear' | 'Clear') => {
    if (newStatus === currentStatus) return;

    updateStatusMutation.mutate(
      { topicId, subjectId, status: newStatus },
      {
        onSuccess: () => {
          setCurrentStatus(newStatus);
          toast.success('Topic status updated successfully');
          // No need for router.refresh() - TanStack Query invalidates the cache automatically!
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to update topic status');
        },
      }
    );
  };

  const statusLoading = updateStatusMutation.isPending;

  const handleBack = () => {
    router.push(routeHelpers.subject(semesterId, subjectId));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Topics
        </Button>
      </div>

      {/* Topic Navigation and Status */}
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Select Topic
          </label>
          <Select value={topicId} onValueChange={handleTopicChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a topic">
                <span className="font-medium">{topic.name}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent position="popper" className="w-[var(--radix-select-trigger-width)]">
              {allTopics.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  <div className="flex items-center justify-between w-full gap-4">
                    <span className="font-medium">{t.name}</span>
                    <Badge
                      variant="outline"
                      className={cn('text-xs', getStatusColor(t.status))}
                    >
                      {t.status}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Status
          </label>
          <Select 
            value={currentStatus} 
            onValueChange={handleStatusChange}
            disabled={statusLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                <Badge
                  variant="outline"
                  className={cn('text-xs', getStatusColor(currentStatus))}
                >
                  {currentStatus}
                </Badge>
              </SelectValue>
            </SelectTrigger>
            <SelectContent position="popper" className="w-[var(--radix-select-trigger-width)]">
              <SelectItem value="Not Clear">
                <Badge
                  variant="outline"
                  className={cn('text-xs', getStatusColor('Not Clear'))}
                >
                  Not Clear
                </Badge>
              </SelectItem>
              <SelectItem value="Somewhat Clear">
                <Badge
                  variant="outline"
                  className={cn('text-xs', getStatusColor('Somewhat Clear'))}
                >
                  Somewhat Clear
                </Badge>
              </SelectItem>
              <SelectItem value="Clear">
                <Badge
                  variant="outline"
                  className={cn('text-xs', getStatusColor('Clear'))}
                >
                  Clear
                </Badge>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Topic Info */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{topic.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Topic #{allTopics.findIndex(t => t.id === topicId) + 1} of {allTopics.length}
          </p>
        </div>
      </div>

      {/* Minimalistic Tabs */}
      <Tabs defaultValue="notes" className="w-full">
        <div className="border-b">
          <TabsList className="w-fit bg-transparent border-0 rounded-none h-auto p-0 gap-0">
            <TabsTrigger 
              value="notes"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 text-sm font-medium transition-colors hover:text-foreground"
            >
              <FileText className="h-4 w-4 mr-2" />
              Notes
            </TabsTrigger>
            <TabsTrigger 
              value="flashcard"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 text-sm font-medium transition-colors hover:text-foreground"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              FlashCard
            </TabsTrigger>
            <TabsTrigger 
              value="quiz"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 text-sm font-medium transition-colors hover:text-foreground"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Quiz
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="notes" className="mt-6">
          <div className="min-h-[400px] flex items-center justify-center border border-dashed rounded-lg bg-muted/20">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Notes functionality coming soon</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="flashcard" className="mt-6">
          <div className="min-h-[400px] flex items-center justify-center border border-dashed rounded-lg bg-muted/20">
            <div className="text-center">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">FlashCard functionality coming soon</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="quiz" className="mt-6">
          <div className="min-h-[400px] flex items-center justify-center border border-dashed rounded-lg bg-muted/20">
            <div className="text-center">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Quiz functionality coming soon</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

