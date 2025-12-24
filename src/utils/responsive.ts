import {Dimensions, PixelRatio} from 'react-native';

// Get the screen dimensions
const {width, height} = Dimensions.get('window');

// Base design dimensions (Adjust according to your design)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// Function to scale sizes based on screen width
const scaleWidth = (size: number) => (width / BASE_WIDTH) * size;

// Function to scale sizes based on screen height
const scaleHeight = (size: number) => (height / BASE_HEIGHT) * size;

// Function to normalize font sizes for different screens 
const normalizeFont = (size: number) => {
  const scale = width / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export {scaleWidth, scaleHeight, normalizeFont, width, height};

