import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Settings } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

interface BudgetTrackerProps {
  userId: string;
  language: string;
  refreshKey: number;
}
// ✅ currency by language
const currencyByLang: Record<string, { code: string; locale: string }> = {
  pl: { code: "PLN", locale: "pl-PL" },
  en: { code: "GBP", locale: "en-GB" },
  es: { code: "EUR", locale: "es-ES" },
  fr: { code: "EUR", locale: "fr-FR" },
  de: { code: "EUR", locale: "de-DE" },
};

const getCurrency = (language: string) => currencyByLang[language] || currencyByLang.en;

const formatMoney = (value: number, language: string) => {
  const { code, locale } = getCurrency(language);
  return new Intl.NumberFormat(locale, { style: "currency", currency: code }).format(value);
};
const translations: Record<string, Record<string, string>> = {
  en: {
    dailyBudget: "Daily Budget",
    spent: "Spent",
    remaining: "Remaining",
    warning: "Budget Limit Alert!",
    youveExceeded: "You have exceeded your daily budget",
    setBudget: "Set Budget Limit",
    cancel: "Cancel",
    save: "Save",
    statistics: "Statistics",
    premiumFeature: "Premium feature",
    unlockStats: "Unlock statistics with Premium",
    upgrade: "Upgrade",
    premium: "Premium",
    premiumDesc: "Unlock full statistics and premium features.",
    buyPremium: "Buy Premium",
    close: "Close",
    limit: "Limit",
    loading: "Loading...",
    expenseHistory: "Expense History",
    noExpenses: "No expenses yet",
    last7days: "Last 7 days",
  },
  pl: {
    dailyBudget: "Dzienny Budżet",
    spent: "Wydano",
    remaining: "Pozostało",
    warning: "Alert!",
    youveExceeded: "Przekroczyłeś budżet",
    setBudget: "Ustaw limit",
    cancel: "Anuluj",
    save: "Zapisz",
    statistics: "Statystyki",
    premiumFeature: "Funkcja Premium",
    unlockStats: "Odblokuj statystyki dzięki Premium",
    upgrade: "Ulepsz",
    premium: "Premium",
    premiumDesc: "Odblokuj pełne statystyki i funkcje premium.",
    buyPremium: "Kup Premium",
    close: "Zamknij",
    limit: "Limit",
    loading: "Ładowanie...",
    expenseHistory: "Historia wydatków",
    noExpenses: "Brak wydatków",
    last7days: "Ostatnie 7 dni",
  },
  es: {
    dailyBudget: "Presupuesto Diario",
    spent: "Gastado",
    remaining: "Restante",
    warning: "Alerta!",
    youveExceeded: "Has excedido tu presupuesto",
    setBudget: "Establecer límite",
    cancel: "Cancelar",
    save: "Guardar",
    statistics: "Estadísticas",
    premiumFeature: "Función Premium",
    unlockStats: "Desbloquea estadísticas con Premium",
    upgrade: "Mejorar",
    premium: "Premium",
    premiumDesc: "Desbloquea estadísticas completas y funciones premium.",
    buyPremium: "Comprar Premium",
    close: "Cerrar",
    limit: "Límite",
    loading: "Cargando...",
    expenseHistory: "Historial de gastos",
    noExpenses: "Sin gastos todavía",
    last7days: "Últimos 7 días",
  },
  fr: {
    dailyBudget: "Budget Quotidien",
    spent: "Dépensé",
    remaining: "Restant",
    warning: "Alerte!",
    youveExceeded: "Vous avez dépassé votre budget",
    setBudget: "Définir limite",
    cancel: "Annuler",
    save: "Enregistrer",
    statistics: "Statistiques",
    premiumFeature: "Fonction Premium",
    unlockStats: "Débloquez les statistiques avec Premium",
    upgrade: "Mettre à niveau",
    premium: "Premium",
    premiumDesc: "Débloquez les statistiques complètes et les fonctions premium.",
    buyPremium: "Acheter Premium",
    close: "Fermer",
    limit: "Limite",
    loading: "Chargement...",
    expenseHistory: "Historique des dépenses",
    noExpenses: "Aucune dépense",
    last7days: "7 derniers jours",
  },
  de: {
    dailyBudget: "Tagesbudget",
    spent: "Ausgegeben",
    remaining: "Verbleibend",
    warning: "Warnung!",
    youveExceeded: "Du hast dein Budget überschritten",
    setBudget: "Limit setzen",
    cancel: "Abbrechen",
    save: "Speichern",
    statistics: "Statistiken",
    premiumFeature: "Premium-Funktion",
    unlockStats: "Statistiken mit Premium freischalten",
    upgrade: "Upgrade",
    premium: "Premium",
    premiumDesc: "Schalte volle Statistiken und Premium-Funktionen frei.",
    buyPremium: "Premium kaufen",
    close: "Schließen",
    limit: "Limit",
    loading: "Laden...",
    expenseHistory: "Ausgabenverlauf",
    noExpenses: "Keine Ausgaben",
  last7days: "Letzte 7 Tage",
  },
};

