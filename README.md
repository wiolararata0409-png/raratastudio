# 💰 Budget Tracker - Aplikacja Premium

Pełnofunkcjonalna aplikacja do zarządzania budżetem z integracją Stripe i planem Premium.

## ✨ Funkcje

### Wersja Darmowa (Free)
- ✅ Rejestracja i logowanie
- ✅ Dodawanie wydatków
- ✅ Przesyłanie zdjęć paragonów
- ✅ Jeden budżet
- ✅ Podstawowe kategorie

### Wersja Premium
- 🎉 Nieograniczona liczba budżetów
- 🎉 Nieograniczona liczba wydatków
- 🎉 Zaawansowane raporty
- 🎉 Export danych
- 🎉 Wsparcie priorytetowe

---

## 📚 Dokumentacja Wdrożenia

### Dla początkujących (ZACZNIJ TUTAJ):
1. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Szczegółowy przewodnik krok po kroku
2. **[QUICK_CHECKLIST.md](./QUICK_CHECKLIST.md)** - Krótka checklista do wydrukowania
3. **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Rozwiązywanie problemów

### Czas: ~2-3 godziny (pierwszy raz)

---

## 🛠️ Stack Technologiczny

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Płatności**: Stripe
- **Hosting**: Netlify
- **Auth**: Supabase Auth

---

## 🚀 Szybki Start (Development)

### Wymagania
- Node.js 18+
- npm lub yarn

### Instalacja

