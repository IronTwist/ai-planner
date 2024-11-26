// 'use client';

// import { Button } from '@mui/material';
// import { RefObject, useEffect, useRef } from 'react';
// import { FaEraser, FaFileExport } from 'react-icons/fa6';

// interface CanvasProps {
//   width: number;
//   height: number;
//   loadContent?: string;
//   onSave: (canvasRef: RefObject<HTMLCanvasElement>) => void;
// }

// // Function to draw a horizontal line
// function drawLine(
//   ctx: CanvasRenderingContext2D,
//   canvas: HTMLCanvasElement,
//   y: number,
// ) {
//   ctx.beginPath();
//   ctx.moveTo(0, y);
//   ctx.lineTo(canvas.width, y);
//   ctx.strokeStyle = 'gray';
//   ctx.stroke();
//   ctx.strokeStyle = 'blue';
// }

// export const Canvas = ({ loadContent, width, height, onSave }: CanvasProps) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   //   const [xTest, setXTest] = useState(0);
//   //   const [yTest, setYTest] = useState(0);
//   // const [showScaleFactor, setShowScaleFactor] = useState(0);
//   // const user = useAppSelector(state => state.auth.user);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       const ctx = canvas.getContext('2d');

//       // Set scaling factor for high DPI canvas (e.g., 5x)
//       const scaleFactor = 2.5;
//       // setShowScaleFactor(scaleFactor);
//       // Set internal canvas size to be scaled
//       canvas.width = width * scaleFactor;
//       canvas.height = height * scaleFactor;
//       // Set the CSS size to match the original size
//       // canvas.style.width = `${width}px`;
//       // canvas.style.height = `${height}px`;

//       if (ctx) {
//         if (loadContent) {
//           // preload current note image
//           const image = new Image();
//           image.src = loadContent;

//           const imageLoadPromise = new Promise((resolve, reject) => {
//             image.onload = () => resolve(image);
//             image.onerror = error => reject(error);
//           });

//           imageLoadPromise
//             .then(loadedImage => {
//               canvas.width = (loadedImage as HTMLImageElement).width as number;
//               canvas.height = (loadedImage as HTMLImageElement)
//                 .height as number;
//               canvas.style.width = '100%';
//               canvas.style.height = 'auto';
//               ctx.drawImage(loadedImage as HTMLImageElement, 0, 0);
//             })
//             .catch(error => {
//               console.error('Error loading image:', error);
//               // Handle the error, e.g., display an error message or fallback image
//             });

//           console.log('Image loaded: ', image);
//           canvas.width = image.width;
//           canvas.height = image.height;

//           ctx.drawImage(image, 0, 0);
//         } else {
//           // Initial canvas setup
//           ctx.fillStyle = '#f0efeb';
//           ctx.fillRect(0, 0, width * scaleFactor, height * scaleFactor);

//           ctx.lineJoin = 'round';
//           ctx.lineCap = 'round';
//           ctx.imageSmoothingEnabled = true;
//           ctx.imageSmoothingQuality = 'high';
//         }

//         // Drawing state variables
//         let drawing = false;
//         let lastX = 0;
//         let lastY = 0;

//         // Draw lines with a spacing of 100 pixels
//         let y = 100;
//         while (y < canvas.height) {
//           drawLine(ctx, canvas, y);
//           y += 100;
//         }

//         ctx.strokeStyle = 'blue';

//         // Function to start drawing
//         const startDrawing = (e: PointerEvent) => {
//           if (e.pointerType !== 'pen') return;
//           drawing = true;
//           const rect = canvas.getBoundingClientRect();

//           // Calculate touch coordinates and adjust for scaling
//           const x = (e.clientX - rect.left) * scaleFactor;
//           const y = (e.clientY - rect.top) * scaleFactor;

//           //   setXTest(x);
//           //   setYTest(y);

//           lastX = x;
//           lastY = y;

//           ctx.beginPath();
//           ctx.moveTo(x, y);
//           e.preventDefault();
//         };

