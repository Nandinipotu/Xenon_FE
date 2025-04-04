import React, { useEffect } from "react";

const AnimatedBackground: React.FC = () => {
  useEffect(() => {
    const svgEl = document.querySelector(".animated-lines") as SVGSVGElement;

    const randomRange = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const numberOfLines = 20;
    const lineDataArr: any[] = [];

    const createPathString = () => {
      let completedPath = "";
      const comma = ",";
      const ampl = 50; // pixel range for bending

      lineDataArr.forEach((path) => {
        const current = {
          x: ampl * Math.sin(path.counter / path.sin),
          y: ampl * Math.cos(path.counter / path.cos),
        };

        const newPathSection = `M${path.startX},${path.startY} Q${
          path.pointX
        },${(current.y * 1.5).toFixed(3)} ${(
          current.x / 10 +
          path.centerX
        ).toFixed(3)},${(current.y / 5 + path.centerY).toFixed(3)} T${
          path.endX
        },${path.endY}`;

        path.counter++;
        completedPath += newPathSection;
      });

      return completedPath;
    };

    const createLines = () => {
      const newPathEl = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );

      for (let i = 0; i < numberOfLines; i++) {
        lineDataArr.push({
          counter: randomRange(1, 500),
          startX: randomRange(-5, -40),
          startY: randomRange(-5, -30),
          endX: randomRange(200, 220),
          endY: randomRange(120, 140),
          sin: randomRange(85, 150),
          cos: randomRange(85, 150),
          pointX: randomRange(30, 55),
          centerX: randomRange(90, 120),
          centerY: randomRange(60, 70),
        });
      }

      const animLoop = () => {
        newPathEl.setAttribute("d", createPathString());
        requestAnimationFrame(animLoop);
      };

      svgEl.appendChild(newPathEl);
      animLoop();
    };

    createLines();
  }, []);

  return (
    <svg
      className="animated-lines"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 120"
    ></svg>
  );
};

export default AnimatedBackground;
