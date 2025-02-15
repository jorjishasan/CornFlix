import { motion, useScroll, useTransform } from "framer-motion";
import { 
  FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaGithub, 
  FaLinkedinIn, FaHeart, FaArrowUp, FaPlay, FaRobot, FaFilm,
  FaEnvelope, FaDiscord, FaTelegram
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useRef } from "react";

const socialLinks = [
  { icon: FaDiscord, href: "#", label: "Discord", color: "#5865F2", gradient: "from-[#5865F2] to-[#7289DA]" },
  { icon: FaGithub, href: "#", label: "GitHub", color: "#181717", gradient: "from-[#2b2b2b] to-[#181717]" },
  { icon: FaTelegram, href: "#", label: "Telegram", color: "#26A5E4", gradient: "from-[#26A5E4] to-[#0088cc]" },
  { icon: FaTwitter, href: "#", label: "Twitter", color: "#1DA1F2", gradient: "from-[#1DA1F2] to-[#0d8ecf]" },
  { icon: FaYoutube, href: "#", label: "YouTube", color: "#FF0000", gradient: "from-[#FF0000] to-[#cc0000]" },
  { icon: FaInstagram, href: "#", label: "Instagram", color: "#E4405F", gradient: "from-[#833AB4] via-[#FD1D1D] to-[#F77737]" },
];

const features = [
  { icon: FaPlay, title: "4K Streaming", description: "Ultra HD quality content" },
  { icon: FaRobot, title: "AI Powered", description: "Smart recommendations" },
  { icon: FaFilm, title: "Exclusive Content", description: "Original productions" },
];

const SocialButton = ({ icon: Icon, href, label, gradient }) => (
  <motion.a
    href={href}
    whileHover={{ scale: 1.1, y: -4 }}
    whileTap={{ scale: 0.95 }}
    className="group relative"
    aria-label={label}
  >
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${gradient} p-3 text-white shadow-lg transition-all duration-300 hover:shadow-xl`}>
      <Icon className="h-5 w-5" />
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 -translate-x-full rotate-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-transform duration-500 group-hover:translate-x-full group-hover:opacity-100"
      />
    </div>
  </motion.a>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="group relative overflow-hidden rounded-2xl bg-black/20 p-6 backdrop-blur-sm"
  >
    <div className="relative z-10 flex flex-col items-center gap-4 text-center">
      <div className="rounded-xl bg-gradient-to-r from-red-600 to-purple-600 p-3 text-white shadow-lg">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
    {/* Animated gradient background */}
    <motion.div
      className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      animate={{
        background: [
          "radial-gradient(circle at 0% 0%, rgba(220,38,38,0.15), transparent 50%)",
          "radial-gradient(circle at 100% 100%, rgba(147,51,234,0.15), transparent 50%)",
          "radial-gradient(circle at 0% 0%, rgba(220,38,38,0.15), transparent 50%)",
        ],
      }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    />
  </motion.div>
);

const NewsletterForm = () => (
  <motion.form
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600/5 via-purple-600/5 to-red-600/5 p-8 backdrop-blur-sm"
  >
    <div className="relative z-10 space-y-4">
      <h3 className="text-xl font-bold text-white">Join Our Newsletter</h3>
      <p className="text-sm text-gray-400">
        Get weekly updates on new releases, recommendations, and exclusive content.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-grow">
          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-xl bg-black/20 px-10 py-3 text-sm text-white placeholder-gray-500 backdrop-blur-sm transition-all duration-300 focus:bg-black/30 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-red-600 via-purple-600 to-red-600 bg-[length:200%] px-8 py-3 text-sm font-semibold text-white transition-all duration-500 hover:bg-[center-right] hover:shadow-lg hover:shadow-purple-600/20"
        >
          <span className="relative z-10">Subscribe</span>
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 -translate-x-full rotate-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-transform duration-500 group-hover:translate-x-full group-hover:opacity-100"
          />
        </motion.button>
      </div>
    </div>
    {/* Animated gradient border */}
    <motion.div
      className="absolute inset-0 -z-10"
      animate={{
        background: [
          "linear-gradient(45deg, rgba(220,38,38,0.1), rgba(147,51,234,0.1), rgba(220,38,38,0.1))",
          "linear-gradient(45deg, rgba(147,51,234,0.1), rgba(220,38,38,0.1), rgba(147,51,234,0.1))",
        ],
      }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    />
  </motion.form>
);

const Footer = () => {
  const user = useSelector((store) => store.user);
  const footerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);

  if (!user) return null;

  return (
    <motion.footer
      ref={footerRef}
      style={{ opacity, y }}
      className="relative overflow-hidden bg-black px-4 py-16 text-gray-300"
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, rgba(220,38,38,0.1), transparent 50%)",
            "radial-gradient(circle at 100% 100%, rgba(147,51,234,0.1), transparent 50%)",
            "radial-gradient(circle at 0% 0%, rgba(220,38,38,0.1), transparent 50%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <div className="container mx-auto max-w-7xl">
        {/* Features Section */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-8">
            <div>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-4 text-3xl font-bold text-white"
              >
                CornFlix
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-sm leading-relaxed text-gray-400"
              >
                Experience cinema like never before with our AI-powered recommendations
                and exclusive content. Join our community of movie enthusiasts and discover
                your next favorite film. Let's make movie nights magical together.
              </motion.p>
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-4"
            >
              {socialLinks.map((social) => (
                <SocialButton key={social.label} {...social} />
              ))}
            </motion.div>
          </div>

          {/* Right Column */}
          <div>
            <NewsletterForm />
          </div>
        </div>

        {/* Footer Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center md:flex-row"
        >
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} CornFlix. All rights reserved.
          </p>
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-sm text-gray-400"
          >
            Made with{" "}
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
                color: ["#ef4444", "#7c3aed", "#ef4444"],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FaHeart className="text-red-500" />
            </motion.span>{" "}
            by the CornFlix Team with{" "}
            <span className="gradient-text font-medium">passion</span>
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