//         // Function to draw the path
//         const draw = (e: PointerEvent) => {
//           if (!drawing || e.pointerType !== 'pen') return;
//           const rect = canvas.getBoundingClientRect();

//           // Adjust touch coordinates for scaling
//           const x = (e.clientX - rect.left) * scaleFactor;
//           const y = (e.clientY - rect.top) * scaleFactor;
//           const pressure = 1.5; // to add preasure e.pressure || 0.5;

//           // Adjust line width based on pressure and scaling factor
//           const scaledLineWidth = Math.max(1, pressure * scaleFactor);
//           ctx.lineWidth = scaledLineWidth;

//           // Draw the line using quadratic curve for smoother strokes
//           ctx.quadraticCurveTo(lastX, lastY, x, y);
//           ctx.stroke();

//           // Update the last coordinates for the next stroke
//           lastX = x;
//           lastY = y;
//         };

//         // Function to stop drawing
//         const stopDrawing = () => {
//           drawing = false;
//           ctx.closePath();
//         };

//         // Attach event listeners for pointer events
//         canvas.addEventListener('pointerdown', startDrawing);
//         canvas.addEventListener('pointermove', draw);
//         canvas.addEventListener('pointerup', stopDrawing);
//         canvas.addEventListener('pointerleave', stopDrawing);
//         canvas.addEventListener('pointercancel', stopDrawing);

//         // Cleanup event listeners on component unmount
//         return () => {
//           canvas.removeEventListener('pointerdown', startDrawing);
//           canvas.removeEventListener('pointermove', draw);
//           canvas.removeEventListener('pointerup', stopDrawing);
//           canvas.removeEventListener('pointerleave', stopDrawing);
//           canvas.removeEventListener('pointercancel', stopDrawing);
//         };
//       }
//     }
//   }, [width, height, loadContent]);

//   const handleSave = async () => {
//     // canvasRef.current?.toBlob(
//     //   async blob => {
//     //     const file = new File([blob as Blob], `${user?.uid}-imagine.jpg`, {
//     //       type: 'image/jpeg',
//     //     });

//     //     console.log('Start upload');
//     //     if (blob) {
//     //       const response = await fetch(
//     //         `/api/notes/upload?filename=${file.name}`,
//     //         {
//     //           method: 'POST',
//     //           body: file,
//     //         },
//     //       );
//     //       const data = await response.json();
//     //       console.log('Upload response: ', data);
//     //     }
//     //   },
//     //   'image/jpeg',
//     //   0.95, // JPEG quality
//     // );

//     console.log('Start saving on canvas: ', canvasRef.current);
//     onSave(canvasRef);
//   };

//   const handleErase = () => {
//     const canvas = canvasRef.current;
//     const context = canvas?.getContext('2d');
//     if (canvas && context) {
//       // context.clearRect(0, 0, width * 5, height * 5);
//       context.reset();

//       // Initial canvas setup
//       context.fillStyle = '#f0efeb';
//       context.fillRect(0, 0, width * 2.5, height * 2.5);

//       context.lineJoin = 'round';
//       context.lineCap = 'round';
//       context.imageSmoothingEnabled = true;
//       context.imageSmoothingQuality = 'high';

//       context.beginPath();
//       context.strokeStyle = 'lightgray';
//       let y = 100;
//       while (y < canvas?.height) {
//         drawLine(context, canvas, y);
//         y += 100;
//       }
//     }
//   };

//   return (
//     <div className='flex flex-col gap-2'>
//       {/* <div className='flex'>debug: showScaleFactor: {showScaleFactor}</div> */}
//       <div className='flex justify-between'>
//         <Button variant='contained' onClick={handleErase}>
//           <FaEraser size={20} />
//         </Button>
//         <Button variant='contained' className='flex gap-2' onClick={handleSave}>
//           <FaFileExport size={20} /> Save
//         </Button>
//       </div>
//       <canvas
//         ref={canvasRef}
//         width={width * 5} // Scaled canvas size (internal resolution)
//         height={height * 5} // Scaled canvas size (internal resolution)
//         style={{
//           border: '1px solid black',
//           touchAction: 'none',
//           backgroundColor: '#f0efeb',
//         }}
//       />
//     </div>
//   );
// };

