import { Trophy, Star, Download } from "lucide-react";

export default function WinnersSection() {
  return (
    <section id="winners" className="py-20 bg-white/5 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="h-7 w-7 text-yellow-400 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold text-yellow-300">
              SCNTSE 2025 — Legacy
            </h2>
            <Star className="h-7 w-7 text-yellow-400 animate-pulse" />
          </div>
          <p className="text-gray-400 text-lg mb-10">
            Building on the success of last year's landmark edition
          </p>

          {/* Stats */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="glass-effect rounded-2xl p-8 border border-yellow-400/30 shadow-xl">
              <div className="text-5xl font-bold text-yellow-300 mb-2">500+</div>
              <div className="text-lg text-gray-300">Students from across Bengal participated in SCNTSE 2025</div>
            </div>
            <div className="glass-effect rounded-2xl p-8 border border-accent/30 shadow-xl">
              <div className="text-5xl font-bold text-accent mb-2">10</div>
              <div className="text-lg text-gray-300">
                Top candidates each received a scholarship of{" "}
                <span className="font-bold text-yellow-300">₹1,00,000</span>
              </div>
            </div>
          </div>

          {/* Winners note */}
          <div className="glass-effect rounded-2xl p-8 border border-white/10 shadow-xl mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="h-6 w-6 text-yellow-400" />
              <h3 className="text-2xl font-bold text-accent">SCNTSE 2025 Scholarship Winners</h3>
            </div>
            <p className="text-gray-300 mb-6">
              The SCNTSE 2025 examination saw exceptional talent from across West Bengal. The top 10 scholars
              were awarded prestigious scholarships of ₹1,00,000 each. The full list of results and
              award recipients is available in the official Results PDF.
            </p>
            <a
              href="/Results.pdf"
              download
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 text-white font-bold text-lg shadow-xl border-2 border-emerald-300 hover:scale-105 transition-all duration-200 focus:ring-4 focus:ring-emerald-400 focus:outline-none"
            >
              <Download className="h-5 w-5" />
              Download SCNTSE 2025 Results PDF
            </a>
          </div>

          {/* CTA for 2026 */}
          <div className="bg-gradient-to-br from-accent/20 to-secondary/20 rounded-2xl p-8 border border-accent/30">
            <h3 className="text-2xl font-bold text-white mb-3">
              Will you be the next SCNTSE Scholar?
            </h3>
            <p className="text-gray-300 text-lg">
              SCNTSE 2026 is your chance to join the ranks of Bengal's brightest minds.
              Register for the <span className="text-accent font-semibold">2026 edition</span> and compete for a{" "}
              <span className="text-yellow-300 font-bold">₹1,00,000 scholarship</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
