# Documentation des API Routes — Studio Élan

Toutes les routes sont sous `app/api/**` et renvoient des réponses JSON standardisées. Les erreurs sont gérées par `lib/api/error-handler.ts`.

Note: Les exemples indiquent le schéma Zod associé et l’auth requis.

Authentification
- getServerSession (NextAuth) + wrappers:
  - `withAuth(handler)` → session obligatoire
  - `withAdminAuth(handler)` → rôle ADMIN obligatoire

Courses
- GET `/api/courses`
  - Auth: public
  - Réponse: liste des cours (id, title, description, price, duration, level, capacity)
- POST `/api/courses`
  - Auth: ADMIN
  - Body: `createCourseSchema` (lib/validations/course.ts)
  - Réponse: cours créé
- PUT `/api/courses/[id]`
  - Auth: ADMIN
  - Body: `updateCourseSchema`
  - Réponse: cours mis à jour
- DELETE `/api/courses/[id]`
  - Auth: ADMIN
  - Réponse: 204

Bookings
- GET `/api/bookings`
  - Auth: withAuth
  - Query: pagination (optionnelle)
  - Réponse: réservations de l’utilisateur connecté (relations user/course incluses)
- GET `/api/bookings/[id]`
  - Auth: withAuth + ownership/admin
  - Réponse: réservation détaillée
- POST `/api/bookings`
  - Auth: withAuth
  - Body: `createBookingSchema` (lib/validations/booking.ts)
  - Réponse: réservation créée (contrôle capacité, anti-duplication)
- PUT `/api/bookings/[id]`
  - Auth: ADMIN
  - Body: `updateBookingSchema`
  - Réponse: réservation mise à jour

Contact
- POST `/api/contact`
  - Auth: public
  - Body: `contactSchema` (lib/validations/contact.ts)
  - Sécurité: rate limiting (10/10min/IP), validate JSON
  - Réponse: message reçu (et éventuellement notifications)

Paiement Stripe
- POST `/api/create-checkout-session`
  - Auth: withAuth
  - Body: `createCheckoutSessionSchema` (courseId, date ISO future, userId)
  - Sécurité: rate limiting (60/10min/IP), validate JSON
  - Mode démo (par défaut):
    - Retourne `{ sessionId: "demo_...", url: "https://checkout.stripe.com/pay/demo_..." }`
  - Mode live:
    - Nécessite `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
    - Crée une session Stripe réelle

Webhook Stripe
- POST `/api/webhook`
  - Auth: public (stripe-signature en live)
  - Body (live): payload Stripe signé
  - Body (démo): `{ sessionId: "demo_..." }`
  - Réponse: accusé de réception + traitement éventuel (création/confirmation de booking)

Notifications
- POST `/api/notifications/reminder`
  - Auth: ADMIN (ou tâche planifiée)
  - Fonction: envoi rappel pour réservations à venir
  - Réponse: résumé des envois

Santé
- GET `/api/health`
  - Réponse: `{ status: "ok" }`
- GET `/api/ready`
  - Réponse: `{ status: "ready" }` ou 503 si DB indisponible

Erreurs (schéma)
- `VALIDATION_ERROR` (400): détails par champ (Zod)
- `AUTHENTICATION_ERROR` (401)
- `AUTHORIZATION_ERROR` (403)
- `NOT_FOUND_ERROR` (404)
- `CONFLICT_ERROR` (409)
- `RATE_LIMIT_ERROR` (429)
- `EXTERNAL_SERVICE_ERROR` (502)
- `INTERNAL_SERVER_ERROR` (500)

Conventions
- JSON camelCase
- Dates en ISO 8601 (UTC)
- Types stricts côté server: pas de `any`, utilisez des interfaces Zod et des gardes de type.