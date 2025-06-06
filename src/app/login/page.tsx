
"use client";

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PawPrint } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth.tsx';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const { login, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  if (authLoading) {
    return <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">Loading...</div>;
  }

  if (isAuthenticated) {
    const redirectUrl = searchParams.get('redirect') || '/account';
    router.push(redirectUrl);
    return null; 
  }

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsSubmitting(true);
    const user = await login(data);
    setIsSubmitting(false);
    if (!user) {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    }
    // Successful login and redirect is handled by the useAuth hook
  };

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <PawPrint className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Sign in to access your Pawsitive Cart account.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                {...register('email')} 
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                {...register('password')} 
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || authLoading}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </CardContent>
        </form>
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
