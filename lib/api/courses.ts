import { Course } from '@/types/course';
import { logger } from '@/lib/logger';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchCourses(): Promise<Course[]> {
  try {
    const response = await fetch(`${API_URL}/courses`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Failed to fetch courses:', error);
    throw new Error('Une erreur est survenue lors du chargement des cours');
  }
}

export async function deleteCourse(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    logger.error('Failed to delete course:', error);
    throw new Error('Une erreur est survenue lors de la suppression du cours');
  }
}

export async function createCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
  try {
    const response = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(course),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    logger.error('Failed to create course:', error);
    throw new Error('Une erreur est survenue lors de la création du cours');
  }
}

export async function updateCourse(id: string, course: Partial<Course>): Promise<Course> {
  try {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(course),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    logger.error('Failed to update course:', error);
    throw new Error('Une erreur est survenue lors de la mise à jour du cours');
  }
}