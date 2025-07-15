import {
  Building,
  GraduationCap,
  University,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VenuesSection() {
  const venues = [
    {
      name: "IEM Management House",
      description: "Main administrative building with modern facilities",
      icon: Building,
      mapUrl: "https://maps.app.goo.gl/eL7cenJFuB5ugS3c6",
    },
    {
      name: "IEM Gurukul Building",
      description:
        "Traditional learning environment with state-of-the-art amenities",
      icon: GraduationCap,
      mapUrl: "https://maps.app.goo.gl/RbJfTfW6aw88mQ3d9",
    },
    {
      name: "IEM Ashram Building",
      description:
        "Peaceful examination environment with excellent infrastructure",
      icon: University,
      mapUrl: "https://maps.app.goo.gl/AmEGBLRfDg8iMTep9",
    },
    {
      name: "IEM Newtown",
      description: "Modern campus with cutting-edge facilities and technology",
      icon: Building,
      mapUrl: "https://maps.app.goo.gl/N1ETrobPc73vfWBT8",
    },
  ];

  return (
    <section id="venues" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-accent">
            Exam Venues
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {venues.map((venue, index) => (
              <Card
                key={index}
                className="glass-effect hover:border-accent/50 transition-all duration-300 hover:transform hover:scale-105 group"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <venue.icon className="h-6 w-6 text-accent" />
                    {venue.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={venue.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors group-hover:text-white"
                  >
                    <MapPin className="h-4 w-4" />
                    View on Maps
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
