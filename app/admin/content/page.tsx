'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from '@/components/ui/toast';
import { fetchContent, updateContent } from '@/lib/api/content';
import type {
  HomePageContent,
  AboutPageContent,
  ServicesPageContent,
  ContactPageContent,
  ContentKey,
} from '@/lib/content/defaults';
import { DEFAULT_CONTENT } from '@/lib/content/defaults';

type TabId = ContentKey;

const TABS: { id: TabId; label: string }[] = [
  { id: 'home_page', label: 'Page d’accueil' },
  { id: 'about_page', label: 'Page À propos' },
  { id: 'services_page', label: 'Page Services' },
  { id: 'contact_page', label: 'Page Contact' },
];

interface HomeFormProps {
  content: HomePageContent;
  onSave: (values: HomePageContent) => void;
  isSaving: boolean;
}

interface AboutFormProps {
  content: AboutPageContent;
  onSave: (values: AboutPageContent) => void;
  isSaving: boolean;
}

interface ServicesFormProps {
  content: ServicesPageContent;
  onSave: (values: ServicesPageContent) => void;
  isSaving: boolean;
}

interface ContactFormProps {
  content: ContactPageContent;
  onSave: (values: ContactPageContent) => void;
  isSaving: boolean;
}

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<TabId>('home_page');
  const queryClient = useQueryClient();

  const homeQuery = useQuery<HomePageContent>({
    queryKey: ['content', 'home_page'],
    queryFn: () => fetchContent('home_page'),
  });

  const aboutQuery = useQuery<AboutPageContent>({
    queryKey: ['content', 'about_page'],
    queryFn: () => fetchContent('about_page'),
  });

  const servicesQuery = useQuery<ServicesPageContent>({
    queryKey: ['content', 'services_page'],
    queryFn: () => fetchContent('services_page'),
  });

  const contactQuery = useQuery<ContactPageContent>({
    queryKey: ['content', 'contact_page'],
    queryFn: () => fetchContent('contact_page'),
  });

  const mutation = useMutation({
    mutationFn: async (variables: { key: ContentKey; data: unknown }) =>
      updateContent(variables.key as ContentKey, variables.data as any),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['content', variables.key] });
      toast({
        title: 'Succès',
        description: 'Contenu mis à jour',
        variant: 'success',
      });
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la mise à jour du contenu',
        variant: 'destructive',
      });
    },
  });

  const isAnyLoading =
    homeQuery.isLoading || aboutQuery.isLoading || servicesQuery.isLoading || contactQuery.isLoading;

  const currentTab = TABS.find((tab) => tab.id === activeTab);

  if (isAnyLoading && !homeQuery.data && !aboutQuery.data && !servicesQuery.data && !contactQuery.data) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  const handleSave = <K extends ContentKey>(key: K, values: any) => {
    mutation.mutate({ key, data: values });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-gray-900">Contenu du site</h1>
        <p className="mt-2 text-sm text-gray-700">
          Modifiez les textes et images des principales pages du site.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-sage text-sage'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white shadow rounded-lg p-6">
        {currentTab?.id === 'home_page' && (
          <HomeContentForm
            content={homeQuery.data ?? DEFAULT_CONTENT.home_page}
            onSave={(values) => handleSave('home_page', values)}
            isSaving={mutation.isPending}
          />
        )}

        {currentTab?.id === 'about_page' && (
          <AboutContentForm
            content={aboutQuery.data ?? DEFAULT_CONTENT.about_page}
            onSave={(values) => handleSave('about_page', values)}
            isSaving={mutation.isPending}
          />
        )}

        {currentTab?.id === 'services_page' && (
          <ServicesContentForm
            content={servicesQuery.data ?? DEFAULT_CONTENT.services_page}
            onSave={(values) => handleSave('services_page', values)}
            isSaving={mutation.isPending}
          />
        )}

        {currentTab?.id === 'contact_page' && (
          <ContactContentForm
            content={contactQuery.data ?? DEFAULT_CONTENT.contact_page}
            onSave={(values) => handleSave('contact_page', values)}
            isSaving={mutation.isPending}
          />
        )}
      </div>
    </div>
  );
}

