import { Trophy, GraduationCap, Award, Brain, Users, Rocket, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const REGISTRATION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdzihdCX1Q2RAmM_dOKOtUxuZD5SjoPKL6NzzCY5ntWfovKvg/viewform?usp=publish-editor";

export default function WhyParticipateSection() {
  const reasons = [
    {
      icon: Trophy,
      title: "Prestigious Recognition",
      description: "Be part of a national competition honoring academic excellence and join the legacy of outstanding scholars.",
      gradient: "from-accent to-brand-red",
    },
    {
      icon: GraduationCap,
      title: "Scholarship Opportunities",
      description: "Win from a ₹10,00,000 prize pool — the top 10 performers each receive a ₹1,00,000 scholarship in Science & Humanities (Physics, Maths, Chemistry, English).",
      gradient: "from-secondary to-primary",
    },
    {
      icon: Award,
      title: "Participation Certificate",
      description: "All participants receive a certificate, adding value to your academic profile and college applications.",
      gradient: "from-green-500 to-blue-500",
    },
    {
      icon: Brain,
      title: "Multi-Stage Assessment",
      description: "Showcase your knowledge and skills through MCQ, Descriptive, and Interview/Project rounds.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Users,
      title: "Networking Opportunities",
      description: "Connect with like-minded peers and academic professionals during the examination and interview process.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Rocket,
      title: "Career Advancement",
      description: "Boost your resume with recognition from a prestigious talent search and stand out in competitive selections.",
      gradient: "from-teal-500 to-cyan-500",
    },
  ];

  return (
    <section id="why-participate" className="py-20 bg-white/5 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-accent">
            Why Should You Participate?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {reasons.map((reason, index) => (
              <Card
                key={index}
                className="glass-effect hover:border-accent/50 transition-all duration-300 hover:transform hover:-translate-y-2 group"
              >
                <CardContent className="p-8 text-center">
                  <div className={`bg-gradient-to-r ${reason.gradient} w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <reason.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-accent">{reason.title}</h3>
                  <p className="text-gray-300">{reason.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Register CTA */}
          <div className="mt-12 text-center">
            <a
              href={REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-accent via-blue-500 to-secondary text-white font-bold text-xl shadow-2xl border-2 border-accent/50 hover:scale-105 transition-all duration-200 focus:ring-4 focus:ring-accent focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Register Now for SCNTSE 2026
              <ExternalLink className="h-5 w-5" />
            </a>
            <p className="text-gray-400 text-sm mt-3">Registration fee: ₹200 (inclusive of all taxes)</p>
          </div>
        </div>
      </div>
    </section>
  );
}
