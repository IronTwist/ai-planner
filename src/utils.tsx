import { v4 as uuidv4 } from 'uuid';

export const generateUniqueId = () => {
  return `${uuidv4()}-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
};

export const preloadImages = () => {
  const images = ['/images/aaabstract.webp'];
  images.forEach(image => {
    const img = new Image();
    img.src = image;
  });
};
