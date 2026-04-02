import { lazy, Suspense, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import ProtectedRoute from "./components/ProtectedRoute";
import CookieBanner from "./components/CookieBanner";
import ScrollToTop from "./components/ScrollToTop";

// Lazy-loaded routes (not needed on initial page load)

const GetStarted = lazy(() => import("./pages/GetStarted.tsx"));
const ReadyPack = lazy(() => import("./pages/ReadyPack.tsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.tsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const PricingPage = lazy(() => import("./pages/PricingPage.tsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const TermsOfService = lazy(() => import("./pages/TermsOfService.tsx"));
const Affiliates = lazy(() => import("./pages/Affiliates.tsx"));
const Partners = lazy(() => import("./pages/Partners.tsx"));
const AffiliateApply = lazy(() => import("./pages/AffiliateApply.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const Guides = lazy(() => import("./pages/Guides.tsx"));
const GuideDetail = lazy(() => import("./pages/GuideDetail.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe.tsx"));
const CpfChecker = lazy(() => import("./pages/CpfChecker.tsx"));

const ScrollToAnchor = ({ anchor }: { anchor: string }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/", { replace: true });
    const timer = setTimeout(() => {
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [anchor, navigate]);
  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <CookieBanner />
          <ScrollToTop />
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/get-started" element={<ProtectedRoute><GetStarted /></ProtectedRoute>} />
              <Route path="/ready-pack" element={<ProtectedRoute><ReadyPack /></ProtectedRoute>} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signin" element={<Navigate to="/login" replace />} />
              <Route path="/sign-in" element={<Navigate to="/login" replace />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/sign-up" element={<Navigate to="/signup" replace />} />
              {/* Checkout.tsx removed — all checkout happens on /pricing */}
              <Route path="/checkout" element={<Navigate to="/pricing" replace />} />
              <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />
              <Route path="/terms-of-service" element={<Navigate to="/terms" replace />} />
              <Route path="/cookie-policy" element={<Navigate to="/privacy" replace />} />
              <Route path="/affiliate-disclosure" element={<Navigate to="/affiliates" replace />} />
              <Route path="/faq" element={<ScrollToAnchor anchor="faq" />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/affiliates" element={<Affiliates />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/affiliates/apply" element={<AffiliateApply />} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/guides/:slug" element={<GuideDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cpf-checker" element={<CpfChecker />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
