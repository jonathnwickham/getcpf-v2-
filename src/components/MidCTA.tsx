import { useNavigate } from "react-router-dom";

interface MidCTAProps {
  onOpenModal?: () => void;
  text: string;
  buttonText?: string;
}

const MidCTA = ({ onOpenModal, text, buttonText = "Get started" }: MidCTAProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onOpenModal) onOpenModal();
    else navigate("/pricing");
  };

  return (
    <section className="py-6 sm:py-8 px-5 text-center">
      <p className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">{text}</p>
      <button
        onClick={handleClick}
        className="bg-green-800 text-white px-8 py-3.5 rounded-full font-semibold text-base hover:bg-green-900 transition-all btn-press"
      >
        {buttonText}
      </button>
    </section>
  );
};

export default MidCTA;
