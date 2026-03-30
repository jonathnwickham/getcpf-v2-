import { UtensilsCrossed, CreditCard, Smartphone, Home, ShoppingCart, Package } from "lucide-react";

const cards = [
  {
    icon: UtensilsCrossed,
    title: "Order food from anywhere",
    desc: "iFood, Rappi, 99Food. No more asking someone at the hostel to order for you. Your CPF, your account, your coxinha at 2 AM.",
  },
  {
    icon: CreditCard,
    title: "Open a bank account in minutes",
    desc: "Nubank, Inter, C6. Walk in, scan your CPF, walk out with a debit card and Pix. You're part of the system now.",
  },
  {
    icon: Smartphone,
    title: "Get a proper phone plan",
    desc: "No more tourist SIMs that expire. Claro, Vivo, TIM. A real plan, with real data, that actually works.",
  },
  {
    icon: Home,
    title: "Find your own place",
    desc: "QuintoAndar, ZAP Imóveis, OLX. Sign a lease, set up utilities, make Brazil feel like home.",
  },
  {
    icon: ShoppingCart,
    title: "Shop online like a local",
    desc: "Amazon Brazil, Mercado Livre, Shopee. No more blocked checkouts. Just add to cart and go.",
  },
  {
    icon: Package,
    title: "Send and receive packages",
    desc: "Correios, Jadlog, domestic shipping. No more borrowing someone else's CPF to send a parcel.",
  },
];

const AfterCPF = () => {
  return (
    <section className="py-24 px-8 relative overflow-hidden">
      {/* Subtle Brazilian flag accent */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[hsl(140,70%,40%)] via-[hsl(50,90%,55%)] to-[hsl(210,80%,45%)]" />

      <div className="max-w-[1100px] mx-auto text-center">
        <div className="text-4xl mb-6">🇧🇷</div>
        <div className="text-xs uppercase tracking-[3px] text-primary font-bold mb-4">After you've got your CPF</div>
        <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight">
          This is where the fun starts
        </h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-[15px] leading-relaxed">
          You might not be Brazilian, but with a CPF you're part of it. No more asking for help at the checkout. 
          No more borrowing someone's number to order food. No more workarounds. You just... do things. Like everyone else.
        </p>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-[15px] leading-relaxed">
          Brazil is the most beautiful country in the world, and we're so proud to help you actually experience it. 
          Not as a tourist figuring things out, but as someone who belongs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14 text-left">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-primary/5 border border-primary/10 rounded-2xl p-8 max-w-2xl mx-auto">
          <p className="text-sm leading-relaxed text-foreground">
            Your Ready Pack includes a full <span className="font-semibold text-primary">"Life in Brazil"</span> guide. 
            Once you have your CPF, we walk you through everything: setting up Pix, getting a phone plan, 
            opening a bank account, finding an apartment. You don't need to figure it out alone. We've got you. 🇧🇷
          </p>
        </div>
      </div>
    </section>
  );
};

export default AfterCPF;
