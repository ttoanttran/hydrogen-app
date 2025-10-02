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
  const [draggingId, setDraggingId] = useState(null);
  const [viewportScale, setViewportScale] = useState(1);
  
  const activeListenersRef = useRef({ onMouseMove: null, onMouseUp: null });

  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      const scale = Math.max(0.5, Math.min(1, width / 1200));
      setViewportScale(scale);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    const containerWidth = containerRef.current?.offsetWidth || 800;
    const baseY = 200;
    const offsets = [-50, 30, -70, 40, -30];
    const spacing = containerWidth / (initialStickers.length + 1);

    const initialPositions = initialStickers.map((s, i) => ({
      ...s,
      x: spacing * (i + 1) - 80 + Math.random() * 40 - 20,
      y: baseY + offsets[i % offsets.length],
      scale: 1.5 * viewportScale,
      rotation: Math.random() * 20 - 10,
    }));

    setStickers(initialPositions);
    
    return () => {
      if (activeListenersRef.current.onMouseMove) {
        document.removeEventListener('mousemove', activeListenersRef.current.onMouseMove);
      }
      if (activeListenersRef.current.onMouseUp) {
        document.removeEventListener('mouseup', activeListenersRef.current.onMouseUp);
      }
    };
  }, [viewportScale]);

  const handleDragStart = (id, e) => {
    e.preventDefault();
    setDraggingId(id);

    const startX = e.clientX;
    const startY = e.clientY;
    const stickerIndex = stickers.findIndex((s) => s.id === id);
    const startSticker = stickers[stickerIndex];

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      setStickers(prevStickers => {
        const newStickers = [...prevStickers];
        const index = newStickers.findIndex(s => s.id === id);
        if (index > -1) {
          newStickers[index] = {
            ...newStickers[index],
            x: startSticker.x + dx,
            y: startSticker.y + dy,
          };
        }
        return newStickers;
      });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      activeListenersRef.current = { onMouseMove: null, onMouseUp: null };
      setDraggingId(null);
    };

    activeListenersRef.current = { onMouseMove, onMouseUp };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="stickers-area" ref={containerRef}>
      {stickers.map((sticker) => (
        <div
          key={sticker.id}
          className={`sticker ${sticker.id === draggingId ? 'is-dragging' : ''}`}
          style={{
            transform: `translate(${sticker.x}px, ${sticker.y}px) scale(${sticker.scale}) rotate(${sticker.rotation}deg)`,
            zIndex: sticker.id === draggingId ? 100 : 1,
          }}
          onMouseDown={(e) => handleDragStart(sticker.id, e)}
        >
          <img src={sticker.src} alt={`sticker-${sticker.id}`} />
        </div>
      ))}

      {/* Swirly arrow */}
      <p className='clickme'>click me!</p>
      <div className="curved-arrow">
        <svg width="120" height="100" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
          <path 
            className="arrow-path"
            d="M10 10 C50 0, 100 40, 110 80" 
            fill="transparent" 
            stroke="#ff69b4" 
            strokeWidth="3" 
            strokeLinecap="round"
          />
          {/* Bigger arrow tip */}
          <polygon className="arrow-head" points="110,80 100,70 120,70" fill="#ff69b4" />
        </svg>
      </div>



    </div>
  );
};

export default Stickers;
