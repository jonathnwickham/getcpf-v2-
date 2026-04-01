import logoImg from "@/assets/logo.svg";

const Logo = ({ className = "h-8" }: { className?: string }) => (
  <img
    src={logoImg}
    alt="GET CPF"
    className={className}
    style={{ objectFit: "contain" }}
  />
);

export default Logo;
