import React from "react";
import { motion } from "framer-motion";
import { FaPlay, FaInfoCircle } from "react-icons/fa";

const VideoTitle = ({ title, description }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto flex min-h-[60vh] max-w-screen-xl items-center px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-2xl">
          <motion.h1
            variants={itemVariants}
            className="mb-4 text-center text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-left xl:text-7xl"
          >
            {title}
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="mb-8 text-center text-base text-gray-300 sm:text-lg md:text-xl lg:text-left"
          >
            {description}
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 lg:justify-start"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-2 rounded-md bg-white px-8 py-3 text-lg font-semibold text-black transition-all duration-300 hover:bg-white/90"
            >
              <FaPlay className="text-black transition-transform duration-300 group-hover:scale-110" />
              <span>Play</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-2 rounded-md bg-white/20 px-8 py-3 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/30"
            >
              <FaInfoCircle className="transition-transform duration-300 group-hover:scale-110" />
              <span>More Info</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
};

export default VideoTitle;
