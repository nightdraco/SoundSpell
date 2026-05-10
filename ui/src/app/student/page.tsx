
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Play, Star, Trophy, BookOpen, Music, MapPin } from 'lucide-react';

const LESSONS = [
  { id: 1, title: 'Phase 2: s, a, t, p', progress: 100, status: 'completed', image: 'https://picsum.photos/seed/s-a-t-p/300/200' },
  { id: 2, title: 'Phase 2: i, n, m, d', progress: 45, status: 'current', image: 'https://picsum.photos/seed/i-n-m-d/300/200' },
  { id: 3, title: 'Phase 3: j, v, w, x', progress: 0, status: 'locked', image: 'https://picsum.photos/seed/j-v-w-x/300/200' },
];

export default function StudentDashboard() {
  const avatar = PlaceHolderImages.find(img => img.id === 'student-avatar');

  return (
    <div className="min-h-screen bg-background">
      {/* Student Top Bar */}
      <header className="bg-white px-6 h-20 flex items-center justify-between border-b-4 border-primary/10 shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center border-2 border-white shadow-md">
            <Image src={avatar?.imageUrl || ''} alt="Mascot" width={40} height={40} className="rounded-full" />
          </div>
          <div>
            <h1 className="text-xl font-headline font-bold text-primary">Hello, Leo!</h1>
            <div className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
              <Star className="h-3 w-3 fill-yellow-600" /> 250 Stars
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block w-48 lg:w-64">
             <p className="text-[10px] font-bold text-primary uppercase mb-1 flex justify-between">
                <span>Level 5</span>
                <span>XP: 1240/1500</span>
             </p>
             <Progress value={80} className="h-3 bg-blue-100 ring-2 ring-white" />
          </div>
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
               <Music className="h-6 w-6 text-primary" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto py-8 px-4">
        {/* Journey Map Header */}
        <div className="flex items-center gap-2 mb-8">
           <MapPin className="h-6 w-6 text-secondary fill-secondary" />
           <h2 className="text-2xl font-headline font-extrabold text-primary">Your Learning Island</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LESSONS.map((lesson) => (
            <Card key={lesson.id} className={`group relative overflow-hidden border-4 rounded-3xl transition-all duration-300 ${
              lesson.status === 'locked' ? 'grayscale opacity-80 cursor-not-allowed' : 'hover:scale-105 hover:shadow-2xl'
            } ${lesson.status === 'current' ? 'border-secondary' : 'border-transparent'}`}>
              <CardContent className="p-0">
                <div className="relative aspect-video">
                  <Image src={lesson.image} alt={lesson.title} fill className="object-cover" />
                  {lesson.status === 'locked' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                       <Trophy className="h-12 w-12 text-white/50" />
                    </div>
                  )}
                  {lesson.status === 'completed' && (
                    <div className="absolute top-4 right-4 bg-green-500 p-2 rounded-full shadow-lg">
                      <Star className="h-5 w-5 text-white fill-white" />
                    </div>
                  )}
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-lg font-headline font-bold text-primary mb-3">{lesson.title}</h3>
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-xs font-body font-bold text-muted-foreground uppercase">Progress</span>
                     <span className="text-xs font-body font-bold text-primary">{lesson.progress}%</span>
                  </div>
                  <Progress value={lesson.progress} className="h-2 mb-6" />
                  
                  {lesson.status === 'current' ? (
                    <Link href={`/student/lessons/${lesson.id}`}>
                      <Button className="w-full bg-secondary hover:bg-secondary/90 text-foreground font-headline text-lg rounded-2xl h-14 group-hover:animate-pulse">
                        <Play className="mr-2 h-5 w-5 fill-current" /> Continue
                      </Button>
                    </Link>
                  ) : lesson.status === 'completed' ? (
                    <Button variant="outline" className="w-full border-2 border-primary text-primary font-headline text-lg rounded-2xl h-14">
                      Replay
                    </Button>
                  ) : (
                    <Button disabled className="w-full h-14 rounded-2xl">
                      Locked
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Fun Facts/Callout */}
        <div className="mt-16 bg-white p-8 rounded-[2rem] border-4 border-dashed border-secondary/50 flex flex-col md:flex-row items-center gap-8">
           <div className="h-32 w-32 shrink-0 bg-blue-50 rounded-full flex items-center justify-center">
              <Trophy className="h-16 w-16 text-primary" />
           </div>
           <div className="space-y-2">
              <h3 className="text-2xl font-headline font-bold text-primary">Weekly Challenge!</h3>
              <p className="text-muted-foreground font-body leading-relaxed">
                Complete 3 lessons this week to unlock the "Super Speller" badge and earn a 50 bonus stars! You can do it, Leo!
              </p>
              <div className="pt-4 flex gap-4">
                <Button className="bg-primary rounded-xl font-headline">View Badges</Button>
                <Button variant="ghost" className="text-primary font-bold">Details</Button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
