// Advanced Animation Utilities
// lib/animations/advanced.ts

import { Variants } from 'framer-motion';

// Page Transitions
export const pageTransition: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.6, -0.05, 0.01, 0.99]
        }
    },
    exit: { 
        opacity: 0, 
        y: -20,
        transition: {
            duration: 0.3
        }
    }
};

// Smooth Scale
export const smoothScale: Variants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { 
        scale: 1, 
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 25
        }
    },
    exit: { scale: 0.95, opacity: 0 }
};

// Slide from Bottom
export const slideFromBottom: Variants = {
    initial: { y: 100, opacity: 0 },
    animate: { 
        y: 0, 
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20
        }
    },
    exit: { y: 100, opacity: 0 }
};

// Slide from Right
export const slideFromRight: Variants = {
    initial: { x: 100, opacity: 0 },
    animate: { 
        x: 0, 
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20
        }
    },
    exit: { x: 100, opacity: 0 }
};

// Bounce In
export const bounceIn: Variants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
        scale: 1, 
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20
        }
    }
};

// Rotate In
export const rotateIn: Variants = {
    initial: { rotate: -180, opacity: 0 },
    animate: { 
        rotate: 0, 
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

// Stagger Children with Delay
export const staggerChildren = (staggerDelay: number = 0.1): Variants => ({
    animate: {
        transition: {
            staggerChildren: staggerDelay
        }
    }
});

// List Item Animation
export const listItem: Variants = {
    initial: { x: -20, opacity: 0 },
    animate: { 
        x: 0, 
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

// Hover Scale
export const hoverScale = {
    scale: 1.05,
    transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
    }
};

// Hover Lift
export const hoverLift = {
    y: -5,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
    }
};

// Tap Scale
export const tapScale = {
    scale: 0.95,
    transition: {
        duration: 0.1
    }
};

// Shimmer Effect
export const shimmer: Variants = {
    initial: { backgroundPosition: "-200% 0" },
    animate: {
        backgroundPosition: "200% 0",
        transition: {
            repeat: Infinity,
            duration: 2,
            ease: "linear"
        }
    }
};

// Pulse
export const pulse: Variants = {
    animate: {
        scale: [1, 1.05, 1],
        transition: {
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
        }
    }
};

// Shake (for errors)
export const shake: Variants = {
    animate: {
        x: [0, -10, 10, -10, 10, 0],
        transition: {
            duration: 0.5
        }
    }
};

// Success Checkmark
export const successCheck: Variants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { 
        pathLength: 1, 
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeInOut"
        }
    }
};

// Card Flip
export const cardFlip: Variants = {
    initial: { rotateY: 0 },
    animate: { 
        rotateY: 180,
        transition: {
            duration: 0.6,
            ease: "easeInOut"
        }
    }
};

// Expand/Collapse
export const expandCollapse = (isExpanded: boolean): Variants => ({
    initial: { height: 0, opacity: 0 },
    animate: { 
        height: isExpanded ? "auto" : 0,
        opacity: isExpanded ? 1 : 0,
        transition: {
            height: {
                duration: 0.3,
                ease: "easeInOut"
            },
            opacity: {
                duration: 0.2,
                delay: isExpanded ? 0.1 : 0
            }
        }
    }
});

// Number Counter Animation
export const counterAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};
