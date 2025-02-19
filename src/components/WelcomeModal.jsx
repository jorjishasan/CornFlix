import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useDispatch, useSelector } from "react-redux";
import { setShowWelcomeModal } from "../redux/creditSlice";
import { FaGift, FaRobot, FaTimes } from "react-icons/fa";

const WelcomeModal = () => {
  const dispatch = useDispatch();
  const showModal = useSelector((store) => store.credits.showWelcomeModal);
  const user = useSelector((store) => store.user);

  useEffect(() => {
    if (showModal) {
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#9333ea', '#dc2626', '#ffffff']
      });
    }
  }, [showModal]);

  if (!showModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => dispatch(setShowWelcomeModal(false))}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg rounded-2xl bg-zinc-900 p-6 text-white shadow-xl"
        >
          {/* Close button */}
          <button
            onClick={() => dispatch(setShowWelcomeModal(false))}
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
          >
            <FaTimes className="text-xl" />
          </button>

          {/* Content */}
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-purple-600/20 p-4">
                <FaGift className="text-4xl text-purple-400" />
              </div>
            </div>
            
            <h2 className="mb-2 text-2xl font-bold">
              Welcome, {user?.displayName}! 🎉
            </h2>
            
            <p className="mb-6 text-gray-300">
              You've received <span className="font-bold text-purple-400">49 free credits</span> to
              explore AI-powered movie recommendations!
            </p>

            {/* Feature highlight */}
            <div className="mb-6 rounded-lg bg-black/30 p-4">
              <div className="mb-2 flex items-center justify-center gap-2">
                <FaRobot className="text-lg text-purple-400" />
                <span className="font-semibold">How it works:</span>
              </div>
              <p className="text-sm text-gray-400">
                Exchange your credits to get personalized movie recommendations powered
                by advanced AI. Each conversation costs 1 credit.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => dispatch(setShowWelcomeModal(false))}
                className="rounded-lg bg-gradient-to-r from-red-600 to-purple-600 px-6 py-2 font-medium text-white shadow-lg shadow-purple-600/20"
              >
                Start Exploring
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WelcomeModal; 