"use client";
import React, { useEffect, useState, useRef } from "react";
import anime from "animejs";

interface AnimatedTextProps {
  text: string[];
  speed?: number;
}
const AnimatedText: React.FC<AnimatedTextProps> = ({ text, speed =.8 }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const animateText = () => {
      if (textRef.current) {
        textRef.current.innerHTML = text[currentWordIndex].replace(/\S/g, "<span class='inline-block'>$&</span>");

        anime.timeline({ loop: false })
          .add({
            targets: '.animated-text .inline-block',
            scale: [4, 1],
            opacity: [0, 1],
            translateZ: 0,
            easing: "easeOutExpo",
            duration: 950 / speed,
            delay: (el, i) => (70 / speed) * i
          }).add({
            targets: '.animated-text .inline-block',
            opacity: 0,
            duration: 1000 / speed,
            easing: "easeOutExpo",
            delay: 1000 / speed,
            complete: () => {
              setCurrentWordIndex((prevIndex) => (prevIndex + 1) % text.length);
            }
          });
      }
    };

    animateText();
  }, [currentWordIndex, text, speed]);

  return (
    <h1 className="font-black text-5xl">
      <span ref={textRef} className="animated-text">{text[currentWordIndex]}</span>{' '}
    </h1>
  );
};

export default AnimatedText;
// 
