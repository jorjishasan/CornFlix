import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleAiSearch } from "../redux/aiSearchSlice";
import { Link } from "react-router-dom";
import { 
  FaRobot, FaSignOutAlt, FaCog, FaChevronDown,
  FaFilm, FaUser
} from "react-icons/fa";

const QuickActions = () => (
  <div className="hidden items-center gap-4 lg:flex">
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="btn-secondary hover-lift"
    >
      <FaFilm className="text-xs" />
      <span>Browse</span>
    </motion.button>
  </div>
);

const Header = () => {
  const user = useSelector((store) => store.user);
  const showAiSearchComponent = useSelector((store) => store.aiSearch.showAiSearch);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const headerRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.98]);
  const headerBlur = useTransform(scrollYProgress, [0, 0.2], [0, 8]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      className={`fixed z-50 w-full transition-all duration-500 ${
        isScrolled 
          ? "bg-zinc-900/95" 
          : "bg-gradient-to-b from-black/80 via-black/50 to-transparent"
      }`}
    >
      <div className="header-gradient" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to={user ? "/browse" : "/"}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <h1 className="font-display text-2xl font-bold tracking-wider text-theme-accent">
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
            {/* AI Search CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => dispatch(toggleAiSearch())}
              className={`flex items-center gap-2 rounded-sm px-4 py-1.5 transition-all duration-300 ${
                showAiSearchComponent
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <FaRobot className="text-lg" />
              <span className="hidden font-ui text-sm font-medium md:inline">
                AI Movie Search
              </span>
            </motion.button>

            {/* User Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setShowDropdown(!showDropdown)}
                className="group flex items-center gap-2 rounded-sm p-0.5 hover:ring-2 hover:ring-white/20"
              >
                <img
                  className="h-8 w-8 rounded-sm object-cover"
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="dropdown-menu netflix-shadow"
                  >
                    <div className="dropdown-header">
                      <p className="font-ui font-medium text-white">{user.displayName}</p>
                      <p className="font-ui text-xs text-gray-400">{user.email}</p>
                    </div>
                    <div className="p-1">
                      <motion.button
                        whileHover={{ x: 4 }}
                        className="dropdown-item"
                      >
                        <FaUser className="text-lg" />
                        <span className="font-ui">Profile</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ x: 4 }}
                        className="dropdown-item"
                      >
                        <FaCog className="text-lg" />
                        <span className="font-ui">Settings</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={handleSignOut}
                        className="dropdown-item text-red-500 hover:text-red-400"
                      >
                        <FaSignOutAlt className="text-lg" />
                        <span className="font-ui">Sign Out</span>
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
            className="btn-primary hover-lift"
          >
            <span>Sign In</span>
          </motion.button>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
