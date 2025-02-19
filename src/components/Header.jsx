import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaSignOutAlt, FaBell, FaUser, FaCog, FaCoins, FaTimes } from "react-icons/fa";
import CreditCounter from "./CreditCounter";

const NotificationItem = ({ icon: Icon, title, time, color = "purple" }) => (
  <div className="flex items-start gap-3 rounded-md p-2 hover:bg-white/5">
    <div className={`mt-1 rounded-full bg-${color}-500/10 p-2`}>
      <Icon className={`text-sm text-${color}-400`} />
    </div>
    <div className="flex-1">
      <p className="text-sm text-white">{title}</p>
      <p className="text-xs text-gray-400">{time}</p>
    </div>
  </div>
);

const Header = () => {
  const user = useSelector((store) => store.user);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const headerRef = useRef(null);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
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
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
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

  return (
    <motion.header
      ref={headerRef}
      style={{ 
        backdropFilter: `blur(${headerBlur}px)`,
        WebkitBackdropFilter: `blur(${headerBlur}px)`,
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`fixed z-50 w-full transition-all duration-500 ${
        isScrolled 
          ? "bg-zinc-900/95 shadow-lg" 
          : "bg-gradient-to-b from-black/80 via-black/50 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link to={user ? "/browse" : "/"}>
            <h1 className="font-display text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-purple-600 hover:from-red-500 hover:to-purple-500 transition-all duration-300">
              CORNFLIX
            </h1>
          </Link>

          {/* Navigation */}
          {user && (
            <nav className="hidden items-center gap-8 lg:flex">
              <Link to="/browse" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
                Browse
              </Link>
              <Link to="/movies" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
                Movies
              </Link>
              <Link to="/series" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
                Series
              </Link>
            </nav>
          )}
        </div>

        {/* Right Section */}
        {user ? (
          <div className="flex items-center gap-6">
            {/* Credits */}
            <CreditCounter />

            {/* Notifications */}
            <div className="relative hidden lg:block" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <FaBell className="text-lg text-gray-400 transition-colors hover:text-white" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold">
                  3
                </span>
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg bg-zinc-900/95 p-2 shadow-xl backdrop-blur-sm ring-1 ring-white/10"
                  >
                    <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2">
                      <h3 className="font-medium text-white">Notifications</h3>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white"
                      >
                        <FaTimes className="text-sm" />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <NotificationItem
                        icon={FaCoins}
                        title="You received 50 credits!"
                        time="Just now"
                        color="yellow"
                      />
                      <NotificationItem
                        icon={FaUser}
                        title="Profile updated successfully"
                        time="1 hour ago"
                      />
                      <NotificationItem
                        icon={FaCoins}
                        title="5 credits used for recommendations"
                        time="2 hours ago"
                        color="red"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
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
              </motion.button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute right-0 mt-2 w-64 origin-top-right rounded-lg bg-zinc-900/95 p-1 shadow-xl backdrop-blur-sm ring-1 ring-white/10"
                  >
                    <div className="border-b border-white/10 p-4">
                      <p className="font-medium text-white">{user.displayName}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <div className="p-1">
                      <motion.button
                        whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.1)" }}
                        className="flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-left text-gray-300 transition-colors duration-300"
                      >
                        <FaUser className="text-lg text-gray-400" />
                        <span className="text-sm">Profile</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.1)" }}
                        className="flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-left text-gray-300 transition-colors duration-300"
                      >
                        <FaCog className="text-lg text-gray-400" />
                        <span className="text-sm">Settings</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ x: 4, backgroundColor: "rgba(239,68,68,0.1)" }}
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-left text-red-500 transition-colors duration-300"
                      >
                        <FaSignOutAlt className="text-lg" />
                        <span className="text-sm">Sign Out</span>
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