// Good version

// 'use client';

// import { Button } from '@mui/material';
// import { RefObject, useEffect, useRef } from 'react';
// import { FaEraser, FaFileExport } from 'react-icons/fa6';

// interface CanvasProps {
//   width: number;
//   height: number;
//   loadContent?: string;
//   onSave: (canvasRef: RefObject<HTMLCanvasElement>) => void;
// }

// // Function to draw horizontal grid lines
// function drawGrid(
//   ctx: CanvasRenderingContext2D,
//   canvas: HTMLCanvasElement,
//   spacing: number,
// ) {
//   ctx.strokeStyle = 'gray';
//   ctx.lineJoin = 'round';
//   ctx.lineCap = 'round';
//   ctx.imageSmoothingEnabled = true;
//   ctx.imageSmoothingQuality = 'high';
//   for (let y = spacing; y < canvas.height; y += spacing) {
//     ctx.beginPath();
//     ctx.moveTo(0, y);
//     ctx.lineTo(canvas.width, y);
//     ctx.stroke();
//   }
// }

// export const Canvas = ({ loadContent, width, height, onSave }: CanvasProps) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     // Set up high-DPI scaling for canvas
//     const scaleFactor = window.devicePixelRatio || 1;
//     canvas.width = width * scaleFactor;
//     canvas.height = height * scaleFactor;
//     canvas.style.width = `${width}px`;
//     canvas.style.height = `${height}px`;
//     ctx.scale(scaleFactor, scaleFactor);
//     ctx.lineJoin = 'round';
//     ctx.lineCap = 'round';
//     ctx.imageSmoothingEnabled = true;
//     ctx.imageSmoothingQuality = 'high';

//     // Initialize canvas
//     if (loadContent) {
//       const image = new Image();
//       image.src = loadContent;
//       image.onload = () => {
//         ctx.drawImage(image, 0, 0, width, height);
//       };
//     } else {
//       ctx.fillStyle = '#f0efeb';
//       ctx.fillRect(0, 0, width, height);
//       ctx.lineJoin = 'round';
//       ctx.lineCap = 'round';
//       ctx.imageSmoothingEnabled = true;
//       ctx.imageSmoothingQuality = 'high';
//       drawGrid(ctx, canvas, 50);
//     }

//     // Drawing state variables
//     let isDrawing = false;
//     let lastX = 0;
//     let lastY = 0;

//     const startDrawing = (e: PointerEvent) => {
//       if (e.pointerType !== 'pen' && e.pointerType !== 'mouse') return;
//       const rect = canvas.getBoundingClientRect();
//       isDrawing = true;
//       lastX = e.clientX - rect.left;
//       lastY = e.clientY - rect.top;
//       ctx.beginPath();
//       ctx.moveTo(lastX, lastY);
//     };

//     const draw = (e: PointerEvent) => {
//       if (!isDrawing || (e.pointerType !== 'pen' && e.pointerType !== 'mouse'))
//         return;
//       const rect = canvas.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;
//       const pressure = e.pressure || 1.5; // Default pressure if unsupported
//       ctx.lineWidth = Math.max(1, pressure * 2);
//       ctx.lineTo(x, y);
//       ctx.stroke();
//       lastX = x;
//       lastY = y;
//     };

//     const stopDrawing = () => {
//       if (isDrawing) {
//         isDrawing = false;
//         ctx.closePath();
//       }
//     };

//     // Attach event listeners
//     canvas.addEventListener('pointerdown', startDrawing);
//     canvas.addEventListener('pointermove', draw);
//     canvas.addEventListener('pointerup', stopDrawing);
//     canvas.addEventListener('pointerleave', stopDrawing);

