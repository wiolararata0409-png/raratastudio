import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Camera, Image } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface ExpenseFormProps {
  userId: string;
  language: string;
  onSuccess?: () => void;
}

const translations: Record<string, Record<string, string>> = {
  en: { addExpense: 'Add Expense', amount: 'Amount (£)', category: 'Category', description: 'Description', notes: 'Notes (optional)', today: "Today's Expenses", empty: 'No expenses yet', add: 'Add', delete: 'Delete', receipt: 'Receipt Photo', addPhoto: 'Add Photo', remove: 'Remove', viewReceipt: 'View Receipt' },
  pl: { addExpense: 'Dodaj wydatek', amount: 'Kwota (£)', category: 'Kategoria', description: 'Opis', notes: 'Notatki (opcjonalnie)', today: 'Wydatki dzisiaj', empty: 'Brak wydatków', add: 'Dodaj', delete: 'Usuń', receipt: 'Zdjęcie paragonu', addPhoto: 'Dodaj zdjęcie', remove: 'Usuń', viewReceipt: 'Zobacz paragon' },
  es: { addExpense: 'Agregar gasto', amount: 'Cantidad (£)', category: 'Categoría', description: 'Descripción', notes: 'Notas (opcional)', today: 'Gastos de hoy', empty: 'Sin gastos', add: 'Agregar', delete: 'Eliminar', receipt: 'Foto del recibo', addPhoto: 'Agregar foto', remove: 'Eliminar', viewReceipt: 'Ver recibo' },
  fr: { addExpense: 'Ajouter dépense', amount: 'Montant (£)', category: 'Catégorie', description: 'Description', notes: 'Notes (facultatif)', today: 'Dépenses d\'aujourd\'hui', empty: 'Aucune dépense', add: 'Ajouter', delete: 'Supprimer', receipt: 'Photo du reçu', addPhoto: 'Ajouter photo', remove: 'Supprimer', viewReceipt: 'Voir reçu' },
  de: { addExpense: 'Ausgabe hinzufügen', amount: 'Betrag (£)', category: 'Kategorie', description: 'Beschreibung', notes: 'Notizen (optional)', today: 'Heutige Ausgaben', empty: 'Keine Ausgaben', add: 'Hinzufügen', delete: 'Löschen', receipt: 'Belegfoto', addPhoto: 'Foto hinzufügen', remove: 'Entfernen', viewReceipt: 'Beleg ansehen' }
};

const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Utilities', 'Other'];

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  receipt_image_url?: string;
}

export default function ExpenseForm({ userId, language, onSuccess }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [receiptImage, setReceiptImage] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const t = translations[language] || translations.en;

  useEffect(() => {
    loadExpenses();
  }, [userId]);

  const loadExpenses = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('expenses')
      .select('id, amount, category, description, receipt_image_url')
      .eq('user_id', userId)
      .eq('date', today)
      .order('created_at', { ascending: false });

    setExpenses(data || []);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReceiptImage = () => {
    setReceiptImage(null);
    setReceiptPreview(null);
  };

  const uploadReceiptImage = async (): Promise<string | null> => {
    if (!receiptImage) return null;

    const fileExt = receiptImage.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('receipts')
      .upload(fileName, receiptImage);

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    const { data } = supabase.storage
      .from('receipts')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const receiptUrl = await uploadReceiptImage();

      await supabase.from('expenses').insert([
        {
          user_id: userId,
          amount: parseFloat(amount),
          category,
          description,
          date: today,
          receipt_image_url: receiptUrl
        }
      ]);

      setAmount('');
      setDescription('');
      setCategory('Food');
      removeReceiptImage();
      await loadExpenses();
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    await supabase.from('expenses').delete().eq('id', id);
    await loadExpenses();
    onSuccess?.();
  };

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Plus size={24} className="text-blue-600" />
          {t.addExpense}
        </h2>

        <form onSubmit={handleAddExpense} className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t.amount}</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t.category}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t.notes}</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg"
              placeholder="What did you buy?"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{t.receipt}</label>
            {receiptPreview ? (
              <div className="relative">
                <img
                  src={receiptPreview}
                  alt="Receipt preview"
                  className="w-full h-48 object-cover rounded-xl border-2 border-slate-200"
                />
                <button
                  type="button"
                  onClick={removeReceiptImage}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-500 transition bg-slate-50">
                <Camera className="text-slate-400 mb-2" size={32} />
                <span className="text-slate-600 font-semibold">{t.addPhoto}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !amount}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold text-lg hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? 'Adding...' : t.add}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">{t.today}</h3>

        {expenses.length === 0 ? (
          <p className="text-slate-600 text-center py-6 text-lg">{t.empty}</p>
        ) : (
          <div className="space-y-3">
            {expenses.map(exp => (
              <div
                key={exp.id}
                className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-lg">
                      {exp.category}
                    </span>
                    <p className="font-semibold text-slate-800">{exp.description || 'Expense'}</p>
                  </div>
                  {exp.receipt_image_url && (
                    <button
                      onClick={() => setSelectedImage(exp.receipt_image_url!)}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      <Image size={16} />
                      {t.viewReceipt}
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-bold text-slate-800">£{exp.amount.toFixed(2)}</p>
                  <button
                    onClick={() => handleDeleteExpense(exp.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-4 pt-4 border-t-2 border-slate-200 flex justify-between items-center">
              <p className="font-bold text-slate-700">Total:</p>
              <p className="text-2xl font-bold text-slate-800">£{total.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 bg-white text-slate-800 p-2 rounded-lg hover:bg-slate-100 transition"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Receipt"
              className="max-w-full max-h-[90vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
