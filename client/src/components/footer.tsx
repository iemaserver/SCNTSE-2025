import { Mail, Phone, MapPin, ExternalLink, Clock, Calendar, Award } from "lucide-react";
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
                    <p className="font-semibold">Round 1: MCQ Exam</p>
                    <p>2nd August 2025, 11:00 AM - 1:00 PM (Report by 10:00 AM)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Calendar className="h-4 w-4 text-accent" />
                  <div className="text-sm">
                    <p className="font-semibold">Round 2: Descriptive Exam</p>
                    <p>10th August 2025, 10:30 AM - 1:30 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Calendar className="h-4 w-4 text-accent" />
                  <div className="text-sm">
                    <p className="font-semibold">Round 3: Interview & Project</p>
                    <p>23rd August 2025, from 10:00 AM onwards</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Clock className="h-4 w-4 text-accent" />
                  <div className="text-sm">
                    <p className="font-semibold">Registration Fee</p>
                    <p>₹200 (inclusive of all taxes)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Award className="h-4 w-4 text-accent" />
                  <div className="text-sm">
                    <p className="font-semibold">Certificate</p>
                    <p>All participants receive a certificate</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Award className="h-4 w-4 text-accent" />
                  <div className="text-sm">
                    <p className="font-semibold">Scholarship</p>
                    <p>Top performer wins ₹1,00,000 INR</p>
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
              </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
