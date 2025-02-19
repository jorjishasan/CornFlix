import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { 
  FaRobot, FaSignOutAlt, FaCog, FaChevronDown,
  FaFilm, FaUser, FaSearch, FaBell
} from "react-icons/fa";
import CreditCounter from "./CreditCounter";

const QuickActions = () => (
  <div className="hidden items-center gap-3 lg:flex">
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group flex items-center gap-2 rounded-md bg-transparent px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-300 hover:bg-white/10"
    >
      <FaFilm className="text-sm text-gray-400 transition-colors group-hover:text-white" />
      <span className="transition-colors group-hover:text-white">Browse</span>
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group flex items-center gap-2 rounded-md bg-transparent px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-300 hover:bg-white/10"
    >
      <FaSearch className="text-sm text-gray-400 transition-colors group-hover:text-white" />
      <span className="transition-colors group-hover:text-white">Search</span>
    </motion.button>
  </div>
);

const NotificationBadge = () => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="relative cursor-pointer"
  >
    <FaBell className="text-xl text-gray-400 transition-colors duration-300 hover:text-white" />
    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
      3
    </span>
  </motion.div>
);

const Header = () => {
  const user = useSelector((store) => store.user);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const headerRef = useRef(null);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.98]);
  const headerBlur = useTransform(scrollYProgress, [0, 0.2], [0, 8]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    setShowDropdown(false);
    signOut(auth)
      .then(() => navigate("/"))
      .catch((error) => console.error("Sign out error:", error));
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      y: 10, 
      scale: 0.95,
      transition: { 
        duration: 0.2 
      }
    }
  };

  return (
    <motion.header
      ref={headerRef}
      style={{ 
        backdropFilter: `blur(${headerBlur}px)`,
        WebkitBackdropFilter: `blur(${headerBlur}px)`,
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      className={`fixed z-50 w-full transition-all duration-500 ${
        isScrolled 
          ? "bg-zinc-900/95 shadow-lg" 
          : "bg-gradient-to-b from-black/80 via-black/50 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to={user ? "/browse" : "/"}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <h1 className="bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text font-display text-2xl font-bold tracking-wider text-transparent">
                CORNFLIX
              </h1>
            </motion.div>
          </Link>

          {/* Quick Actions */}
          {user && <QuickActions />}
        </div>

        {/* Right Section */}
        {user ? (
          <div className="flex items-center gap-4">
            {/* Credit Counter */}
            <CreditCounter />

            {/* Notifications */}
            <div className="hidden md:block">
              <NotificationBadge />
            </div>

            {/* User Menu */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setShowDropdown(!showDropdown)}
                className="group flex items-center gap-2 rounded-md p-1 transition-all duration-300 hover:bg-white/10"
              >
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  className="h-8 w-8 rounded-md object-cover ring-2 ring-transparent transition-all duration-300 group-hover:ring-purple-500"
                  src={user.photoURL}
                  alt={user.displayName}
                />
                <motion.div
                  animate={{ rotate: showDropdown ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaChevronDown className="text-xs text-gray-400 transition-colors duration-300 group-hover:text-white" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-64 origin-top-right rounded-lg bg-zinc-900/95 p-1 shadow-xl backdrop-blur-sm ring-1 ring-white/10"
                  >
                    <div className="border-b border-white/10 p-4">
                      <p className="font-ui font-medium text-white">{user.displayName}</p>
                      <p className="font-ui text-xs text-gray-400">{user.email}</p>
                    </div>
                    <div className="p-1">
                      <motion.button
                        whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.1)" }}
                        className="flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-left text-gray-300 transition-colors duration-300"
                      >
                        <FaUser className="text-lg text-gray-400" />
                        <span className="font-ui text-sm">Profile</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.1)" }}
                        className="flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-left text-gray-300 transition-colors duration-300"
                      >
                        <FaCog className="text-lg text-gray-400" />
                        <span className="font-ui text-sm">Settings</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ x: 4, backgroundColor: "rgba(239,68,68,0.1)" }}
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-left text-red-500 transition-colors duration-300"
                      >
                        <FaSignOutAlt className="text-lg" />
                        <span className="font-ui text-sm">Sign Out</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
            className="rounded-md bg-gradient-to-r from-red-600 to-purple-600 px-6 py-2 font-medium text-white shadow-lg shadow-purple-600/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-600/30"
          >
            Sign In
          </motion.button>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
