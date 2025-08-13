import { useState, useEffect } from "react";
import { Calendar, Clock, Zap } from "lucide-react";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const examDate = new Date('2025-08-23T09:30:00');
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = examDate.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { value: timeLeft.days, label: 'Days', color: 'from-cyan-400 to-blue-500' },
    { value: timeLeft.hours, label: 'Hours', color: 'from-purple-400 to-pink-500' },
    { value: timeLeft.minutes, label: 'Minutes', color: 'from-green-400 to-teal-500' },
    { value: timeLeft.seconds, label: 'Seconds', color: 'from-orange-400 to-red-500' }
  ];

  return (
    <div className="relative glass-effect rounded-3xl p-8 border border-accent/40 shadow-2xl backdrop-blur-md">
      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-accent/20 via-primary/20 to-secondary/20 blur-sm -z-10"></div>
      
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="relative">
          <Clock className="h-8 w-8 text-accent animate-pulse" />
          <div className="absolute inset-0 h-8 w-8 text-accent animate-ping opacity-30">
            <Clock className="h-8 w-8" />
          </div>
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-accent to-white bg-clip-text text-transparent">
          Exam Countdown
        </h3>
        <Zap className="h-6 w-6 text-yellow-400 animate-bounce" />
      </div>
      
      {/* Timer Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {timeUnits.map((unit, index) => (
          <div key={index} className="relative group">
            <div className={`relative bg-gradient-to-br ${unit.color} rounded-xl p-4 border border-white/20 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
              {/* Glowing effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${unit.color} rounded-xl opacity-50 blur-md group-hover:opacity-75 transition-opacity`}></div>
              
              {/* Content */}
              <div className="relative text-center">
                <div className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  {unit.value.toString().padStart(2, '0')}
                </div>
                <div className="text-sm font-semibold text-white/90 uppercase tracking-wide">
                  {unit.label}
                </div>
              </div>
              
              {/* Corner accent */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
          <Calendar className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-gray-200">Until 2nd Round</span>
        </div>
      </div>
    </div>
  );
}