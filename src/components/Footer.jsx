import { FaGithub, FaTwitter, FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";

const socialLinks = [
  { icon: FaGithub, href: "https://github.com/jorjishasan", label: "GitHub" },
  { icon: FaTwitter, href: "https://www.x.com/jorjishasan_", label: "Twitter" },
];

const SocialButton = ({ icon: Icon, href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-white transition-colors"
    aria-label={label}
  >
    <Icon className="h-5 w-5" />
  </a>
);

const Footer = () => {
  const user = useSelector((store) => store.user);

  if (!user) return null;

  return (
    <footer className="bg-zinc-950 px-4 py-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <h3 className="text-xl font-bold text-white">
              CornFlix
            </h3>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} CornFlix. All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.map((social) => (
              <SocialButton key={social.label} {...social} />
            ))}
          </div>

          {/* Credit */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            Made with <FaHeart className="text-red-500" /> by{" "}
            <a
              href="https://www.x.com/jorjishasan_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 underline"
            >
              this guy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
