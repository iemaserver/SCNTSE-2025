import { Calendar, Users, BookOpen, ChevronDown, Award, IndianRupee } from "lucide-react";
import professorImage from "@assets/images.jpeg";
import CountdownTimer from "@/components/countdown-timer";
import { Button } from "@/components/ui/button";
import { Clock, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function HeroSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center fade-in">
          <div className="mb-8 flex justify-center mt-8">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-accent to-brand-red p-1 pulse-glow">
              <div className="w-full h-full rounded-full glass-effect flex items-center justify-center overflow-hidden">
                <img
                  src={professorImage}
                  alt="Prof. (Dr.) Satyajit Chakrabarti"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-4 gradient-text slide-up">
            SCNTSE 2025
          </h1>

          {/* Scholarship Highlight */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-400 shadow-lg border-4 border-yellow-200 animate-pulse">
              <svg
                className="h-8 w-8 text-yellow-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3zm0 13c-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8zm0-18V2m0 20v-2m8-8h2m-20 0h2" />
              </svg>
              <span className="text-2xl md:text-3xl font-bold text-yellow-900 drop-shadow-lg">
                Win a ₹1,00,000 INR Scholarship!
              </span>
            </div>
          </div>

          <p className="text-xl md:text-2xl mb-2 text-gray-300 slide-up">
            Prof. (Dr.) Satyajit Chakrabarti  National Talent Search
            Examination
          </p>

          <p className="text-lg md:text-xl mb-8 text-gray-400 slide-up">
            Honoring Excellence in Science & Humanities
          </p>

          <div className="flex flex-col items-center justify-center space-y-6 slide-up max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-6">
              <div className="glass-effect rounded-lg p-4 neon-border text-accent">
                <div className="text-3xl font-bold flex items-center gap-2">
                  <Calendar className="h-8 w-8" />
                  2nd Aug 2025
                </div>
                <div className="text-sm text-gray-300">Exam Date (Round 1)</div>
              </div>
              <div className="glass-effect rounded-lg p-4 neon-border text-secondary">
                <div className="text-3xl font-bold flex items-center gap-2">
                  <Users className="h-8 w-8" />3 Rounds
                </div>
                <div className="text-sm text-gray-300">
                  MCQ + Descriptive + Interview/Project
                </div>
              </div>
              <div className="glass-effect rounded-lg p-4 neon-border text-brand-red">
                <div className="text-3xl font-bold flex items-center gap-2">
                  <BookOpen className="h-8 w-8" />Science & Humanities
                </div>
                <div className="text-sm text-gray-300">
                  Physics, Maths, Chemistry, English
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="glass-effect rounded-lg p-4 neon-border text-yellow-400">
                <div className="text-3xl font-bold flex items-center gap-2">
                  <Award className="h-8 w-8" />Certificate for All
                </div>
                <div className="text-sm text-gray-300">
                  Every participant receives a certificate
                </div>
              </div>
              <div className="glass-effect rounded-lg p-4 neon-border text-green-400">
                <div className="text-3xl font-bold flex items-center gap-2">
                  <IndianRupee className="h-8 w-8" />Only ₹200 Fees
                </div>
                <div className="text-sm text-gray-300">
                  Registration fee (incl. all taxes)
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 mb-8">
            <div className="relative inline-block group">
              <CountdownTimer />
            </div>
          </div>

          {/* Download Eligible Students Button */}
          <div className="flex justify-center mb-8">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="text-lg font-bold px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shadow-2xl border-4 border-yellow-300 hover:scale-105 hover:shadow-amber-500/50 transition-all duration-200 focus:ring-4 focus:ring-yellow-400 focus:outline-none"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Download List of Eligible Students for Round 2
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold mb-4 text-center">
                    Important Instructions for Round 2 Examination
                  </DialogTitle>
                  <DialogDescription asChild>
                    <ul className="list-disc pl-5 text-gray-700 mb-6 space-y-2">
                      <li>All candidates must bring one photocopy of their 12th standard marksheet.</li>
                      <li>Two photocopies of the SCNTSE Round 2 Admit Card are required. (Admit cards will be released soon.)</li>
                      <li>The Round 2 examination will be held on <b>10th August 2025</b> from <b>11:00 AM to 2:00 PM</b>.</li>
                      <li>Venue: <b>IEM Management House</b></li>
                      <li>Reporting time is <b>10:00 AM</b>. Late arrivals may not be permitted.</li>
                      <li>Please ensure you carry a valid government-issued photo identification proof.</li>
                    </ul>
                  </DialogDescription>
                </DialogHeader>
                <a
                  href="/notice.pdf"
                  download
                  className="block w-full text-center bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition mb-2"
                >
                  Download Notice PDF
                </a>
              </DialogContent>
            </Dialog>
          </div>
          {/* Results Announcement */}
          <div className="flex justify-center mb-8">
            <a href="/admit" className="text-lg font-bold px-8 py-4 rounded-2xl bg-gradient-to-r from-green-400 via-green-500 to-green-600 shadow-2xl border-4 border-green-300 hover:scale-105 hover:shadow-green-500/50 transition-all duration-200 focus:ring-4 focus:ring-green-400 focus:outline-none text-white">
              Download Admit Card For Round 2
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 floating-animation">
        <ChevronDown className="h-8 w-8 text-accent" />
      </div>
    </section>
  );
}