1. Sklonuj repo:
```bash
git clone https://github.com/TWOJE_KONTO/budget-tracker.git
cd budget-tracker
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Skopiuj `.env.example` do `.env`:
```bash
cp .env.example .env
```

4. Wypełnij zmienne w `.env`:
```env
VITE_SUPABASE_URL=https://twój-project.supabase.co
VITE_SUPABASE_ANON_KEY=twój-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PRICE_ID=price_...
```

5. Uruchom dev server:
```bash
npm run dev
```

6. Otwórz: http://localhost:5173

---

## 📦 Struktura Projektu

```
budget-tracker/
├── src/
│   ├── components/          # Komponenty React
│   │   ├── Auth.tsx         # Logowanie/Rejestracja
│   │   ├── BudgetTracker.tsx # Główny tracker
│   │   ├── ExpenseForm.tsx  # Formularz wydatków
│   │   └── PremiumModal.tsx # Modal płatności
│   ├── App.tsx              # Główny komponent
│   ├── main.tsx             # Entry point
│   └── index.css            # Style globalne
├── supabase/
│   ├── migrations/          # Migracje bazy danych
│   └── functions/           # Edge Functions
│       ├── create-checkout-session/
│       └── stripe-webhook/
├── public/                  # Statyczne assety
├── DEPLOYMENT_GUIDE.md      # 📖 Główny przewodnik
├── QUICK_CHECKLIST.md       # ✅ Szybka lista
├── TROUBLESHOOTING.md       # 🔧 Problemy
└── README.md                # Ten plik
```

---

## 🗄️ Struktura Bazy Danych

### Tabele:

**users** (Supabase Auth)
- Automatyczne zarządzanie przez Supabase

**expenses**
- `id`, `user_id`, `amount_pence`, `description`, `category`, `date`, `receipt_image_url`

**budgets**
- `id`, `user_id`, `name`, `total_amount_pence`, `period_start`, `period_end`

**subscriptions**
- `user_id`, `plan_type`, `stripe_customer_id`, `stripe_subscription_id`, `is_active`, `expires_at`

**payment_history**
- `id`, `user_id`, `stripe_payment_intent_id`, `amount_pence`, `status`, `created_at`

---

## 💳 Integracja Stripe

### Testowanie (Test Mode)

**Testowa karta:**
- Numer: `4242 4242 4242 4242`
- Data: dowolna przyszła (np. 12/28)
- CVC: dowolne 3 cyfry (np. 123)
- ZIP: dowolny

### Przejście na produkcję

1. Przełącz Stripe na Live mode
2. Zaktualizuj klucze API (Live keys)
3. Stwórz nowy produkt (Live)
4. Skonfiguruj nowy webhook (Live)
5. Zaktualizuj zmienne środowiskowe
6. Redeploy

**Szczegóły w: DEPLOYMENT_GUIDE.md → KROK 18**

---

## 🔒 Bezpieczeństwo

### ✅ Zaimplementowano:
- Row Level Security (RLS) na wszystkich tabelach
- JWT verification dla API
- Webhook signature verification (Stripe)
- Environment variables dla sekretów
- HTTPS only

### ⚠️ Przed produkcją:
- [ ] Dodaj politykę prywatności
- [ ] Dodaj regulamin
- [ ] Dodaj RODO compliance
- [ ] Zweryfikuj tożsamość w Stripe
- [ ] Skonfiguruj monitoring (opcjonalnie Sentry)

---

## 📊 Monitorowanie

### Gdzie sprawdzić logi:

**Frontend:**
- Netlify Dashboard → Deploys → Deploy log
- Console w przeglądarce (F12)

**Backend:**
- Supabase → Edge Functions → Logs
- Supabase → Database → Query logs

**Płatności:**
- Stripe Dashboard → Webhooks → Recent attempts
- Stripe Dashboard → Payments

---

## 🧪 Testowanie

### Przed produkcją przetestuj:

- [ ] Rejestracja nowego użytkownika
- [ ] Logowanie
- [ ] Dodawanie wydatku
- [ ] Upload zdjęcia paragonu
- [ ] Płatność testową kartą
- [ ] Webhook Stripe (czy status zmienia się na Premium)
- [ ] Funkcje Premium (nieograniczone budżety)
- [ ] Wylogowanie
- [ ] Ponowne logowanie (czy Premium się utrzymuje)

---

## 💰 Koszty

### Darmowe tiery:
- ✅ **Netlify**: 100 GB bandwidth/miesiąc
- ✅ **Supabase**: 500 MB bazy, 2 GB transferu
- ✅ **Stripe**: 0% na pierwsze 1M PLN (potem 1.4% + 1 PLN)

### Kiedy musisz płacić:
- Netlify: Po przekroczeniu 100 GB bandwidth (~$20/m)
- Supabase: Po przekroczeniu limitów (~$25/m za Pro)
- Stripe: Dopiero przy dużej sprzedaży

### Przychody od 1. dnia:
- Ustawiasz cenę (np. 29 PLN/miesiąc)
- Stripe pobiera prowizję (1.4% + 1 PLN)
- Resztę dostajesz na konto

**Przykład:** Sprzedajesz za 29 PLN
- Stripe zabiera: ~1.40 PLN
- Ty dostajesz: ~27.60 PLN

---

## 🎯 Marketing

### Jak zdobyć pierwszych użytkowników:

1. **Social media**
   - Pokaż zrzuty ekranu
   - Nagraj krótki film demo
   - Hashtagi: #budgetapp #finanse #oszczedzanie

2. **Polskie fora**
   - Facebook grupy o finansach
   - Wykop.pl (link do projektu)
   - Reddit r/finanseosobiste

3. **Product Hunt**
   - Wystaw produkt
   - Przygotuj dobry opis i grafiki

4. **Darmowa wersja**
   - Pozwól używać za darmo
   - Ludzie polecą znajomym
   - Część przejdzie na Premium

---

## 📈 Rozwój

### Przyszłe funkcje (pomysły):

- [ ] Eksport do PDF/Excel
- [ ] Wykresy i statystyki
- [ ] Powiadomienia o przekroczeniu budżetu
- [ ] Integracja z bankami
- [ ] Aplikacja mobilna (React Native)
- [ ] Współdzielenie budżetu z rodziną
- [ ] Automatyczna kategoryzacja (AI)

---

## 🤝 Wsparcie

### Potrzebujesz pomocy?

1. Przeczytaj **TROUBLESHOOTING.md**
2. Sprawdź logi (Netlify, Supabase, Stripe)
3. Sprawdź Console w przeglądarce (F12)
4. Upewnij się że wykonałeś wszystkie kroki z DEPLOYMENT_GUIDE.md

---

## 📄 Licencja

MIT - możesz robić co chcesz z tym kodem.

---

## 🎉 Gotowe!

Masz wszystko czego potrzebujesz żeby:
1. Wdrożyć aplikację na produkcję
2. Zacząć zarabiać
3. Rozwijać funkcje
4. Zdobyć pierwszych klientów

**Powodzenia! 🚀**

---

**Stworzone z ❤️ dla ludzi, którzy chcą zarabiać na swoich pomysłach.**
