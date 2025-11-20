export interface HomeHeroContent {
  title: string;
  subtitle: string;
  ctaLabel: string;
  backgroundImageUrl: string;
  ctaHref: string;
}

export interface HomeAboutStat {
  label: string;
  value: string;
}

export interface HomeAboutContent {
  title: string;
  paragraphs: string[];
  imageUrl: string;
  stats: HomeAboutStat[];
}

export interface HomeServiceItem {
  title: string;
  description: string;
  price: string;
  duration: string;
  level: string;
  imageUrl: string;
  schedule: string;
}

export interface HomeServicesSection {
  title: string;
  description?: string;
  services: HomeServiceItem[];
}

export interface HomeTestimonialItem {
  name: string;
  role: string;
  content: string;
  image: string;
}

export interface HomeTestimonialsSection {
  title: string;
  testimonials: HomeTestimonialItem[];
}

export interface HomeCtaSection {
  title: string;
  text: string;
  buttonLabel: string;
  buttonHref: string;
}

export interface HomePageContent {
  hero: HomeHeroContent;
  about: HomeAboutContent;
  servicesSection: HomeServicesSection;
  testimonialsSection: HomeTestimonialsSection;
  cta: HomeCtaSection;
}

export interface AboutPhilosophyItem {
  title: string;
  description: string;
  icon: string;
}

export interface AboutMainSection {
  title: string;
  paragraphs: string[];
  imageUrl: string;
}

export interface AboutHeroSection {
  title: string;
  subtitle: string;
}

export interface AboutPageContent {
  hero: AboutHeroSection;
  mainSection: AboutMainSection;
  philosophySection: {
    title: string;
    items: AboutPhilosophyItem[];
  };
}

export interface ServicesHeroSection {
  title: string;
  subtitle: string;
}

export interface ServicesListItem {
  title: string;
  description: string;
  duration: string;
  price: string;
  imageUrl: string;
}

export interface ServicesAdditionalItem {
  title: string;
  description: string;
}

export interface ServicesPageContent {
  hero: ServicesHeroSection;
  services: ServicesListItem[];
  additionalInfo: {
    title: string;
    items: ServicesAdditionalItem[];
  };
}

export interface ContactHeroSection {
  title: string;
  subtitle: string;
}

export interface ContactInfoBlock {
  title: string;
  lines: string[];
}

export interface ContactPageContent {
  hero: ContactHeroSection;
  contactInfo: ContactInfoBlock;
  openingHours: ContactInfoBlock;
  mapPlaceholderText: string;
}

export interface ContentMap {
  home_page: HomePageContent;
  about_page: AboutPageContent;
  services_page: ServicesPageContent;
  contact_page: ContactPageContent;
}

export type ContentKey = keyof ContentMap;

