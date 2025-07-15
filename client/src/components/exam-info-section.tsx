import { FlaskConical, Clock, Target, ArrowRight, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExamInfoSection() {
  return (
    <section id="exam-info" className="py-20 bg-white/5 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-accent mb-4">
            Examination Details
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Step into a world of opportunity! The SCNTSE 2025 exam is your
            gateway to national recognition, a prestigious scholarship, and a
            bright academic future. Compete with the best and showcase your
            talent in Science & Humanities.
          </p>
          <div className="flex justify-center mb-8">
            <span className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-green-400 text-white font-semibold shadow-lg animate-pulse">
              <svg
                className="inline h-6 w-6 mr-2 text-yellow-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3zm0 13c-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8zm0-18V2m0 20v-2m8-8h2m-20 0h2" />
              </svg>
              Win a ₹1,00,000 INR Scholarship!
            </span>
          </div>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-blue-900/80 via-cyan-900/80 to-purple-900/80 rounded-2xl shadow-2xl p-8 border-2 border-accent/30 glass-effect relative">
            <div className="flex items-center gap-3 mb-6">
              <FlaskConical className="h-8 w-8 text-cyan-400 animate-bounce" />
              <h3 className="text-2xl md:text-3xl font-bold text-cyan-300 tracking-wide">
                Science & Humanities Examination
              </h3>
            </div>
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-200">
                <Clock className="h-5 w-5 text-accent" />
                <span className="font-medium">Duration:</span>
              </div>
              <span className="font-bold text-lg text-white">3 Hours</span>
            </div>
            <div className="flex justify-between mb-6">
              <div className="flex items-center gap-2 text-gray-200">
                <BookOpen className="h-5 w-5 text-accent" />
                <span className="font-medium">Total Marks:</span>
              </div>
              <span className="font-bold text-lg text-white">100</span>
            </div>
            <div className="mb-6">
              <h4 className="text-xl font-semibold text-yellow-300 mb-2">
                Subjects & Marks
              </h4>
              <ul className="grid grid-cols-2 gap-2 text-base text-gray-100">
                <li className="bg-blue-800/40 rounded-lg px-4 py-2 flex items-center gap-2">
                  <span className="font-bold text-blue-300">Physics</span>{" "}
                  <span className="ml-auto">25</span>
                </li>
                <li className="bg-purple-800/40 rounded-lg px-4 py-2 flex items-center gap-2">
                  <span className="font-bold text-purple-300">Chemistry</span>{" "}
                  <span className="ml-auto">25</span>
                </li>
                <li className="bg-green-800/40 rounded-lg px-4 py-2 flex items-center gap-2">
                  <span className="font-bold text-green-300">Mathematics</span>{" "}
                  <span className="ml-auto">25</span>
                </li>
                <li className="bg-pink-800/40 rounded-lg px-4 py-2 flex items-center gap-2">
                  <span className="font-bold text-pink-300">English</span>{" "}
                  <span className="ml-auto">25</span>
                </li>
              </ul>
            </div>
            <div className="mb-6">
              <h4 className="text-xl font-semibold text-yellow-400 mb-2">
                Scholarship
              </h4>
              <div className="bg-yellow-100/10 border-l-4 border-yellow-400 px-4 py-3 rounded-lg text-yellow-200 font-bold text-lg shadow animate-pulse">
                Top performer wins{" "}
                <span className="text-yellow-300">₹1,00,000 INR</span> scholarship!
              </div>
            </div>
            <div className="mt-8 text-center">
              <span className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-accent to-brand-red text-white font-semibold shadow-lg animate-fade-in">
                Ready to shine?{" "}
                <span className="underline">
                  Register soon and be a part of SCNTSE 2025!
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
