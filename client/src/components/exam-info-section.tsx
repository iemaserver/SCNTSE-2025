import { FlaskConical, Clock, Target, ArrowRight, BookOpen, Trophy } from "lucide-react";
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
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
            <div className="flex-1 bg-gradient-to-br from-blue-900/80 via-cyan-900/80 to-purple-900/80 rounded-2xl shadow-xl p-6 border-2 border-accent/30 glass-effect">
              <h4 className="text-lg font-bold text-blue-200 mb-2 flex items-center gap-2"><BookOpen className="h-5 w-5 text-blue-300" /> Round 1</h4>
              <ul className="text-gray-200 text-left list-disc list-inside text-base">
                <li>MCQ Exam on PCME (25 marks each)</li>
                <li>2 hours | No negative marking</li>
                <li>2nd August, 11:00 AM - 1:00 PM</li>
                <li>Reporting: 10:00 AM</li>
              </ul>
            </div>
            <div className="flex-1 bg-gradient-to-br from-purple-900/80 via-pink-900/80 to-yellow-900/80 rounded-2xl shadow-xl p-6 border-2 border-accent/30 glass-effect">
              <h4 className="text-lg font-bold text-pink-200 mb-2 flex items-center gap-2"><Target className="h-5 w-5 text-pink-300" /> Round 2</h4>
              <ul className="text-gray-200 text-left list-disc list-inside text-base">
                <li>Descriptive Exam on PCME (25 marks each)</li>
                <li>Attempt any 5 out of 7 questions (5 marks each)</li>
                <li>3 hours</li>
                <li>10th August, 10:30 AM - 1:30 PM</li>
              </ul>
            </div>
            <div className="flex-1 bg-gradient-to-br from-green-900/80 via-cyan-900/80 to-blue-900/80 rounded-2xl shadow-xl p-6 border-2 border-accent/30 glass-effect">
              <h4 className="text-lg font-bold text-green-200 mb-2 flex items-center gap-2"><ArrowRight className="h-5 w-5 text-green-300" /> Round 3</h4>
              <ul className="text-gray-200 text-left list-disc list-inside text-base">
                <li>Interview & Project Showcase</li>
                <li>23rd August, from 10:00 AM onwards</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
            <div className="flex-1 bg-gradient-to-br from-accent/10 to-white/10 rounded-xl p-6 border border-accent/30 shadow-lg flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-accent" />
                <span className="text-lg font-semibold text-accent">Registration Fee:</span>
                <span className="text-lg font-bold text-white">INR 200</span>
                <span className="text-gray-400 text-base">(inclusive of all taxes)</span>
              </div>
              <div className="flex items-center gap-3">
                <FlaskConical className="h-6 w-6 text-yellow-400" />
                <span className="text-lg font-semibold text-yellow-300">Participation Certificate to all</span>
              </div>
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-yellow-400" />
                <span className="text-lg font-semibold text-yellow-300">Scholarship of ₹1,00,000 INR for top performers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
