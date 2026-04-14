import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Settings } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

interface BudgetTrackerProps {
  userId: string;
  language: string;
  refreshKey: number;
}

const currencyByLang: Record<string, { code: string; locale: string }> = {
  pl: { code: "PLN", locale: "pl-PL" },
  en: { code: "GBP", locale: "en-GB" },
  es: { code: "EUR", locale: "es-ES" },
  fr: { code: "EUR", locale: "fr-FR" },
  de: { code: "EUR", locale: "de-DE" },
};

const getCurrency = (language: string) =>
  currencyByLang[language] || currencyByLang.en;

const formatMoney = (value: number, language: string) => {
  const { code, locale } = getCurrency(language);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
  }).format(value);
};

const categoryColors = [
  "bg-orange-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-purple-400",
  "bg-pink-400",
  "bg-yellow-400",
  "bg-teal-400",
  "bg-indigo-400",
];

const translations: Record<string, Record<string, string>> = {
  en: {
    dailyBudget: "Daily Budget",
    monthlyBudget: "Monthly Budget",
    monthlyBreakdown: "Monthly Breakdown",
    totalThisMonth: "Total this month",
    spent: "Spent",
    remaining: "Remaining",
    warning: "Budget Limit Alert!",
    youveExceeded: "You have exceeded your budget",
    setBudget: "Set Budget Limits",
    dailyLimit: "Daily Limit",
    monthlyLimit: "Monthly Limit",
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
    noCategoryData: "No category data yet",
    last7days: "Last 7 days",
    used: "used",
    left: "left",
    uncategorized: "Other",
  },
  pl: {
    dailyBudget: "Dzienny Budżet",
    monthlyBudget: "Miesięczny Budżet",
    monthlyBreakdown: "Podział miesięczny",
    totalThisMonth: "Łącznie w tym miesiącu",
    spent: "Wydano",
    remaining: "Pozostało",
    warning: "Alert!",
    youveExceeded: "Przekroczyłeś budżet",
    setBudget: "Ustaw limity budżetu",
    dailyLimit: "Limit dzienny",
    monthlyLimit: "Limit miesięczny",
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
    noCategoryData: "Brak danych o kategoriach",
    last7days: "Ostatnie 7 dni",
    used: "wykorzystano",
    left: "pozostało",
    uncategorized: "Inne",
  },
  es: {
    dailyBudget: "Presupuesto Diario",
    monthlyBudget: "Presupuesto Mensual",
    monthlyBreakdown: "Desglose mensual",
    totalThisMonth: "Total este mes",
    spent: "Gastado",
    remaining: "Restante",
    warning: "Alerta!",
    youveExceeded: "Has excedido tu presupuesto",
    setBudget: "Establecer límites",
    dailyLimit: "Límite diario",
    monthlyLimit: "Límite mensual",
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
    noCategoryData: "Sin datos por categoría",
    last7days: "Últimos 7 días",
    used: "usado",
    left: "restante",
    uncategorized: "Otros",
  },
  fr: {
    dailyBudget: "Budget Quotidien",
    monthlyBudget: "Budget Mensuel",
    monthlyBreakdown: "Répartition mensuelle",
    totalThisMonth: "Total ce mois-ci",
    spent: "Dépensé",
    remaining: "Restant",
    warning: "Alerte!",
    youveExceeded: "Vous avez dépassé votre budget",
    setBudget: "Définir les limites",
    dailyLimit: "Limite quotidienne",
    monthlyLimit: "Limite mensuelle",
    cancel: "Annuler",
    save: "Enregistrer",
    statistics: "Statistiques",
    premiumFeature: "Fonction Premium",
    unlockStats: "Débloquez les statistiques avec Premium",
    upgrade: "Mettre à niveau",
    premium: "Premium",
    premiumDesc:
      "Débloquez les statistiques complètes et les fonctions premium.",
    buyPremium: "Acheter Premium",
    close: "Fermer",
    limit: "Limite",
    loading: "Chargement...",
    expenseHistory: "Historique des dépenses",
    noExpenses: "Aucune dépense",
    noCategoryData: "Aucune donnée par catégorie",
    last7days: "7 derniers jours",
    used: "utilisé",
    left: "restant",
    uncategorized: "Autres",
  },
  de: {
    dailyBudget: "Tagesbudget",
    monthlyBudget: "Monatsbudget",
    monthlyBreakdown: "Monatliche Aufteilung",
    totalThisMonth: "Gesamt in diesem Monat",
    spent: "Ausgegeben",
    remaining: "Verbleibend",
    warning: "Warnung!",
    youveExceeded: "Du hast dein Budget überschritten",
    setBudget: "Budgets festlegen",
    dailyLimit: "Tageslimit",
    monthlyLimit: "Monatslimit",
    cancel: "Abbrechen",
    save: "Speichern",
    statistics: "Statistiken",
    premiumFeature: "Premium-Funktion",
    unlockStats: "Statistiken mit Premium freischalten",
    upgrade: "Upgrade",
    premium: "Premium",
    premiumDesc:
      "Schalte volle Statistiken und Premium-Funktionen frei.",
    buyPremium: "Premium kaufen",
    close: "Schließen",
    limit: "Limit",
    loading: "Laden...",
    expenseHistory: "Ausgabenverlauf",
    noExpenses: "Keine Ausgaben",
    noCategoryData: "Keine Kategoriedaten",
    last7days: "Letzte 7 Tage",
    used: "verwendet",
    left: "übrig",
    uncategorized: "Andere",
  },
};