//     // Cleanup on unmount
//     return () => {
//       canvas.removeEventListener('pointerdown', startDrawing);
//       canvas.removeEventListener('pointermove', draw);
//       canvas.removeEventListener('pointerup', stopDrawing);
//       canvas.removeEventListener('pointerleave', stopDrawing);
//     };
//   }, [width, height, loadContent]);

//   const handleSave = () => {
//     onSave(canvasRef);
//   };

//   const handleErase = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');
//     if (canvas && ctx) {
//       // ctx.fillStyle = '#f0efeb';
//       // ctx.fillRect(0, 0, width, height);
//       // drawGrid(ctx, canvas, 50);

//       // Initialize canvas
//       if (loadContent) {
//         const image = new Image();
//         image.src = loadContent;
//         image.onload = () => {
//           ctx.drawImage(image, 0, 0, width, height);
//         };
//       } else {
//         ctx.fillStyle = '#f0efeb';
//         ctx.fillRect(0, 0, width, height);
//         drawGrid(ctx, canvas, 50);
//       }
//     }
//   };

//   return (
//     <div className='flex flex-col gap-2'>
//       <div className='flex justify-between'>
//         <Button variant='contained' onClick={handleErase}>
//           <FaEraser size={20} />
//         </Button>
//         <Button variant='contained' className='flex gap-2' onClick={handleSave}>
//           <FaFileExport size={20} /> Save
//         </Button>
//       </div>
//       <div className='flex p-1'>
//         <canvas
//           ref={canvasRef}
//           style={{
//             // border: '1px solid black',
//             touchAction: 'none',
//             backgroundColor: '#f0efeb',
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// A4 version ###############################################################################

// 'use client';

// import { Button } from '@mui/material';
// import { RefObject, useEffect, useRef, useState } from 'react';
// import { FaEraser, FaFileExport } from 'react-icons/fa6';

// interface CanvasProps {
//   loadContent?: string;
//   onSave: (canvasRef: RefObject<HTMLCanvasElement>) => void;
// }

// // Function to draw grid lines
// function drawGrid(
//   ctx: CanvasRenderingContext2D,
//   canvas: HTMLCanvasElement,
//   spacing: number,
// ) {
//   ctx.strokeStyle = 'gray';
//   for (let y = spacing; y < canvas.height; y += spacing) {
//     ctx.beginPath();
//     ctx.moveTo(0, y);
//     ctx.lineTo(canvas.width, y);
//     ctx.stroke();
//   }
// }

// export const Canvas = ({ loadContent, onSave }: CanvasProps) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

//   const A4_RATIO = 210 / 297; // A4 aspect ratio (width / height)

//   // Handle screen resize to dynamically calculate canvas size
//   useEffect(() => {
//     const calculateCanvasSize = () => {
//       const screenWidth = window.innerWidth;
//       const screenHeight = window.innerHeight;

//       if (screenWidth > screenHeight) {
//         // Landscape: use full height
//         const height = screenHeight * 0.9; // Leave some padding
//         const width = height * A4_RATIO;
//         setDimensions({ width, height });
//       } else {
//         // Portrait: use full width
//         const width = screenWidth * 0.9; // Leave some padding
//         const height = width / A4_RATIO;
//         setDimensions({ width, height });
//       }
//     };

//     calculateCanvasSize();
//     window.addEventListener('resize', calculateCanvasSize);

//     return () => window.removeEventListener('resize', calculateCanvasSize);
//   }, []);

//   // Initialize canvas on mount or when dimensions change
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     const { width, height } = dimensions;

//     // Set up high-DPI scaling
//     const scaleFactor = window.devicePixelRatio || 1;
//     canvas.width = width * scaleFactor;
//     canvas.height = height * scaleFactor;
//     canvas.style.width = `${width}px`;
//     canvas.style.height = `${height}px`;

//     ctx.scale(scaleFactor, scaleFactor);

