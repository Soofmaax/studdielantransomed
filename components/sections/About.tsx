import Image from 'next/image';

const About = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[500px]">
            <Image
              src="https://images.pexels.com/photos/8436461/pexels-photo-8436461.jpeg"
              alt="Studio de yoga"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-sage mb-6">À propos de nous</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Fondé en 2020, Studio Élan est né d'une passion pour le yoga et d'une vision : créer un espace où chacun peut se reconnecter à soi-même, dans un cadre apaisant au cœur de Paris.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Notre approche unique combine traditions ancestrales et techniques modernes, guidée par des professeurs expérimentés qui s'adaptent à tous les niveaux.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-cream rounded-lg">
                <p className="text-2xl font-serif text-gold mb-2">500+</p>
                <p className="text-sm text-gray-600">Élèves satisfaits</p>
              </div>
              <div className="p-4 bg-cream rounded-lg">
                <p className="text-2xl font-serif text-gold mb-2">12</p>
                <p className="text-sm text-gray-600">Professeurs experts</p>
              </div>
              <div className="p-4 bg-cream rounded-lg">
                <p className="text-2xl font-serif text-gold mb-2">25</p>
                <p className="text-sm text-gray-600">Cours par semaine</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;