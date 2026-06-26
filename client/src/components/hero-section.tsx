import { Calendar, Users, BookOpen, ChevronDown, Award, IndianRupee, Trophy, Star } from "lucide-react";
import professorImage from "@assets/images.jpeg";
import CountdownTimer from "@/components/countdown-timer";

export default function HeroSection() {
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
            SCNTSE 2026
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
            Prof. (Dr.) Satyajit Chakrabarti National Talent Search Examination
          </p>

          <p className="text-lg md:text-xl mb-8 text-gray-400 slide-up">
            Honoring Excellence in Science & Humanities
          </p>

          <div className="flex flex-col items-center justify-center space-y-6 slide-up max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-6">
              <div className="glass-effect rounded-lg p-4 neon-border text-accent">
                <div className="text-3xl font-bold flex items-center gap-2">
                  <Calendar className="h-8 w-8" />
                  1st Aug 2026
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

          {/* SCNTSE 2025 Legacy Banner */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="glass-effect rounded-3xl p-8 border border-yellow-400/30 shadow-2xl">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Star className="h-6 w-6 text-yellow-400 animate-pulse" />
                <h3 className="text-2xl font-bold text-yellow-300">SCNTSE 2025 — A Glorious Edition</h3>
                <Star className="h-6 w-6 text-yellow-400 animate-pulse" />
              </div>
              <p className="text-gray-300 text-lg mb-6">
                The 2025 edition saw <span className="font-bold text-white">500+ students</span> from across Bengal compete, with the <span className="font-bold text-accent">top 10 candidates each receiving a scholarship of ₹1,00,000</span>.
              </p>
              <div className="mt-2">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  <span className="text-lg font-semibold text-yellow-300">SCNTSE 2025 Scholarship Winners</span>
                </div>
                <p className="text-sm text-gray-400 italic">
                  The full list of 2025 results and winners is available in the Results PDF.{" "}
                  <a
                    href="/Results.pdf"
                    download
                    className="text-accent underline hover:text-white transition-colors"
                  >
                    Download Results PDF
                  </a>
                </p>
              </div>
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
