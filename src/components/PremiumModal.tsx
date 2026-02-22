import { useState } from 'react';
import { X, Check, Crown, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
  language: string;
  userId: string;
}

const translations: Record<string, Record<string, string>> = {
  en: {
    premiumFeatures: 'Premium Features',
    monthlyPlan: 'Monthly - £2.99',
    yearlyPlan: 'Yearly - £26.99',
    subscribe: 'Subscribe',
    unsubscribe: 'Cancel Subscription',
    feature1: 'Advanced spending analytics',
    feature2: 'Budget forecasting',
    feature3: 'Export reports to PDF',
    feature4: 'Custom categories',
    feature5: 'Recurring expenses',
    feature6: 'Multi-currency support',
    saveUpTo: 'Save up to 43% with yearly plan',
    bestValue: 'Best Value',
    active: 'Active until',
    alreadyPremium: 'You are already a premium member',
    errorTitle: 'Payment Error',
    stripeNotConfigured: 'Stripe payment system is not configured. Please contact support.',
    invalidPrice: 'Invalid price selected. Please try again.',
    genericError: 'Failed to start checkout. Please try again later.'
  },
  pl: {
    premiumFeatures: 'Funkcje Premium',
    monthlyPlan: 'Miesięczny - £2.99',
    yearlyPlan: 'Roczny - £26.99',
    subscribe: 'Subskrybuj',
    unsubscribe: 'Anuluj subskrypcję',
    feature1: 'Zaawansowana analiza wydatków',
    feature2: 'Prognozowanie budżetu',
    feature3: 'Export raportów do PDF',
    feature4: 'Niestandardowe kategorie',
    feature5: 'Powtarzające się wydatki',
    feature6: 'Obsługa wielu walut',
    saveUpTo: 'Zaoszczędź do 43% z planem rocznym',
    bestValue: 'Najlepsza oferta',
    active: 'Aktywny do',
    alreadyPremium: 'Jesteś już członkiem premium',
    errorTitle: 'Błąd płatności',
    stripeNotConfigured: 'System płatności Stripe nie jest skonfigurowany. Skontaktuj się z pomocą techniczną.',
    invalidPrice: 'Wybrano nieprawidłową cenę. Spróbuj ponownie.',
    genericError: 'Nie udało się rozpocząć płatności. Spróbuj ponownie później.'
  },
  es: {
    premiumFeatures: 'Funciones Premium',
    monthlyPlan: 'Mensual - £2.99',
    yearlyPlan: 'Anual - £26.99',
    subscribe: 'Suscribirse',
    unsubscribe: 'Cancelar suscripción',
    feature1: 'Análisis avanzado de gastos',
    feature2: 'Pronóstico de presupuesto',
    feature3: 'Exportar informes en PDF',
    feature4: 'Categorías personalizadas',
    feature5: 'Gastos recurrentes',
    feature6: 'Soporte multimoneda',
    saveUpTo: 'Ahorra hasta 43% con plan anual',
    bestValue: 'Mejor valor',
    active: 'Activo hasta',
    alreadyPremium: 'Ya eres miembro premium',
    errorTitle: 'Error de pago',
    stripeNotConfigured: 'El sistema de pago Stripe no está configurado. Contacte con soporte.',
    invalidPrice: 'Precio seleccionado no válido. Inténtalo de nuevo.',
    genericError: 'No se pudo iniciar el pago. Inténtalo más tarde.'
  },
  fr: {
    premiumFeatures: 'Fonctionnalités Premium',
    monthlyPlan: 'Mensuel - £2.99',
    yearlyPlan: 'Annuel - £26.99',
    subscribe: 'S\'abonner',
    unsubscribe: 'Annuler l\'abonnement',
    feature1: 'Analyse avancée des dépenses',
    feature2: 'Prévision budgétaire',
    feature3: 'Exporter rapports en PDF',
    feature4: 'Catégories personnalisées',
    feature5: 'Dépenses récurrentes',
    feature6: 'Support multidevises',
    saveUpTo: 'Économisez jusqu\'à 43% avec le plan annuel',
    bestValue: 'Meilleure valeur',
    active: 'Actif jusqu\'au',
    alreadyPremium: 'Vous êtes déjà un membre premium',
    errorTitle: 'Erreur de paiement',
    stripeNotConfigured: 'Le système de paiement Stripe n\'est pas configuré. Contactez le support.',
    invalidPrice: 'Prix sélectionné invalide. Veuillez réessayer.',
    genericError: 'Impossible de démarrer le paiement. Réessayez plus tard.'
  },
  de: {
    premiumFeatures: 'Premium-Funktionen',
    monthlyPlan: 'Monatlich - £2.99',
    yearlyPlan: 'Jährlich - £26.99',
    subscribe: 'Abonnieren',
    unsubscribe: 'Abonnement kündigen',
    feature1: 'Erweiterte Ausgabenanalyse',
    feature2: 'Budgetprognose',
    feature3: 'Berichte als PDF exportieren',
    feature4: 'Benutzerdefinierte Kategorien',
    feature5: 'Wiederkehrende Ausgaben',
    feature6: 'Multi-Währungsunterstützung',
    saveUpTo: 'Sparen Sie bis zu 43% mit Jahresplan',
    bestValue: 'Bestes Angebot',
    active: 'Aktiv bis',
    alreadyPremium: 'Sie sind bereits Premium-Mitglied',
    errorTitle: 'Zahlungsfehler',
    stripeNotConfigured: 'Das Stripe-Zahlungssystem ist nicht konfiguriert. Kontaktieren Sie den Support.',
    invalidPrice: 'Ungültiger Preis ausgewählt. Bitte versuchen Sie es erneut.',
    genericError: 'Checkout konnte nicht gestartet werden. Bitte versuchen Sie es später erneut.'
  }
};

