import { useNavigate } from "react-router-dom";
import protocolImg from "@/assets/protocol-preview.png";

const ProductPreview = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-5xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-12">
          This is what you walk in with
        </h2>

        {/* Document mockup */}
        <div className="flex justify-center mb-10">
          <div className="relative">
            <div
              className="rounded-lg overflow-hidden shadow-2xl border border-border bg-white"
              style={{ transform: "rotate(3deg)", maxWidth: 480 }}
            >
              <img
                src={protocolImg}
                alt="CPF application protocol from Receita Federal — the official document you bring to the office"
                className="w-full h-auto"
                loading="lazy"
              />
              {/* Overlay "Your Name Here" on the Nome field */}
              <div
                className="absolute text-[11px] md:text-sm font-semibold text-blue-900 pointer-events-none"
                style={{
                  top: "12.5%",
                  left: "30%",
                  transform: "rotate(0deg)",
                }}
              >
                Your Name Here
              </div>
            </div>
          </div>
        </div>

        {/* Three callout items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <CalloutItem
            text="Your reference number — proof your application was submitted correctly"
          />
          <CalloutItem
            text="Valid for 90 days — plenty of time to visit the office"
          />
          <CalloutItem
            text="In Portuguese — we translate everything so you know exactly what to bring"
          />
        </div>

        {/* Muted line */}
        <p className="text-center text-sm text-muted-foreground italic mb-8">
          Generated from the official Receita Federal system. Accepted at every office in Brazil.
        </p>

        {/* CTA */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/pricing")}
            className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-base hover:opacity-90 transition-all shadow-lg"
          >
            Get my Ready Pack — $49 →
          </button>
        </div>
      </div>
    </section>
  );
};

const CalloutItem = ({ text }: { text: string }) => (
  <div className="flex items-start gap-3">
    <span className="text-green-500 text-xl mt-0.5 shrink-0">✓</span>
    <p className="text-sm text-foreground font-medium">{text}</p>
  </div>
);

export default ProductPreview;
