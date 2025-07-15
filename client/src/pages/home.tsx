import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import ExamInfoSection from "@/components/exam-info-section";
import VenuesSection from "@/components/venues-section";
import WhyParticipateSection from "@/components/why-participate-section";
import FaqSection from "@/components/faq-section";
import Footer from "@/components/footer";
import ParticleBackground from "@/components/particle-background";

export default function Home() {
  return (
    <div className="overflow-x-hidden relative">
      <ParticleBackground />
      <div className="relative z-10">
        <Navigation />
        <HeroSection />
        <AboutSection />
        <ExamInfoSection />
        <VenuesSection />
        <WhyParticipateSection />
        <FaqSection />
        <Footer />
      </div>
    </div>
  );
}
