import { useEffect, useRef } from 'react';

interface Props {
  className?: string;
  theme?: 'dark' | 'light';
}

export default function AlgorithmicBackground({ className = "absolute inset-0 z-0 pointer-events-none", theme = 'dark' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Cleanup any existing canvas
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    // Load p5.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js';
    script.async = true;
    
    script.onload = () => {
      // @ts-ignore
      new window.p5((p: any) => {
        let particles: Particle[] = [];
        let numParticles = 120; // Will be scaled based on screen size
        const connectionDistance = 120;
        
        const isDark = theme === 'dark';
        const bgColor = isDark ? [10, 15, 30] : [250, 250, 252];
        const particleColor1 = isDark ? [0, 255, 200] : [14, 165, 233]; // Cyan / Blue
        const particleColor2 = isDark ? [138, 43, 226] : [99, 102, 241]; // Violet / Indigo
        const lineBaseColor = isDark ? [100, 200, 255] : [59, 130, 246]; // Light Blue / Blue
        
        class Particle {
          pos: any;
          vel: any;
          baseSize: number;
          size: number;
          color: number[];
          noiseOffset: number;

          constructor() {
            this.pos = p.createVector(p.random(p.width), p.random(p.height));
            // Slow, deliberate drift
            this.vel = p.createVector(p.random(-0.3, 0.3), p.random(-0.3, 0.3));
            this.baseSize = p.random(1.5, 3.5);
            this.size = this.baseSize;
            this.color = p.random(1) > 0.5 ? particleColor1 : particleColor2;
            this.noiseOffset = p.random(1000);
          }

          update() {
            // Add subtle Perlin noise turbulence to velocity
            let angle = p.noise(this.pos.x * 0.001, this.pos.y * 0.001, p.frameCount * 0.002) * p.TWO_PI * 2;
            let force = p.createVector(p.cos(angle), p.sin(angle));
            force.mult(0.02);
            
            this.vel.add(force);
            this.vel.limit(0.8); // Strict speed limit for elegance
            this.pos.add(this.vel);

            // Breathing effect for size
            this.size = this.baseSize + p.sin(p.frameCount * 0.02 + this.noiseOffset) * 1.5;

            // Wrap around edges smoothly
            if (this.pos.x < -50) this.pos.x = p.width + 50;
            if (this.pos.x > p.width + 50) this.pos.x = -50;
            if (this.pos.y < -50) this.pos.y = p.height + 50;
            if (this.pos.y > p.height + 50) this.pos.y = -50;
          }

          draw() {
            p.noStroke();
            // Glow effect
            p.fill(this.color[0], this.color[1], this.color[2], 50);
            p.circle(this.pos.x, this.pos.y, this.size * 3);
            
            // Core
            p.fill(this.color[0], this.color[1], this.color[2], 200);
            p.circle(this.pos.x, this.pos.y, this.size);
          }
        }

        p.setup = () => {
          const w = containerRef.current?.clientWidth || window.innerWidth;
          const h = containerRef.current?.clientHeight || window.innerHeight;
          let canvas = p.createCanvas(w, h);
          canvas.parent(containerRef.current);
          
          // Responsive density
          numParticles = Math.floor((w * h) / 12000);
          // Cap particles to ensure buttery smooth performance
          numParticles = p.min(numParticles, 250);

          for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
          }
        };

        p.draw = () => {
          // Clear background with slight opacity for motion trails
          p.background(bgColor[0], bgColor[1], bgColor[2], 80);

          // Update all particles
          for (let particle of particles) {
            particle.update();
          }

          // Draw geometric connections (Emergent Knowledge Network)
          p.strokeWeight(isDark ? 0.8 : 0.5);
          for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
              let d = p.dist(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
              
              if (d < connectionDistance) {
                // Opacity based on distance (closer = more opaque)
                let alpha = p.map(d, 0, connectionDistance, isDark ? 150 : 100, 0);
                p.stroke(lineBaseColor[0], lineBaseColor[1], lineBaseColor[2], alpha);
                p.line(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
              }
            }
          }

          // Draw particles on top of lines
          for (let particle of particles) {
            particle.draw();
          }
        };

        p.windowResized = () => {
          if (!containerRef.current) return;
          const w = containerRef.current.clientWidth;
          const h = containerRef.current.clientHeight;
          p.resizeCanvas(w, h);
          
          // Re-adjust particle count smoothly
          let targetParticles = Math.floor((w * h) / 12000);
          targetParticles = p.min(targetParticles, 250);
          
          if (targetParticles > particles.length) {
            for (let i = particles.length; i < targetParticles; i++) {
              particles.push(new Particle());
            }
          } else if (targetParticles < particles.length) {
            particles.splice(targetParticles);
          }
        };
      });
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      // P5 instance cleanup happens via container unmount
    };
  }, [theme]);

  return <div ref={containerRef} className={className} />;
}