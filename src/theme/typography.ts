import { FontSizeOption } from '../types';

export const getFontSizeMultiplier = (size: FontSizeOption): number => {
  switch (size) {
    case 'small':
      return 0.9;
    case 'normal':
      return 1.0;
    case 'large':
      return 1.18;
    case 'xlarge':
      return 1.35;
    default:
      return 1.0;
  }
};

export const getZikrFontSize = (size: FontSizeOption): number => {
  switch (size) {
    case 'small':
      return 17;
    case 'normal':
      return 20;
    case 'large':
      return 24;
    case 'xlarge':
      return 28;
    default:
      return 20;
  }
};

export const getZikrLineHeight = (size: FontSizeOption): number => {
  switch (size) {
    case 'small':
      return 28;
    case 'normal':
      return 34;
    case 'large':
      return 40;
    case 'xlarge':
      return 48;
    default:
      return 34;
  }
};
