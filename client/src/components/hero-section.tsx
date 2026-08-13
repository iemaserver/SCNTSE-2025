import { Calendar, Users, BookOpen, ChevronDown, Award, IndianRupee, Trophy, Star, ExternalLink, Download } from "lucide-react";
import professorImage from "@assets/images.jpeg";
import CountdownTimer from "@/components/countdown-timer";

const REGISTRATION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdzihdCX1Q2RAmM_dOKOtUxuZD5SjoPKL6NzzCY5ntWfovKvg/viewform?usp=publish-editor";

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

          {/* Prize Pool Highlight */}
          <div className="flex justify-center mb-4">
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
                ₹10,00,000 Prize Pool — Top 10 Win ₹1,00,000 Each!
              </span>
            </div>
          </div>

          <p className="text-xl md:text-2xl mb-2 text-gray-300 slide-up">
            Prof. (Dr.) Satyajit Chakrabarti National Talent Search Examination
          </p>

          <p className="text-lg md:text-xl mb-6 text-gray-400 slide-up">
            Honoring Excellence in Science & Humanities
          </p>

          {/* Registration Button */}
          <div className="flex justify-center mb-8">
            <a
              href={REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-accent via-blue-500 to-secondary text-white font-bold text-xl shadow-2xl border-2 border-accent/50 hover:scale-105 hover:shadow-accent/40 transition-all duration-200 focus:ring-4 focus:ring-accent focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Register Now for SCNTSE 2026
              <ExternalLink className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
          </div>

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <div className="glass-effect rounded-lg p-4 neon-border text-yellow-400">
                <div className="text-3xl font-bold flex items-center gap-2">
                  <Trophy className="h-8 w-8" />₹10 Lakh
                </div>
                <div className="text-sm text-gray-300">
                  Total prize pool — 10 scholarships of ₹1 lakh each
                </div>
              </div>
              <div className="glass-effect rounded-lg p-4 neon-border text-yellow-300">
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

          {/* Registration CTA (below timer) */}
          <div className="flex justify-center mb-10">
            <a
              href={REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent underline underline-offset-4 hover:text-white transition-colors text-base font-medium"
            >
              <ExternalLink className="h-4 w-4" />
              Click here to register — Registration Fee: ₹200 only
            </a>
          </div>

          {/* SCNTSE 2026 Round 1 Results Banner */}
          <div className="max-w-3xl mx-auto mb-6">
            <div className="rounded-3xl p-6 border-2 border-green-400/60 shadow-2xl bg-gradient-to-r from-green-900/60 via-emerald-900/60 to-teal-900/60 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Trophy className="h-6 w-6 text-green-400 animate-bounce" />
                <h3 className="text-2xl font-bold text-green-300">SCNTSE 2026 — Round 1 Results Out!</h3>
                <Trophy className="h-6 w-6 text-green-400 animate-bounce" />
              </div>
              <p className="text-gray-300 text-base mb-4">
                The results of <span className="font-bold text-white">Round 1 (MCQ)</span> of SCNTSE 2026 have been announced. Check the official results PDF to see if you've qualified for Round 2.
              </p>
              <a
                href="/Results_2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-lg shadow-lg border border-green-300/50 hover:scale-105 transition-all duration-200 focus:ring-4 focus:ring-green-400 focus:outline-none"
              >
                <Download className="h-5 w-5" />
                View Round 1 Results — SCNTSE 2026
              </a>
            </div>
          </div>

          {/* SCNTSE 2026 Round 2 Results Banner */}
          <div className="max-w-3xl mx-auto mb-6">
            <div className="rounded-3xl p-6 border-2 border-blue-400/60 shadow-2xl bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-violet-900/60 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Trophy className="h-6 w-6 text-blue-400 animate-bounce" />
                <h3 className="text-2xl font-bold text-blue-300">SCNTSE 2026 — Round 2 Results Out!</h3>
                <Trophy className="h-6 w-6 text-blue-400 animate-bounce" />
              </div>
              <p className="text-gray-300 text-base mb-4">
                The results of <span className="font-bold text-white">Round 2 (Descriptive)</span> of SCNTSE 2026 have been announced. Check the official results PDF to see if you've qualified for Round 3.
              </p>
              <a
                href="/Result2.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white font-bold text-lg shadow-lg border border-blue-300/50 hover:scale-105 transition-all duration-200 focus:ring-4 focus:ring-blue-400 focus:outline-none"
              >
                <Download className="h-5 w-5" />
                View Round 2 Results — SCNTSE 2026
              </a>
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
              <p className="text-gray-300 text-lg mb-4">
                The 2025 edition saw <span className="font-bold text-white">500+ students</span> from across Bengal compete, with the <span className="font-bold text-accent">top 10 candidates each receiving a scholarship of ₹1,00,000</span> — a total prize pool of <span className="font-bold text-yellow-300">₹10,00,000</span>.
              </p>
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

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 floating-animation">
        <ChevronDown className="h-8 w-8 text-accent" />
      </div>
    </section>
  );
}
