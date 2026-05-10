"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Volume2, Wand2, Star, Globe, Mic, Trophy } from 'lucide-react';
import styles from './PhonicsReader.module.css';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "Magic Word Sounder": "Magic Word Sounder",
          "Type a word (e.g., cat)": "Type a word (e.g., cat)",
          "Thinking...": "Thinking...",
          "Break It!": "Break It!",
        }
      },
      hi: {
        translation: {
          "Magic Word Sounder": "जादुई शब्द ध्वनि",
          "Type a word (e.g., cat)": "एक शब्द टाइप करें (उदा. cat)",
          "Thinking...": "सोच रहा हूँ...",
          "Break It!": "इसे तोड़ो!",
        }
      }
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

interface PhoneticResponse {
  word: string;
  phonemes: string[];
}

// Map CMUdict ARPAbet phonemes to more pronounceable text for the Web Speech API.
// This ensures the browser reads the "sound" (e.g., 'kuh' for K) rather than spelling it out.
const pronunciationMap: Record<string, string> = {
  aa: 'ah', ae: 'aah', ah: 'uh', ao: 'aw', aw: 'ow',
  ay: 'eye', b: 'buh', ch: 'ch', d: 'duh', dh: 'the',
  eh: 'eh', er: 'er', ey: 'ay', f: 'ff', g: 'guh',
  hh: 'huh', ih: 'ih', iy: 'ee', jh: 'juh', k: 'kuh',
  l: 'ull', m: 'mm', n: 'nn', ng: 'ing', ow: 'oh',
  oy: 'oy', p: 'puh', r: 'err', s: 'ss', sh: 'sh',
  t: 'tuh', th: 'th', uh: 'uh', uw: 'oo', v: 'vv',
  w: 'wuh', y: 'yuh', z: 'zz', zh: 'zh'
};

const studentId = 1; // Temporary Demo student ID

