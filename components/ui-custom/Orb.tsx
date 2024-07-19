import React from 'react';
import { useEffect, useState } from 'react';

const Orb: React.FC<{ colors: string[] }> = ({ colors }) => {
  const totalParticles = 300;
  const orbSize = 100;
  const particleSize = 2;
  const animationTime = 14;
  const [styles, setStyles] = useState<string[]>([]);

  useEffect(() => {
    const generateStyles = () => {
      const stylesArray: string[] = [];

      for (let i = 1; i <= totalParticles; i++) {
        const z = Math.random() * 360;
        const y = Math.random() * 360;
        const color = colors[i % colors.length];

        const style = `
          .c:nth-child(${i}) {
            animation: orbit${i} ${animationTime}s infinite;
            animation-delay: ${i * 0.01}s;
            background-color: ${color};
            filter: saturate(2);
          }
          
          @keyframes orbit${i} { 
            20% {
              opacity: 1; 
            }
            30% {
              transform: rotateZ(-${z}deg) rotateY(${y}deg) translateX(${orbSize}px) rotateZ(${z}deg); 
            }
            80% {
              transform: rotateZ(-${z}deg) rotateY(${y}deg) translateX(${orbSize}px) rotateZ(${z}deg); 
              opacity: 1; 
            }
            100% {
              transform: rotateZ(-${z}deg) rotateY(${y}deg) translateX(${orbSize * 3}px) rotateZ(${z}deg); 
            }
          }
        `;

        stylesArray.push(style);
      }

      setStyles(stylesArray);
    };

    generateStyles();
  }, [colors]);

  return (
    <div className="wrap">
      {[...Array(totalParticles)].map((_, index) => (
        <div key={index} className="c" />
      ))}
      <style jsx global>{`
        .wrap {
          position: relative;
          top: 50%;
          left: 50%;
          width: 0; 
          height: 0; 
          transform-style: preserve-3d;
          perspective: 1000px;
          animation: rotate ${animationTime}s infinite linear;
        }
        
        @keyframes rotate {
          100% {
            transform: rotateY(360deg) rotateX(360deg);
          }
        }
        
        .c {
          position: absolute;
          width: ${particleSize}px;
          height: ${particleSize}px;
          border-radius: 50%;
          opacity: 0; 
        }
        
        ${styles.join(' ')}
      `}</style>
    </div>
  );
};

export default Orb;
