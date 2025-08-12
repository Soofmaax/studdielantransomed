/**
 * Types et interfaces pour les composants React - Approche artisanale
 * Typage strict pour une expérience développeur exceptionnelle
 */

import { ReactNode, ComponentPropsWithoutRef, ElementType } from 'react';
import { IPublicCourse, IPublicUser, IBookingWithRelations } from './api';

// =============================================================================
// TYPES DE BASE POUR COMPOSANTS
// =============================================================================

/**
 * Props de base héritées par tous les composants
 */
export interface IBaseProps {
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
}

/**
 * Props pour les composants polymorphes (qui peuvent changer d'élément HTML)
 */
export type PolymorphicProps<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithoutRef<T> & IBaseProps;

/**
 * Variantes de taille standardisées
 */
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Variantes de couleur standardisées
 */
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';

/**
 * Variantes d'apparence standardisées
 */
export type AppearanceVariant = 'solid' | 'outline' | 'ghost' | 'link';

// =============================================================================
// INTERFACES LAYOUT
// =============================================================================

/**
 * Props pour le composant Header
 */
export interface IHeaderProps extends IBaseProps {
  variant?: 'default' | 'transparent' | 'sticky';
  showAuthButtons?: boolean;
  user?: IPublicUser | null;
  onMenuToggle?: () => void;
}

/**
 * Props pour le composant Footer
 */
export interface IFooterProps extends IBaseProps {
  variant?: 'default' | 'minimal';
  showSocialLinks?: boolean;
  showNewsletter?: boolean;
}

/**
 * Props pour le composant Navigation
 */
export interface INavigationProps extends IBaseProps {
  items: INavigationItem[];
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
  activeItem?: string;
  onItemClick?: (item: INavigationItem) => void;
}

/**
 * Interface pour les éléments de navigation
 */
export interface INavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
  children?: INavigationItem[];
}

// =============================================================================
// INTERFACES UI COMPONENTS
// =============================================================================

/**
 * Props pour le composant Button
 */
export interface IButtonProps extends IBaseProps {
  variant?: AppearanceVariant;
  size?: SizeVariant;
  color?: ColorVariant;
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Props pour le composant Input
 */
export interface IInputProps extends IBaseProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  size?: SizeVariant;
  variant?: 'default' | 'filled' | 'flushed';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  helperText?: string;
  errorMessage?: string;
  label?: string;
  name?: string;
  id?: string;
  autoComplete?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * Props pour le composant Modal
 */
export interface IModalProps extends IBaseProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: SizeVariant;
  isCentered?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
}

/**
 * Props pour le composant Card
 */
export interface ICardProps extends IBaseProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: SizeVariant;
  header?: ReactNode;
  footer?: ReactNode;
  isHoverable?: boolean;
  isClickable?: boolean;
  onClick?: () => void;
}

/**
 * Props pour le composant Badge
 */
export interface IBadgeProps extends IBaseProps {
  variant?: AppearanceVariant;
  size?: SizeVariant;
  color?: ColorVariant;
  isRounded?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

/**
 * Props pour le composant Loading
 */
export interface ILoadingProps extends IBaseProps {
  size?: SizeVariant;
  variant?: 'spinner' | 'skeleton' | 'dots' | 'pulse';
  color?: ColorVariant;
  text?: string;
  isFullScreen?: boolean;
}

/**
 * Props pour le composant Alert
 */
export interface IAlertProps extends IBaseProps {
  variant?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  description?: string;
  isClosable?: boolean;
  onClose?: () => void;
  icon?: ReactNode;
  action?: ReactNode;
}

// =============================================================================
// INTERFACES MÉTIER (YOGA STUDIO)
// =============================================================================

/**
 * Props pour le composant CourseCard
 */
export interface ICourseCardProps extends IBaseProps {
  course: IPublicCourse;
  variant?: 'default' | 'compact' | 'featured';
  showPrice?: boolean;
  showDuration?: boolean;
  showLevel?: boolean;
  showCapacity?: boolean;
  isBookable?: boolean;
  onBook?: (courseId: string) => void;
  onViewDetails?: (courseId: string) => void;
}

/**
 * Props pour le composant CourseList
 */
export interface ICourseListProps extends IBaseProps {
  courses: IPublicCourse[];
  variant?: 'grid' | 'list';
  columns?: 1 | 2 | 3 | 4;
  isLoading?: boolean;
  emptyMessage?: string;
  onCourseBook?: (courseId: string) => void;
  onCourseView?: (courseId: string) => void;
}

/**
 * Props pour le composant BookingCard
 */
export interface IBookingCardProps extends IBaseProps {
  booking: IBookingWithRelations;
  variant?: 'default' | 'compact';
  showCourse?: boolean;
  showUser?: boolean;
  showActions?: boolean;
  onCancel?: (bookingId: string) => void;
  onReschedule?: (bookingId: string) => void;
  onViewDetails?: (bookingId: string) => void;
}

/**
 * Props pour le composant BookingForm
 */
export interface IBookingFormProps extends IBaseProps {
  course: IPublicCourse;
  availableDates: Date[];
  isLoading?: boolean;
  onSubmit: (data: IBookingFormData) => void;
  onCancel?: () => void;
}

/**
 * Interface pour les données du formulaire de réservation
 */
export interface IBookingFormData {
  courseId: string;
  date: string;
  specialRequests?: string;
}

/**
 * Props pour le composant Calendar
 */
export interface ICalendarProps extends IBaseProps {
  events: ICalendarEvent[];
  view?: 'month' | 'week' | 'day';
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: ICalendarEvent) => void;
  isLoading?: boolean;
}

