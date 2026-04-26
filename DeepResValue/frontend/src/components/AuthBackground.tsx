import { useEffect, useRef } from "react";
import p5 from "p5";

export default function AuthBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      // Quantum Harmonics Algorithm for Auth Modal
      const particles: Particle[] = [];
      const numParticles = 40;
      
      // Brand Colors
      const brandOrange = p.color("#d97757");
      const brandBlue = p.color("#6a9bcc");
      const colors = [brandOrange, brandBlue];

      class Particle {
        pos: p5.Vector;
        phase: number;
        freq: number;
        baseColor: p5.Color;
        size: number;
        orbitRadius: number;
        center: p5.Vector;

        constructor(p: p5) {
          this.center = p.createVector(p.width / 2, p.height / 2);
          this.orbitRadius = p.random(20, p.width / 1.5);
          this.phase = p.random(p.TWO_PI);
          this.freq = p.random(0.005, 0.02);
          
          const chosenColor = p.random(colors);
          this.baseColor = p.color(p.red(chosenColor), p.green(chosenColor), p.blue(chosenColor));
          this.size = p.random(2, 6);
          this.pos = p.createVector(0, 0);
        }

        update(p: p5) {
          this.phase += this.freq;
          // Harmonic motion
          const r = this.orbitRadius + p.sin(this.phase * 3) * 20;
          this.pos.x = this.center.x + p.cos(this.phase) * r;
          this.pos.y = this.center.y + p.sin(this.phase) * r;
        }

        display(p: p5) {
          p.noStroke();
          
          // Glow effect
          this.baseColor.setAlpha(30);
          p.fill(this.baseColor);
          p.circle(this.pos.x, this.pos.y, this.size * 3);
          
          // Core
          this.baseColor.setAlpha(200);
          p.fill(this.baseColor);
          p.circle(this.pos.x, this.pos.y, this.size);
        }
      }

      // Attach class to sketch
      (p as any).Particle = Particle;

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        for (let i = 0; i < numParticles; i++) {
          particles.push(new Particle(p));
        }
      };

      p.draw = () => {
        p.clear(); // Transparent background

        // Update and display particles
        for (let i = 0; i < particles.length; i++) {
          particles[i].update(p);
          particles[i].display(p);
        }

        // Draw interference connections
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const d = p.dist(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
            const maxDist = 80;
            
            if (d < maxDist) {
              // Constructive interference when phases align
              const phaseDiff = p.abs(particles[i].phase - particles[j].phase) % p.TWO_PI;
              const interference = p.map(p.cos(phaseDiff), -1, 1, 0, 1);
              
              if (interference > 0.5) {
                const alpha = p.map(d, 0, maxDist, 100 * interference, 0);
                const strokeColor = p.lerpColor(particles[i].baseColor, particles[j].baseColor, 0.5);
                strokeColor.setAlpha(alpha);
                p.stroke(strokeColor);
                p.strokeWeight(1.5 * interference);
                p.line(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
              }
            }
          }
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        // Update center for all particles
        for (let i = 0; i < particles.length; i++) {
          particles[i].center = p.createVector(p.width / 2, p.height / 2);
        }
      };
    };

    const p5Instance = new p5(sketch, containerRef.current);

    return () => {
      p5Instance.remove();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-60 mix-blend-screen"
    />
  );
}