//     // Load content or initialize blank canvas
//     if (loadContent) {
//       const image = new Image();
//       image.src = loadContent;
//       image.onload = () => {
//         ctx.drawImage(image, 0, 0, width, height);
//       };
//     } else {
//       ctx.fillStyle = '#f0efeb';
//       ctx.fillRect(0, 0, width, height);
//       drawGrid(ctx, canvas, 50);
//     }

//     // Drawing state variables
//     let isDrawing = false;
//     let lastX = 0;
//     let lastY = 0;

//     const startDrawing = (e: PointerEvent) => {
//       const rect = canvas.getBoundingClientRect();
//       isDrawing = true;
//       lastX = (e.clientX - rect.left) * (canvas.width / rect.width);
//       lastY = (e.clientY - rect.top) * (canvas.height / rect.height);
//       ctx.beginPath();
//       ctx.moveTo(lastX, lastY);
//     };

//     const draw = (e: PointerEvent) => {
//       if (!isDrawing) return;
//       const rect = canvas.getBoundingClientRect();
//       const x = (e.clientX - rect.left) * (canvas.width / rect.width);
//       const y = (e.clientY - rect.top) * (canvas.height / rect.height);

//       ctx.lineWidth = 2;
//       ctx.lineJoin = 'round';
//       ctx.lineCap = 'round';
//       ctx.strokeStyle = 'blue';
//       ctx.lineTo(x, y);
//       ctx.stroke();

//       lastX = x;
//       lastY = y;
//     };

//     const stopDrawing = () => {
//       isDrawing = false;
//       ctx.closePath();
//     };

//     // Attach event listeners
//     canvas.addEventListener('pointerdown', startDrawing);
//     canvas.addEventListener('pointermove', draw);
//     canvas.addEventListener('pointerup', stopDrawing);
//     canvas.addEventListener('pointerleave', stopDrawing);

//     // Cleanup on unmount
//     return () => {
//       canvas.removeEventListener('pointerdown', startDrawing);
//       canvas.removeEventListener('pointermove', draw);
//       canvas.removeEventListener('pointerup', stopDrawing);
//       canvas.removeEventListener('pointerleave', stopDrawing);
//     };
//   }, [dimensions, loadContent]);

//   const handleSave = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     // Save at true A4 dimensions (2480x3508 at 300 DPI)
//     const exportCanvas = document.createElement('canvas');
//     exportCanvas.width = 2480;
//     exportCanvas.height = 3508;

//     const exportCtx = exportCanvas.getContext('2d');
//     if (!exportCtx) return;

//     exportCtx.fillStyle = '#f0efeb';
//     exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

//     const scaleFactor = exportCanvas.width / canvas.width;
//     exportCtx.scale(scaleFactor, scaleFactor);
//     exportCtx.drawImage(canvas, 0, 0);

//     exportCanvas.toBlob(blob => {
//       if (!blob) return;
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);
//       link.download = 'A4_canvas.png';
//       link.click();
//     }, 'image/png');
//   };

//   const handleErase = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');
//     if (canvas && ctx) {
//       const { width, height } = dimensions;
//       ctx.fillStyle = '#f0efeb';
//       ctx.fillRect(0, 0, width, height);
//       drawGrid(ctx, canvas, 50);
//     }
//   };

//   return (
//     <div className='flex flex-col gap-2'>
//       <div className='flex justify-between'>
//         <Button variant='contained' onClick={handleErase}>
//           <FaEraser size={20} />
//         </Button>
//         <Button variant='contained' className='flex gap-2' onClick={handleSave}>
//           <FaFileExport size={20} /> Save
//         </Button>
//       </div>
//       <div className='flex p-1'>
//         <canvas
//           ref={canvasRef}
//           style={{
//             border: '1px solid black',
//             touchAction: 'none',
//             backgroundColor: '#f0efeb',
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// final version #################################################################
'use client';

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
      const image = new Image();
      image.src = loadContent;
      image.onload = () => {
        ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
      };
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
  }, [screenWidth, isLandscape, loadContent]);

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