const features = [
  'feature1',
  'feature2',
  'feature3',
  'feature4',
  'feature5',
  'feature6'
];

export default function PremiumModal({
  isOpen,
  onClose,
  isPremium,
  language,
  userId
}: PremiumModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = translations[language] || translations.en;
const handleSubscribe = async (planType: 'monthly' | 'yearly') => {
  setLoading(true);
  setError(null);

  const priceIds = {
    monthly: import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID,
    yearly: import.meta.env.VITE_STRIPE_YEARLY_PRICE_ID,
  };

  try {
    // 1) Bierzemy sesję (token)
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    console.log('=== FRONTEND START ===');
    console.log('SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('Session error:', sessionError);
    console.log('Session:', session);

    if (!session?.access_token) {
      throw new Error('Not authenticated');
    }

    // 2) Bierzemy usera NA ŚWIEŻO (pewniejsze niż session.user)
    const { data: userData, error: userError } = await supabase.auth.getUser();

    console.log('User error:', userError);
    console.log('User:', userData?.user);

    const freshUserId = userData?.user?.id;

    if (!freshUserId) {
      console.error('No userId – user not logged in');
      setError(t.genericError);
      return;
    }

    // 3) PriceId z ENV (frontend)
    const priceId = priceIds[planType];

    if (!priceId) {
      setError(t.invalidPrice);
      console.error('Price ID not configured for plan:', planType);
      return;
    }

    // 4) Wywołanie Edge Function (Supabase)
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`;

    const payload = {
      userId: freshUserId,
      priceId,
      successUrl: `${window.location.origin}?checkout=success`,
      cancelUrl: `${window.location.origin}?checkout=cancel`,
      plan: planType, // jeśli backend ignoruje — nie szkodzi
    };

    console.log('Starting checkout for plan:', planType);
    console.log('Calling URL:', url);
    console.log('BODY TO SEND:', payload);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const responseText = await response.text();
    console.log('Response body (raw):', responseText);

    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      data = { error: 'Invalid response from server' };
    }

    console.log('Checkout response:', { status: response.status, data });

    if (!response.ok) {
      if (data.details === 'STRIPE_SECRET_KEY environment variable is missing') {
        setError(t.stripeNotConfigured);
      } else if (data.error) {
        setError(data.error);
      } else {
        setError(t.genericError);
      }
      console.error('Checkout error:', data);
      return;
    }

    // edge function w moim kodzie zwraca { id, url } albo { sessionId, url }
    const checkoutUrl = data.url;

    if (!checkoutUrl) {
      setError(t.genericError);
      console.error('No checkout URL returned:', data);
      return;
    }

    window.location.href = checkoutUrl;
  } catch (err) {
    console.error('Subscription error:', err);
    setError(t.genericError);
  } finally {
    setLoading(false);
  }
};
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Crown className="text-yellow-500" size={28} />
            {t.premiumFeatures}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {isPremium && (
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
              <p className="text-green-700 font-semibold">{t.alreadyPremium}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-red-800 font-semibold">{t.errorTitle}</p>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-slate-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">{t.monthlyPlan}</h3>
              <button
                onClick={() => handleSubscribe('monthly')}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50 mb-6"
              >
                {loading ? 'Processing...' : t.subscribe}
              </button>
            </div>

            <div className="border-2 border-yellow-400 rounded-2xl p-6 bg-yellow-50 relative">
              <div className="absolute -top-3 right-6 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                {t.bestValue}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">{t.yearlyPlan}</h3>
              <p className="text-sm text-slate-600 mb-4">{t.saveUpTo}</p>
              <button
                onClick={() => handleSubscribe('yearly')}
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? 'Processing...' : t.subscribe}
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-3">Included Features:</h4>
            <div className="space-y-2">
              {features.map(feature => (
                <div key={feature} className="flex items-center gap-3">
                  <Check className="text-green-600 flex-shrink-0" size={20} />
                  <p className="text-slate-700">{t[feature]}</p>
                </div>
              ))}
            </div>
          </div>

          {isPremium && (
            <button
              onClick={handleUnsubscribe}
              disabled={loading}
              className="w-full py-3 border-2 border-red-300 text-red-600 rounded-xl font-bold hover:bg-red-50 transition disabled:opacity-50"
            >
              {t.unsubscribe}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
