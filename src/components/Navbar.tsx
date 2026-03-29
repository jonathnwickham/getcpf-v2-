import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  onOpenModal?: () => void;
}

const Navbar = ({ onOpenModal }: NavbarProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePrimaryAction = () => {
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 flex items-center justify-between backdrop-blur-xl bg-background/90 border-b border-border">
      <a href="/" className="text-xl font-bold tracking-tight">
        cpf<span className="text-primary">easy</span>.ai
      </a>
      <div className="flex items-center gap-8">
        <a href="/#how" className="hidden md:inline text-muted-foreground text-sm font-medium hover:text-foreground transition-colors">How it works</a>
        <a href="/#pricing" className="hidden md:inline text-muted-foreground text-sm font-medium hover:text-foreground transition-colors">Pricing</a>
        <a href="/#faq" className="hidden md:inline text-muted-foreground text-sm font-medium hover:text-foreground transition-colors">FAQ</a>
        <button
          onClick={() => navigate("/login")}
          className="text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
        >
          Sign in
        </button>
        <button
          onClick={handlePrimaryAction}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-all"
        >
          {user ? "My CPF pack" : "Get started"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
