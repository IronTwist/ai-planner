'use client';

import { Button } from '@mui/material';
import { RefObject, useEffect, useRef } from 'react';
import { FaEraser, FaFileExport } from 'react-icons/fa6';

interface CanvasProps {
  width: number;
  height: number;
  onSave: (canvasRef: RefObject<HTMLCanvasElement>) => void;
}

// Function to draw a horizontal line
function drawLine(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  y: number,
) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(canvas.width, y);
  ctx.strokeStyle = 'gray';
  ctx.stroke();
  ctx.strokeStyle = 'blue';
}

export const Canvas = ({ width, height, onSave }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  //   const [xTest, setXTest] = useState(0);
  //   const [yTest, setYTest] = useState(0);
  // const [showScaleFactor, setShowScaleFactor] = useState(0);
  // const user = useAppSelector(state => state.auth.user);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');

      // Set scaling factor for high DPI canvas (e.g., 5x)
      const scaleFactor = 2.5;
      // setShowScaleFactor(scaleFactor);
      // Set internal canvas size to be scaled
      canvas.width = width * scaleFactor;
      canvas.height = height * scaleFactor;
      // Set the CSS size to match the original size
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      if (ctx) {
        // Initial canvas setup
        ctx.fillStyle = '#f0efeb';
        ctx.fillRect(0, 0, width * scaleFactor, height * scaleFactor);

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Drawing state variables
        let drawing = false;
        let lastX = 0;
        let lastY = 0;

        // Draw lines with a spacing of 100 pixels
        let y = 100;
        while (y < canvas.height) {
          drawLine(ctx, canvas, y);
          y += 100;
        }

        ctx.strokeStyle = 'blue';

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
    // canvasRef.current?.toBlob(
    //   async blob => {
    //     const file = new File([blob as Blob], `${user?.uid}-imagine.jpg`, {
    //       type: 'image/jpeg',
    //     });

    //     console.log('Start upload');
    //     if (blob) {
    //       const response = await fetch(
    //         `/api/notes/upload?filename=${file.name}`,
    //         {
    //           method: 'POST',
    //           body: file,
    //         },
    //       );
    //       const data = await response.json();
    //       console.log('Upload response: ', data);
    //     }
    //   },
    //   'image/jpeg',
    //   0.95, // JPEG quality
    // );

    console.log('Start saving on canvas: ', canvasRef.current);
    onSave(canvasRef);
  };

  const handleErase = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context) {
      // context.clearRect(0, 0, width * 5, height * 5);
      context.reset();

      // Initial canvas setup
      context.fillStyle = '#f0efeb';
      context.fillRect(0, 0, width * 2.5, height * 2.5);

      context.lineJoin = 'round';
      context.lineCap = 'round';
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';

      context.beginPath();
      context.strokeStyle = 'lightgray';
      let y = 100;
      while (y < canvas?.height) {
        drawLine(context, canvas, y);
        y += 100;
      }
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      {/* <div className='flex'>debug: showScaleFactor: {showScaleFactor}</div> */}
      <div className='flex justify-between'>
        <Button variant='contained' onClick={handleErase}>
          <FaEraser size={20} />
        </Button>
        <Button variant='contained' className='flex gap-2' onClick={handleSave}>
          <FaFileExport size={20} /> Save
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
