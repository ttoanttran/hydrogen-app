'use client';
import React, { useState, useEffect, useRef } from 'react';
// Assuming this path is correct for your CSS
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

  // Calculate scale based on viewport
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      // Scale down on smaller screens
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
      scale: 1.5 * viewportScale, // Apply viewport scale here
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
  }, [viewportScale]); // Re-initialize when scale changes

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
      
      // Clear the ref
      activeListenersRef.current = { onMouseMove: null, onMouseUp: null };
      setDraggingId(null);
    };

    // Store references for cleanup
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
    </div>
  );
};

export default Stickers;