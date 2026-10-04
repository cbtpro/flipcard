export interface FlipAnimationProps {
  items?: (string | number)[];
  currentIndex?: number;
  currentValue?: string | number;
  duration?: number;
  flipMode?: 'direct' | 'sequential';
  flipOrder?: 'simultaneous' | 'sequential';
  sequenceIndex?: number;
  stagger?: number;
  width?: number;
  height?: number;
  fontSize?: number;
  theme?: 'light' | 'dark';
  paused?: boolean;
  respectReducedMotion?: boolean;
  sound?: boolean;
  volume?: number;
}
