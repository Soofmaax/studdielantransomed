import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-sage/10 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif text-sage mb-4">Studio Élan</h3>
            <p className="text-sm text-gray-600">
              Un espace dédié au yoga et au bien-être au cœur de Paris.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-sage mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-600 hover:text-gold transition-colors">Accueil</Link></li>
              <li><Link href="/about" className="text-gray-600 hover:text-gold transition-colors">À propos</Link></li>
              <li><Link href="/services" className="text-gray-600 hover:text-gold transition-colors">Services</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-gold transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-sage mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-600">
              <li>123 Avenue des Champs-Élysées</li>
              <li>75008 Paris</li>
              <li>01 23 45 67 89</li>
              <li>contact@studio-elan.fr</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-sage mb-4">Horaires</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Lundi - Vendredi: 8h - 21h</li>
              <li>Samedi: 9h - 18h</li>
              <li>Dimanche: 9h - 16h</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-sage/20 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Studio Élan. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;