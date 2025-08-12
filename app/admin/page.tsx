import Link from 'next/link';

export default function AdminDashboard() {
  // Mock statistics
  const stats = [
    { name: 'Cours cette semaine', value: '25' },
    { name: 'Clients actifs', value: '150' },
    { name: 'Taux de remplissage', value: '85%' },
    { name: 'Revenus du mois', value: '5,240€' },
  ];

  // Mock recent bookings
  const recentBookings = [
    { id: '1', client: 'Sophie Martin', course: 'Yoga Vinyasa', date: '2025-01-15 10:00', status: 'confirmed' },
    { id: '2', client: 'Thomas Dubois', course: 'Méditation', date: '2025-01-15 14:00', status: 'pending' },
    { id: '3', client: 'Marie Laurent', course: 'Yoga Doux', date: '2025-01-16 09:00', status: 'confirmed' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-gray-900">Tableau de bord</h1>
        <p className="mt-2 text-sm text-gray-700">
          Vue d'ensemble de l'activité du studio
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                {stat.name}
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-sage">
                {stat.value}
              </dd>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Réservations récentes
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {booking.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Link
                      href={`/admin/bookings/${booking.id}`}
                      className="text-sage hover:text-gold"
                    >
                      Voir détails
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}