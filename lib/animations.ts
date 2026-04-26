// Framer Motion Animation Variants

export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1], // Luxury easing curve
        }
    }
};

export const slideUp = {
    hidden: {
        opacity: 0,
        y: 30
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
        }
    }
};

export const slideInFromLeft = {
    hidden: {
        opacity: 0,
        x: -50
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
        }
    }
};

export const slideInFromRight = {
    hidden: {
        opacity: 0,
        x: 50
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
        }
    }
};

export const scaleIn = {
    hidden: {
        opacity: 0,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
        }
    }
};

// Stagger children animation
export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        }
    }
};

// Hover animations for cards
export const cardHover = {
    rest: {
        scale: 1,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    hover: {
        scale: 1.02,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        transition: {
            duration: 0.3,
            ease: [0.16, 1, 0.3, 1],
        }
    }
};

// Button press animation
export const buttonPress = {
    rest: { scale: 1 },
    hover: {
        scale: 1.05,
        transition: {
            duration: 0.2,
        }
    },
    tap: {
        scale: 0.95,
        transition: {
            duration: 0.1,
        }
    }
};

// Page transition
export const pageTransition = {
    hidden: {
        opacity: 0,
        y: 20
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
        }
    }
};

// Pulse animation for badges
export const pulse = {
    animate: {
        scale: [1, 1.05, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        }
    }
};

// Smooth reveal for images
export const imageReveal = {
    hidden: {
        opacity: 0,
        scale: 1.1
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
        }
    }
};
