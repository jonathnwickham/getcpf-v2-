const items = [
  { icon: "🔒", text: "Data encrypted & never stored" },
  { icon: "📋", text: "Based on official Receita Federal rules" },
  { icon: "🌍", text: "Works from any country" },
  { icon: "⚡", text: "Available 24/7" },
];

const TrustBar = () => (
  <section className="py-16 px-8 text-center border-y border-border">
    <div className="flex justify-center gap-8 md:gap-12 flex-wrap">
      {items.map((item) => (
        <div key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <span className="text-lg">{item.icon}</span> {item.text}
        </div>
      ))}
    </div>
  </section>
);

export default TrustBar;
