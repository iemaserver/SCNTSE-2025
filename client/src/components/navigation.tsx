import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import IEM from "@assets/logo.png";
import UEM from "@assets/image_1752080086077.png";
export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "#about", label: "About" },
    { href: "#exam-info", label: "Exam Info" },
    { href: "#venues", label: "Venues" },
    { href: "#why-participate", label: "Why Participate" },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* IEM and UEM Logos */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-white/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img
                  src={IEM}
                  alt="IEM Logo"
                  className="relative h-10 w-auto object-contain filter brightness-110 hover:brightness-125 transition-all duration-300"
                />
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-white/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img
                  src={UEM}
                  alt="UEM Logo"
                  className="relative h-10 w-auto object-contain filter brightness-110 hover:brightness-125 transition-all duration-300"
                />
              </div>
              <div className="w-px h-8 bg-white/30"></div>
            </div>

            <div className="relative group">
              {/* Glowing background */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-secondary rounded-xl blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>

              {/* Logo container */}
              <div className="relative w-15 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center border border-white/20 shadow-lg transform transition-all duration-300 hover:scale-110">
                <span className="text-sm font-bold text-white drop-shadow-lg">
                  SCNTSE
                </span>

                {/* Corner accents */}
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse"></div>
                <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse delay-500"></div>
              </div>
            </div>

            <div className="relative">
              <span className="text-2xl font-bold bg-gradient-to-r from-accent via-white to-secondary bg-clip-text text-transparent drop-shadow-lg">
                SCNTSE 2025
              </span>

              {/* Underline animation */}
              <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-accent to-secondary transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
            </div>
          </div>

          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-white hover:text-accent transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="bg-background/95 backdrop-blur-sm"
            >
              <div className="flex flex-col space-y-6 mt-8">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className="text-left text-lg text-white hover:text-accent transition-colors duration-200"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
