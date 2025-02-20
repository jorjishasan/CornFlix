import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { FaCoins } from "react-icons/fa";

const CreditCounter = () => {
  const credits = useSelector((store) => store.credits.count);
  const isLoading = useSelector((store) => store.credits.isLoading);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group flex items-center gap-2 rounded-md px-2 py-1 mx:px-4 mx:py-2 transition-all duration-300
        ${credits > 10 
          ? "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
          : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
        }`}
    >
      <div className="relative">
        <FaCoins className={`text-lg ${
          credits > 10 ? "text-yellow-500" : "text-red-400"
        }`} />
        
        {/* Loading spinner */}
        {isLoading && (
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <div className="h-full w-full rounded-full border-2 border-transparent border-t-current" />
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.span
          key={credits}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="font-ui text-sm font-medium"
        >
          {credits} Credits
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
};

export default CreditCounter; 