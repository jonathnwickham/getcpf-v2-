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
    <section className="py-24 px-8">
      <div className="max-w-[1100px] mx-auto text-center">
        <div className="text-xs uppercase tracking-[3px] text-primary font-bold mb-4">This is where it gets good</div>
        <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight">
          This is where the fun starts
        </h2>
        <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm leading-relaxed">
          You might not be Brazilian, but with a CPF you're part of it. No more asking for help, no more workarounds. 
          Brazil is the most beautiful country in the world, and we're proud to help you actually experience it.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 text-left">
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

        <p className="text-sm text-muted-foreground mt-10 max-w-md mx-auto leading-relaxed">
          Your Ready Pack includes a full "Life in Brazil" guide so you know exactly what to do after your CPF. We've got you.
        </p>
      </div>
    </section>
  );
};

export default AfterCPF;
