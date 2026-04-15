const items = [
  { icon: "🔒", text: "Your data stays private" },
  { icon: "📋", text: "Based on official government rules" },
  { icon: "🌍", text: "Works wherever you are" },
  { icon: "⚡", text: "Ready when you are" },
];

const TrustBar = () => (
  <section className="py-16 px-8 text-center border-y border-gray-100">
    <div className="flex justify-center gap-8 md:gap-12 flex-wrap">
      {items.map((item) => (
        <div key={item.text} className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <span className="text-lg">{item.icon}</span> {item.text}
        </div>
      ))}
    </div>
  </section>
);

export default TrustBar;
