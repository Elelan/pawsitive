
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PawPrint, UserCog, UserCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth.tsx';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login, loading, currentUser } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">Loading...</div>;
  }

  if (currentUser) {
    router.push(currentUser.role === 'admin' ? '/admin' : '/account');
    return null; 
  }

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <PawPrint className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Sign in to access your Pawsitive Cart account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Removed traditional form for mock login */}
          <Button onClick={() => login('user')} className="w-full" size="lg">
            <UserCircle className="mr-2 h-5 w-5" /> Login as User
          </Button>
          <Button onClick={() => login('admin')} variant="outline" className="w-full" size="lg">
             <UserCog className="mr-2 h-5 w-5" /> Login as Admin
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign Up
            </Link>
          </p>
           <Link href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
