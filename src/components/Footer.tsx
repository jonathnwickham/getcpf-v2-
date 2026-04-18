import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { openCookiePreferences } from "@/components/CookieBanner";

const Footer = () => (
  <footer className="bg-[#0a0f0a] text-white py-20 pb-32 md:pb-20 px-5 sm:px-8 rounded-t-2xl mt-3">
    <div className="max-w-5xl mx-auto">
      {/* Footer CTA */}
      <div className="text-center mb-16 pb-16 border-b border-white/10">
        <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">Stop researching. Start preparing.</p>
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Get your CPF sorted in 5 minutes.</h3>
        <Link to="/pricing" className="mt-6 inline-flex items-center bg-white text-green-800 px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-gray-100 transition-all">
          Get started · <s className="opacity-50">$49</s> $29
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
        <div>
          <Logo className="h-8 brightness-0 invert opacity-80 mb-4" />
          <p className="text-sm text-gray-500 leading-relaxed max-w-[240px]">
            Helping foreigners get their Brazilian CPF, the easy way.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Product</h4>
          <ul className="space-y-2.5 text-sm text-gray-500">
            <li><a href="/#how" className="hover:text-white transition-colors link-underline link-underline-light">How it works</a></li>
            <li><a href="/#pricing" className="hover:text-white transition-colors link-underline link-underline-light">Pricing</a></li>
            <li><a href="/#faq" className="hover:text-white transition-colors link-underline link-underline-light">FAQ</a></li>
            <li><Link to="/guides" className="hover:text-white transition-colors link-underline link-underline-light">Guides</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">CPF Guides</h4>
          <ul className="space-y-2.5 text-sm text-gray-500">
            <li><a href="/what-is-cpf/" className="hover:text-white transition-colors link-underline link-underline-light">What is a CPF?</a></li>
            <li><a href="/cpf-documents-needed/" className="hover:text-white transition-colors link-underline link-underline-light">Documents needed</a></li>
            <li><a href="/cpf-for-americans/" className="hover:text-white transition-colors link-underline link-underline-light">CPF for Americans</a></li>
            <li><a href="/cpf-without-portuguese/" className="hover:text-white transition-colors link-underline link-underline-light">Without Portuguese</a></li>
            <li><a href="/guides/" className="hover:text-white transition-colors link-underline link-underline-light">All guides</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Company</h4>
          <ul className="space-y-2.5 text-sm text-gray-500">
            <li><Link to="/contact" className="hover:text-white transition-colors link-underline link-underline-light">Contact us</Link></li>
            <li><Link to="/partners" className="hover:text-white transition-colors link-underline link-underline-light">Become a partner</Link></li>
            <li><Link to="/affiliates/apply" className="hover:text-white transition-colors link-underline link-underline-light">Affiliate programme</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Legal</h4>
          <ul className="space-y-2.5 text-sm text-gray-500">
            <li><Link to="/privacy" className="hover:text-white transition-colors link-underline link-underline-light">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors link-underline link-underline-light">Terms of Service</Link></li>
            <li><Link to="/affiliates" className="hover:text-white transition-colors link-underline link-underline-light">Affiliate Disclosure</Link></li>
            <li><button onClick={openCookiePreferences} className="hover:text-white transition-colors text-left">Cookie preferences</button></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xs text-gray-600">© 2026 GET CPF. All rights reserved.</p>
          <p className="text-xs text-gray-600 mt-1">Data Protection Officer: jonathan@telosmedia.co</p>
        </div>
        <p className="text-xs text-gray-600 max-w-md text-center sm:text-right">Not affiliated with the Brazilian Government or Receita Federal. We provide preparation guidance only.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
