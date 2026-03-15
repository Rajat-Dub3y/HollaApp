import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "./pages/home";
import NotFound from "./pages/not-found";
import Subscribe from "./pages/subscribe";
import SubscribePremiumPlus from "./pages/subscribe-premium-plus";
import NoOAuthSubscribe from "./pages/no-oauth-subscribe";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import About from "./pages/about";
import Help from "./pages/help";
import Contact from "./pages/contact";
import HowItWorks from "./pages/how-it-works";
import Login from "./pages/login";
import SuccessStories from "./pages/success-stories";
import Report from "./pages/report";
import Guidelines from "./pages/guidelines";
import WelcomePremium from "./pages/welcome-premium";
import Feedback from "./pages/feedback";
import RefundPolicy from "./pages/refund-policy";
import PremiumCheckout from "./pages/premium-checkout";
import PaymentTest from "./pages/payment-test";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/subscribe" component={NoOAuthSubscribe} />
      <Route path="/no-oauth-subscribe" component={NoOAuthSubscribe} />
      <Route path="/subscribe-oauth" component={Subscribe} />
      <Route path="/subscribe-premium-plus" component={SubscribePremiumPlus} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/about" component={About} />
      <Route path="/help" component={Help} />
      <Route path="/contact" component={Contact} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/success-stories" component={SuccessStories} />
      <Route path="/report" component={Report} />
      <Route path="/guidelines" component={Guidelines} />
      <Route path="/welcome-premium" component={WelcomePremium} />
      <Route path="/feedback" component={Feedback} />
      <Route path="/refund-policy" component={RefundPolicy} />
      <Route path="/premium-checkout" component={PremiumCheckout} />
      <Route path="/payment-test" component={PaymentTest} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div>
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
