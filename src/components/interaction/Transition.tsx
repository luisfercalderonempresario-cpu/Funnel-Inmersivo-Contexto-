import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TransitionProps {
  transitionKey: string;
  children: React.ReactNode;
  mode?: 'fade' | 'slide' | 'blur' | 'crossfade';
  className?: string;
}

export const Transition: React.FC<TransitionProps> = ({
  transitionKey,
  children,
  mode = 'fade',
  className = '',
}) => {
  const getVariants = () => {
    switch (mode) {
      case 'slide':
        return {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -20 },
        };
      case 'blur':
        return {
          initial: { opacity: 0, filter: 'blur(8px)' },
          animate: { opacity: 1, filter: 'blur(0px)' },
          exit: { opacity: 0, filter: 'blur(8px)' },
        };
      case 'fade':
      case 'crossfade':
      default:
        return {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -8 },
        };
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        variants={getVariants()}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full flex-1 flex flex-col ${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
