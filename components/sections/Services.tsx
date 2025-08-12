import Image from 'next/image';

const Services = () => {
  const services = [
    {
      title: "Yoga Vinyasa",
      description: "Un style dynamique qui synchronise le mouvement et la respiration pour créer un flux continu. Idéal pour développer force, souplesse et concentration.",
      price: "25",
      duration: "60 min",
      level: "Tous niveaux",
      imageUrl: "https://images.pexels.com/photos/3822219/pexels-photo-3822219.jpeg",
      schedule: "Lun, Mer, Ven 10h & 18h"
    },
    {
      title: "Yin Yoga",
      description: "Une pratique douce et méditative qui cible les tissus conjonctifs. Les postures sont maintenues plus longtemps pour favoriser la relaxation profonde.",
      price: "22",
      duration: "75 min",
      level: "Tous niveaux",
      imageUrl: "https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg",
      schedule: "Mar, Jeu 12h & 20h"
    },
    {
      title: "Méditation",
      description: "Des séances guidées pour apaiser l'esprit, réduire le stress et favoriser la conscience de soi. Une pratique accessible à tous pour cultiver la paix intérieure.",
      price: "18",
      duration: "45 min",
      level: "Débutant à avancé",
      imageUrl: "https://images.pexels.com/photos/8964015/pexels-photo-8964015.jpeg",
      schedule: "Mer, Sam 9h & 17h"
    }
  ];

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
            Nos Services
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-8"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2 group">
              <div className="relative h-60">
                <Image 
                  src={service.imageUrl}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white font-serif">
                    {service.title}
                  </h3>
                  <span className="text-accent-600 dark:text-accent-400 font-bold text-xl">
                    {service.price}€
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {service.description}
                </p>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>{service.duration}</span>
                    <span>{service.level}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {service.schedule}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;