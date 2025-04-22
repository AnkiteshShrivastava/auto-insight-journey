
import React, { useEffect, useState } from 'react';

const InteractiveBackground = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate relative position for parallax effect
      const x = (e.clientX / window.innerWidth) * 15;
      const y = (e.clientY / window.innerHeight) * 15;
      setPosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-carPurple-100/30 to-carBlue-400/30"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      />
      <div className="absolute inset-0 backdrop-blur-[2px]" />
    </div>
  );
};

export default InteractiveBackground;
