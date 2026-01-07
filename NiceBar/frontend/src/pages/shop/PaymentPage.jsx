import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuth } from "../../services/AuthContext";
import { useShop } from "../../services/ShopContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { toast } from "sonner";

const stripePromise = loadStripe("pk_test_51SaLzIGxlBSq9jXCnf5BpZwAvFbHBIrHdPsOExtYwvc1wYS4LraUr29Ag3I7JYU40AtQkLbGYMcD12TJO7dZJLYJ00NA9MCwUA");

const CheckoutForm = ({ orderId, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { api } = useAuth();
  const { clearCart } = useShop();
  const navigate = useNavigate();
  
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin, 
      },
      redirect: "if_required", 
    });

    if (error) {
      setMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        await api.post("/orders/payment/confirm", {
          orderId,
          paymentIntentId: paymentIntent.id,
        });
        
        // Czyścimy koszyk tylko jeśli płatność była robiona zaraz po złożeniu zamówienia
        clearCart();
        toast.success("Płatność zaakceptowana", {
            description: "Zamówienie zostało złożone"
        });
        navigate("/profile/orders"); 
      } catch (err) {
        setMessage("Płatność przeszła w Stripe, ale wystąpił błąd zapisu w bazie.");
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-950 p-4 rounded-lg border border-slate-700">
        <PaymentElement options={{
            theme: 'night',
            variables: {
                colorPrimary: '#3b82f6',
                colorBackground: '#020617',
                colorText: '#cbd5e1',
                colorDanger: '#ef4444',
                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                spacingUnit: '4px',
                borderRadius: '8px',
            },
        }} />
      </div>
      
      {message && <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded border border-red-500/20">{message}</div>}
      
      <Button 
        disabled={isProcessing || !stripe || !elements} 
        className="w-full bg-white text-slate-950 hover:bg-slate-300 font-bold py-6"
      >
        {isProcessing ? "Przetwarzanie..." : "Zapłać teraz bezpiecznie"}
      </Button>
    </form>
  );
};

const PaymentPage = () => {
  const location = useLocation(); 
  const { api } = useAuth();
  const [clientSecret, setClientSecret] = useState("");
  const dataFetchedRef = useRef(false);

  // Pobieramy parametry z URL (?orderId=...)
  const searchParams = new URLSearchParams(location.search);
  // OrderId bierzemy albo ze "state" (przekierowanie z koszyka) albo z "URL" (link z listy zamówień)
  const orderId = location.state?.orderId || searchParams.get('orderId');
  // --------------------

  useEffect(() => {
    if (dataFetchedRef.current) return;
    
    if (!orderId) return;
    
    dataFetchedRef.current = true;

    const initiatePayment = async () => {
      try {
          const { data } = await api.post('/orders/payment/init', { orderId });
          setClientSecret(data.clientSecret);
      } catch (error) {
          console.error("Błąd inicjalizacji płatności", error);
      }
    };

    initiatePayment();
  }, [orderId, api]);

  if (!orderId) return <div className="min-h-screen bg-slate-950 text-red-500 flex items-center justify-center">Błąd: Brak numeru zamówienia.</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-16 flex justify-center items-center px-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-xl">
        <CardHeader className="text-center border-b border-slate-800 pb-6">
          <div className="mx-auto bg-slate-800 p-3 rounded-full w-fit mb-4">
            <Lock className="text-green-500" size={24} />
          </div>
          <CardTitle className="text-white text-2xl">Bezpieczna płatność</CardTitle>
          <p className="text-slate-400 text-sm mt-2">Zamówienie: <span className="font-mono text-blue-400">{orderId}</span></p>
        </CardHeader>
        <CardContent className="pt-6">
          {clientSecret ? (
            <Elements stripe={stripePromise} options={{ 
                clientSecret, 
                appearance: { theme: 'night', labels: 'floating' } 
            }}>
              <CheckoutForm orderId={orderId} clientSecret={clientSecret} />
            </Elements>
          ) : (
            <div className="text-center text-slate-400 py-10 flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                Ładowanie bramki płatności...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;