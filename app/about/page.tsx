import Image from 'next/image';

export default function AboutPage() {
  const philosophyItems = [
    {
      title: "Calme",
      description: "Un espace serein pour se reconnecter à soi-même et trouver la paix intérieure.",
      icon: "🌿"
    },
    {
      title: "Énergie",
      description: "Des pratiques dynamisantes pour revitaliser corps et esprit.",
      icon: "✨"
    },
    {
      title: "Équilibre",
      description: "Une approche holistique pour harmoniser tous les aspects de votre être.",
      icon: "⚖️"
    }
  ];

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="bg-cream py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-serif text-sage text-center mb-8">
            Notre Histoire
          </h1>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl text-gray-600 mb-8">
              Studio Élan est né d'une vision simple : créer un espace où chacun peut explorer et approfondir sa pratique du yoga dans un cadre bienveillant et inspirant.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative h-[600px]">
              <Image
                src="https://images.pexels.com/photos/8436714/pexels-photo-8436714.jpeg"
                alt="Studio de yoga"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-serif text-sage mb-6">Notre Vision</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Depuis notre création en 2020, nous nous efforçons de créer un environnement où la pratique du yoga devient une expérience transformative. Notre studio, situé au cœur de Paris, est plus qu'un simple espace de pratique - c'est un lieu de rencontre, d'apprentissage et de croissance personnelle.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Nos professeurs, tous certifiés et passionnés, vous accompagnent dans votre progression, que vous soyez débutant ou pratiquant confirmé. Nous croyons en un yoga accessible à tous, adapté aux besoins et aux capacités de chacun.
              </p>
            </div>
          </div>

          {/* Philosophy Section */}
          <div className="bg-cream rounded-lg p-12 mt-16">
            <h2 className="text-3xl font-serif text-sage text-center mb-12">Notre Philosophie</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {philosophyItems.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-serif text-sage mb-4">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}