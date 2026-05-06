"use client";
import { useMemo, useRef, useState } from "react";
import { useGesture } from "@use-gesture/react";

export type GalleryImage = {
  id?: string;
  url: string;
  date?: string;
  description?: string;
};

const DomeGallery = ({ images = [], itemsCount = 20 }: { images: GalleryImage[]; itemsCount?: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const itemsRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [selectedItem, setSelectedItem] = useState<{ id: string, image: string, date?: string, description?: string } | null>(null);
  const isDragging = useRef(false);

  // Default images if none provided (for preview)
  const displayImages: GalleryImage[] = images.length > 0 ? images : [
    { url: "https://images.unsplash.com/photo-1755331039789-7e5680e26e8f?q=80&w=774&auto=format&fit=crop" },
    { url: "https://images.unsplash.com/photo-1755569309049-98410b94f66d?q=80&w=772&auto=format&fit=crop" }
  ];

  // Increase radius for full screen
  const radius = 350;

  const items = useMemo(() => {
    const arr = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = Math.PI * 2 * goldenRatio;

    for (let i = 0; i < itemsCount; i++) {
      const t = i / itemsCount;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = angleIncrement * i;

      const x = radius * Math.sin(inclination) * Math.cos(azimuth);
      const y = radius * Math.sin(inclination) * Math.sin(azimuth);
      const z = radius * Math.cos(inclination);

      const imgObj = displayImages[i % displayImages.length];

      arr.push({
        id: imgObj.id ? `${imgObj.id}-${i}` : i.toString(),
        image: imgObj.url,
        date: imgObj.date,
        description: imgObj.description,
        x, y, z
      });
    }
    return arr;
  }, [itemsCount, radius, displayImages]);

  const rotationRef = useRef({ x: 0, y: 0 });

  useGesture(
    {
      onDrag: ({ delta: [dx, dy], movement: [mx, my] }) => {
        if (Math.abs(mx) > 5 || Math.abs(my) > 5) {
          isDragging.current = true;
        }

        rotationRef.current.x -= dy * 0.25;
        rotationRef.current.y += dx * 0.25;
        
        if (galleryRef.current) {
          galleryRef.current.style.transform = `rotateX(${rotationRef.current.x}deg) rotateY(${rotationRef.current.y}deg)`;
        }

        // Keep items upright (billboarding)
        itemsRefs.current.forEach((item) => {
          if (item) {
            const { x, y, z } = item.dataset;
            item.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${-rotationRef.current.y}deg) rotateX(${-rotationRef.current.x}deg)`;
          }
        });
      },
      onDragEnd: () => {
        setTimeout(() => {
          isDragging.current = false;
        }, 50);
      }
    },
    { target: containerRef, eventOptions: { passive: false } }
  );

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden bg-transparent flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ perspective: "1200px", touchAction: "none" }}
      >
        <div
          ref={galleryRef}
          className="relative w-0 h-0 transition-transform duration-100 ease-out"
          style={{ transform: "rotateX(0deg) rotateY(0deg)", transformStyle: "preserve-3d" }}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => { itemsRefs.current[index] = el; }}
              data-x={item.x}
              data-y={item.y}
              data-z={item.z}
              onClick={(e) => {
                if (isDragging.current) {
                  e.preventDefault();
                  return;
                }
                setSelectedItem(item);
              }}
              className="absolute left-[-55px] top-[-75px] w-[110px] h-[150px] bg-zinc-800 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(217,70,239,0.3)] border border-fuchsia-500/20 cursor-pointer hover:border-fuchsia-400 transition-colors"
              style={{ 
                transform: `translate3d(${item.x}px, ${item.y}px, ${item.z}px) rotateY(0deg) rotateX(0deg)`, 
                pointerEvents: "auto"
              }}
            >
              <img
                src={item.image}
                alt="Moment"
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>

      {selectedItem && (
        <div 
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 px-6 backdrop-blur-md transition-opacity"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-[4/5] rounded-xl overflow-hidden shadow-2xl mb-6 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedItem.image} 
              alt="Selected" 
              className="w-full h-full object-cover" 
            />
          </div>
          {(selectedItem.date || selectedItem.description) && (
            <div 
              className="w-full max-w-[280px] sm:max-w-[340px] rounded-xl border border-[#4A2440] bg-[#1E0E1C] px-4 py-4 text-center shadow-lg shadow-fuchsia-900/20 flex flex-col gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.date && <span className="text-xs font-semibold text-white/50">{selectedItem.date}</span>}
              {selectedItem.description && <span className="text-sm font-bold text-white/90">{selectedItem.description}</span>}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DomeGallery;
