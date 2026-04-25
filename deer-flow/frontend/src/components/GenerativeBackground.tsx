import React, { useEffect, useRef } from 'react';

const GenerativeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Particle class representing nodes
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      baseX: number;
      baseY: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        
        // Random velocity
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        
        // Random radius
        this.radius = Math.random() * 2 + 1;
        
        // Mix of brand colors: Orange #d97757 and Blue #6a9bcc
        const colors = ['#d97757', '#6a9bcc', '#b0aea5'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(time: number) {
        // Flow field effect using sine waves
        const angle = Math.sin(this.x * 0.001 + time * 0.0005) * Math.cos(this.y * 0.002 + time * 0.0003) * Math.PI * 2;
        
        this.vx += Math.cos(angle) * 0.02;
        this.vy += Math.sin(angle) * 0.02;

        // Apply friction
        this.vx *= 0.98;
        this.vy *= 0.98;

        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges smoothly
        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
        
        // Keep particles within bounds
        if (this.x < 0) this.x = 0;
        if (this.x > canvas!.width) this.x = canvas!.width;
        if (this.y < 0) this.y = 0;
        if (this.y > canvas!.height) this.y = canvas!.height;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 15000); // Responsive density
      
      for (let i = 0; i < numParticles; i++) {
        particles.push(
          new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height
          )
        );
      }
    };

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = 1 - distance / 120;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(176, 174, 165, ${opacity * 0.2})`; // Mid gray for lines
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const render = (time: number) => {
      // Clear canvas with dark brand color and a slight trailing effect
      ctx.fillStyle = 'rgba(20, 20, 19, 0.3)'; // #141413 with opacity
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update(time);
        particle.draw(ctx);
      });

      drawLines();

      animationFrameId = requestAnimationFrame(render);
    };

    // Initialize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    render(0);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 bg-[#141413]"
      style={{ display: 'block' }}
    />
  );
};

export default GenerativeBackground;
