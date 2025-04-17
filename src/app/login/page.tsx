import { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Login - Craigslist Alert Pro",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link 
            href="/" 
            className="transition-colors hover:text-primary/90"
          >
            Craigslist Alert Pro
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <Card className="bg-transparent border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary-foreground">What Users Say</CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="space-y-2">
                <p className="text-lg italic">
                  "This tool has completely transformed how I search for items on Craigslist. 
                  The multi-city monitoring is a game-changer!"
                </p>
                <footer className="text-sm text-primary-foreground/80">Sofia Davis</footer>
              </blockquote>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="lg:p-8">
        <Card className="mx-auto w-full max-w-[350px] border-none shadow-none">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Welcome back
            </CardTitle>
            <CardDescription>
              Enter your email to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <AuthForm />
            <Separator />
            <div className="text-center text-sm">
              <Link
                href="/register"
                className={cn(
                  "text-muted-foreground underline-offset-4 transition-colors",
                  "hover:text-primary hover:underline"
                )}
              >
                Don&apos;t have an account? Sign Up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
