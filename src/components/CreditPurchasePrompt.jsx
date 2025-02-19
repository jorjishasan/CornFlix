import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { FaCoins, FaCrown } from "react-icons/fa";

const CreditPurchasePrompt = () => {
  const user = useSelector((store) => store.user);

  return (
    <div className="rounded-xl bg-gradient-to-br from-zinc-900 via-purple-900/20 to-zinc-900 p-8 shadow-xl">
      <div className="text-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto mb-6 inline-flex rounded-full bg-purple-600/20 p-4"
        >
          <FaCrown className="text-4xl text-purple-400" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-2xl font-bold text-white"
        >
          Hey {user?.displayName}! 👋
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 text-gray-300"
        >
          To get the best AI recommended movies, please spend a few extra pennies
          or wait until next month when we'll refill your account with fresh credits!
        </motion.p>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg shadow-purple-600/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-600/30"
        >
          <FaCoins className="text-yellow-300" />
          <span>Buy Credits</span>
        </motion.button>

        {/* Packages Preview */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { credits: 50, price: "$4.99" },
            { credits: 100, price: "$8.99", popular: true },
            { credits: 200, price: "$15.99" },
          ].map((pkg) => (
            <motion.div
              key={pkg.credits}
              whileHover={{ scale: 1.02 }}
              className={`relative rounded-lg ${
                pkg.popular
                  ? "bg-purple-600/20 ring-2 ring-purple-500"
                  : "bg-white/5"
              } p-4 text-center`}
            >
              {pkg.popular && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-purple-600 px-3 py-0.5 text-xs font-medium text-white">
                  Popular
                </span>
              )}
              <div className="mt-2 text-2xl font-bold text-white">
                {pkg.credits}
                <span className="text-sm text-gray-400"> credits</span>
              </div>
              <div className="text-lg font-medium text-purple-400">
                {pkg.price}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreditPurchasePrompt; 