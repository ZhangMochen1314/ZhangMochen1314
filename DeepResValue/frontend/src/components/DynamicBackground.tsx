import { useEffect, useRef } from "react";
import p5 from "p5";

export default function DynamicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      // Data Constellations Algorithm
      // Nodes drift based on Perlin noise, connecting when close
      
      const nodes: DataNode[] = [];
      const numNodes = 80;
      const maxDistance = 150;
      
      // Brand Colors
      const brandOrange = p.color("#d97757");
      const brandBlue = p.color("#6a9bcc");
      const brandGreen = p.color("#788c5d");
      const colors = [brandOrange, brandBlue, brandGreen];

      class DataNode {
        pos: p5.Vector;
        vel: p5.Vector;
        noiseOffset: p5.Vector;
        baseColor: p5.Color;
        size: number;

        constructor(p: p5) {
          this.pos = p.createVector(p.random(p.width), p.random(p.height));
          this.vel = p.createVector(0, 0);
          this.noiseOffset = p.createVector(p.random(1000), p.random(1000));
          
          // Clone the color to avoid mutating shared references
          const chosenColor = p.random(colors);
          this.baseColor = p.color(p.red(chosenColor), p.green(chosenColor), p.blue(chosenColor));
          this.size = p.random(1.5, 3.5);
        }

        update(p: p5) {
          // Drift slowly using noise
          const angle = p.noise(this.noiseOffset.x, this.noiseOffset.y) * p.TWO_PI * 2;
          this.vel.x = p.cos(angle) * 0.3;
          this.vel.y = p.sin(angle) * 0.3;
          this.pos.add(this.vel);
          
          this.noiseOffset.add(0.001, 0.001);

          // Wrap around edges
          if (this.pos.x < 0) this.pos.x = p.width;
          if (this.pos.x > p.width) this.pos.x = 0;
          if (this.pos.y < 0) this.pos.y = p.height;
          if (this.pos.y > p.height) this.pos.y = 0;
        }

        display(p: p5) {
          p.noStroke();
          this.baseColor.setAlpha(150);
          p.fill(this.baseColor);
          p.circle(this.pos.x, this.pos.y, this.size);
        }
      }

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        for (let i = 0; i < numNodes; i++) {
          nodes.push(new DataNode(p));
        }
      };

      p.draw = () => {
        p.clear(); // Transparent background

        // Update and display nodes
        for (let i = 0; i < nodes.length; i++) {
          nodes[i].update(p);
          nodes[i].display(p);
        }

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const d = p.dist(nodes[i].pos.x, nodes[i].pos.y, nodes[j].pos.x, nodes[j].pos.y);
            if (d < maxDistance) {
              const alpha = p.map(d, 0, maxDistance, 100, 0);
              const strokeColor = p.lerpColor(nodes[i].baseColor, nodes[j].baseColor, 0.5);
              strokeColor.setAlpha(alpha);
              p.stroke(strokeColor);
              p.strokeWeight(1);
              p.line(nodes[i].pos.x, nodes[i].pos.y, nodes[j].pos.x, nodes[j].pos.y);
            }
          }
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
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
      className="absolute top-0 left-0 w-full h-full -z-20 pointer-events-none opacity-40"
    />
  );
}
