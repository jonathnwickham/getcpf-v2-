interface FinalCTAProps {
  onOpenModal: () => void;
}

const FinalCTA = ({ onOpenModal }: FinalCTAProps) => (
  <section className="py-24 px-8 text-center relative">
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,hsl(var(--accent-glow)/0.06)_0%,transparent_70%)] pointer-events-none" />
    <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-tight">
      Coming to Brazil?<br />Get your CPF sorted now.
    </h2>
    <p className="text-text-secondary mt-4 mx-auto max-w-[500px] leading-relaxed">
      Don't waste your first days in Brazil fighting bureaucracy. Get your CPF application ready before you land.
    </p>
    <button onClick={onOpenModal} className="mt-6 bg-primary text-primary-foreground px-8 py-3.5 rounded-[10px] font-semibold hover:brightness-110 hover:-translate-y-0.5 transition-all">
      Start my CPF application →
    </button>
  </section>
);

export default FinalCTA;
