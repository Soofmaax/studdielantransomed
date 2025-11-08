'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from '@/components/ui/toast';

export default function NewCoursePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: 0,
    duration: 60,
    level: 'ALL_LEVELS',
    capacity: 10,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'duration' || name === 'capacity' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'Erreur lors de la création du cours');
      }

      toast({
        title: 'Succès',
        description: 'Cours créé',
        variant: 'success',
      });

      router.push('/admin/courses');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-serif text-gray-900 mb-6">Nouveau cours</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Titre
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Prix (€)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min={0}
              step={1}
              value={form.price}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Durée (min)
            </label>
            <input
              id="duration"
              name="duration"
              type="number"
              min={15}
              step={15}
              value={form.duration}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
              Capacité
            </label>
            <input
              id="capacity"
              name="capacity"
              type="number"
              min={1}
              step={1}
              value={form.capacity}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700">
            Niveau
          </label>
          <select
            id="level"
            name="level"
            value={form.level}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Sélectionnez un niveau</option>
            <option value="BEGINNER">BEGINNER</option>
            <option value="INTERMEDIATE">INTERMEDIATE</option>
            <option value="ADVANCED">ADVANCED</option>
            <option value="ALL_LEVELS">ALL_LEVELS</option>
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 border rounded-md"
            onClick={() => router.push('/admin/courses')}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-sage text-white rounded-md hover:bg-gold transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </form>
    </div>
  );
}