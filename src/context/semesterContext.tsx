'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { SemesterWithSubjectCount, SubjectWithTopicCount } from '@/serverActions/semester/action';

interface SemesterContextValue {
  semesters: SemesterWithSubjectCount[];
  currentSemester: {
    id: string;
    name: string;
    start_date: Date;
    end_date: Date;
    is_active: boolean;
    created_at: Date;
  } | null;
  currentSubjects: SubjectWithTopicCount[];
  getSemesterById: (id: string) => SemesterWithSubjectCount | undefined;
  getSubjectById: (id: string) => SubjectWithTopicCount | undefined;
}

const SemesterContext = createContext<SemesterContextValue | null>(null);

interface SemesterProviderProps {
  children: React.ReactNode;
  semesters: SemesterWithSubjectCount[];
  currentSemesterId?: string;
  currentSubjects?: SubjectWithTopicCount[];
}

export function SemesterProvider({
  children,
  semesters,
  currentSemesterId,
  currentSubjects = [],
}: SemesterProviderProps) {
  const value = useMemo(() => {
    const currentSemester = currentSemesterId
      ? semesters.find((s) => s.id === currentSemesterId)
      : null;

    return {
      semesters,
      currentSemester: currentSemester
        ? {
            id: currentSemester.id,
            name: currentSemester.name,
            start_date: currentSemester.start_date,
            end_date: currentSemester.end_date,
            is_active: currentSemester.is_active,
            created_at: currentSemester.created_at,
          }
        : null,
      currentSubjects,
      getSemesterById: (id: string) => semesters.find((s) => s.id === id),
      getSubjectById: (id: string) => currentSubjects.find((s) => s.id === id),
    };
  }, [semesters, currentSemesterId, currentSubjects]);

  return (
    <SemesterContext.Provider value={value}>
      {children}
    </SemesterContext.Provider>
  );
}

export function useSemesterContext() {
  const context = useContext(SemesterContext);
  if (!context) {
    throw new Error('useSemesterContext must be used within a SemesterProvider');
  }
  return context;
}