const STRIPE_MONTHLY_URL =
 "/.netlify/functions/create-portal-session?plan=monthly"; // <- podmień na swój link
const STRIPE_YEARLY_URL = "/.netlify/functions/create-portal-session?plan=yearly";

type HistoryItem = {
  id: string;
  amount: string | number;
  category: string | null;
  date: string;
};

export default function BudgetTracker({ userId, language, refreshKey }: BudgetTrackerProps) {
  const [budget, setBudgetLimit] = useState(30);
  
  const [spent, setSpent] = useState(0);

  const [showSettings, setShowSettings] = useState(false);
  const [newBudget, setNewBudget] = useState(30);
  const [loading, setLoading] = useState(true);

  const [isPremium, setIsPremium] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
const last7Days = (() => {
  // history: [{ date: "YYYY-MM-DD", amount: ... }]
  const map = new Map<string, number>();

  for (const item of history) {
    const d = (item as any).date;
    const a = Number((item as any).amount || 0);
    if (!d) continue;
    map.set(d, (map.get(d) || 0) + a);
  }

  const days: { date: string; total: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dt = new Date();
    dt.setDate(dt.getDate() - i);
    const key = dt.toISOString().split("T")[0];
    days.push({ date: key, total: map.get(key) || 0 });
  }

  return days;
})();

const maxDayTotal = Math.max(1, budget, ...last7Days.map((d) => d.total));
  const t = useMemo(() => translations[language] || translations.en, [language]);

  const handleCreateBudget = async (uid: string, defaultLimit = 30) => {
    const { error } = await supabase
      .from("user_budgets")
      .insert([{ user_id: uid, daily_limit: defaultLimit }]);

    if (error) {
      console.error("Create budget error:", error);
      return false;
    }
    return true;
  };

  const checkSubscription = async () => {
    // ✅ Wariant A (jak u Ciebie w App.tsx): tabela "subscriptions" + expires_at
    const { data } = await supabase
      .from("subscriptions")
      .select("is_active, expires_at")
      .eq("user_id", userId)
      .maybeSingle();

    const active =
      !!data?.is_active &&
      (!data?.expires_at || new Date(data.expires_at) > new Date());

    setIsPremium(active);

    // ❗ Jeśli premium trzymasz w "user_subscriptions" (bez expires_at), zamień na:
    // const { data } = await supabase
    //   .from("user_subscriptions")
    //   .select("is_active")
    //   .eq("user_id", userId)
    //   .maybeSingle();
    // setIsPremium(!!data?.is_active);
  };

  const loadTodayExpenses = async () => {
    const today = new Date().toISOString().split("T")[0];

    const { data } = await supabase
      .from("expenses")
      .select("amount")
      .eq("user_id", userId)
      .eq("date", today);

    const total =
      data?.reduce((sum, exp: any) => sum + parseFloat(exp.amount as any), 0) || 0;

    setSpent(total);
  };

  const loadHistory = async () => {
    if (!isPremium) return;

    setHistoryLoading(true);

    const { data, error } = await supabase
      .from("expenses")
      .select("id, amount, category, date")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(50);

    if (!error && data) setHistory(data as any);

    setHistoryLoading(false);
  };

  const loadBudgetData = async () => {
    try {
      const { data: budgetData } = await supabase
        .from("user_budgets")
        .select("daily_limit")
        .eq("user_id", userId)
        .maybeSingle();

      if (budgetData) {
        setBudgetLimit(budgetData.daily_limit);
        setNewBudget(budgetData.daily_limit);
      } else {
        const ok = await handleCreateBudget(userId, 30);
        if (ok) {
          setBudgetLimit(30);
          setNewBudget(30);
        }
      }

      await loadTodayExpenses();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBudget = async () => {
    await supabase
      .from("user_budgets")
      .update({ daily_limit: newBudget })
      .eq("user_id", userId);

    setBudgetLimit(newBudget);
    setShowSettings(false);
  };

  useEffect(() => {
    loadBudgetData();
    checkSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

 
useEffect(() => {
  loadTodayExpenses();
  if (isPremium) loadHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [refreshKey]);
  // ✅ Auto-odświeżanie “Spent” i historii po insert/update/delete w expenses
  useEffect(() => {
    const channel = supabase
      .channel(`expenses-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "expenses",
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          await loadTodayExpenses();
          if (isPremium) await loadHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isPremium]);

  const remaining = Math.max(0, budget - spent);
  const percentage = Math.min(100, (spent / budget) * 100);
  const isExceeded = spent > budget;

  if (loading) {
    return <div className="text-center py-12 text-slate-600">{t.loading}</div>;
  }

  return (
    <div className="space-y-4">
      {/* TOP CARD */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">{t.dailyBudget}</h2>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <Settings className="text-slate-600" size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-slate-600 text-sm font-semibold mb-1">{t.limit}</p>
              <p className="text-3xl font-bold text-slate-800">{formatMoney(budget, language)}</p>
            </div>

            <div className="text-center">
              <p className={`text-sm font-semibold mb-1 ${isExceeded ? "text-red-600" : "text-slate-600"}`}>
                {t.spent}
              </p>
              <p className={`text-3xl font-bold ${isExceeded ? "text-red-600" : "text-slate-800"}`}>
                {formatMoney(spent, language)}
              </p>
            </div>

            <div className="text-center">
              <p className="text-slate-600 text-sm font-semibold mb-1">{t.remaining}</p>
              <p className={`text-3xl font-bold ${isExceeded ? "text-red-600" : "text-green-600"}`}>
                {formatMoney(remaining, language)}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-600 font-semibold">{Math.round(percentage)}%</p>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  isExceeded ? "bg-red-500" : percentage > 75 ? "bg-yellow-500" : "bg-green-500"
                }`}
                style={{ width: `${Math.min(100, percentage)}%` }}
              />
            </div>
          </div>
        </div>

        {isExceeded && (
          <div className="mt-6 flex items-start gap-3 bg-red-50 border-2 border-red-300 rounded-xl p-4">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <p className="font-bold text-red-700 text-lg">{t.warning}</p>
              <p className="text-red-600 text-sm">{t.youveExceeded}</p>
            </div>
          </div>
        )}
      </div>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-in slide-in-from-bottom">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">{t.setBudget}</h3>
            <div className="space-y-4">
              <input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(parseFloat(e.target.value))}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 text-xl"
                step="0.01"
                min="1"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 py-3 border-2 border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleUpdateBudget}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition"
                >
                  {t.save}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATS SECTION */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">{t.statistics}</h3>

        {isPremium ? (
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4">{t.expenseHistory}</h3>
      {/* WOW: 7-day mini chart */}
<div className="mb-4">
  <div className="text-sm font-semibold text-slate-700 mb-2">
  {t.last7days}
  </div>

  <div className="flex items-end gap-2 h-24">
    {last7Days.map((d) => {
      const h = Math.round((d.total / maxDayTotal) * 100);
      return (
        <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full bg-slate-100 rounded-lg overflow-hidden h-20 flex items-end">
            <div
              className="w-full bg-blue-600 transition-all duration-500"
style={{ height: `${h}%` }}
              title={`${d.date}: £${d.total.toFixed(2)}`}
            />
          </div>
          <div className="text-[10px] text-slate-500">
            {d.date.slice(5)}
          </div>
        </div>
      );
    })}
  </div>
</div>
            {historyLoading ? (
              <p>{t.loading}</p>
            ) : history.length === 0 ? (
              <p>{t.noExpenses}</p>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm border-b pb-2">
                    <span>{item.date}</span>
                   <span>£{Number(item.amount).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div
              onClick={() => setShowPremium(true)}
              className="p-4 rounded-xl border border-dashed text-center cursor-pointer hover:bg-slate-50"
            >
              <p className="font-semibold">{t.premiumFeature}</p>
              <p className="text-sm opacity-70">{t.unlockStats}</p>
              <p className="text-xs mt-2 text-blue-600 underline">{t.upgrade}</p>
            </div>

            {showPremium && (
              <div className="fixed inset-0 bg-black/50 flex items-end z-50">
                <div className="bg-white w-full rounded-t-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{t.premium}</h3>
                    <button
                      onClick={() => setShowPremium(false)}
                      className="px-3 py-1 rounded-lg border"
                    >
                      {t.close}
                    </button>
                  </div>

                  <p className="text-slate-700">{t.premiumDesc}</p>

                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => setSelectedPlan("monthly")}
                      className={`px-4 py-2 rounded ${
                        selectedPlan === "monthly" ? "bg-blue-600 text-white" : "bg-gray-200"
                      }`}
                    >
                      Monthly
                    </button>

                    <button
                      onClick={() => setSelectedPlan("yearly")}
                      className={`px-4 py-2 rounded ${
                        selectedPlan === "yearly" ? "bg-blue-600 text-white" : "bg-gray-200"
                      }`}
                    >
                      Yearly
                    </button>
                  </div>
<a
  href={`${selectedPlan === "monthly" ? STRIPE_MONTHLY_URL : STRIPE_YEARLY_URL}&user_id=${encodeURIComponent(
    userId
  )}`}
  className="mt-4 w-full block text-center py-3 bg-blue-600 text-white rounded-xl font-semibold"
>
  {t.buyPremium}
</a>
            </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
