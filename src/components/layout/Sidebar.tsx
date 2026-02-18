import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  ClipboardListIcon, 
  UserIcon,
  SettingsIcon
} from 'lucide-react';
import { useAuth } from '@/hooks';
import { cn } from '@/utils';

interface SidebarProps {
  className?: string;
}

interface SidebarLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
  isActive?: boolean;
}

function SidebarLink({ href, icon, label, isActive }: SidebarLinkProps) {
  return (
    <Link 
      href={href}
      className={cn(
        'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
        isActive 
          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600 shadow-sm' 
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      <span className={cn('flex-shrink-0', isActive ? 'text-blue-600' : 'text-gray-500')}>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}

/**
 * Application sidebar with navigation links
 * Compact design with proper active states
 */
export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();

  const navigationLinks = [
    {
      href: '/dashboard',
      icon: <HomeIcon className="h-5 w-5" />,
      label: 'Dashboard',
    },
    {
      href: '/products',
      icon: <ShoppingBagIcon className="h-5 w-5" />,
      label: 'Products',
    },
    {
      href: '/orders',
      icon: <ClipboardListIcon className="h-5 w-5" />,
      label: 'Orders',
    },
    {
      href: '/profile',
      icon: <UserIcon className="h-5 w-5" />,
      label: 'Profile',
    },
  ];

  const adminLinks = [
    {
      href: '/admin',
      icon: <SettingsIcon className="h-5 w-5" />,
      label: 'Admin Panel',
    },
  ];

  return (
    <aside className={cn(
      'w-64 bg-white border-r border-gray-200 shadow-sm h-full overflow-y-auto',
      className
    )}>
      <div className="p-6">
        {/* User Info */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email
                }
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <div className="mb-6">
            {navigationLinks.map((link) => (
              <SidebarLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                isActive={pathname === link.href}
              />
            ))}
          </div>

          {/* Admin Section */}
          {isAdmin() && (
            <div className="pt-4 border-t border-gray-200">
              <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Administration
              </p>
              {adminLinks.map((link) => (
                <SidebarLink
                  key={link.href}
                  href={link.href}
                  icon={link.icon}
                  label={link.label}
                  isActive={pathname === link.href}
                />
              ))}
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
}