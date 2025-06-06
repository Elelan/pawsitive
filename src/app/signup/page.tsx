
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PawPrint, UserPlus, Loader2 } from 'lucide-react'; 
import { useAuth } from '@/hooks/useAuth.tsx';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const signUpFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], 
});

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export default function SignUpPage() {
  const { signup, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, setError } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
  });

  if (authLoading) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="ml-4 text-lg">Loading...</span>
      </div>
    );
  }

  if (isAuthenticated) {
    router.push('/account');
    return null;
  }

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    setIsSubmitting(true);
    const result = await signup({ name: data.name, email: data.email, password: data.password });
    setIsSubmitting(false);

    if (result.user) {
      toast({
        title: 'Account Created!',
        description: 'Welcome to Pawsitive Cart. You are now logged in.',
      });
      // Redirect is handled by useAuth's login method after successful signup
    } else {
      let toastMessage = 'Could not create your account. Please try again.';
      if (typeof result.error === 'string') {
        toastMessage = result.error;
      } else if (typeof result.error === 'object') {
        // If the error object has field-specific messages (like from validation or P2002)
        const fieldErrors = Object.values(result.error).flat();
        if (fieldErrors.length > 0) {
          toastMessage = fieldErrors.join(' ');
           // Set form errors for specific fields if possible
           Object.entries(result.error).forEach(([field, messages]) => {
            if (field === 'email' || field === 'name' || field === 'password') { // Add other fields if your API returns them
              setError(field as keyof SignUpFormValues, { type: 'manual', message: (messages as string[]).join(' ') });
            }
          });
        }
      }
      
      toast({
        title: 'Sign Up Failed',
        description: toastMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <PawPrint className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-3xl font-bold">Create Your Account</CardTitle>
          <CardDescription>Join Pawsitive Cart and give your pet the best!</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="Your Name" 
                {...register('name')} 
                aria-invalid={errors.name ? "true" : "false"}
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                {...register('email')} 
                aria-invalid={errors.email ? "true" : "false"}
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="••••••••" 
                {...register('confirmPassword')} 
                aria-invalid={errors.confirmPassword ? "true" : "false"}
                disabled={isSubmitting}
              />
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || authLoading}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" /> Sign Up
                </>
              )}
            </Button>
          </CardContent>
        </form>
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
