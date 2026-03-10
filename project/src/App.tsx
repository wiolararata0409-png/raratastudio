import { useEffect, useState } from 'react';
import { Logout, Crown } from 'lucide-react'
import Auth from './components/Auth';
import BudgetTracker from './components/BudgetTracker';
import ExpenseForm from './components/ExpenseForm';
import PremiumModal from './components/PremiumModal';
import { supabase } from './lib/supabaseClient';
const path = window.location.pathname;
type Language = 'en' | 'pl' | 'es' | 'fr' | 'de';
function PrivacyPolicyPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", lineHeight: 1.6 }}>
      <h1>Privacy Policy</h1>
      <p>Last updated: 7 March 2026</p>
      <p>This app collects basic account data, expense records, notes, and receipt images to provide the service.</p>
      <p>Payments are securely processed by Stripe. We do not store full card details.</p>
      <p>Data may be processed by trusted providers such as Supabase, Stripe, and Netlify.</p>
      <p>If you want to access, correct, or delete your data, contact us at: info@raratastudio.com</p>
    </div>
  );
}


const translations: Record<Language, Record<string, string>> = {
  en: {
    title: 'Budget Tracker',
    logout: 'Logout',
    settings: 'Settings',
    premium: 'Premium',
    addExpense: 'Add Expense',
    dailyBudget: 'Daily Budget',
    spent: 'Spent',
    remaining: 'Remaining',
    warning: 'Budget Limit Alert!',
    youveExceeded: 'You have exceeded your daily budget',
    setPremium: 'Unlock Premium Features',
    features: 'Premium Features',
    monthlyPlan: 'Monthly - £2.99',
    yearlyPlan: 'Yearly - £26.99'
  },
  pl: {
    title: 'Tracker Budżetu',
    logout: 'Wyloguj',
    settings: 'Ustawienia',
    premium: 'Premium',
    addExpense: 'Dodaj wydatek',
    dailyBudget: 'Dzienny budżet',
    spent: 'Wydano',
    remaining: 'Pozostało',
    warning: 'Alert Przekroczenia Budżetu!',
    youveExceeded: 'Przekroczyłeś swój dzienny budżet',
    setPremium: 'Odblokuj funkcje Premium',
    features: 'Funkcje Premium',
    monthlyPlan: 'Miesięczny - £2.99',
    yearlyPlan: 'Roczny - £26.99'
  },
  es: {
    title: 'Rastreador de Presupuesto',
    logout: 'Cerrar sesión',
    settings: 'Configuración',
    premium: 'Premium',
    addExpense: 'Agregar gasto',
    dailyBudget: 'Presupuesto diario',
    spent: 'Gastado',
    remaining: 'Restante',
    warning: 'Alerta de Límite de Presupuesto',
    youveExceeded: 'Has excedido tu presupuesto diario',
    setPremium: 'Desbloquear funciones Premium',
    features: 'Funciones Premium',
    monthlyPlan: 'Mensual - £2.99',
    yearlyPlan: 'Anual - £26.99'
  },
  fr: {
    title: 'Suivi du Budget',
    logout: 'Se déconnecter',
    settings: 'Paramètres',
    premium: 'Premium',
    addExpense: 'Ajouter une dépense',
    dailyBudget: 'Budget quotidien',
    spent: 'Dépensé',
    remaining: 'Restant',
    warning: 'Alerte de Dépassement!',
    youveExceeded: 'Vous avez dépassé votre budget quotidien',
    setPremium: 'Débloquer les fonctionnalités Premium',
    features: 'Fonctionnalités Premium',
    monthlyPlan: 'Mensuel - £2.99',
    yearlyPlan: 'Annuel - £26.99'
  },
  de: {
    title: 'Budget-Tracker',
    logout: 'Abmelden',
    settings: 'Einstellungen',
    premium: 'Premium',
    addExpense: 'Ausgabe hinzufügen',
    dailyBudget: 'Tagesbudget',
    spent: 'Ausgegeben',
    remaining: 'Verbleibend',
    warning: 'Budget-Warnung!',
    youveExceeded: 'Du hast dein Tagesbudget überschritten',
    setPremium: 'Premium-Funktionen freischalten',
    features: 'Premium-Funktionen',
    monthlyPlan: 'Monatlich - £2.99',
    yearlyPlan: 'Jährlich - £26.99'
  }
};
function TermsPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", lineHeight: 1.6 }}>
      <h1>Terms of Service</h1>
      <p>Last updated: 7 March 2026</p>
      <p>By using Budget Tracker, you agree to use the service responsibly.</p>
      <p>The app helps users track personal budgets and expenses.</p>
      <p>Premium features may require a paid subscription processed by Stripe.</p>
      <p>We may update these terms from time to time.</p>
    </div>
  );
}
function App() {
  if (path === "/privacy-policy") return <PrivacyPolicyPage />;
if (path === "/terms") return <TermsPage />;
  const [user, setUser] = useState<any>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [showPremium, setShowPremium] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
const [refreshKey, setRefreshKey] = useState(0);
const FREE_LIMIT = 50;
  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
  }, []);

  useEffect(() => {
    if (user) {
      checkPremiumStatus();
    }
  }, [user]);

  const checkPremiumStatus = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('subscriptions')
      .select('is_active, expires_at')
      .eq('user_id', user.id)
      .maybeSingle();

    setIsPremium(data?.is_active && (!data.expires_at || new Date(data.expires_at) > new Date()));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const t = translations[language];

 if (!user) {
  if (path === "/login") {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center px-6 text-center">
    <h1 className="text-5xl leading-tight font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
        Budget Tracker
      </h1>

      <p className="text-lg text-slate-600 mb-3 max-w-xl">
        Track your daily expenses in seconds.
Simple budget tracker for everyday spending.
      </p>
<p className="text-sm text-slate-500 mb-8">
  Free plan available. Premium unlocks statistics.
</p>
      <div className="flex gap-4 mb-10">
        <a
          href="/login"
         className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition"
        >
          Start tracking
        </a>

        <a
          href="/login"
          className="px-6 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50"
        >
          Login
        </a>
      </div>

      <div className="grid gap-3 text-slate-700 max-w-md">
        <div>✓ Quick expense logging</div>
        <div>✓ Spending statistics</div>
        <div>✓ CSV export</div>
        <div>✓ Multiple currencies</div>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">{t.title}</h1>
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="text-sm px-2 py-1 border border-slate-300 rounded-lg bg-white"
            >
              <option value="en">EN</option>
              <option value="pl">PL</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
              <option value="de">DE</option>
            </select>
            <button
              onClick={() => setShowPremium(true)}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
              title={t.premium}
            >
             <Crown className={isPremium ? 'text-yellow-500' : 'text-slate-400'} size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
              title={t.logout}
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        <div className="space-y-6">
          <BudgetTracker userId={user.id} language={language} refreshKey={refreshKey} />

          {!isPremium && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 text-center">
             <Crown className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <p className="text-slate-700 font-semibold mb-3">{t.setPremium}</p>
              <button
                onClick={() => setShowPremium(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
              >
                {t.premium}
              </button>
            </div>
          )}

<ExpenseForm
  userId={user.id}
  language={language}
  onSuccess={() => setRefreshKey((k) => k + 1)}
  isPremium={isPremium}
  setShowPremium={setShowPremium}
  freeLimit={FREE_LIMIT}
/>
        </div>
      </main>

      {showPremium && (
        <PremiumModal
          isOpen={showPremium}
          onClose={() => setShowPremium(false)}
          isPremium={isPremium}
          language={language}
          userId={user.id}
        />
)}

<footer style={{
  textAlign: "center",
  marginTop: "40px",
  padding: "20px",
  fontSize: "14px",
  color: "#94a3b8"
}}>
 <a href="/privacy-policy">Privacy Policy</a>
  {" | "}
  <a href="/terms">Terms of Service</a>
</footer>

</div>
);
}

export default App;
