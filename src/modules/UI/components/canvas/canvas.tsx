'use client';

import { blobRepository } from '@/app/repositories/vercel-blobs';
import { Button } from '@mui/material';
import { RefObject, useEffect, useRef, useState } from 'react';
import { FaEraser, FaFileExport } from 'react-icons/fa6';

interface CanvasProps {
  loadContent?: string;
  editMode?: boolean;
  onSave: (canvasRef: RefObject<HTMLCanvasElement>) => void;
}

const A4_RATIO = 210 / 297; // A4 aspect ratio (width/height)
// const A4_WIDTH_MM = 210; // mm
// const A4_HEIGHT_MM = 297; // mm

// Function to draw horizontal grid lines
function drawGrid(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  spacing: number,
) {
  ctx.strokeStyle = 'gray';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  for (let y = spacing; y < canvas.height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

export const Canvas = ({
  loadContent,
  editMode = true,
  onSave,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isLandscape, setIsLandscape] = useState(
    window.innerWidth > window.innerHeight,
  );

  // Update screen width and orientation dynamically
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up high-DPI scaling for canvas
    const scaleFactor = 2; // window.devicePixelRatio || 1;

    const canvasWidth = isLandscape
      ? screenWidth * A4_RATIO
      : screenWidth * A4_RATIO;
    const canvasHeight = isLandscape ? screenWidth / A4_RATIO : screenWidth;

    canvas.width = canvasWidth * scaleFactor;
    canvas.height = canvasHeight * scaleFactor;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.scale(scaleFactor, scaleFactor);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Initialize canvas
    if (loadContent) {
      const newImage = new Image();
      blobRepository.getImageByUrl(loadContent).then(response => {
        newImage.src = URL.createObjectURL(response);
        newImage.onload = () => {
          ctx.drawImage(newImage, 0, 0, canvasWidth, canvasHeight);
        };
      });
    } else {
      ctx.fillStyle = '#f0efeb';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      drawGrid(ctx, canvas, 50);
    }

    // Drawing state variables
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const startDrawing = (e: PointerEvent) => {
      if (e.pointerType !== 'pen' && e.pointerType !== 'mouse') return;
      const rect = canvas.getBoundingClientRect();
      isDrawing = true;
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
    };

    const draw = (e: PointerEvent) => {
      if (
        !editMode ||
        !isDrawing ||
        (e.pointerType !== 'pen' && e.pointerType !== 'mouse')
      )
        return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const pressure = e.pressure || 1.5; // Default pressure if unsupported
      ctx.lineWidth = Math.max(1, pressure * 2);
      ctx.lineTo(x, y);
      ctx.stroke();
      lastX = x;
      lastY = y;
    };

    const stopDrawing = () => {
      if (isDrawing) {
        isDrawing = false;
        ctx.closePath();
      }
    };

    // Attach event listeners
    canvas.addEventListener('pointerdown', startDrawing);
    canvas.addEventListener('pointermove', draw);
    canvas.addEventListener('pointerup', stopDrawing);
    canvas.addEventListener('pointerleave', stopDrawing);

    // Cleanup on unmount
    return () => {
      canvas.removeEventListener('pointerdown', startDrawing);
      canvas.removeEventListener('pointermove', draw);
      canvas.removeEventListener('pointerup', stopDrawing);
      canvas.removeEventListener('pointerleave', stopDrawing);
    };
  }, [screenWidth, isLandscape, loadContent, editMode]);

  const handleSave = () => {
    onSave(canvasRef);
  };

  const handleErase = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const scaleFactor = 2; // window.devicePixelRatio || 1;

      const canvasWidth = isLandscape
        ? screenWidth * A4_RATIO
        : screenWidth * A4_RATIO;
      const canvasHeight = isLandscape ? screenWidth / A4_RATIO : screenWidth;

      canvas.width = canvasWidth * scaleFactor;
      canvas.height = canvasHeight * scaleFactor;
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;

      ctx.scale(scaleFactor, scaleFactor);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.fillStyle = '#f0efeb';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      drawGrid(ctx, canvas, 50);
      // Initialize canvas
      if (loadContent) {
        const image = new Image();
        image.src = loadContent;
        image.onload = () => {
          ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        };
      } else {
        ctx.fillStyle = '#f0efeb';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        drawGrid(ctx, canvas, 50);
      }
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      {editMode && (
        <div className='flex justify-between'>
          <Button variant='contained' onClick={handleErase}>
            <FaEraser size={20} />
          </Button>
          <Button
            variant='contained'
            className='flex gap-2'
            onClick={handleSave}
          >
            <FaFileExport size={20} /> Save
          </Button>
        </div>
      )}
      <div className='flex justify-center'>
        <canvas
          ref={canvasRef}
          style={{
            // border: '1px solid black',
            touchAction: 'none',
            backgroundColor: '#f0efeb',
            width: '100%',
          }}
        />
      </div>
    </div>
  );
};
