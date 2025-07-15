import { Mail, Phone, MapPin, ExternalLink, Clock, Calendar } from "lucide-react";
import IEM from "@assets/logo.png";
import UEM from "@assets/image_1752080086077.png";
import Lion from "@assets/l.jpg";
import rotary from "@assets/r.jpg";
export default function Footer() {
  return (
    <footer className="bg-background/95 backdrop-blur-sm border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Organizing Institutions */}
          <div className="text-center mb-12">
            <h3 className="text-xl font-bold text-accent mb-6">Organized By</h3>
            <div className="flex items-center justify-center gap-8">
              <div className="group">
                <img
                  src={IEM}
                  alt="IEM Logo"
                  className="h-16 w-auto object-contain filter brightness-110 hover:brightness-125 transition-all duration-300 group-hover:scale-110"
                />
           
              </div>
              <div className="w-px h-16 bg-white/30"></div>
              <div className="group">
                <img
                  src={UEM}
                  alt="UEM Logo"
                  className="h-16 w-auto object-contain filter brightness-110 hover:brightness-125 transition-all duration-300 group-hover:scale-110"
                /> 
              </div>
              <div className="w-px h-16 bg-white/30"></div>
              
              <div className="group">
                <img
                  src={Lion}
                  alt="Lion's Logo"
                  className="h-16 w-auto object-contain filter brightness-110 hover:brightness-125 transition-all duration-300 group-hover:scale-110"
                />
                </div>
                <div className="w-px h-16 bg-white/30"></div>
               <div className="group">
                <img
                  src={rotary}
                  alt="Rotary's Logo"
                  className="h-16 w-auto object-contain filter brightness-110 hover:brightness-125 transition-all duration-300 group-hover:scale-110"
                />
               </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-bold text-accent mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/80">
                  <Mail className="h-4 w-4 text-accent" />
                  <a 
                    href="mailto:scntse@iem.edu.in" 
                    className="hover:text-accent transition-colors text-sm"
                  >
               scntse@iem.edu.in
                  </a>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Phone className="h-4 w-4 text-accent" />
                  <a 
                    href="tel:+91-33-6653-2700" 
                    className="hover:text-accent transition-colors text-sm"
                  >
                    +91-33-6653-2700
                  </a>
                </div>
                <div className="flex items-start gap-3 text-white/80">
                  <MapPin className="h-4 w-4 text-accent mt-0.5" />
                  <div className="text-sm">
                    <p>Salt Lake Sector V</p>
                    <p>Kolkata, West Bengal</p>
                    <p>India - 700091</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold text-accent mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#about" className="block text-white/80 hover:text-accent transition-colors text-sm">
                  About SCNTSE
                </a>
                <a href="#exam-info" className="block text-white/80 hover:text-accent transition-colors text-sm">
                  Exam Information
                </a>
                <a href="#venues" className="block text-white/80 hover:text-accent transition-colors text-sm">
                  Exam Venues
                </a>
                <a href="#why-participate" className="block text-white/80 hover:text-accent transition-colors text-sm">
                  Why Participate
                </a>
                <a href="#faq" className="block text-white/80 hover:text-accent transition-colors text-sm">
                  FAQs
                </a>
              </div>
            </div>

            {/* Important Information */}
            <div>
              <h3 className="text-xl font-bold text-accent mb-4">Important Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/80">
                  <Calendar className="h-4 w-4 text-accent" />
                  <div className="text-sm">
                    <p className="font-semibold">Exam Date</p>
                    <p>August 10, 2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Clock className="h-4 w-4 text-accent" />
                  <div className="text-sm">
                    <p className="font-semibold">Duration</p>
                    <p>3 Hours</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-white/60 text-sm">
                  © 2025 SCNTSE - Prof. (Dr.) Satyajit Chakrabarti  National Talent Search Examination. All rights reserved.
                </p>
                <p className="text-white/40 text-xs mt-1">
                  Organized by Institute of Engineering & Management (IEM) and University of Engineering & Management (UEM)
                </p>
              </div>
              <div className="flex items-center gap-4">
                <a href="#" className="text-white/60 hover:text-accent transition-colors text-sm">
                  Privacy Policy
                </a>
                <span className="text-white/30">|</span>
                <a href="#" className="text-white/60 hover:text-accent transition-colors text-sm">
                  Terms & Conditions
                </a>
                <span className="text-white/30">|</span>
                <a href="#" className="text-white/60 hover:text-accent transition-colors text-sm">
                  Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