export const DEFAULT_CONTENT: ContentMap = {
  home_page: {
    hero: {
      title: 'Trouvez votre équilibre intérieur',
      subtitle:
        "Le yoga n'est pas une simple pratique — c'est un voyage de reconnexion à votre essence véritable.",
      ctaLabel: 'Réserver',
      backgroundImageUrl: 'https://images.pexels.com/photos/6698513/pexels-photo-6698513.jpeg',
      ctaHref: '/reservation',
    },
    about: {
      title: 'À propos de nous',
      paragraphs: [
        "Fondé en 2020, Studio Élan est né d'une passion pour le yoga et d'une vision : créer un espace où chacun peut se reconnecter à soi-même, dans un cadre apaisant au cœur de Paris.",
        "Notre approche unique combine traditions ancestrales et techniques modernes, guidée par des professeurs expérimentés qui s'adaptent à tous les niveaux.",
      ],
      imageUrl: 'https://images.pexels.com/photos/8436461/pexels-photo-8436461.jpeg',
      stats: [
        {
          value: '500+',
          label: 'Élèves satisfaits',
        },
        {
          value: '12',
          label: 'Professeurs experts',
        },
        {
          value: '25',
          label: 'Cours par semaine',
        },
      ],
    },
    servicesSection: {
      title: 'Nos Services',
      description: '',
      services: [
        {
          title: 'Yoga Vinyasa',
          description:
            'Un style dynamique qui synchronise le mouvement et la respiration pour créer un flux continu. Idéal pour développer force, souplesse et concentration.',
          price: '25',
          duration: '60 min',
          level: 'Tous niveaux',
          imageUrl: 'https://images.pexels.com/photos/3822219/pexels-photo-3822219.jpeg',
          schedule: 'Lun, Mer, Ven 10h & 18h',
        },
        {
          title: 'Yin Yoga',
          description:
            'Une pratique douce et méditative qui cible les tissus conjonctifs. Les postures sont maintenues plus longtemps pour favoriser la relaxation profonde.',
          price: '22',
          duration: '75 min',
          level: 'Tous niveaux',
          imageUrl: 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg',
          schedule: 'Mar, Jeu 12h & 20h',
        },
        {
          title: 'Méditation',
          description:
            "Des séances guidées pour apaiser l'esprit, réduire le stress et favoriser la conscience de soi. Une pratique accessible à tous pour cultiver la paix intérieure.",
          price: '18',
          duration: '45 min',
          level: 'Débutant à avancé',
          imageUrl: 'https://images.pexels.com/photos/8964015/pexels-photo-8964015.jpeg',
          schedule: 'Mer, Sam 9h & 17h',
        },
      ],
    },
    testimonialsSection: {
      title: 'Ce que disent nos élèves',
      testimonials: [
        {
          name: 'Sophie Martin',
          role: 'Élève depuis 2021',
          content:
            "Studio Élan a transformé ma pratique du yoga. L'ambiance est apaisante et les professeurs sont exceptionnels.",
          image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
        },
        {
          name: 'Thomas Dubois',
          role: 'Élève depuis 2022',
          content:
            "J'ai découvert le yoga ici et je ne peux plus m'en passer. Les cours sont adaptés à tous les niveaux.",
          image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
        },
        {
          name: 'Marie Laurent',
          role: 'Élève depuis 2020',
          content:
            "Un véritable havre de paix dans Paris. Les cours de méditation ont changé ma vie quotidienne.",
          image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
        },
      ],
    },
    cta: {
      title: 'Prêt à rejoindre Studio Élan ?',
      text: "Commencez votre voyage vers le bien-être aujourd'hui. Premier cours d'essai à 15€.",
      buttonLabel: 'Réserver maintenant',
      buttonHref: '/reservation',
    },
  },
  about_page: {
    hero: {
      title: 'Notre Histoire',
      subtitle:
        "Studio Élan est né d'une vision simple : créer un espace où chacun peut explorer et approfondir sa pratique du yoga dans un cadre bienveillant et inspirant.",
    },
    mainSection: {
      title: 'Notre Vision',
      paragraphs: [
        "Depuis notre création en 2020, nous nous efforçons de créer un environnement où la pratique du yoga devient une expérience transformative. Notre studio, situé au cœur de Paris, est plus qu'un simple espace de pratique - c'est un lieu de rencontre, d'apprentissage et de croissance personnelle.",
        "Nos professeurs, tous certifiés et passionnés, vous accompagnent dans votre progression, que vous soyez débutant ou pratiquant confirmé. Nous croyons en un yoga accessible à tous, adapté aux besoins et aux capacités de chacun.",
      ],
      imageUrl: 'https://images.pexels.com/photos/8436714/pexels-photo-8436714.jpeg',
    },
    philosophySection: {
      title: 'Notre Philosophie',
      items: [
        {
          title: 'Calme',
          description:
            'Un espace serein pour se reconnecter à soi-même et trouver la paix intérieure.',
          icon: '🌿',
        },
        {
          title: 'Énergie',
          description: 'Des pratiques dynamisantes pour revitaliser corps et esprit.',
          icon: '✨',
        },
        {
          title: 'Équilibre',
          description:
            'Une approche holistique pour harmoniser tous les aspects de votre être.',
          icon: '⚖️',
        },
      ],
    },
  },
  services_page: {
    hero: {
      title: 'Nos Services',
      subtitle: 'Découvrez notre sélection de cours adaptés à tous les niveaux et objectifs.',
    },
    services: [
      {
        title: 'Yoga Doux',
        description:
          'Une pratique douce et accessible, parfaite pour les débutants ou pour une approche plus relaxante du yoga.',
        duration: '60 min',
        price: '25€',
        imageUrl: 'https://images.pexels.com/photos/8436589/pexels-photo-8436589.jpeg',
      },
      {
        title: 'Yoga Énergie',
        description:
          'Un cours dynamique combinant postures fluides et respirations pour stimuler votre énergie vitale.',
        duration: '75 min',
        price: '28€',
        imageUrl: 'https://images.pexels.com/photos/6698513/pexels-photo-6698513.jpeg',
      },
      {
        title: 'Étirements & Relaxation',
        description:
          'Séance focalisée sur les étirements profonds et la relaxation pour libérer les tensions.',
        duration: '60 min',
        price: '25€',
        imageUrl: 'https://images.pexels.com/photos/6698615/pexels-photo-6698615.jpeg',
      },
    ],
    additionalInfo: {
      title: 'Informations Pratiques',
      items: [
        {
          title: 'Équipement Fourni',
          description: 'Tapis, blocs, sangles disponibles sur place',
        },
        {
          title: 'Vestiaires',
          description: 'Douches et casiers sécurisés',
        },
        {
          title: 'Réservation',
          description: 'En ligne ou par téléphone',
        },
      ],
    },
  },
  contact_page: {
    hero: {
      title: 'Contactez-nous',
      subtitle: 'Une question ? Nous sommes là pour vous répondre.',
    },
    contactInfo: {
      title: 'Coordonnées',
      lines: [
        '123 Avenue des Champs-Élysées',
        '75008 Paris',
        'Téléphone: 01 23 45 67 89',
        'Email: contact@studio-elan.fr',
      ],
    },
    openingHours: {
      title: "Horaires d'ouverture",
      lines: ['Lundi - Vendredi: 8h - 21h', 'Samedi: 9h - 18h', 'Dimanche: 9h - 16h'],
    },
    mapPlaceholderText: 'Carte interactive',
  },
};

export function isValidContentKey(key: string): key is ContentKey {
  return key in DEFAULT_CONTENT;
}