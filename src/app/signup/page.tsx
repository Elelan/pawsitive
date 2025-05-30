
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PawPrint, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth.tsx';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const { login, loading, currentUser } = useAuth(); // Using login to simulate signup and login
  const router = useRouter();

  if (loading) {
    return <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">Loading...</div>;
  }

  if (currentUser) {
    router.push('/account'); // Redirect if already logged in
    return null;
  }

  // Simplified signup: just logs in as a user
  const handleSignUpAsUser = () => {
    login('user', 'newuser@pawsitive.com'); // Mock email
  };

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <PawPrint className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-3xl font-bold">Create Your Account</CardTitle>
          <CardDescription>Join Pawsitive Cart and give your pet the best!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {/* Removed traditional form for mock signup */}
            <Button onClick={handleSignUpAsUser} className="w-full" size="lg">
                <UserPlus className="mr-2 h-5 w-5" /> Sign Up as User
            </Button>
            {/* In a real app, you'd have input fields for name, email, password etc. */}
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
