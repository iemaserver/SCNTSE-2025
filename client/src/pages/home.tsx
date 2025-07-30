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
        {/* Beautifully designed button to Admit Card page */}
        <div className="flex justify-center my-8">
          <a href="/admit" className="group">
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-accent to-yellow-400 text-white font-bold text-lg shadow-lg transition-all duration-200 transform group-hover:scale-105 group-hover:from-yellow-400 group-hover:to-accent focus:outline-none focus:ring-4 focus:ring-accent/40 border-2 border-accent/60">
              <span className="inline-flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-white group-hover:text-yellow-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                  />
                </svg>
                Download Admit Card
              </span>
            </button>
          </a>
        </div>
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
