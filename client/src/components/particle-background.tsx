import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: { r: number; g: number; b: number };
  glow: number;
  connections: number[];
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle colors for neon effect (RGB values)
    const colors = [
      { r: 0, g: 255, b: 255 }, // Cyan
      { r: 255, g: 0, b: 255 }, // Magenta
      { r: 255, g: 255, b: 0 }, // Yellow
      { r: 0, g: 255, b: 0 }, // Green
      { r: 255, g: 0, b: 128 }, // Pink
      { r: 128, g: 0, b: 255 }, // Purple
      { r: 255, g: 128, b: 0 }, // Orange
      { r: 0, g: 128, b: 255 }, // Blue
    ];

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const baseCount = Math.min(
        50,
        Math.max(100, Math.floor((canvas.width * canvas.height) / 50000)),
      );

      for (let i = 0; i < baseCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 2 + 1.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          glow: Math.random() * 8 + 7,
          connections: [],
        });
      }
    };

    initParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const maxDistance = 120;

      // Update particles
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Update glow effect
        particle.glow = 4 + Math.sin(Date.now() * 0.002 + i) * 3;

        // Find connections
        particle.connections = [];
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particle.x;
          const dy = particles[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            particle.connections.push(j);
          }
        }
      });

      // Draw connections
      particles.forEach((particle, i) => {
        particle.connections.forEach((j) => {
          const other = particles[j];
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const opacity = Math.max(0, 1 - distance / maxDistance);

          if (opacity > 0.2) {
            // Create gradient for connection line
            const gradient = ctx.createLinearGradient(
              particle.x,
              particle.y,
              other.x,
              other.y,
            );
            gradient.addColorStop(
              0,
              `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${opacity * 0.15})`,
            );
            gradient.addColorStop(
              1,
              `rgba(${other.color.r}, ${other.color.g}, ${other.color.b}, ${opacity * 0.15})`,
            );

            ctx.strokeStyle = gradient;
            ctx.lineWidth = opacity * 0.8;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      // Draw particles
      particles.forEach((particle) => {
        const { r, g, b } = particle.color;

        // Create subtle glow effect
        const glowGradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.glow,
        );
        glowGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.3)`);
        glowGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.glow, 0, Math.PI * 2);
        ctx.fill();

        // Draw particle core
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background:
          "radial-gradient(ellipse at center, #0a192f 0%, #112240 50%, #020c1b 100%)",
      }}
    />
  );
}
