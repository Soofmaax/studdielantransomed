import { render, screen } from '@testing-library/react';
import About from '../About';

describe('About Section', () => {
  it('renders the about section correctly', () => {
    render(<About />);
    
    expect(screen.getByText('À propos de nous')).toBeInTheDocument();
    expect(screen.getByText(/Fondé en 2020/)).toBeInTheDocument();
    expect(screen.getByText('500+')).toBeInTheDocument();
    expect(screen.getByText('Élèves satisfaits')).toBeInTheDocument();
  });

  it('displays all statistics', () => {
    render(<About />);
    
    const stats = [
      { value: '500+', label: 'Élèves satisfaits' },
      { value: '12', label: 'Professeurs experts' },
      { value: '25', label: 'Cours par semaine' },
    ];

    stats.forEach(({ value, label }) => {
      expect(screen.getByText(value)).toBeInTheDocument();
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});