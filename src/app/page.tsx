import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">Craigslist Alert Pro</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center gap-4 pb-8 pt-6 md:py-10">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
            Monitor Craigslist Listings Across Multiple Cities
          </h1>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            Set up alerts, get instant notifications, and never miss a deal again.
          </p>
        </div>
        <div className="flex gap-4">
          <Button size="lg" asChild>
            <Link href="/register">Start Monitoring Craigslist</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-12 md:py-24">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <h3 className="mt-4 text-lg font-semibold">Multi-City Search</h3>
            <p className="text-muted-foreground">
              Monitor listings across multiple cities simultaneously
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <h3 className="mt-4 text-lg font-semibold">Real-Time Alerts</h3>
            <p className="text-muted-foreground">
              Get instant notifications when new listings match your criteria
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <h3 className="mt-4 text-lg font-semibold">Smart Filtering</h3>
            <p className="text-muted-foreground">
              Filter by price, date, and keywords to find exactly what you want
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container py-12 md:py-24">
        <h2 className="mb-12 text-center text-3xl font-bold">Simple, Transparent Pricing</h2>
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {/* Free Tier */}
          <div className="rounded-lg border p-8">
            <h3 className="mb-2 text-xl font-bold">Free</h3>
            <p className="mb-4 text-muted-foreground">Get started with basic monitoring</p>
            <div className="mb-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="mb-8 space-y-2">
              <li>3 Active Alerts</li>
              <li>5 Results per Alert</li>
              <li>Daily Updates</li>
            </ul>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>

          {/* Mid Tier */}
          <div className="rounded-lg border p-8">
            <h3 className="mb-2 text-xl font-bold">Pro</h3>
            <p className="mb-4 text-muted-foreground">Perfect for regular searchers</p>
            <div className="mb-4">
              <span className="text-4xl font-bold">$9</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="mb-8 space-y-2">
              <li>10 Active Alerts</li>
              <li>20 Results per Alert</li>
              <li>Real-time Updates</li>
              <li>Email Notifications</li>
            </ul>
            <Button className="w-full" asChild>
              <Link href="/register?plan=pro">Get Pro</Link>
            </Button>
          </div>

          {/* Pro Tier */}
          <div className="rounded-lg border p-8">
            <h3 className="mb-2 text-xl font-bold">Enterprise</h3>
            <p className="mb-4 text-muted-foreground">For power users</p>
            <div className="mb-4">
              <span className="text-4xl font-bold">$29</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="mb-8 space-y-2">
              <li>Unlimited Alerts</li>
              <li>100 Results per Alert</li>
              <li>Real-time Updates</li>
              <li>Priority Support</li>
              <li>Custom Integrations</li>
            </ul>
            <Button className="w-full" variant="secondary" asChild>
              <Link href="/register?plan=enterprise">Get Enterprise</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex h-14 items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Craigslist Alert Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
