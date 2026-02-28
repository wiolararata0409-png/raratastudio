import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Jeśli masz lucide-react w projekcie – OK. Jak nie, usuń import i ikonki.
import { Check, Crown, AlertCircle } from "lucide-react";

type PlanType = "monthly" | "yearly";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
  language: string;
  userId?: string; // opcjonalnie, ale i tak pobieramy świeżo z Supabase
}

const translations: Record<string, any> = {
  en: {
    title: "Premium Features",
    subscribe: "Subscribe",
    processing: "Processing...",
    bestValue: "Best Value",
    saveUpTo: "Save up to 43% with yearly plan",
    paymentError: "Payment Error",
    missingUser: "You must be logged in to subscribe.",
    genericError: "Checkout could not be started. Please try again.",
    invalidPrice: "Invalid price selected. Please try again.",
    included: "Included Features",
    unsubscribe: "Unsubscribe",
  },
  pl: {
    title: "Funkcje Premium",
    subscribe: "Subskrybuj",
    processing: "Przetwarzanie...",
    bestValue: "Najlepsza opcja",
    saveUpTo: "Oszczędź do 43% z planem rocznym",
    paymentError: "Błąd płatności",
    missingUser: "Musisz być zalogowana/y, aby wykupić subskrypcję.",
    genericError: "Nie udało się uruchomić płatności. Spróbuj ponownie.",
    invalidPrice: "Nieprawidłowa cena. Spróbuj ponownie.",
    included: "W pakiecie",
    unsubscribe: "Anuluj subskrypcję",
  },
};

const features = ["feature1", "feature2", "feature3", "feature4"];

export default function PremiumModal({
  isOpen,
  onClose,
  isPremium,
  language,
  userId: userIdFromProps,
}: PremiumModalProps) {
  const t = useMemo(() => translations[language] || translations.en, [language]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Upewnij się, że modal resetuje błąd po otwarciu
  useEffect(() => {
    if (isOpen) setError(null);
  }, [isOpen]);

  // Stripe priceId z ENV (Vite)
  const priceIds = useMemo(
    () => ({
      monthly: import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID as string | undefined,
      yearly: import.meta.env.VITE_STRIPE_YEARLY_PRICE_ID as string | undefined,
    }),
    []
  );

  const handleSubscribe = async (planType: PlanType) => {
    try {
      setLoading(true);
      setError(null);

      const priceId = planType === "yearly" ? priceIds.yearly : priceIds.monthly;

      if (!priceId) {
        console.error("Price ID not configured for plan:", planType);
        setError(t.invalidPrice);
        setLoading(false);
        return;
      }

      // 1) Pobierz sesję
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) console.error("getSession error:", sessionError);

      const session = sessionData?.session || null;

      // 2) Pobierz usera NA ŚWIEŻO (pewniejsze niż propsy)
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) console.error("getUser error:", userError);

      const freshUserId =
        userData?.user?.id ||
        session?.user?.id ||
        userIdFromProps ||
        null;

      console.log("SESSION:", session);
      console.log("USER FROM getUser:", userData?.user);
      console.log("freshUserId:", freshUserId);

      if (!freshUserId) {
        setError(t.missingUser);
        setLoading(false);
        return;
      }

      // 3) Edge Function URL
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`;

      const payload = {
        userId: freshUserId, // ✅ KLUCZOWE: to rozwiązuje "Missing userId"
        plan: planType,
        priceId,
        successUrl: `${window.location.origin}?checkout=success`,
        cancelUrl: `${window.location.origin}?checkout=cancel`,
      };

      console.log("Starting checkout for plan:", planType, "with priceId:", priceId);
      console.log("Calling URL:", url);
      console.log("PAYLOAD:", payload);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token || ""}`,
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
        },
        body: JSON.stringify(payload),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch (e) {
        // jeśli backend nie zwróci JSON
        data = null;
      }

      console.log("Checkout response:", { status: response.status, data });

      if (!response.ok) {
        const backendMessage =
          data?.error || data?.message || data?.details || t.genericError;

        // Najczęstsze: Missing userId / Missing STRIPE_SECRET_KEY itd.
        setError(typeof backendMessage === "string" ? backendMessage : t.genericError);
        setLoading(false);
        return;
      }

      // Zakładamy, że edge function zwraca np. { url: "https://checkout.stripe.com/..." }
      const checkoutUrl = data?.url;
      if (!checkoutUrl) {
        setError(t.genericError);
        setLoading(false);
        return;
      }

      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(t.genericError);
      setLoading(false);
    }
  };

  // Jeśli masz endpoint do anulowania subskrypcji, tu podepniesz
const handleUnsubscribe = async () => {
  try {
    setLoading(true);

    const response = await fetch("/.netlify/functions/create-portal-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Failed to open billing portal.");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  } finally {
    setLoading(false);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-500 hover:text-slate-800"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Crown className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-bold text-slate-900">{t.title}</h2>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <div>
                <div className="font-semibold">{t.paymentError}</div>
                <div className="text-sm">{error}</div>
              </div>
            </div>
          </div>
        )}
        {!isPremium && (

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* MONTHLY */}
          <div className="border-2 border-slate-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              Monthly - £2.99
            </h3>

            <button
              onClick={() => handleSubscribe("monthly")}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? t.processing : t.subscribe}
            </button>
          </div>

          {/* YEARLY */}
          <div className="border-2 border-yellow-400 rounded-2xl p-6 bg-yellow-50 relative">
            <div className="absolute -top-3 right-6 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
              {t.bestValue}
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-1">
              Yearly - £26.99
            </h3>
            <p className="text-sm text-slate-600 mb-3">{t.saveUpTo}</p>

            <button
              onClick={() => handleSubscribe("yearly")}
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? t.processing : t.subscribe}
            </button>
          </div>
        </div>
      )}

        <div className="mt-6">
          <div className="font-semibold text-slate-800 mb-2">{t.included}</div>
          <div className="space-y-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <p className="text-slate-700">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {isPremium && (
          <div className="mt-6">
            <button
              onClick={handleUnsubscribe}
              disabled={loading}
              className="w-full py-3 rounded-xl border-2 border-red-300 text-red-700 font-bold disabled:opacity-50"
            >
              {t.unsubscribe}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
