import { motion, AnimatePresence } from 'framer-motion';

const AnimatedTransition = ({ 
  children, 
  isVisible = true,
  duration = 0.2,
  delay = 0,
  type = 'tween', // ou 'spring'
  customVariants = null
}) => {
  const defaultVariants = {
    initial: { 
      opacity: 0, 
      y: -10,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        type
      }
    },
    exit: { 
      opacity: 0,
      y: 10,
      scale: 0.95,
      transition: {
        duration: duration * 0.8
      }
    }
  };

  const variants = customVariants || defaultVariants;

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          layout
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedTransition;