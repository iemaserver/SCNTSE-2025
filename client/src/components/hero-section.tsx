import { Calendar, Users, BookOpen, ChevronDown, Award, IndianRupee } from "lucide-react";
import professorImage from "@assets/images.jpeg";
import CountdownTimer from "@/components/countdown-timer";
import { Button } from "@/components/ui/button";
import { Clock, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
          {/* Register Now Button */}
          <div className="mt-8 mb-8">
            <div className="relative inline-block group">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="relative bg-gradient-to-r from-secondary via-primary to-accent text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105 disabled:opacity-100 disabled:cursor-not-allowed">
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary via-primary to-accent opacity-75 animate-pulse"></div>
                    <div className="relative flex items-center gap-3">
                      <Sparkles className="h-6 w-6 animate-pulse" />
                      <span className="bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                        Register Now
                      </span>
                      <Sparkles className="h-6 w-6 animate-pulse" />
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-effect border-accent/30 max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-accent text-center">
                      Coming Soon!
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-300 mt-4">
                      Registration for SCNTSE 2025 will open soon. Stay tuned for
                      updates!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-center mt-6">
                    <div className="flex items-center gap-2 text-accent">
                      <Sparkles className="h-5 w-5 animate-pulse" />
                      <span className="text-sm font-medium">
                        Keep checking this website for updates
                      </span>
                      <Sparkles className="h-5 w-5 animate-pulse" />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-secondary via-primary to-accent rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 floating-animation">
        <ChevronDown className="h-8 w-8 text-accent" />
      </div>
    </section>
  );
}
