import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="py-16 px-8 border-t border-border bg-card">
    <div className="max-w-5xl mx-auto">
      {/* Top section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        {/* Brand */}
        <div>
          <div className="text-xl font-bold tracking-tight mb-3">
            GET <span className="text-primary">CPF</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
            Helping foreigners get their Brazilian CPF — the easy way. We handle the preparation so you just show up.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Quick links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/#how-it-works" className="hover:text-foreground transition-colors">How it works</a></li>
            <li><a href="/#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
            <li><a href="/#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
            <li><Link to="/login" className="hover:text-foreground transition-colors">Sign in</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            <li><a href="mailto:support@getcpf.com" className="hover:text-foreground transition-colors">Contact us</a></li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border pt-8">
        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground leading-relaxed max-w-[700px] mx-auto text-center">
          CPF Easy AI is a private consulting service and is not affiliated with the Brazilian Government or Receita Federal. We provide guidance to help foreigners navigate the official CPF registration process. We do not issue CPF numbers — only Receita Federal can do that. The CPF registration itself is free. Some partner links on this site are affiliate links — we may earn a small commission at no extra cost to you.
        </p>
        <p className="text-xs text-muted-foreground mt-4 text-center">© 2026 CPF Easy AI. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
