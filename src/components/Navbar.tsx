import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, LogOut } from "lucide-react";
import Logo from "@/components/Logo";

interface NavbarProps {
  onOpenModal?: () => void;
}

const Navbar = ({ onOpenModal }: NavbarProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handlePrimaryAction = () => {
    setMobileOpen(false);
    if (user) {
      navigate("/ready-pack");
      return;
    }
    if (onOpenModal) {
      onOpenModal();
    } else {
      navigate("/pricing");
    }
  };

  const navLinks = [
    { label: "How it works", href: "/#how" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
    { label: "Guides", href: "/guides" },
    { label: "Partners", href: "/partners" },
  ];

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold">
        Skip to content
      </a>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/90 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <Logo className="h-10" />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-gray-500 text-sm hover:text-gray-900 transition-colors">
                {link.label}
              </a>
            ))}
            {!user ? (
              <Link to="/login" className="text-gray-500 text-sm hover:text-gray-900 transition-colors">
                Sign in
              </Link>
            ) : (
              <button
                onClick={signOut}
                className="text-gray-500 text-sm hover:text-gray-900 transition-colors inline-flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            )}
            <button
              onClick={handlePrimaryAction}
              className="bg-green-800 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-900 transition-colors btn-press"
            >
              {user ? "My CPF pack" : "Get started"}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-900 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-5 pb-4 pt-2 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-gray-700 text-sm py-2"
              >
                {link.label}
              </a>
            ))}
            {!user ? (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="text-gray-700 text-sm py-2">
                Sign in
              </Link>
            ) : (
              <button
                onClick={() => { setMobileOpen(false); signOut(); }}
                className="text-left text-gray-700 text-sm py-2 inline-flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            )}
            <button
              onClick={handlePrimaryAction}
              className="bg-green-800 text-white px-5 py-3 rounded-lg text-sm font-semibold w-full"
            >
              {user ? "My CPF pack" : "Get started"}
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
