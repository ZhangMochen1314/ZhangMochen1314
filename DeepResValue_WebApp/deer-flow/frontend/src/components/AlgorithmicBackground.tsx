import React, { useEffect, useRef } from "react";
import p5Types from "p5";

// Since react-p5 can sometimes have issues with SSR or dynamic imports in strict mode,
// we will dynamically import it or just use standard import.
import Sketch from "react-p5";

export default function AlgorithmicBackground() {
  const particlesRef = useRef<any[]>([]);
  const numParticles = 120;

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    
    for (let i = 0; i < numParticles; i++) {
      particlesRef.current.push({
        x: p5.random(p5.width),
        y: p5.random(p5.height),
        vx: p5.random(-0.5, 0.5),
        vy: p5.random(-0.5, 0.5),
        phase: p5.random(p5.TWO_PI),
        colorType: p5.random()
      });
    }
  };

  const draw = (p5: p5Types) => {
    p5.clear(); // Transparent background to let CSS show through
    
    const particles = particlesRef.current;
    
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.phase += 0.02;

      // Wrap around edges
      if (p.x < -50) p.x = p5.width + 50;
      if (p.x > p5.width + 50) p.x = -50;
      if (p.y < -50) p.y = p5.height + 50;
      if (p.y > p5.height + 50) p.y = -50;

      // Draw particle
      const r = p5.map(p5.sin(p.phase), -1, 1, 2, 8);
      p5.noStroke();
      
      // Use Anthropic Brand Colors
      if (p.colorType < 0.6) {
        p5.fill(106, 155, 204, 120); // Blue #6a9bcc
      } else if (p.colorType < 0.8) {
        p5.fill(217, 119, 87, 100); // Orange #d97757
      } else {
        p5.fill(120, 140, 93, 100); // Green #788c5d
      }
      
      p5.circle(p.x, p.y, r);
      
      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        let other = particles[j];
        let d = p5.dist(p.x, p.y, other.x, other.y);
        
        if (d < 120) {
          const alpha = p5.map(d, 0, 120, 80, 0);
          p5.stroke(176, 174, 165, alpha); // Mid Gray #b0aea5
          p5.strokeWeight(0.5);
          p5.line(p.x, p.y, other.x, other.y);
        }
      }
    }
  };

  const windowResized = (p5: p5Types) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  return (
    <Sketch 
      setup={setup} 
      draw={draw} 
      windowResized={windowResized} 
      className="absolute inset-0 -z-20 pointer-events-none" 
    />
  );
}
