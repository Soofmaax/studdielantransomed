import Image from 'next/image';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sophie Martin",
      role: "Élève depuis 2021",
      content: "Studio Élan a transformé ma pratique du yoga. L'ambiance est apaisante et les professeurs sont exceptionnels.",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg"
    },
    {
      name: "Thomas Dubois",
      role: "Élève depuis 2022",
      content: "J'ai découvert le yoga ici et je ne peux plus m'en passer. Les cours sont adaptés à tous les niveaux.",
      image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg"
    },
    {
      name: "Marie Laurent",
      role: "Élève depuis 2020",
      content: "Un véritable havre de paix dans Paris. Les cours de méditation ont changé ma vie quotidienne.",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-serif text-sage text-center mb-12">
          Ce que disent nos élèves
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-cream rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 mr-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="rounded-full object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="font-medium text-sage">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">&ldquo;{testimonial.content}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;