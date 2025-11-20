'use client';

import { Home, Users, Book, BarChart, LogOut, Shield, FileText } from 'lucide-react'; // Icônes de Lucide
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import React, { memo, useMemo } from 'react';

import { cn } from '@/lib/utils'; // J'utilise votre fonction `cn`

/**
 * Configuration de la navigation de l'administration
 */
const ADMIN_NAVIGATION_CONFIG = [
  { id: 'dashboard', label: 'Tableau de bord', href: '/admin', icon: Home },
  { id: 'users', label: 'Utilisateurs', href: '/admin/users', icon: Users },
  { id: 'courses', label: 'Cours', href: '/admin/courses', icon: Book },
  { id: 'content', label: 'Contenu du site', href: '/admin/content', icon: FileText },
  { id: 'stats', label: 'Statistiques', href: '/admin/stats', icon: BarChart },
] as const;

/**
 * Styles centralisés pour le layout de l'administration
 */
const adminLayoutStyles = {
  wrapper: 'flex min-h-screen bg-gray-50 font-sans',
  sidebar: 'w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col',
  sidebarHeader: 'px-6 py-4 border-b border-gray-200',
  logo: 'text-2xl font-serif text-sage hover:text-gold transition-colors duration-200',
  nav: 'flex-1 px-4 py-4 space-y-2',
  navLink: 'flex items-center px-4 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  activeNavLink: 'bg-sage/10 text-sage font-medium',
  sidebarFooter: 'px-6 py-4 border-t border-gray-200 mt-auto',
  footerLink: 'flex items-center w-full text-left text-sm text-gray-500 hover:text-gold transition-colors',
  mainContent: 'flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto',
} as const;

/**
 * Composant AdminNavLink - Réutilisable et inspiré de votre NavigationLink
 */
const AdminNavLink = memo(({ item }: { item: (typeof ADMIN_NAVIGATION_CONFIG)[number] & { isActive: boolean } }) => (
  <Link
    href={item.href}
    className={cn(
      adminLayoutStyles.navLink,
      item.isActive && adminLayoutStyles.activeNavLink
    )}
    aria-current={item.isActive ? 'page' : undefined}
  >
    <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
    <span>{item.label}</span>
  </Link>
));
AdminNavLink.displayName = 'AdminNavLink';

/**
 * Composant AdminLayout principal
 */
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Hook pour déterminer les liens actifs, comme dans votre Header
  const navigationWithActiveState = useMemo(() =>
    ADMIN_NAVIGATION_CONFIG.map(item => ({
      ...item,
      isActive: pathname === item.href,
    })),
    [pathname]
  );

  return (
    <div className={adminLayoutStyles.wrapper}>
      {/* Barre latérale de navigation */}
      <aside className={adminLayoutStyles.sidebar}>
        <div className={adminLayoutStyles.sidebarHeader}>
          <Link href="/admin" aria-label="Panneau d'administration - Accueil">
            <h2 className={adminLayoutStyles.logo}>Admin Élan</h2>
          </Link>
          <p className="text-sm text-gray-500 mt-1">
            Connecté en tant que {session?.user?.name || 'Admin'}
          </p>
        </div>

        <nav className={adminLayoutStyles.nav} aria-label="Navigation de l'administration">
          {navigationWithActiveState.map((item) => (
            <AdminNavLink key={item.id} item={item} />
          ))}
        </nav>

        <div className={adminLayoutStyles.sidebarFooter}>
          <Link href="/" className={adminLayoutStyles.footerLink}>
            <Shield className="w-4 h-4 mr-2" />
            Retour au site principal
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className={cn(adminLayoutStyles.footerLink, 'mt-2')}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className={adminLayoutStyles.mainContent}>
        {children}
      </main>
    </div>
  );
};

AdminLayout.displayName = 'AdminLayout';

export default AdminLayout;
