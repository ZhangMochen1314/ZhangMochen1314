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
    const rootStyle = getComputedStyle(document.documentElement);
    
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
      return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ] : [20, 20, 20];
    };

    const bgDarkRgb = hexToRgb(rootStyle.getPropertyValue('--theme-dark') || '#141413');
    const accent1Hex = rootStyle.getPropertyValue('--theme-accent1') || '#d97757';
    const accent2Hex = rootStyle.getPropertyValue('--theme-accent2') || '#6a9bcc';
    const accent3Hex = rootStyle.getPropertyValue('--theme-accent3') || '#788c5d';
    const mutedHex = rootStyle.getPropertyValue('--theme-muted') || '#b0aea5';

    p5.background(bgDarkRgb[0], bgDarkRgb[1], bgDarkRgb[2], 20); // Fading trail effect
    
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
        const rgb = hexToRgb(accent2Hex);
        p5.fill(rgb[0], rgb[1], rgb[2], 120);
      } else if (p.colorType < 0.8) {
        const rgb = hexToRgb(accent1Hex);
        p5.fill(rgb[0], rgb[1], rgb[2], 100);
      } else {
        const rgb = hexToRgb(accent3Hex);
        p5.fill(rgb[0], rgb[1], rgb[2], 100);
      }
      
      p5.circle(p.x, p.y, r);
      
      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        let other = particles[j];
        let d = p5.dist(p.x, p.y, other.x, other.y);
        
        if (d < 120) {
          const alpha = p5.map(d, 0, 120, 80, 0);
          const rgb = hexToRgb(mutedHex);
          p5.stroke(rgb[0], rgb[1], rgb[2], alpha);
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