function HomeContentForm({ content, onSave, isSaving }: HomeFormProps) {
  const [values, setValues] = useState<HomePageContent>(content);

  useEffect(() => {
    setValues(content);
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(values);
  };

  const handleHeroChange = (field: keyof HomePageContent['hero'], value: string) => {
    setValues((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }));
  };

  const handleAboutChange = (field: keyof HomePageContent['about'], value: string | string[]) => {
    setValues((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        [field]: value as any,
      },
    }));
  };

  const handleAboutStatChange = (
    index: number,
    field: 'label' | 'value',
    value: string
  ) => {
    setValues((prev) => {
      const stats = [...prev.about.stats];
      stats[index] = {
        ...stats[index],
        [field]: value,
      };
      return {
        ...prev,
        about: {
          ...prev.about,
          stats,
        },
      };
    });
  };

  const handleServiceChange = (
    index: number,
    field: keyof HomePageContent['servicesSection']['services'][number],
    value: string
  ) => {
    setValues((prev) => {
      const services = [...prev.servicesSection.services];
      services[index] = {
        ...services[index],
        [field]: value,
      };
      return {
        ...prev,
        servicesSection: {
          ...prev.servicesSection,
          services,
        },
      };
    });
  };

  const handleTestimonialChange = (
    index: number,
    field: keyof HomePageContent['testimonialsSection']['testimonials'][number],
    value: string
  ) => {
    setValues((prev) => {
      const testimonials = [...prev.testimonialsSection.testimonials];
      testimonials[index] = {
        ...testimonials[index],
        [field]: value,
      };
      return {
        ...prev,
        testimonialsSection: {
          ...prev.testimonialsSection,
          testimonials,
        },
      };
    });
  };

  const handleCtaChange = (field: keyof HomePageContent['cta'], value: string) => {
    setValues((prev) => ({
      ...prev,
      cta: {
        ...prev.cta,
        [field]: value,
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Hero */}
      <section>
        <h2 className="text-xl font-serif text-gray-900 mb-4">Section hero (Accueil)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre principal</label>
            <input
              type="text"
              value={values.hero.title}
              onChange={(e) => handleHeroChange('title', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Texte du bouton</label>
            <input
              type="text"
              value={values.hero.ctaLabel}
              onChange={(e) => handleHeroChange('ctaLabel', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Sous-titre</label>
            <textarea
              value={values.hero.subtitle}
              onChange={(e) => handleHeroChange('subtitle', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows={3}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Image de fond (URL)
            </label>
            <input
              type="text"
              value={values.hero.backgroundImageUrl}
              onChange={(e) => handleHeroChange('backgroundImageUrl', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            <p className="mt-1 text-xs text-gray-500">
              Utilisez une URL d&apos;image (Pexels, Unsplash, etc.).
            </p>
          </div>
        </div>
      </section>

      {/* À propos */}
      <section>
        <h2 className="text-xl font-serif text-gray-900 mb-4">Section &quot;À propos&quot;</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre</label>
            <input
              type="text"
              value={values.about.title}
              onChange={(e) => handleAboutChange('title', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          {values.about.paragraphs.map((paragraph, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700">
                Paragraphe {index + 1}
              </label>
              <textarea
                value={paragraph}
                onChange={(e) => {
                  const paragraphs = [...values.about.paragraphs];
                  paragraphs[index] = e.target.value;
                  handleAboutChange('paragraphs', paragraphs);
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                rows={3}
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image de la section (URL)
            </label>
            <input
              type="text"
              value={values.about.imageUrl}
              onChange={(e) => handleAboutChange('imageUrl', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Chiffres clés</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {values.about.stats.map((stat, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-3">
                  <label className="block text-xs font-medium text-gray-600">
                    Valeur (ex: 500+)
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleAboutStatChange(index, 'value', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                  <label className="block text-xs font-medium text-gray-600 mt-2">
                    Libellé
                  </label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleAboutStatChange(index, 'label', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services (Accueil) */}
      <section>
        <h2 className="text-xl font-serif text-gray-900 mb-4">Section services (Accueil)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre de la section</label>
            <input
              type="text"
              value={values.servicesSection.title}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  servicesSection: {
                    ...prev.servicesSection,
                    title: e.target.value,
                  },
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          {values.servicesSection.services.map((service, index) => (
            <div key={index} className="border border-gray-200 rounded-md p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Service {index + 1}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600">Titre</label>
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">Prix</label>
                  <input
                    type="text"
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">Durée</label>
                  <input
                    type="text"
                    value={service.duration}
                    onChange={(e) => handleServiceChange(index, 'duration', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">Niveau</label>
                  <input
                    type="text"
                    value={service.level}
                    onChange={(e) => handleServiceChange(index, 'level', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600">Description</label>
                  <textarea
                    value={service.description}
                    onChange={(e) =>
                      handleServiceChange(index, 'description', e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600">
                    Image (URL)
                  </label>
                  <input
                    type="text"
                    value={service.imageUrl}
                    onChange={(e) => handleServiceChange(index, 'imageUrl', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600">
                    Horaires (texte libre)
                  </label>
                  <input
                    type="text"
                    value={service.schedule}
                    onChange={(e) => handleServiceChange(index, 'schedule', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Témoignages */}
      <section>
        <h2 className="text-xl font-serif text-gray-900 mb-4">Section témoignages</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre de la section</label>
            <input
              type="text"
              value={values.testimonialsSection.title}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  testimonialsSection: {
                    ...prev.testimonialsSection,
                    title: e.target.value,
                  },
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          {values.testimonialsSection.testimonials.map((testimonial, index) => (
            <div key={index} className="border border-gray-200 rounded-md p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Témoignage {index + 1}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600">Nom</label>
                  <input
                    type="text"
                    value={testimonial.name}
                    onChange={(e) =>
                      handleTestimonialChange(index, 'name', e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">Rôle</label>
                  <input
                    type="text"
                    value={testimonial.role}
                    onChange={(e) =>
                      handleTestimonialChange(index, 'role', e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600">Texte</label>
                  <textarea
                    value={testimonial.content}
                    onChange={(e) =>
                      handleTestimonialChange(index, 'content', e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600">
                    Image (URL)
                  </label>
                  <input
                    type="text"
                    value={testimonial.image}
                    onChange={(e) =>
                      handleTestimonialChange(index, 'image', e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Appel à l'action */}
      <section>
        <h2 className="text-xl font-serif text-gray-900 mb-4">Bandeau d’appel à l’action</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre</label>
            <input
              type="text"
              value={values.cta.title}
              onChange={(e) => handleCtaChange('title', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Texte</label>
            <textarea
              value={values.cta.text}
              onChange={(e) => handleCtaChange('text', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Texte du bouton
              </label>
              <input
                type="text"
                value={values.cta.buttonLabel}
                onChange={(e) => handleCtaChange('buttonLabel', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Lien du bouton (URL interne)
              </label>
              <input
                type="text"
                value={values.cta.buttonHref}
                onChange={(e) => handleCtaChange('buttonHref', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-sage text-white rounded-md hover:bg-gold transition-colors disabled:opacity-50"
          disabled={isSaving}
        >
          {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </form>
  );
}

function AboutContentForm({ content, onSave, isSaving }: AboutFormProps) {
  const [values, setValues] = useState<AboutPageContent>(content);

  useEffect(() => {
    setValues(content);
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(values);
  };

  const handleHeroChange = (field: keyof AboutPageContent['hero'], value: string) => {
    setValues((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }));
  };

  const handleMainChange = (field: keyof AboutPageContent['mainSection'], value: string | string[]) => {
    setValues((prev) => ({
      ...prev,
      mainSection: {
        ...prev.mainSection,
        [field]: value as any,
      },
    }));
  };

  const handlePhilosophyItemChange = (
    index: number,
    field: keyof AboutPageContent['philosophySection']['items'][number],
    value: string
  ) => {
    setValues((prev) => {
      const items = [...prev.philosophySection.items];
      items[index] = {
        ...items[index],
        [field]: value,
      };
      return {
        ...prev,
        philosophySection: {
          ...prev.philosophySection,
          items,
        },
      };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Hero */}
      <section>
        <h2 className="text-xl font-serif text-gray-900 mb-4">En-tête de la page &quot;À propos&quot;</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre</label>
            <input
              type="text"
              value={values.hero.title}
              onChange={(e) => handleHeroChange('title', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sous-titre</label>
            <textarea
              value={values.hero.subtitle}
              onChange={(e) => handleHeroChange('subtitle', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows={3}
            />
          </div>
        </div>
      </section>

      {/* Section principale */}
      <section>
        <h2 className="text-xl font-serif text-gray-900 mb-4">Section principale</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre</label>
            <input
              type="text"
              value={values.mainSection.title}
              onChange={(e) => handleMainChange('title', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          {values.mainSection.paragraphs.map((paragraph, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700">
                Paragraphe {index + 1}
              </label>
              <textarea
                value={paragraph}
                onChange={(e) => {
                  const paragraphs = [...values.mainSection.paragraphs];
                  paragraphs[index] = e.target.value;
                  handleMainChange('paragraphs', paragraphs);
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                rows={3}
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image de la section (URL)
            </label>
            <input
              type="text"
              value={values.mainSection.imageUrl}
              onChange={(e) => handleMainChange('imageUrl', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>
      </section>

      {/* Philosophie */}
      <section>
        <h2 className="text-xl font-serif text-gray-900 mb-4">Section &quot;Notre Philosophie&quot;</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre de la section</label>
            <input
              type="text"
              value={values.philosophySection.title}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  philosophySection: {
                    ...prev.philosophySection,
                    title: e.target.value,
                  },
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {values.philosophySection.items.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4">
                <label className="block text-xs font-medium text-gray-600">Icône (emoji)</label>
                <input
                  type="text"
                  value={item.icon}
                  onChange={(e) =>
                    handlePhilosophyItemChange(index, 'icon', e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                />
                <label className="block text-xs font-medium text-gray-600 mt-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) =>
                    handlePhilosophyItemChange(index, 'title', e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                />
                <label className="block text-xs font-medium text-gray-600 mt-2">
                  Description
                </label>
                <textarea
                  value={item.description}
                  onChange={(e) =>
                    handlePhilosophyItemChange(index, 'description', e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  rows={3}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-sage text-white rounded-md hover:bg-gold transition-colors disabled:opacity-50"
          disabled={isSaving}
        >
          {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </form>
  );
}

function ServicesContentForm({ content, onSave, isSaving }: ServicesFormProps) {
  const [values, setValues] = useState<ServicesPageContent>(content);

  useEffect(() => {
    setValues(content);
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(values);
  };

  const handleHeroChange = (field: keyof ServicesPageContent['hero'], value: string) => {
    setValues((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }));
  };

  const handleServiceChange = (
    index: number,
    field: keyof ServicesPageContent['services'][number],
    value: string
  ) => {
    setValues((prev) => {
      const services = [...prev.services];
      services[index] = {
        ...services[index],
        [field]: value,
      };
      return {
        ...prev,
        services,
      };
    });
  };

  const handleAdditionalItemChange = (
    index: number,
    field: keyof ServicesPageContent['additionalInfo']['items'][number],
    value: string
  ) => {
    setValues((prev) => {
      const items = [...prev.additionalInfo.items];
      items[index] = {
        ...items[index],
        [field]: value,
      };
      return {
        ...prev,
        additionalInfo: {
          ...prev.additionalInfo,
          items,
        },
      };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Hero */}
      <section>
        <h2 className="text-xl font-serif text-gray-900 mb-4">En-tête de la page services</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre</label>
            <input
              type="text"
              value={values.hero.title}
              onChange={(e) => handleHeroChange('title', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sous-titre</label>
            <textarea
              value={values.hero.subtitle}
              onChange={(e) => handleHeroChange('subtitle', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows={3}
            />
          </div>
        </div>
      </section>

      {/* Liste des services */}
      <section>
        <h2 className="text-xl font-serif text-gray-900 mb-4">Liste des services</h2>
        <div className="space-y-4">
          {values.services.map((service, index) => (
            <div key={index} className="border border-gray-200 rounded-md p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Service {index + 1}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600">Titre</label>
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">Prix</label>
                  <input
                    type="text"
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">Durée</label>
                  <input
                    type="text"
                    value={service.duration}
                    onChange={(e) =>
                      handleServiceChange(index, 'duration', e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600">
                    Image (URL)
                  </label>
                  <input
                    type="text"
                    value={service.imageUrl}
                    onChange={(e) =>
                      handleServiceChange(index, 'imageUrl', e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600">
                    Description
                  </label>
                  <textarea
                    value={service.description}
                    onChange={(e) =>
                      handleServiceChange(index, 'description', e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Informations pratiques */}
      <section>
        <h2 className="text-xl font-serif text-gray-900 mb-4">Informations pratiques</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre de la section</label>
            <input
              type="text"
              value={values.additionalInfo.title}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  additionalInfo: {
                    ...prev.additionalInfo,
                    title: e.target.value,
                  },
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {values.additionalInfo.items.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4">
                <label className="block text-xs font-medium text-gray-600">Titre</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) =>
                    handleAdditionalItemChange(index, 'title', e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                />
                <label className="block text-xs font-medium text-gray-600 mt-2">
                  Description
                </label>
                <textarea
                  value={item.description}
                  onChange={(e) =>
                    handleAdditionalItemChange(index, 'description', e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  rows={3}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-sage text-white rounded-md hover:bg-gold transition-colors disabled:opacity-50"
          disabled={isSaving}
        >
          {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </form>
  );
}

function ContactContentForm({ content, onSave, isSaving }: ContactFormProps) {
  const [values, setValues] = useState<ContactPageContent>(content);

  useEffect(() => {
    setValues(content);
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(values);
  };

  const handleHeroChange = (field: keyof ContactPageContent['hero'], value: string) => {
    setValues((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }));
  };

  const handleBlockLinesChange = (
    block: 'contactInfo' | 'openingHours',
    index: number,
    value: string
  ) => {
    setValues((prev) => {
      const lines = [...prev[block].lines];
      lines[index] = value;
      return {
        ...prev,
        [block]: {
          ...prev[block],
          lines,
        },
      };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Hero */}
      <section>
        <h2 className="text-xl font-serif text-gray-900 mb-4">En-tête de la page contact</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre</label>
            <input
              type="text"
              value={values.hero.title}
              onChange={(e) => handleHeroChange('title', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sous-titre</label>
            <textarea
              value={values.hero.subtitle}
              onChange={(e) => handleHeroChange('subtitle', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows={3}
            />
          </div>
        </div>
      </section>

      {/* Coordonnées */}
      <section>
        <h2 className="text-xl font-serif text-gray-900 mb-4">Coordonnées</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre du bloc</label>
            <input
              type="text"
              value={values.contactInfo.title}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  contactInfo: {
                    ...prev.contactInfo,
                    title: e.target.value,
                  },
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          {values.contactInfo.lines.map((line, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700">
                Ligne {index + 1}
              </label>
              <input
                type="text"
                value={line}
                onChange={(e) =>
                  handleBlockLinesChange('contactInfo', index, e.target.value)
                }
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Horaires d'ouverture */}
      <section>
        <h2 className="text-xl font-serif text-gray-900 mb-4">Horaires d&apos;ouverture</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre du bloc</label>
            <input
              type="text"
              value={values.openingHours.title}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  openingHours: {
                    ...prev.openingHours,
                    title: e.target.value,
                  },
                }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          {values.openingHours.lines.map((line, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700">
                Ligne {index + 1}
              </label>
              <input
                type="text"
                value={line}
                onChange={(e) =>
                  handleBlockLinesChange('openingHours', index, e.target.value)
                }
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Carte */}
      <section>
        <h2 className="text-xl font-serif text-gray-900 mb-4">Bloc carte</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Texte de remplacement
          </label>
          <input
            type="text"
            value={values.mapPlaceholderText}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                mapPlaceholderText: e.target.value,
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      </section>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-sage text-white rounded-md hover:bg-gold transition-colors disabled:opacity-50"
          disabled={isSaving}
        >
          {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </form>
  );
}