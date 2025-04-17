# Craigslist Alert Pro 🔍

A modern, production-ready SaaS application for automated Craigslist monitoring and alerts.

## Features ✨

- **Smart Alerts**: Create and manage custom alerts with advanced filtering
- **Real-time Updates**: Get instant notifications when new matches are found
- **Spam Protection**: Advanced filtering to remove scams and duplicate listings
- **Multi-tier Plans**: Free, Pro, and Business plans with different quotas
- **Modern UI**: Clean, responsive interface with dark mode support

## Tech Stack 🛠

- **Frontend**: Next.js, TypeScript, TailwindCSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Infrastructure**: Vercel, Supabase Cloud
- **Monitoring**: Sentry, Vercel Analytics

## Getting Started 🚀

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account (optional for deployment)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/craigslist-alert-pro.git
cd craigslist-alert-pro
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Copy `.env.example` to `.env.local` and fill in your environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the app

### Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Database Setup

1. Create a new Supabase project
2. Run the database migrations:
```bash
npx supabase db push
```

## Deployment 🌍

### Vercel Deployment

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Manual Deployment

1. Build the application:
```bash
npm run build
# or
yarn build
```

2. Start the production server:
```bash
npm start
# or
yarn start
```

## Security 🔒

- All database access is controlled through Row Level Security (RLS)
- API keys and secrets are managed through environment variables
- Input sanitization and validation on both client and server
- Regular security audits and dependency updates

## Monitoring & Analytics 📊

- Error tracking through Sentry
- Performance monitoring with Vercel Analytics
- Custom event tracking for user actions
- Database query performance monitoring

## Support & Feedback 💬

- GitHub Issues for bug reports and feature requests
- Email support: support@yourapp.com
- Discord community: [Join here](your_discord_link)

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📝

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments 🙏

- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.io)
- [TailwindCSS](https://tailwindcss.com)
- [Vercel](https://vercel.com)

A powerful SaaS tool that helps users monitor Craigslist listings across multiple cities with automated alerts and real-time updates.

## Features

- Multi-city Craigslist search monitoring
- Real-time listing updates
- Customizable search alerts
- Email notifications
- Subscription-based access tiers

## Tech Stack

- Frontend: Next.js 14 (App Router)
- UI: Tailwind CSS + ShadcnUI
- Backend: Supabase (Auth, Database, Real-time)
- Deployment: Vercel
- Scraping: Apify Craigslist Scraper

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Add your Supabase and other credentials to `.env.local`
5. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/                 # Next.js 14 App Router
├── components/          # Reusable UI components
├── lib/                 # Utilities and helpers
├── types/              # TypeScript definitions
└── styles/             # Global styles
```

## License

Private - All rights reserved
