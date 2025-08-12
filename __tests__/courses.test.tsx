import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import CoursesPage from '@/app/admin/courses/page';
import { toast } from '@/components/ui/toast';
import * as api from '@/lib/api/courses';

jest.mock('@/lib/api/courses');
jest.mock('@/components/ui/toast');

const mockCourses = [
  {
    id: '1',
    title: 'Yoga Vinyasa',
    description: 'Un style dynamique qui synchronise le mouvement avec la respiration.',
    price: 25,
    duration: 60,
    level: 'ALL_LEVELS',
    capacity: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('CoursesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    );
  };

  it('displays courses list', async () => {
    (api.fetchCourses as jest.Mock).mockResolvedValueOnce(mockCourses);
    
    renderWithProviders(<CoursesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Yoga Vinyasa')).toBeInTheDocument();
    });
  });

  it('handles course deletion', async () => {
    (api.fetchCourses as jest.Mock).mockResolvedValueOnce(mockCourses);
    (api.deleteCourse as jest.Mock).mockResolvedValueOnce({});
    
    renderWithProviders(<CoursesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Yoga Vinyasa')).toBeInTheDocument();
    });

    window.confirm = jest.fn(() => true);
    
    fireEvent.click(screen.getByText('Supprimer'));
    
    await waitFor(() => {
      expect(api.deleteCourse).toHaveBeenCalledWith('1');
      expect(toast).toHaveBeenCalledWith({
        title: 'Succès',
        description: 'Le cours a été supprimé',
        variant: 'success',
      });
    });
  });

  it('displays error message on API failure', async () => {
    (api.fetchCourses as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
    
    renderWithProviders(<CoursesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Une erreur est survenue lors du chargement des cours')).toBeInTheDocument();
    });
  });
});