const STRIPE_MONTHLY_URL =
  "/.netlify/functions/create-portal-session?plan=monthly";
const STRIPE_YEARLY_URL =
  "/.netlify/functions/create-portal-session?plan=yearly";

type HistoryItem = {
  id: string;
  amount: string | number;
  category: string | null;
  date: string;
};

type BudgetView = "daily" | "monthly";

type CategoryBreakdownItem = {
  category: string;
  total: number;
  percent: number;
  colorClass: string;
};
const normalizeCategoryKey = (value: string | null | undefined): string => {
  if (!value) return "other";

  const normalized = value.trim().toLowerCase();

  const mapping: Record<string, string> = {
    food: "food",
    jedzenie: "food",

    transport: "transport",

    entertainment: "entertainment",
    rozrywka: "entertainment",

    shopping: "shopping",
    zakupy: "shopping",

    utilities: "utilities",
    rachunki: "utilities",

    other: "other",
    inne: "other",
  };

  return mapping[normalized] || "other";
};

const getCategoryLabel = (categoryKey: string, t: any): string => {
  const labels: Record<string, string> = {
    food: t.food || "Food",
    transport: t.transport || "Transport",
    entertainment: t.entertainment || "Entertainment",
    shopping: t.shopping || "Shopping",
    utilities: t.utilities || "Utilities",
    other: "Other",
  };

  return labels[categoryKey] || labels.other;
};
export default function BudgetTracker({
  userId,
  language,
  refreshKey,
}: BudgetTrackerProps) {
  const [budget, setBudgetLimit] = useState(30);
  const [monthlyBudget, setMonthlyBudget] = useState(200);
  const [spent, setSpent] = useState(0);
  const [monthlySpent, setMonthlySpent] = useState(0);

  const [showSettings, setShowSettings] = useState(false);
  const [newBudget, setNewBudget] = useState(30);
  const [newMonthlyBudget, setNewMonthlyBudget] = useState(200);
  const [loading, setLoading] = useState(true);

  const [isPremium, setIsPremium] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [budgetView, setBudgetView] = useState<BudgetView>("daily");

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState<CategoryBreakdownItem[]>([]);
  const [breakdownLoading, setBreakdownLoading] = useState(false);

  const t = useMemo(() => translations[language] || translations.en, [language]);

  const exportCSV = () => {
    const csvContent =
      "Date,Category,Amount\n" +
      history
        .map((item) => `${item.date},${item.category ?? ""},${item.amount}`)
        .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "expenses.csv";
    link.click();
  };

  const last7Days = (() => {
    const map = new Map<string, number>();

    for (const item of history) {
      const d = item.date;
      const a = Number(item.amount || 0);
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

  const handleCreateBudget = async (
    uid: string,
    defaultDailyLimit = 30,
    defaultMonthlyLimit = 200
  ) => {
    const { error } = await supabase.from("user_budgets").insert([
      {
        user_id: uid,
        daily_limit: defaultDailyLimit,
        monthly_limit: defaultMonthlyLimit,
      },
    ]);

    if (error) {
      console.error("Create budget error:", error);
      return false;
    }
    return true;
  };

  const checkSubscription = async () => {
    const { data } = await supabase
      .from("subscriptions")
      .select("is_active, expires_at")
      .eq("user_id", userId)
      .maybeSingle();

    const active =
      !!data?.is_active &&
      (!data?.expires_at || new Date(data.expires_at) > new Date());

    setIsPremium(active);
  };

  const loadTodayExpenses = async () => {
    const today = new Date().toISOString().split("T")[0];

    const { data } = await supabase
      .from("expenses")
      .select("amount")
      .eq("user_id", userId)
      .eq("date", today);

    const total =
      data?.reduce(
        (sum, exp: { amount: string | number }) =>
          sum + parseFloat(String(exp.amount)),
        0
      ) || 0;

    setSpent(total);
  };

  const loadMonthlyExpenses = async () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    const { data } = await supabase
      .from("expenses")
      .select("amount")
      .eq("user_id", userId)
      .gte("date", firstDay)
      .lte("date", lastDay);

    const total =
      data?.reduce(
        (sum, exp: { amount: string | number }) =>
          sum + parseFloat(String(exp.amount)),
        0
      ) || 0;

    setMonthlySpent(total);
  };

  const loadMonthlyBreakdown = async () => {
    setBreakdownLoading(true);

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    const { data, error } = await supabase
      .from("expenses")
      .select("amount, category")
      .eq("user_id", userId)
      .gte("date", firstDay)
      .lte("date", lastDay);

    if (error || !data) {
      setMonthlyBreakdown([]);
      setBreakdownLoading(false);
      return;
    }

    const totals = new Map<string, number>();

    data.forEach((item: { amount: string | number; category: string | null }) => {
      const categoryKey = normalizeCategoryKey(item.category);
      const amount = Number(item.amount || 0);
    totals.set(categoryKey, (totals.get(categoryKey) || 0) + amount);
    });
const sorted: CategoryBreakdownItem[] = Array.from(totals.entries())
  .map(([categoryKey, total], index) => ({
    category: getCategoryLabel(categoryKey, t),
    total,
    percent: totalSpent > 0 ? Math.round((total / totalSpent) * 100) : 0,
    colorClass: categoryColors[index % categoryColors.length],
  }))
  .sort((a, b) => b.total - a.total);

    const sorted = Array.from(totals.entries())
.map(([categoryKey, total], index) => ({
  category: getCategoryLabel(categoryKey, t),
  total,
  percent: totalSpent > 0 ? Math.round((total / totalSpent) * 100) : 0,
  colorClass: categoryColors[index % categoryColors.length],
}))
        category,
        total,
        percent: totalSpent > 0 ? Math.round((total / totalSpent) * 100) : 0,
        colorClass: categoryColors[index % categoryColors.length],
      }))
      .sort((a, b) => b.total - a.total);

    setMonthlyBreakdown(sorted);
    setBreakdownLoading(false);
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

    if (!error && data) {
      setHistory(data as HistoryItem[]);
    }

    setHistoryLoading(false);
  };

  const loadBudgetData = async () => {
    try {
      const { data: budgetData } = await supabase
        .from("user_budgets")
        .select("daily_limit, monthly_limit")
        .eq("user_id", userId)
        .maybeSingle();

      if (budgetData) {
        const dailyLimit = Number(budgetData.daily_limit ?? 30);
        const monthlyLimit = Number(budgetData.monthly_limit ?? 200);

        setBudgetLimit(dailyLimit);
        setMonthlyBudget(monthlyLimit);
        setNewBudget(dailyLimit);
        setNewMonthlyBudget(monthlyLimit);
      } else {
        const ok = await handleCreateBudget(userId, 30, 200);
        if (ok) {
          setBudgetLimit(30);
          setMonthlyBudget(200);
          setNewBudget(30);
          setNewMonthlyBudget(200);
        }
      }

      await Promise.all([
        loadTodayExpenses(),
        loadMonthlyExpenses(),
        loadMonthlyBreakdown(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBudget = async () => {
    await supabase
      .from("user_budgets")
      .update({
        daily_limit: newBudget,
        monthly_limit: newMonthlyBudget,
      })
      .eq("user_id", userId);

    setBudgetLimit(newBudget);
    setMonthlyBudget(newMonthlyBudget);
    setShowSettings(false);
  };

  useEffect(() => {
    loadBudgetData();
    checkSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    Promise.all([
      loadTodayExpenses(),
      loadMonthlyExpenses(),
      loadMonthlyBreakdown(),
    ]);
    if (isPremium) loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, isPremium, language]);

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
          await Promise.all([
            loadTodayExpenses(),
            loadMonthlyExpenses(),
            loadMonthlyBreakdown(),
          ]);
          if (isPremium) await loadHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isPremium, language]);

  const dailyRemaining = Math.max(0, budget - spent);
  const dailyPercentage = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
  const dailyExceeded = spent > budget;

  const monthlyRemaining = Math.max(0, monthlyBudget - monthlySpent);
  const monthlyPercentage =
    monthlyBudget > 0 ? Math.min(100, (monthlySpent / monthlyBudget) * 100) : 0;
  const monthlyExceeded = monthlySpent > monthlyBudget;

  const currentLimit = budgetView === "daily" ? budget : monthlyBudget;
  const currentSpent = budgetView === "daily" ? spent : monthlySpent;
  const currentRemaining =
    budgetView === "daily" ? dailyRemaining : monthlyRemaining;
  const currentPercentage =
    budgetView === "daily" ? dailyPercentage : monthlyPercentage;
  const currentExceeded =
    budgetView === "daily" ? dailyExceeded : monthlyExceeded;
  const currentTitle =
    budgetView === "daily" ? t.dailyBudget : t.monthlyBudget;

  if (loading) {
    return <div className="text-center py-12 text-slate-600">{t.loading}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">{currentTitle}</h2>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <Settings className="text-slate-600" size={24} />
          </button>
        </div>

        <div className="mb-6 inline-flex bg-slate-100 rounded-xl p-1">
          <button
            onClick={() => setBudgetView("daily")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              budgetView === "daily"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600"
            }`}
          >
            {t.dailyBudget}
          </button>
          <button
            onClick={() => setBudgetView("monthly")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              budgetView === "monthly"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600"
            }`}
          >
            {t.monthlyBudget}
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-slate-600 text-sm font-semibold mb-1">
                {t.limit}
              </p>
              <p className="text-3xl font-bold text-slate-800">
                {formatMoney(currentLimit, language)}
              </p>
            </div>

            <div className="text-center">
              <p
                className={`text-sm font-semibold mb-1 ${
                  currentExceeded ? "text-red-600" : "text-slate-600"
                }`}
              >
                {t.spent}
              </p>
              <p
                className={`text-3xl font-bold ${
                  currentExceeded ? "text-red-600" : "text-slate-800"
                }`}
              >
                {formatMoney(currentSpent, language)}
              </p>
            </div>

            <div className="text-center">
              <p className="text-slate-600 text-sm font-semibold mb-1">
                {t.remaining}
              </p>
              <p
                className={`text-3xl font-bold ${
                  currentExceeded ? "text-red-600" : "text-green-600"
                }`}
              >
                {formatMoney(currentRemaining, language)}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-600 font-semibold">
                {Math.round(currentPercentage)}% {t.used}
              </p>
              <p className="text-slate-500 text-sm">
                {formatMoney(currentRemaining, language)} {t.left}
              </p>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  currentExceeded
                    ? "bg-red-500"
                    : currentPercentage > 75
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${Math.min(100, currentPercentage)}%` }}
              />
            </div>
          </div>
        </div>

        {currentExceeded && (
          <div className="mt-6 flex items-start gap-3 bg-red-50 border-2 border-red-300 rounded-xl p-4">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <p className="font-bold text-red-700 text-lg">{t.warning}</p>
              <p className="text-red-600 text-sm">{t.youveExceeded}</p>
            </div>
          </div>
        )}
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-in slide-in-from-bottom">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              {t.setBudget}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t.dailyLimit}
                </label>
                <input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 text-xl"
                  step="0.01"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t.monthlyLimit}
                </label>
                <input
                  type="number"
                  value={newMonthlyBudget}
                  onChange={(e) =>
                    setNewMonthlyBudget(parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 text-xl"
                  step="0.01"
                  min="1"
                />
              </div>

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

      {monthlyBreakdown.length > 0 && (
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4">{t.monthlyBreakdown}</h3>

          {breakdownLoading ? (
            <p>{t.loading}</p>
          ) : (
            <div className="space-y-4">
              {monthlyBreakdown.map((item) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-3 h-3 rounded-full ${item.colorClass}`} />
                      <span className="font-medium text-slate-700">{item.category}</span>
                      <span className="text-slate-400">{item.percent}%</span>
                    </div>
                    <span className="font-semibold text-slate-800">
                      {formatMoney(item.total, language)}
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.colorClass}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t flex items-center justify-between text-sm">
                <span className="text-slate-500">{t.totalThisMonth}</span>
                <span className="font-bold text-slate-800">
                  {formatMoney(monthlySpent, language)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">{t.statistics}</h3>

        {isPremium ? (
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4">{t.expenseHistory}</h3>

            <button
              onClick={exportCSV}
              className="mb-4 px-4 py-2 bg-green-600 text-white rounded-xl"
            >
              Export CSV
            </button>

            <div className="mb-4">
              <div className="text-sm font-semibold text-slate-700 mb-2">
                {t.last7days}
              </div>

              <div className="flex items-end gap-2 h-24">
                {last7Days.map((d) => {
                  const h = Math.round((d.total / maxDayTotal) * 100);
                  return (
                    <div
                      key={d.date}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <div className="w-full bg-slate-100 rounded-lg overflow-hidden h-20 flex items-end">
                        <div
                          className="w-full bg-blue-600 transition-all duration-500"
                          style={{ height: `${h}%` }}
                          title={`${d.date}: ${formatMoney(d.total, language)}`}
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
                  <div
                    key={item.id}
                    className="flex justify-between text-sm border-b pb-2"
                  >
                    <span>{item.date}</span>
                    <span>{formatMoney(Number(item.amount), language)}</span>
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
                        selectedPlan === "monthly"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      Monthly
                    </button>

                    <button
                      onClick={() => setSelectedPlan("yearly")}
                      className={`px-4 py-2 rounded ${
                        selectedPlan === "yearly"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      Yearly
                    </button>
                  </div>

                  <a
                    href={`${
                      selectedPlan === "monthly"
                        ? STRIPE_MONTHLY_URL
                        : STRIPE_YEARLY_URL
                    }&user_id=${encodeURIComponent(userId)}`}
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