export default function PhonicsReader() {
  const [word, setWord] = useState('');
  const [phonemes, setPhonemes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [stars, setStars] = useState<number>(0);
  const [isWiggling, setIsWiggling] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [trophies, setTrophies] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState('en');

  const fetchNextWord = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/words/next?level=${level}`);
      const data = await res.json();
      setWord(data.word);
      await processWord(data.word);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const processWord = async (targetWord: string) => {
    setIsWiggling(false);
    setPhonemes([]);
    setFeedback(null);
    try {
      const res = await fetch(`http://localhost:8000/api/phonemes/${targetWord}?lang=${currentLang}`);
      if (!res.ok) throw new Error('We could not find that magic word!');
      const data: PhoneticResponse = await res.json();
      setPhonemes(data.phonemes);
    } catch (err: any) {
      setIsWiggling(true);
    }
  };

  const playSound = (phoneme: string) => {
    // Cancel any ongoing speech so clicks don't queue up and overlap
    window.speechSynthesis.cancel();

    // Uses the experimental Web Speech API to read the phonetic chunk aloud.
    // Note: For production, mapping ARPAbet phonemes directly to pre-recorded 
    // sound files from voice actors is highly recommended for best accuracy.
    const cleanPhoneme = phoneme.toLowerCase();
    const speechText = pronunciationMap[cleanPhoneme] || cleanPhoneme;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US'; // Use correct pronunciation locale
    utterance.rate = 0.8;  // Speak slightly slower for kids to absorb it
    utterance.pitch = 1.2; // Slightly higher pitch for a friendlier voice tone
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support Speech Recognition. Try Chrome!');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = async (event: any) => {
      const spoken = event.results[0][0].transcript;
      setIsListening(false);
      // Evaluate attempt against the backend engine
      const res = await fetch('http://localhost:8000/api/attempts/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, target_word: word, spoken_word: spoken }),
      });
      const analysis = await res.json();
      if (analysis.score >= 80) {
        setStars((prev) => prev + 1);
        if ((stars + 1) % 5 === 0) setTrophies((prev) => prev + 1);
        setFeedback('Great job! 🎉');
      } else {
        setFeedback(`Oops! I heard "${spoken}". ${analysis.errors.map((e: any) => e.error_type).join(', ')}`);
      }
    };
    recognition.start();
  };

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'hi' : 'en';
    setCurrentLang(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <div className={`w-full max-w-3xl mx-auto p-6 md:p-10 rounded-[3rem] shadow-sm ${styles.dyslexicText} ${styles.highContrastContainer}`}>
      <div className="flex flex-col items-center justify-center gap-3 mb-8">
        <div className="w-full flex justify-end">
          <Button variant="ghost" onClick={toggleLanguage} className={`flex gap-2 ${styles.highContrastButton} !bg-transparent !text-[#FFFF00] hover:!bg-[#FFFF00]/10`}>
            <Globe className="w-5 h-5" /> {currentLang === 'en' ? 'English' : 'हिंदी'}
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Wand2 className="h-10 w-10 text-[#FFFF00]" />
          <h2 className="text-4xl font-extrabold text-center">
            {t('Magic Word Sounder')}
          </h2>
        </div>
        <div className="flex gap-6 mt-4">
          <span className="flex items-center gap-2 font-bold text-xl"><Trophy className="h-6 w-6 text-yellow-500" /> Trophies: {trophies}</span>
          <span className="flex items-center gap-2 font-bold text-xl">Level: {level}</span>
        </div>
        {stars > 0 && (
          <div className={styles.starsContainer}>
            {Array.from({ length: stars }).map((_, i) => (
              <Star key={i} className={`h-8 w-8 fill-current ${styles.star}`} />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
        <Button 
          onClick={fetchNextWord}
          disabled={loading}
          className={`h-16 px-10 rounded-2xl text-2xl shadow-md transition-transform active:scale-95 bg-blue-500 hover:bg-blue-400 text-white font-bold`}
        >
          Get Next Word
        </Button>
        {word && (
          <Button onClick={startListening} disabled={isListening} className={`h-16 px-10 rounded-2xl text-2xl shadow-md transition-transform active:scale-95 ${styles.highContrastButton}`}>
            <Mic className={`mr-2 h-6 w-6 ${isListening ? 'animate-pulse text-red-500' : ''}`} /> {isListening ? 'Listening...' : 'Say it!'}
          </Button>
        )}
      </div>

      {feedback && <div className="text-center font-bold text-2xl mb-6 bg-[#222] p-4 rounded-xl text-[#00FFFF] border-2 border-[#00FFFF]">{feedback}</div>}

      {phonemes.length > 0 && (
        <div className="flex flex-wrap justify-center gap-6 animate-in slide-in-from-bottom-8 duration-500 fade-in">
          {phonemes.map((phoneme, index) => (
            <Card 
              key={index} 
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/plain', phoneme)}
              className={`group cursor-grab active:cursor-grabbing hover:-translate-y-2 transition-all duration-300 rounded-[2rem] shadow-xl overflow-hidden hover:shadow-2xl ${styles.highContrastCard}`}
            >
              <CardContent className="p-8 flex flex-col items-center justify-center min-w-[140px] min-h-[140px] gap-4">
                <span className="text-5xl font-bold">
                  {phoneme.toLowerCase()}
                </span>
                <div onClick={() => playSound(phoneme)} className="p-3 rounded-full bg-[#FFFF00] group-hover:bg-[#CCCC00] transition-colors duration-300 cursor-pointer">
                  <Volume2 className={`h-8 w-8 ${styles.highContrastIcon}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {phonemes.length > 0 && (
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold mb-4">Elkonin Boxes (Drag sounds here!)</h3>
          <div className="flex justify-center gap-4">
            {phonemes.map((_, i) => (
              <div 
                key={i} 
                onDragOver={(e) => e.preventDefault()} 
                onDrop={(e) => { e.preventDefault(); e.currentTarget.innerHTML = e.dataTransfer.getData('text/plain'); }}
                className="w-24 h-24 border-4 border-dashed border-[#FFFF00] rounded-xl flex items-center justify-center text-4xl font-bold text-[#FFFF00]"
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}