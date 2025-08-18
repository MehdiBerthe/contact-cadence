import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  Users, 
  Upload, 
  Settings, 
  Home,
  MessageSquare
} from 'lucide-react';

const navigationItems = [
  {
    path: '/',
    label: 'Today',
    icon: Calendar,
    description: 'Daily contact queue'
  },
  {
    path: '/contacts',
    label: 'Contacts',
    icon: Users,
    description: 'All contacts'
  },
  {
    path: '/import',
    label: 'Import',
    icon: Upload,
    description: 'CSV import'
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: Settings,
    description: 'App settings'
  }
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Keep in Touch</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                  className={cn(
                    'h-9',
                    isActive && 'bg-primary text-primary-foreground'
                  )}
                >
                  <Link to={item.path} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:block">{item.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}