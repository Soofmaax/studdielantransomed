'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

import { IHeaderProps, INavigationItem } from '@/types/components';
import { cn } from '@/lib/utils';

/**
 * Configuration de navigation - Centralisée pour faciliter la maintenance
 */
const NAVIGATION_CONFIG: INavigationItem[] = [
  {
    id: 'home',
    label: 'Accueil',
    href: '/',
  },
  {
    id: 'about',
    label: 'À propos',
    href: '/about',
  },
  {
    id: 'services',
    label: 'Services',
    href: '/services',
  },
  {
    id: 'courses',
    label: 'Cours',
    href: '/courses',
  },
  {
    id: 'contact',
    label: 'Contact',
    href: '/contact',
  },
] as const;

/**
 * Styles CSS-in-JS pour une maintenance centralisée
 */
const headerStyles = {
  base: 'fixed w-full z-50 transition-all duration-300',
  variants: {
    default: 'bg-cream/90 backdrop-blur-md shadow-sm',
    transparent: 'bg-transparent',
    sticky: 'bg-white shadow-md',
  },
  nav: 'container mx-auto px-4 sm:px-6 lg:px-8',
  content: 'flex items-center justify-between h-16 lg:h-20',
  logo: 'text-2xl lg:text-3xl font-serif text-sage hover:text-gold transition-colors duration-200',
  desktopNav: 'hidden lg:flex items-center space-x-8',
  navLink: 'text-sage hover:text-gold transition-colors duration-200 font-medium',
  activeNavLink: 'text-gold font-semibold',
  ctaButton: 'bg-sage text-white px-6 py-2.5 rounded-full hover:bg-gold transition-all duration-200 font-medium shadow-sm hover:shadow-md',
  mobileButton: 'lg:hidden p-2 text-sage hover:text-gold transition-colors duration-200',
  mobileNav: 'lg:hidden absolute top-full left-0 right-0 bg-cream/95 backdrop-blur-md shadow-lg border-t border-sage/10',
  mobileNavContent: 'container mx-auto px-4 sm:px-6 py-6',
  mobileNavLinks: 'flex flex-col space-y-4',
  userMenu: 'relative',
  userButton: 'flex items-center space-x-2 text-sage hover:text-gold transition-colors duration-200',
  dropdown: 'absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-sage/10 py-2',
  dropdownItem: 'flex items-center space-x-2 px-4 py-2 text-sage hover:bg-sage/5 transition-colors duration-200',
} as const;

/**
 * Hook personnalisé pour la gestion de la navigation
 */
function useNavigation() {
  const pathname = usePathname();
  
  const navigationWithActiveState = useMemo(() => 
    NAVIGATION_CONFIG.map(item => ({
      ...item,
      isActive: pathname === item.href,
    })),
    [pathname]
  );

  return { navigationWithActiveState };
}

/**
 * Hook personnalisé pour la gestion du menu mobile
 */
function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, toggle, close };
}

/**
 * Composant NavigationLink - Réutilisable et typé
 */
interface INavigationLinkProps {
  item: INavigationItem;
  isMobile?: boolean;
  onClick?: () => void;
}

const NavigationLink = React.memo<INavigationLinkProps>(({ 
  item, 
  isMobile = false, 
  onClick 
}) => (
  <Link
    href={item.href}
    className={cn(
      headerStyles.navLink,
      item.isActive && headerStyles.activeNavLink
    )}
    onClick={onClick}
    aria-current={item.isActive ? 'page' : undefined}
  >
    {item.label}
  </Link>
));

NavigationLink.displayName = 'NavigationLink';

/**
 * Composant UserMenu - Gestion de l'authentification
 */
const UserMenu = React.memo(() => {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = useCallback(async () => {
    await signOut({ callbackUrl: '/' });
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  if (status === 'loading') {
    return (
      <div className="w-8 h-8 bg-sage/20 rounded-full animate-pulse" />
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className={cn(headerStyles.ctaButton, 'flex items-center space-x-2')}
      >
        <User size={18} />
        <span>Connexion</span>
      </Link>
    );
  }

  return (
    <div className={headerStyles.userMenu}>
      <button
        onClick={toggleDropdown}
        className={headerStyles.userButton}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <User size={20} />
        <span className="hidden sm:inline">{session.user.name || 'Mon compte'}</span>
      </button>

      {isDropdownOpen && (
        <>
          {/* Overlay pour fermer le dropdown */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsDropdownOpen(false)}
          />
          
          <div className={cn(headerStyles.dropdown, 'z-20')}>
            <Link
              href="/dashboard"
              className={headerStyles.dropdownItem}
              onClick={() => setIsDropdownOpen(false)}
            >
              <User size={16} />
              <span>Mon profil</span>
            </Link>
            
            <button
              onClick={handleSignOut}
              className={cn(headerStyles.dropdownItem, 'w-full text-left')}
            >
              <LogOut size={16} />
              <span>Déconnexion</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
});

UserMenu.displayName = 'UserMenu';

/**
 * Composant Header principal - Architecture artisanale
 * 
 * @param props - Props du composant Header
 * @returns Composant Header rendu
 */
const Header: React.FC<IHeaderProps> = ({
  variant = 'default',
  showAuthButtons = true,
  className,
  onMenuToggle,
  ...props
}) => {
  const { navigationWithActiveState } = useNavigation();
  const mobileMenu = useMobileMenu();

  // Gestion du toggle du menu mobile avec callback externe
  const handleMobileToggle = useCallback(() => {
    mobileMenu.toggle();
    onMenuToggle?.();
  }, [mobileMenu.toggle, onMenuToggle]);

  return (
    <header 
      className={cn(
        headerStyles.base,
        headerStyles.variants[variant],
        className
      )}
      {...props}
    >
      <nav className={headerStyles.nav} role="navigation" aria-label="Navigation principale">
        <div className={headerStyles.content}>
          {/* Logo */}
          <Link 
            href="/" 
            className={headerStyles.logo}
            aria-label="Studio Élan - Retour à l'accueil"
          >
            Studio Élan
          </Link>

          {/* Navigation desktop */}
          <div className={headerStyles.desktopNav}>
            {navigationWithActiveState.map((item) => (
              <NavigationLink key={item.id} item={item} />
            ))}
            
            <Link
              href="/reservation"
              className={headerStyles.ctaButton}
            >
              Réserver un cours
            </Link>

            {showAuthButtons && <UserMenu />}
          </div>

          {/* Bouton menu mobile */}
          <button
            className={headerStyles.mobileButton}
            onClick={handleMobileToggle}
            aria-expanded={mobileMenu.isOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenu.isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {mobileMenu.isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navigation mobile */}
        {mobileMenu.isOpen && (
          <div 
            id="mobile-menu"
            className={headerStyles.mobileNav}
            role="menu"
          >
            <div className={headerStyles.mobileNavContent}>
              <div className={headerStyles.mobileNavLinks}>
                {navigationWithActiveState.map((item) => (
                  <NavigationLink 
                    key={item.id} 
                    item={item} 
                    isMobile 
                    onClick={mobileMenu.close}
                  />
                ))}
                
                <Link
                  href="/reservation"
                  className={cn(headerStyles.ctaButton, 'text-center')}
                  onClick={mobileMenu.close}
                >
                  Réserver un cours
                </Link>

                {showAuthButtons && (
                  <div className="pt-4 border-t border-sage/10">
                    <UserMenu />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

Header.displayName = 'Header';

export default Header;

