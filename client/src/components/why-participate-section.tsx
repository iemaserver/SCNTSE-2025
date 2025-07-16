import { Trophy, GraduationCap, Award, Brain, Users, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
      description: "Win a prestigious ₹1,00,000 INR scholarship for top performance in Science & Humanities (Physics, Maths, Chemistry, English).",
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
        </div>
      </div>
    </section>
  );
}
