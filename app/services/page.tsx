import Image from 'next/image';
import Link from 'next/link';

export default function ServicesPage() {
  const services = [
    {
      title: "Yoga Doux",
      description: "Une pratique douce et accessible, parfaite pour les débutants ou pour une approche plus relaxante du yoga.",
      duration: "60 min",
      price: "25€",
      image: "https://images.pexels.com/photos/8436589/pexels-photo-8436589.jpeg"
    },
    {
      title: "Yoga Énergie",
      description: "Un cours dynamique combinant postures fluides et respirations pour stimuler votre énergie vitale.",
      duration: "75 min",
      price: "28€",
      image: "https://images.pexels.com/photos/6698513/pexels-photo-6698513.jpeg"
    },
    {
      title: "Étirements & Relaxation",
      description: "Séance focalisée sur les étirements profonds et la relaxation pour libérer les tensions.",
      duration: "60 min",
      price: "25€",
      image: "https://images.pexels.com/photos/6698615/pexels-photo-6698615.jpeg"
    }
  ];

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="bg-cream py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-sage mb-8">
            Nos Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez notre sélection de cours adaptés à tous les niveaux et objectifs.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="relative h-64">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-serif text-sage">{service.title}</h3>
                    <span className="text-gold font-medium">{service.price}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Durée: {service.duration}</span>
                  </div>
                  <Link
                    href="/reservation"
                    className="block text-center bg-sage hover:bg-gold text-white py-3 px-6 rounded-full mt-6 transition-colors duration-300"
                  >
                    Réserver
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif text-sage mb-6">Informations Pratiques</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="font-medium text-sage mb-2">Équipement Fourni</h3>
                <p className="text-gray-600">Tapis, blocs, sangles disponibles sur place</p>
              </div>
              <div>
                <h3 className="font-medium text-sage mb-2">Vestiaires</h3>
                <p className="text-gray-600">Douches et casiers sécurisés</p>
              </div>
              <div>
                <h3 className="font-medium text-sage mb-2">Réservation</h3>
                <p className="text-gray-600">En ligne ou par téléphone</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}