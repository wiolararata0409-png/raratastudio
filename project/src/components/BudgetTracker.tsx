import { useEffect, useState } from 'react';
import { AlertCircle, Settings } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface BudgetTrackerProps {
  userId: string;
  language: string;
}

const translations: Record<string, Record<string, string>> = {
  en: { dailyBudget: 'Daily Budget', spent: 'Spent', remaining: 'Remaining', warning: 'Budget Limit Alert!', youveExceeded: 'You have exceeded your daily budget', setBudget: 'Set Budget Limit' },
  pl: { dailyBudget: 'Dzienny Budżet', spent: 'Wydano', remaining: 'Pozostało', warning: 'Alert!', youveExceeded: 'Przekroczyłeś budżet', setBudget: 'Ustaw limit' },
  es: { dailyBudget: 'Presupuesto Diario', spent: 'Gastado', remaining: 'Restante', warning: 'Alerta!', youveExceeded: 'Has excedido tu presupuesto', setBudget: 'Establecer límite' },
  fr: { dailyBudget: 'Budget Quotidien', spent: 'Dépensé', remaining: 'Restant', warning: 'Alerte!', youveExceeded: 'Vous avez dépassé votre budget', setBudget: 'Définir limite' },
  de: { dailyBudget: 'Tagesbudget', spent: 'Ausgegeben', remaining: 'Verbleibend', warning: 'Warnung!', youveExceeded: 'Du hast dein Budget überschritten', setBudget: 'Limit setzen' }
};

export default function BudgetTracker({ userId, language }: BudgetTrackerProps) {
  const [budget, setBudgetLimit] = useState(30);
  const [spent, setSpent] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [newBudget, setNewBudget] = useState(30);
  const [loading, setLoading] = useState(true);

  const t = translations[language] || translations.en;

 useEffect(() => {
  loadBudgetData();
  checkSubscription();
}, [userId]);
// ✅ helper: tworzy budget, jeśli go nie ma
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
      // ✅ jeśli nie ma rekordu — tworzymy domyślny
     // ✅ helper: tworzy budget, jeśli go nie ma
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
      // ✅ jeśli nie ma rekordu — tworzymy domyślny
    // ✅ helper: tworzy budget, jeśli go nie ma
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
      // ✅ jeśli nie ma rekordu — tworzymy domyślny
      const ok = await handleCreateBudget(userId, 30);
      if (ok) {
        setBudgetLimit(30);
        setNewBudget(30);
      }
    }

    loadTodayExpenses();
  } finally {
    setLoading(false);
  }
};
      if (ok) {
        setBudgetLimit(30);
        setNewBudget(30);
      }
    }

    loadTodayExpenses();
  } finally {
    setLoading(false);
  }
};
      if (ok) {
        setBudgetLimit(30);
        setNewBudget(30);
      }
    }

    loadTodayExpenses();
  } finally {
    setLoading(false);
  }
};

  const loadTodayExpenses = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('expenses')
      .select('amount')
      .eq('user_id', userId)
      .eq('date', today);

    const total = data?.reduce((sum, exp) => sum + parseFloat(exp.amount), 0) || 0;
    setSpent(total);
  };

  const handleUpdateBudget = async () => {
    await supabase
      .from('user_budgets')
      .update({ daily_limit: newBudget })
      .eq('user_id', userId);
    setBudgetLimit(newBudget);
    setShowSettings(false);
  };

  const remaining = Math.max(0, budget - spent);
  const percentage = Math.min(100, (spent / budget) * 100);
  const isExceeded = spent > budget;

  if (loading) {
    return <div className="text-center py-12 text-slate-600">Loading...</div>;
  }

  return (
    <div className="space-y-4">
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
              <p className="text-slate-600 text-sm font-semibold mb-1">Limit</p>
              <p className="text-3xl font-bold text-slate-800">£{budget.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className={`text-sm font-semibold mb-1 ${isExceeded ? 'text-red-600' : 'text-slate-600'}`}>
                {t.spent}
              </p>
              <p className={`text-3xl font-bold ${isExceeded ? 'text-red-600' : 'text-slate-800'}`}>
                £{spent.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-600 text-sm font-semibold mb-1">{t.remaining}</p>
              <p className={`text-3xl font-bold ${isExceeded ? 'text-red-600' : 'text-green-600'}`}>
                £{remaining.toFixed(2)}
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
                  isExceeded ? 'bg-red-500' : percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, percentage)}%` }}
              ></div>
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
                  Cancel
                </button>
                <button
                  onClick={handleUpdateBudget}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
