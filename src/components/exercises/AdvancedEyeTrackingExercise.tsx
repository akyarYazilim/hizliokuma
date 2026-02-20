'use client';

import { useState, useEffect, useRef } from 'react';
import { AdvancedEyeTrackingExercise as ExerciseType } from '@/types';
import { Button } from '@/components/common/Button';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/common/Card';
import { storageService } from '@/services/StorageService';

type Phase = 'tracking' | 'results';
type Pattern = 'circle' | 'zigzag' | 'figure8' | 'spiral' | 'square';

interface Target {
  x: number;
  y: number;
}

interface TrackingPoint {
  targetX: number;
  targetY: number;
  userX: number;
  userY: number;
  distance: number;
  timestamp: number;
}

interface Props {
  exercise: ExerciseType;
  onComplete: (score: number, wpm: number, accuracy: number) => void;
}

export const AdvancedEyeTrackingExerciseComponent: React.FC<Props> = ({ exercise, onComplete }) => {
  const [phase, setPhase] = useState<Phase>('tracking');
  const [pattern, setPattern] = useState<Pattern>('circle');
  const [speed, setSpeed] = useState(exercise.speeds[0]);
  const [sizeMult, setSizeMult] = useState(exercise.sizeMultipliers[0]);
  const [time, setTime] = useState(exercise.duration);
  const [target, setTarget] = useState<Target>({ x: exercise.trackingArea.width / 2, y: exercise.trackingArea.height / 2 });
  const [userPos, setUserPos] = useState<Target>({ x: 0, y: 0 });
  const [trackingPoints, setTrackingPoints] = useState<TrackingPoint[]>([]);
  const [targetSize, setTargetSize] = useState(exercise.targetSize * sizeMult);
  const [selectedSpeed, setSelectedSpeed] = useState<number>(exercise.speeds[0]);
  const animRef = useRef<number>(0);
  const progressRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const patternEmojis: Record<Pattern, string> = { circle: '⭕', zigzag: '⚡', figure8: '∞', spiral: '🌀', square: '▢' };

const calculatePosition = (progress: number): Target => {
  const cx = exercise.trackingArea.width / 2;
  const cy = exercise.trackingArea.height / 2;
  const radius = 150;

  // Hızı daha yavaş ve geniş aralık
  const speedFactor = selectedSpeed / 50; // eski /5 yerine /10

  let x = cx, y = cy;

  switch (pattern) {
    case 'circle':
      x = cx + radius * Math.cos(progress * speedFactor);
      y = cy + radius * Math.sin(progress * speedFactor);
      break;
    case 'zigzag': {
      const zx = (progress * speedFactor) % (exercise.trackingArea.width * 2);
      const zy = cy + (zx % 300 < 150 ? 100 : -100);
      x = cx + (zx - exercise.trackingArea.width) / 2;
      y = zy;
      break;
    }
    case 'figure8': {
      const fp = progress * speedFactor;
      x = cx + radius * Math.sin(fp);
      y = cy + radius * Math.sin(fp) * Math.cos(fp);
      break;
    }
    case 'spiral': {
      const sp = progress * speedFactor;
      const r = 50 + (sp % 100);
      x = cx + r * Math.cos(sp);
      y = cy + r * Math.sin(sp);
      break;
    }
    case 'square': {
      const sq = (progress * speedFactor) % 800;
      if (sq < 200) { x = cx - 100 + sq / 2; y = cy - 100; }
      else if (sq < 400) { x = cx + 100; y = cy - 100 + (sq - 200)/2; }
      else if (sq < 600) { x = cx + 100 - (sq - 400)/2; y = cy + 100; }
      else { x = cx - 100; y = cy + 100 - (sq - 600)/2; }
      break;
    }
  }

  return { x, y };
};

// useEffect içinde animasyon
useEffect(() => {
  const animate = () => {
    progressRef.current += 0.5;
    const newPos = calculatePosition(progressRef.current);
    setTarget(newPos);
    
    // pulse kaldırıldı, sadece sabit boyut
    setTargetSize(exercise.targetSize * sizeMult);

    animRef.current = requestAnimationFrame(animate);
  };

  animRef.current = requestAnimationFrame(animate);

  return () => {
    if (animRef.current !== undefined) cancelAnimationFrame(animRef.current);
  };
}, [pattern, selectedSpeed, sizeMult]); // selectedSpeed dependency olarak eklendi




  const handlePatternChange = (dir: 'left'|'right') => {
    const idx = exercise.patterns.indexOf(pattern);
    if (idx === -1) return;
    let newIdx = dir==='left' ? idx-1 : idx+1;
    if (newIdx < 0) newIdx = exercise.patterns.length-1;
    if (newIdx >= exercise.patterns.length) newIdx = 0;
    setPattern(exercise.patterns[newIdx]);
  };

  return (
    <>
      {phase==='tracking' && (
<Card className="relative">
  <CardHeader 
    title={exercise.title} 
    subtitle={`${patternEmojis[pattern]} - Kalan: ${time}s`} 
  />
  <CardBody >
    {/* Tracking Area */}
    <div className="flex flex-col items-center gap-4">
              <div 
      ref={containerRef}
      style={{ width:'100%', height:'400px', position:'relative', touchAction:'none' }}
      className="bg-gray-900 border rounded-lg overflow-hidden relative"
    >
      {/* Target */}
      <div style={{
        position:'absolute', 
        width: targetSize, 
        height: targetSize,
        left:`${(target.x/exercise.trackingArea.width)*100}%`,
        top:`${(target.y/exercise.trackingArea.height)*100}%`,
        transform:'translate(-50%,-50%)',
        borderRadius:'50%', 
        backgroundColor:'#c8ff00b3',
        boxShadow:'0 0 30px rgba(0, 0, 0, 0.8)'
      }} />

      {/* Fullscreen Button */}
      <button 
        onClick={() => {
          if (!document.fullscreenElement) containerRef.current?.requestFullscreen();
          else document.exitFullscreen();
        }}
        className="absolute top-2 right-2 bg-gray-700 text-white px-3 py-1 rounded-md z-10"
      >
        🔳 Fullscreen
      </button>

      {/* Slider & Pattern Controls (overlay) */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex flex-col md:flex-row gap-3 items-center bg-gray-800 bg-opacity-70 p-2 rounded-lg">
        
        {/* Pattern Buttons */}
        <div className="flex gap-2 items-center">
          <Button onClick={()=>handlePatternChange('left')}>◀</Button>
          <Button onClick={()=>handlePatternChange('right')}>▶</Button>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-2">
          <label htmlFor="speedRange" className="text-white">Speed</label>
          <input
            type="range"
            id="speedRange"
            min={1}
            max={20}
            step={1}
            value={selectedSpeed}
            onChange={(e) => setSelectedSpeed(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-white w-8 text-center">{selectedSpeed}</span>
        </div>

        {/* Size Slider */}
        <div className="flex items-center gap-2">
          <label htmlFor="sizeRange" className="text-white">Size</label>
          <input
            type="range"
            id="sizeRange"
            min={0.5}
            max={3}
            step={0.05}
            value={sizeMult}
            onChange={(e) => setSizeMult(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-white w-8 text-center">{sizeMult.toFixed(2)}x</span>
        </div>
      </div>
    </div>
    </div>

  </CardBody>
</Card>
      )}
    </>
  );
};

export default AdvancedEyeTrackingExerciseComponent;