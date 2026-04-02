import { useNavigate } from "react-router-dom";

interface MidCTAProps {
  onOpenModal?: () => void;
  text: string;
  buttonText?: string;
}

const MidCTA = ({ onOpenModal, text, buttonText = "Get started →" }: MidCTAProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onOpenModal) onOpenModal();
    else navigate("/pricing");
  };

  return (
    <section className="py-10 md:py-14 px-6 text-center bg-primary/[0.03] border-y border-border/30">
      <div className="max-w-[600px] mx-auto">
        <p className="text-lg md:text-xl font-semibold text-foreground mb-5">{text}</p>
        <button
          onClick={handleClick}
          className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold text-base hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          {buttonText}
        </button>
      </div>
    </section>
  );
};

export default MidCTA;
