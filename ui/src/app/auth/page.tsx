
"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { BookOpen, User, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'parent' ? 'parent' : 'student';
  const [role, setRole] = useState(initialRole);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'student') {
      router.push('/student');
    } else {
      router.push('/parent');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <BookOpen className="h-8 w-8 text-primary" />
        <span className="text-2xl font-headline font-bold text-primary">SoundSpell Academy</span>
      </Link>

      <Card className="w-full max-w-md border-none shadow-xl bg-white rounded-3xl overflow-hidden">
        <CardHeader className="text-center pt-8 pb-4">
          <CardTitle className="text-2xl font-headline text-primary">Welcome Back!</CardTitle>
          <CardDescription className="font-body">Choose your login to continue your journey</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={role} onValueChange={(v) => setRole(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-background p-1 h-12 rounded-xl">
              <TabsTrigger value="student" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white flex gap-2">
                <User className="h-4 w-4" /> Student
              </TabsTrigger>
              <TabsTrigger value="parent" className="rounded-lg data-[state=active]:bg-secondary data-[state=active]:text-foreground flex gap-2">
                <ShieldCheck className="h-4 w-4" /> Parent
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="kid-code" className="font-headline">Secret Kid Code</Label>
                  <Input 
                    id="kid-code" 
                    placeholder="Enter your magic code" 
                    className="h-12 text-lg rounded-xl border-2 focus:ring-primary font-body"
                    required
                  />
                </div>
                <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-lg rounded-xl font-headline">
                  Ready to Play!
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="parent">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-headline">Parent Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="h-12 rounded-xl border-2 font-body"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-headline">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    className="h-12 rounded-xl border-2 font-body"
                    required 
                  />
                </div>
                <Button className="w-full h-12 bg-secondary hover:bg-secondary/90 text-lg rounded-xl font-headline text-foreground">
                  Login to Dashboard
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <p className="mt-8 text-muted-foreground text-sm font-body">
        {role === 'parent' ? "Need a parent account? " : "Don't have a code? "}
        <Link href="#" className="text-primary font-bold hover:underline">Sign Up</Link>
      </p>
    </div>
  );
}
