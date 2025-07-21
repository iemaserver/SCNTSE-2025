import { GraduationCap, Trophy } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white/5 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-accent">About SCNTSE</h2>
          <div className="glass-effect rounded-2xl p-8">
            <p className="text-lg md:text-xl leading-relaxed mb-6 text-gray-300">
              The Prof. (Dr.) Satyajit Chakrabarti  National Talent Search Examination (SCNTSE) is a prestigious academic competition designed to identify and nurture exceptional talent in Science & Humanities (Physics, Maths, Chemistry, English) among Class 12 graduates.
            </p>
            <p className="text-lg md:text-xl leading-relaxed mb-6 text-gray-300">
              This memorial competition honors the legacy of Prof. (Dr.) Satyajit Chakrabarti, celebrating his contributions to education and inspiring the next generation of scholars.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-primary/20 rounded-lg p-6 border border-primary/30">
                <div className="flex items-center gap-3 mb-3">
                  <GraduationCap className="h-6 w-6 text-accent" />
                  <h3 className="text-xl font-semibold text-accent">Eligibility</h3>
                </div>
                <p className="text-gray-300">At least 70% aggregated in Physics, Chemistry and Maths in Board exams of the year 2025 from ANY board.<br />
                  <span className="text-red-400 font-semibold">If any student is found violating the eligibility criteria, his/her exams will be cancelled and no fees will be refunded.</span>
                </p>
              </div>
              <div className="bg-secondary/20 rounded-lg p-6 border border-secondary/30">
                <div className="flex items-center gap-3 mb-3">
                  <Trophy className="h-6 w-6 text-accent" />
                  <h3 className="text-xl font-semibold text-accent">Rewards</h3>
                </div>
                <p className="text-gray-300">Scholarship of ₹1,00,000 INR for top performers & certificates for all qualifiers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
