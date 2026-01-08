'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  GraduationCap, 
  User,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

const navigation = [
  {
    name: 'Dashboard',
    href: ROUTES.private.dashboard,
    icon: LayoutDashboard,
    color: 'from-blue-500 to-blue-600',
    hoverColor: 'hover:from-blue-600 hover:to-blue-700',
  },
  {
    name: 'Semester',
    href: ROUTES.private.dashboardSemester,
    icon: GraduationCap,
    color: 'from-purple-500 to-purple-600',
    hoverColor: 'hover:from-purple-600 hover:to-purple-700',
  },
  {
    name: 'Calendar',
    href: ROUTES.private.dashboardCalendar,
    icon: Calendar,
    color: 'from-green-500 to-green-600',
    hoverColor: 'hover:from-green-600 hover:to-green-700',
  },
  {
    name: 'Profile',
    href: ROUTES.private.dashboardProfile,
    icon: User,
    color: 'from-orange-500 to-orange-600',
    hoverColor: 'hover:from-orange-600 hover:to-orange-700',
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-lg hover:bg-accent transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-card via-card to-card/95 border-r border-border shadow-xl transform transition-transform duration-300 ease-in-out',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              StudyOS
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== ROUTES.private.dashboard && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-out',
                    'hover:scale-105 hover:shadow-lg',
                    isActive
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-105`
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full animate-pulse" />
                  )}

                  {/* Icon with animation */}
                  <div
                    className={cn(
                      'p-2 rounded-lg transition-all duration-300',
                      isActive
                        ? 'bg-white/20 backdrop-blur-sm'
                        : `bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5 transition-transform duration-300',
                        isActive
                          ? 'text-white'
                          : 'text-foreground group-hover:scale-110'
                      )}
                    />
                  </div>

                  {/* Label */}
                  <span className="font-medium flex-1">{item.name}</span>

                  {/* Hover effect */}
                  {!isActive && (
                    <div
                      className={cn(
                        'absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300',
                        item.color
                      )}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer decoration */}
          <div className="px-4 py-4 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              <p className="font-medium">StudyOS v1.0</p>
              <p className="text-[10px] mt-1">Your Academic OS</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

