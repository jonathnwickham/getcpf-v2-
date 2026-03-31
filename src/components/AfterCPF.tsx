const AfterCPF = () => {
  return (
    <section className="py-24 px-8 relative overflow-hidden">
      {/* Subtle Brazilian flag accent */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[hsl(140,70%,40%)] via-[hsl(50,90%,55%)] to-[hsl(210,80%,45%)]" />

      <div className="max-w-[1100px] mx-auto text-center">
        <div className="text-4xl mb-6">🇧🇷</div>
        <div className="text-xs uppercase tracking-[3px] text-primary font-bold mb-4">After you've got your CPF</div>
        <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight">
          Your CPF unlocks all of these
        </h2>
        <p className="text-primary font-semibold mt-2">200+ people have used GET CPF to get theirs.</p>

        <p className="text-muted-foreground mt-6 max-w-2xl mx-auto text-[15px] leading-relaxed">
          Once you have your CPF, everything opens up. Nubank in 10 minutes, a real SIM card, iFood, Mercado Livre, QuintoAndar for rentals, Pix for payments. Your Ready Pack includes a full Life in Brazil guide that walks you through all of it.
        </p>
      </div>
    </section>
  );
};

export default AfterCPF;
