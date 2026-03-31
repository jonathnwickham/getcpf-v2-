import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.svg";

interface NavbarProps {
  onOpenModal?: () => void;
}

const Navbar = ({ onOpenModal }: NavbarProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 backdrop-blur-xl bg-background/90 border-b border-border">
      <div className="flex items-center justify-between">
        <a href="/" className="flex items-center">
          <img src={logo} alt="GET CPF" className="h-10" />
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-muted-foreground text-sm font-medium hover:text-foreground transition-colors">
              {link.label}
            </a>
          ))}
          {!user && (
            <button
              onClick={() => navigate("/login")}
              className="text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
            >
              Sign in
            </button>
          )}
          <button
            onClick={handlePrimaryAction}
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-all"
          >
            {user ? "My CPF pack" : "Get started"}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-border pt-4 flex flex-col gap-4 animate-fade-up">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-foreground text-sm font-medium hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          {!user && (
            <button
              onClick={() => { setMobileOpen(false); navigate("/login"); }}
              className="text-left text-foreground text-sm font-medium hover:text-primary transition-colors"
            >
              Sign in
            </button>
          )}
          <button
            onClick={handlePrimaryAction}
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-all w-full"
          >
            {user ? "My CPF pack" : "Get started"}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
