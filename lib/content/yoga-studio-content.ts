export interface YogaCourseSeoConfig {
  title: string;
  description: string;
}

export interface YogaCourseHeroConfig {
  title: string;
  subtitle: string;
}

export interface YogaCourseCardConfig {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  level: string;
  imageUrl: string;
  highlight?: boolean;
}

export interface YogaCoursesPageConfig {
  seo: YogaCourseSeoConfig;
  hero: YogaCourseHeroConfig;
  intro: string;
  courses: YogaCourseCardConfig[];
}

export const YOGA_COURSES_PAGE_CONFIG: YogaCoursesPageConfig = {
  seo: {
    title: 'Cours de yoga à Paris – Planning & tarifs',
    description:
      'Découvrez tous les cours du Studio Élan : yoga doux, yoga dynamique, yin yoga et méditation. Choisissez le cours qui vous correspond et réservez votre place en ligne.',
  },
  hero: {
    title: 'Nos cours de yoga',
    subtitle:
      'Des séances pensées pour tous les niveaux, du débutant au pratiquant avancé. Trouvez le cours qui correspond à votre énergie du moment et réservez en quelques clics.',
  },
  intro:
    'Chaque cours au Studio Élan est limité en nombre de participants afin de garantir un accompagnement personnalisé. Les tapis et accessoires sont fournis sur place. Réservez votre place en ligne via le calendrier de réservation.',
  courses: [
    {
      id: 'yoga-doux',
      title: 'Yoga Doux & Relaxation',
      description:
        'Une pratique accessible, idéale pour découvrir le yoga ou pour relâcher les tensions après une journée chargée. Postures simples, respiration guidée et relaxation profonde.',
      duration: '60 min',
      price: '25€',
      level: 'Tous niveaux',
      imageUrl: 'https://images.pexels.com/photos/8436589/pexels-photo-8436589.jpeg',
      highlight: true,
    },
    {
      id: 'yoga-vinyasa',
      title: 'Yoga Vinyasa Dynamique',
      description:
        'Un enchaînement fluide de postures synchronisées à la respiration. Parfait pour développer force, souplesse et concentration dans un rythme soutenu.',
      duration: '60 min',
      price: '25€',
      level: 'Intermédiaire',
      imageUrl: 'https://images.pexels.com/photos/3822219/pexels-photo-3822219.jpeg',
      highlight: false,
    },
    {
      id: 'yin-yoga',
      title: 'Yin Yoga',
      description:
        'Une pratique lente et méditative où les postures sont tenues plusieurs minutes. Idéal pour travailler en profondeur sur les tissus et cultiver le lâcher-prise.',
      duration: '75 min',
      price: '28€',
      level: 'Tous niveaux',
      imageUrl: 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg',
      highlight: false,
    },
    {
      id: 'meditation',
      title: 'Méditation guidée',
      description:
        \"Un moment de pause pour apaiser le mental, réduire le stress et développer une attention plus présente au quotidien. Accessible même sans expérience de yoga.\",
      duration: '45 min',
      price: '18€',
      level: 'Tous niveaux',
      imageUrl: 'https://images.pexels.com/photos/8964015/pexels-photo-8964015.jpeg',
      highlight: false,
    },
  ],
};