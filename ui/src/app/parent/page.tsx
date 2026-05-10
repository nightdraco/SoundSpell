
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, TrendingUp, BookOpen, Clock, Award, Settings, User } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';

const PROGRESS_DATA = [
  { day: 'Mon', minutes: 20 },
  { day: 'Tue', minutes: 35 },
  { day: 'Wed', minutes: 15 },
  { day: 'Thu', minutes: 40 },
  { day: 'Fri', minutes: 25 },
  { day: 'Sat', minutes: 50 },
  { day: 'Sun', minutes: 30 },
];

const RECENT_LESSONS = [
  { name: 'Phase 2: s, a, t, p', date: '2024-03-20', score: 95, status: 'Mastered' },
  { name: 'Phase 2: i, n, m, d', date: '2024-03-21', score: 82, status: 'In Progress' },
  { name: 'Vowel Sounds: a vs e', date: '2024-03-19', score: 100, status: 'Mastered' },
];

export default function ParentDashboard() {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar for Parent */}
      <aside className="w-full md:w-64 bg-white border-r min-h-screen p-6 hidden md:block">
        <div className="flex items-center gap-2 mb-10">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-headline font-bold text-lg text-primary">SoundSpell</span>
        </div>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-3 bg-blue-50 text-primary">
            <TrendingUp className="h-4 w-4" /> Overview
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
            <User className="h-4 w-4" /> Child Profiles
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
            <Award className="h-4 w-4" /> Achievements
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
            <Settings className="h-4 w-4" /> Settings
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 space-y-8 mx-auto max-w-7xl">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-slate-900">Parent Dashboard</h1>
            <p className="text-muted-foreground font-body">Tracking progress for <strong>Leo</strong></p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="font-headline"><CalendarIcon className="mr-2 h-4 w-4" /> Last 7 Days</Button>
            <Button className="bg-primary font-headline">Download Report</Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-green-600">+2 from last week</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Time</CardTitle>
              <Clock className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.5 hrs</div>
              <p className="text-xs text-muted-foreground">Avg. 30m / day</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Accuracy</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89%</div>
              <p className="text-xs text-green-600">+4% improvement</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Streaks</CardTitle>
              <Award className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5 Days</div>
              <p className="text-xs text-muted-foreground">New record!</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Chart */}
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Activity (Minutes Learning)</CardTitle>
              <CardDescription>Time spent on lessons over the past week</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PROGRESS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      content={({active, payload}) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2 border rounded-lg shadow-lg font-body text-xs">
                              <p className="font-bold">{payload[0].value} Minutes</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="minutes" fill="#175CC9" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Skill Breakdown */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Skill Mastery</CardTitle>
              <CardDescription>Phonemic categories progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium font-body">
                    <span>Individual Sounds</span>
                    <span>90%</span>
                  </div>
                  <Progress value={90} className="h-2 bg-blue-50" />
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium font-body">
                    <span>Blending</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2 bg-blue-50" />
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium font-body">
                    <span>Segmenting</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} className="h-2 bg-blue-50" />
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium font-body">
                    <span>Tricky Words</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2 bg-blue-50" />
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Logs */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Recent Lesson History</CardTitle>
            <CardDescription>Detailed breakdown of latest student activities</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-none bg-muted/50 rounded-lg">
                  <TableHead className="font-headline font-bold">Lesson Name</TableHead>
                  <TableHead className="font-headline font-bold">Date</TableHead>
                  <TableHead className="font-headline font-bold">Accuracy</TableHead>
                  <TableHead className="font-headline font-bold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RECENT_LESSONS.map((lesson, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium font-body">{lesson.name}</TableCell>
                    <TableCell className="text-muted-foreground font-body">{lesson.date}</TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <span className="font-bold">{lesson.score}%</span>
                          <Progress value={lesson.score} className={`w-16 h-1.5 ${lesson.score > 90 ? '[&>div]:bg-green-500' : lesson.score > 80 ? '[&>div]:bg-blue-500' : '[&>div]:bg-orange-500'}`} />
                       </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={lesson.status === 'Mastered' ? 'default' : 'secondary'} className={lesson.status === 'Mastered' ? 'bg-green-100 text-green-700 border-none' : ''}>
                        {lesson.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
