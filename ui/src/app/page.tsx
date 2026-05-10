
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BookOpen, Trophy, Users, ShieldCheck } from 'lucide-react';

export default function Home() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-bg');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white">
        <Link className="flex items-center justify-center" href="/">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-headline font-bold text-primary">SoundSpell Academy</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/auth?role=student">
            Student Login
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/auth?role=parent">
            Parent Login
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background relative overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10 mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-headline font-extrabold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                    Unlock the Magic of Phonics!
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl font-body">
                    A colorful, engaging, and interactive journey to help your child master reading through the power of sound.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth?role=student">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-full px-8 text-lg font-headline">
                      Start Learning
                    </Button>
                  </Link>
                  <Link href="/auth?role=parent">
                    <Button variant="outline" size="lg" className="rounded-full px-8 text-lg font-headline border-primary text-primary">
                      Parent Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative group mx-auto">
                <Image
                  src={heroImg?.imageUrl || 'https://picsum.photos/seed/soundspell-hero/1200/600'}
                  alt="Children learning"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  data-ai-hint="education children"
                />
                <div className="absolute -bottom-6 -left-6 bg-secondary p-4 rounded-xl shadow-lg animate-bounce-soft">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white mx-auto">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 p-6 rounded-xl bg-background border shadow-sm">
                <Users className="h-12 w-12 text-primary mb-2" />
                <h3 className="text-xl font-headline font-bold">Kids Love It</h3>
                <p className="text-center text-muted-foreground font-body">
                  Interactive games and rewards keep students motivated and engaged for hours of fun.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 rounded-xl bg-background border shadow-sm">
                <ShieldCheck className="h-12 w-12 text-secondary mb-2" />
                <h3 className="text-xl font-headline font-bold">Parent Peace of Mind</h3>
                <p className="text-center text-muted-foreground font-body">
                  Secure environment with detailed progress tracking and parent-only dashboards.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 rounded-xl bg-background border shadow-sm">
                <BookOpen className="h-12 w-12 text-primary mb-2" />
                <h3 className="text-xl font-headline font-bold">Proven Methods</h3>
                <p className="text-center text-muted-foreground font-body">
                  Curriculum designed by educators focused on phonemic awareness and decoding skills.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white">
        <p className="text-xs text-muted-foreground">© 2024 SoundSpell Academy. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
