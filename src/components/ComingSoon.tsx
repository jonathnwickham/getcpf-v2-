import { useEffect, useRef, useState } from "react";

const items = [
  "Digital Nomad Visa",
  "Student Visa",
  "Visa Extensions",
  "RG (Identity Card)",
  "SUS (Public Healthcare)",
  "CNH (Driver's Licence)",
  "CTPS (Work Card)",
  "Opening a Bank Account",
  "Starting a Business in Brazil",
];

const ComingSoon = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-8 bg-white border-t border-gray-100">
      <div className="max-w-[700px] mx-auto">
        <div className="text-xs uppercase tracking-[3px] text-green-800 font-bold mb-4">Coming soon</div>
        <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight">
          CPF is just the beginning
        </h2>
        <p className="text-gray-500 mt-4 max-w-[560px] text-sm leading-relaxed">
          We're building the one place anyone in Brazil goes to sort out documents, visas, and bureaucracy. Here's what's next.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item, i) => (
            <div
              key={item}
              className="flex items-center gap-3 transition-all duration-500"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : "translateX(-12px)",
                transitionDelay: visible ? `${i * 120}ms` : "0ms",
              }}
            >
              <div
                className="w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-300"
                style={{
                  borderColor: visible ? "hsl(var(--primary))" : "hsl(var(--border))",
                  backgroundColor: visible ? "hsl(var(--primary) / 0.1)" : "transparent",
                  transitionDelay: visible ? `${i * 120 + 200}ms` : "0ms",
                }}
              >
                <svg
                  className="w-3.5 h-3.5 transition-all duration-300"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "scale(1)" : "scale(0)",
                    transitionDelay: visible ? `${i * 120 + 300}ms` : "0ms",
                    color: "hsl(var(--primary))",
                  }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-900">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComingSoon;
