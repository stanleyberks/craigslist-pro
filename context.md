# App Blueprint: Craigslist Alert Pro

## 1. Project Breakdown

**App Name**: Craigslist Alert Pro  
**Platform**: Web (Next.js)  
**Summary**: This Web App is a SaaS tool + data-layer parser that scrapes Craigslist listings across multiple cities, based on user-defined alerts, templates, or categories (mirroring Craigslist's structure). It shows results directly in a clean frontend. Paid users receive a subscription-based experience with unlimited alerts and up to 100 results per alert. Free users are limited to 3 alerts and 5 results per alert. The app uses the Apify Craigslist Scraper: https://apify.com/ivanvs/craigslist-scraper

**Primary Use Case**:  
- Users set up saved searches (keywords + cities + optional categories)  
- System continuously scans Craigslist in the background  
- New matches appear in a structured feed with sorting/filtering  
- Users return to the app to review results without manual searching  

**Authentication**:  
- Supabase Auth (email/password + social logins via Google/GitHub)  
- Free users: 3 alerts, 5 results per alert  
- Paid users: More alerts and result quotas based on plan

---

## 2. Tech Stack Overview  
- **Frontend**: Next.js 14 (App Router) + React  
- **UI**: Tailwind CSS + ShadCN for pre-built accessible components (tables, forms, toasts)  
- **Backend**: Supabase (PostgreSQL DB for user data/alerts, real-time subscriptions for instant updates)  
- **Deployment**: Vercel (serverless functions for background scraping tasks)  

---

## 3. Core Features

### **1. Multi-City Craigslist Search**  
- City selector with auto-complete (predefined Craigslist regions)  
- Keyword input with suggestions (e.g., "vintage bike", "macbook pro")  
- Category selection based on Craigslist taxonomy  

### **2. Alert Management**  
- Save searches with custom names ("NYC Camera Gear")  
- Toggle alerts on/off  
- Edit/delete saved searches  

### **3. Real-Time Results Feed**  
- Card-based layout with listing images, prices, and dates  
- Filter by price range, listing age, or keyword  
- "New since last visit" badge  

### **4. Notification System**  
- In-app badge counter for new matches  
- Email digests (daily, weekly, monthly via Supabase Edge Functions)  

### **5. Subscription-Based Result Limits**  
- Free: 3 alerts, 5 results/alert  
- Mid: 10 alerts, 20 results/alert  
- Pro: Unlimited alerts, 100 results/alert  

---

## 4. User Flow

1. **Sign Up/Login**: Supabase Auth modal (ShadCN)  
2. **Dashboard**:  
   - Empty state: "Add your first alert" → opens search form  
   - Existing users see active alerts + recent matches  
3. **Create Alert**:  
   - Form with keyword input, city multi-select, optional price range and category  
   - Submit → saved to Supabase DB  
4. **Results View**:  
   - Auto-refreshes via Supabase real-time API  
   - "Mark as seen" button to clear new-item badges  
5. **Settings**: Upgrade plan or adjust email frequency  
6. **Subscription**:  
   - Managed via Gumroad or Stripe  
   - Plan data stored in `subscriptions` table (limits, email digest freq)  
7. **Quota Enforcement**: Search/alert actions checked against plan limits  

---

## 5. Design & UI/UX Guidelines

- **Layout**:  
  - Left sidebar (alerts list) + main content (results grid)  
  - Mobile: Hamburger menu for sidebar  
- **Styling**:  
  - Tailwind: Neutral color palette (slate-900 bg, white cards)  
  - ShadCN components for consistent modals/buttons  
- **Key Interactions**:  
  - Hover cards show full listing description  
  - One-click "Open on Craigslist" button in each result  
  - Skeleton loading states during searches

**🎯 UX Goals**:
- Clear, trustworthy workflow  
- Subscription upgrade path is logical and benefits-driven  
- Efficient for power users  
- Mobile-friendly, but desktop-focused

---

## 6. Technical Implementation

### **Frontend (Next.js)**:
- `/app` route: Protected via Supabase Auth middleware  
- `AlertsTable`: ShadCN Data Table connected to Supabase  
- Real-time updates via Supabase channel:  
```ts
const { data: newListings } = await supabase
  .channel('alerts')
  .on('postgres_changes', { event: 'INSERT', schema: 'public' }, handleNewMatch)
  .subscribe()
```

### **Backend (Supabase)**:
- **Tables**:  
  - `users`: Auth profiles  
  - `alerts`: user_id, keywords, cities (JSON), category, created_at  
  - `matches`: alert_id, listing_data (JSON), is_new (boolean)  
  - `subscriptions`: user_id, plan, email_digest_frequency  

- **Serverless Functions (Vercel)**:  
  - Hourly scraping job using Apify  
  - Result → insert into `matches` → triggers realtime updates

---

## 7. API Contract (Scraper)

- **Input to Apify**:
```json
{
  "keyword": "macbook",
  "cities": ["newyork", "sfbay"],
  "category": "for-sale"
}
```
- **Response**: Array of listings with title, price, location, URL, date
- Listings stored as `listing_data` JSON in DB

---

## 8. Development Setup

1. **Tools**:
   - Node.js 20+  
   - Supabase CLI  
   - Apify CLI  
   - Vercel CLI

2. **Local Setup**:
```bash
git clone [repo]
cd craigslist-alert-pro
npm install
cp .env.example .env.local # Add Supabase URL/anon key
supabase start
npm run dev
```

3. **Deployment**:
- Connect to GitHub + Vercel
- Add Supabase environment variables in Vercel
- Enable auto-promotion to production

---

## 9. Security Considerations

### **1. Authentication**:
- Supabase Auth (email/password, OAuth)
- Secure password hashing
- Email confirmation and password reset flow

### **2. Data Protection**:
- RLS enabled for user-specific data access
- Supabase encryption at rest
- Inputs sanitized before sending to Apify

### **3. Abuse Prevention**:
- Limit Apify job frequency per user plan
- Add bot/honeypot protection to alert forms

---

## 10. License + Plan Logic

- Plans: Free / Mid / Pro
- Stored in `subscriptions` table
- Fields:
  - `alert_limit`
  - `results_per_alert`
  - `email_digest_frequency`
  - `plan_name`

---

## 11. Notes

- Each search or alert creates a fetch to Apify actor
- Based on subscription plan:
  - Results are trimmed (5 / 20 / 100)
  - Alerts limited (3 / 10 / ∞)
  - Refresh frequency controlled (future upgrade)
- Results shown in UI with filtering, sorting, and clear UX
- Use this 20 screens from Figma file to UI UX inspiration https://www.figma.com/file/Xn0L5vi97VYqc9V8bpux2N?try-plugin-id=1332649462188834894&try-plugin-version-id=118476&try-plugin-name=Mobbin&is-widget=0&is-playground-file=0&try-plugin-file-key=Xn0L5vi97VYqc9V8bpux2N&mode=design&type=design&fuid=1376248894558929996&try-plugin-editor-type=figjam 