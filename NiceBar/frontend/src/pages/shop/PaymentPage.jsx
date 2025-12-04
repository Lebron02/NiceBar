import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuth } from "../../services/AuthContext";
import { useShop } from "../../services/ShopContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        
        clearCart();
        alert("Płatność udana!");
        navigate("/"); 
      } catch (err) {
        setMessage("Płatność przeszła w Stripe, ale błąd zapisu w bazie.");
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {message && <div className="text-red-500 text-sm">{message}</div>}
      
      <Button 
        disabled={isProcessing || !stripe || !elements} 
        className="w-full mt-4"
      >
        {isProcessing ? "Przetwarzanie..." : "Zapłać teraz"}
      </Button>
    </form>
  );
};

const PaymentPage = () => {
  const { state } = useLocation(); 
  const { api } = useAuth();
  const [clientSecret, setClientSecret] = useState("");
  const dataFetchedRef = useRef(false);
  const orderId = state?.orderId;

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    if (!orderId) return;

    const initiatePayment = async () => {
      try {
          const { data } = await api.post('/orders/payment/init', { orderId });
          setClientSecret(data.clientSecret);
      } catch (error) {
          console.error("Błąd inicjalizacji płatności", error);
      }
    };

    if (orderId) {
        initiatePayment();
    }
  }, [orderId, api]);

  if (!orderId) return <div>Błąd: Brak numeru zamówienia.</div>;

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Płatność bezpieczna</CardTitle>
        </CardHeader>
        <CardContent>
          {clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm orderId={orderId} clientSecret={clientSecret} />
            </Elements>
          ) : (
            <div>Ładowanie bramki płatności...</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;