/**
 * Interface pour les événements du calendrier
 */
export interface ICalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  description?: string;
  course?: IPublicCourse;
  booking?: IBookingWithRelations;
}

/**
 * Props pour le composant UserProfile
 */
export interface IUserProfileProps extends IBaseProps {
  user: IPublicUser;
  isEditable?: boolean;
  showBookings?: boolean;
  onEdit?: () => void;
  onSave?: (data: IUserProfileData) => void;
}

/**
 * Interface pour les données du profil utilisateur
 */
export interface IUserProfileData {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  preferences?: {
    newsletter: boolean;
    notifications: boolean;
    language: string;
  };
}

// =============================================================================
// INTERFACES FORMULAIRES
// =============================================================================

/**
 * Props pour le composant Form
 */
export interface IFormProps extends IBaseProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  noValidate?: boolean;
}

/**
 * Props pour le composant FormField
 */
export interface IFormFieldProps extends IBaseProps {
  label?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  helperText?: string;
}

/**
 * Props pour le composant ContactForm
 */
export interface IContactFormProps extends IBaseProps {
  onSubmit: (data: IContactFormData) => void;
  isLoading?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

/**
 * Interface pour les données du formulaire de contact
 */
export interface IContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// =============================================================================
// INTERFACES SECTIONS DE PAGE
// =============================================================================

/**
 * Props pour la section Hero
 */
export interface IHeroProps extends IBaseProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  overlay?: boolean;
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

/**
 * Props pour la section About
 */
export interface IAboutProps extends IBaseProps {
  title?: string;
  description?: string;
  features?: IFeatureItem[];
  image?: string;
  variant?: 'default' | 'centered' | 'split';
}

/**
 * Interface pour les éléments de fonctionnalité
 */
export interface IFeatureItem {
  id: string;
  title: string;
  description: string;
  icon?: ReactNode;
  image?: string;
}

/**
 * Props pour la section Services
 */
export interface IServicesProps extends IBaseProps {
  title?: string;
  description?: string;
  services: IServiceItem[];
  variant?: 'grid' | 'list' | 'carousel';
}

/**
 * Interface pour les éléments de service
 */
export interface IServiceItem {
  id: string;
  title: string;
  description: string;
  price?: number;
  duration?: number;
  image?: string;
  features?: string[];
  isPopular?: boolean;
}

/**
 * Props pour la section Testimonials
 */
export interface ITestimonialsProps extends IBaseProps {
  title?: string;
  testimonials: ITestimonialItem[];
  variant?: 'carousel' | 'grid' | 'masonry';
  autoPlay?: boolean;
}

/**
 * Interface pour les témoignages
 */
export interface ITestimonialItem {
  id: string;
  content: string;
  author: {
    name: string;
    role?: string;
    avatar?: string;
  };
  rating?: number;
}

// =============================================================================
// TYPES UTILITAIRES POUR COMPOSANTS
// =============================================================================

/**
 * Type pour les refs de composants
 */
export type ComponentRef<T> = React.RefObject<T> | React.MutableRefObject<T>;

/**
 * Type pour les handlers d'événements génériques
 */
export type EventHandler<T = Event> = (event: T) => void;

/**
 * Type pour les handlers asynchrones
 */
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

/**
 * Type pour les render props
 */
export type RenderProp<T> = (props: T) => ReactNode;

/**
 * Type pour les composants avec render props
 */
export interface IRenderPropComponent<T> {
  children: RenderProp<T>;
}

/**
 * Type pour les composants avec slots
 */
export interface ISlottedComponent {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  sidebar?: ReactNode;
}

/**
 * Type pour les états de chargement des composants
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Interface pour les composants avec état de chargement
 */
export interface ILoadingStateComponent {
  loadingState: LoadingState;
  error?: Error | string;
  retry?: () => void;
}

