'use client';

import { Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

interface CanvasProps {
  width: number;
  height: number;
}

export const Canvas = ({ width, height }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  //   const [xTest, setXTest] = useState(0);
  //   const [yTest, setYTest] = useState(0);
  const [showScaleFactor, setShowScaleFactor] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');

      // Set scaling factor for high DPI canvas (e.g., 5x)
      const scaleFactor = 5;
      setShowScaleFactor(scaleFactor);
      // Set internal canvas size to be scaled
      canvas.width = width * scaleFactor;
      canvas.height = height * scaleFactor;
      // Set the CSS size to match the original size
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      if (ctx) {
        // Initial canvas setup
        ctx.fillStyle = '#f5f2da';
        ctx.fillRect(0, 0, width * scaleFactor, height * scaleFactor);
        ctx.strokeStyle = 'blue';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Drawing state variables
        let drawing = false;
        let lastX = 0;
        let lastY = 0;

        // Function to start drawing
        const startDrawing = (e: PointerEvent) => {
          if (e.pointerType !== 'pen') return;
          drawing = true;
          const rect = canvas.getBoundingClientRect();

          // Calculate touch coordinates and adjust for scaling
          const x = (e.clientX - rect.left) * scaleFactor;
          const y = (e.clientY - rect.top) * scaleFactor;

          //   setXTest(x);
          //   setYTest(y);

          lastX = x;
          lastY = y;

          ctx.beginPath();
          ctx.moveTo(x, y);
          e.preventDefault();
        };

        // Function to draw the path
        const draw = (e: PointerEvent) => {
          if (!drawing || e.pointerType !== 'pen') return;
          const rect = canvas.getBoundingClientRect();

          // Adjust touch coordinates for scaling
          const x = (e.clientX - rect.left) * scaleFactor;
          const y = (e.clientY - rect.top) * scaleFactor;
          const pressure = 1.5; // to add preasure e.pressure || 0.5;

          // Adjust line width based on pressure and scaling factor
          const scaledLineWidth = Math.max(1, pressure * scaleFactor);
          ctx.lineWidth = scaledLineWidth;

          // Draw the line using quadratic curve for smoother strokes
          ctx.quadraticCurveTo(lastX, lastY, x, y);
          ctx.stroke();

          // Update the last coordinates for the next stroke
          lastX = x;
          lastY = y;
        };

        // Function to stop drawing
        const stopDrawing = () => {
          drawing = false;
          ctx.closePath();
        };

        // Attach event listeners for pointer events
        canvas.addEventListener('pointerdown', startDrawing);
        canvas.addEventListener('pointermove', draw);
        canvas.addEventListener('pointerup', stopDrawing);
        canvas.addEventListener('pointerleave', stopDrawing);
        canvas.addEventListener('pointercancel', stopDrawing);

        // Cleanup event listeners on component unmount
        return () => {
          canvas.removeEventListener('pointerdown', startDrawing);
          canvas.removeEventListener('pointermove', draw);
          canvas.removeEventListener('pointerup', stopDrawing);
          canvas.removeEventListener('pointerleave', stopDrawing);
          canvas.removeEventListener('pointercancel', stopDrawing);
        };
      }
    }
  }, [width, height]);

  const handleSave = async () => {
    canvasRef.current?.toBlob(
      blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob as Blob);
        link.download = 'image.jpg';

        link.click();

        URL.revokeObjectURL(link.href);
      },
      'image/jpeg',
      0.95, // JPEG quality
    );
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex'>debug: showScaleFactor: {showScaleFactor}</div>
      <div className='flex justify-between'>
        <Button
          variant='contained'
          onClick={() =>
            canvasRef.current
              ?.getContext('2d')
              ?.clearRect(0, 0, width * 5, height * 5)
          }
        >
          Clear
        </Button>
        <Button variant='contained' onClick={handleSave}>
          Save
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        width={width * 5} // Scaled canvas size (internal resolution)
        height={height * 5} // Scaled canvas size (internal resolution)
        style={{
          border: '1px solid black',
          touchAction: 'none',
          backgroundColor: '#f0efeb',
        }}
      />
    </div>
  );
};
