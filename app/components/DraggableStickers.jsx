'use client';
import React, { useState, useEffect, useRef } from 'react';
import '../styles/DraggableStickers.css';

const initialStickers = [
  { id: 1, src: '/sticker1.png' },
  { id: 2, src: '/sticker2.png' },
  { id: 3, src: '/sticker3.png' },
  { id: 4, src: '/sticker4.png' },
  { id: 5, src: '/sticker5.png' },
];

const Stickers = () => {
  const containerRef = useRef(null);
  const [stickers, setStickers] = useState([]);

  useEffect(() => {
    const containerWidth = containerRef.current?.offsetWidth || 800;
    const baseY = 200; // vertical center
    const offsets = [-50, 30, -70, 40, -30]; // wave pattern
    const spacing = containerWidth / (initialStickers.length + 1);

    const initialPositions = initialStickers.map((s, i) => ({
      ...s,
      x: spacing * (i + 1) - 80 + Math.random() * 40 - 20, // center with some randomness
      y: baseY + offsets[i % offsets.length],
      scale: 1.5,
      rotation: Math.random() * 20 - 10,
    }));

    setStickers(initialPositions);
  }, []);

  const handleDrag = (id, e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;

    const stickerIndex = stickers.findIndex((s) => s.id === id);
    const startSticker = stickers[stickerIndex];

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      const newStickers = [...stickers];
      newStickers[stickerIndex] = {
        ...startSticker,
        x: startSticker.x + dx,
        y: startSticker.y + dy,
      };
      setStickers(newStickers);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="stickers-area" ref={containerRef}>
      {stickers.map((sticker) => (
        <div
          key={sticker.id}
          className="sticker"
          style={{
            transform: `translate(${sticker.x}px, ${sticker.y}px) scale(${sticker.scale}) rotate(${sticker.rotation}deg)`,
          }}
          onMouseDown={(e) => handleDrag(sticker.id, e)}
        >
          <img src={sticker.src} alt={`sticker-${sticker.id}`} />
        </div>
      ))}
    </div>
  );
};

export default Stickers;
