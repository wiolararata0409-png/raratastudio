# 🚀 Przewodnik Wdrożenia - Krok Po Kroku

## 📋 Czego Potrzebujesz

- [ ] Konto GitHub (darmowe)
- [ ] Konto Supabase (darmowe)
- [ ] Konto Stripe (darmowe)
- [ ] Konto Netlify (już masz ✅)
- [ ] Twoja domena (już masz ✅)

---

## KROK 1: Pobierz Kod z Bolt.new

1. W bolt.new kliknij **trzy kropki** (⋯) w prawym górnym rogu
2. Wybierz **"Download as ZIP"**
3. Zapisz plik na komputer
4. Rozpakuj folder (kliknij prawym → Wyodrębnij wszystko)

---

## KROK 2: Załóż Konto GitHub (jeśli nie masz)

1. Idź na: https://github.com/signup
2. Wprowadź email, hasło, nazwę użytkownika
3. Potwierdź email
4. **Gotowe!**

---

## KROK 3: Wrzuć Kod na GitHub

### Opcja A: Przez Przeglądarkę (ŁATWIEJSZA)

1. Zaloguj się na GitHub
2. Kliknij zielony przycisk **"New"** (nowe repozytorium)
3. Nazwij je np: `budget-tracker`
4. **WAŻNE**: Zaznacz **"Private"** jeśli chcesz by był prywatny
5. Kliknij **"Create repository"**
6. Kliknij **"uploading an existing file"**
7. Przeciągnij WSZYSTKIE pliki z rozpakowanego folderu
8. Kliknij **"Commit changes"**

### Opcja B: Przez Linię Komend (dla zaawansowanych)

```bash
cd ścieżka/do/rozpakowanego/folderu
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TWOJA-NAZWA/budget-tracker.git
git push -u origin main
```

---

## KROK 4: Stwórz Projekt Supabase

1. Idź na: https://supabase.com
2. Kliknij **"Start your project"**
3. Zaloguj się przez GitHub
4. Kliknij **"New project"**
5. Wybierz **"New organization"** (lub użyj istniejącej)
6. Nazwij organizację np: "Moje Projekty"
7. Wypełnij dane projektu:
   - **Name**: `budget-tracker`
   - **Database Password**: Wymyśl mocne hasło i **ZAPISZ JE GDZIEŚ!**
   - **Region**: Wybierz **"Central EU (Frankfurt)"** (najbliżej Polski)
   - **Pricing Plan**: **"Free"** (wystarczy na start)
8. Kliknij **"Create new project"**
9. ⏳ Poczekaj 2-3 minuty aż projekt się stworzy

---

## KROK 5: Uruchom Migracje Bazy Danych

1. W dashboardzie Supabase kliknij **"SQL Editor"** w lewym menu
2. Kliknij **"New query"**

### Migracja 1: Podstawowa struktura

3. Skopiuj **CAŁY** kod z pliku `supabase/migrations/20260124145931_create_budget_app_schema.sql`
4. Wklej do SQL Editor
5. Kliknij **"Run"** (albo Ctrl+Enter)
6. Sprawdź czy jest zielony komunikat ✅ "Success"

### Migracja 2: Zdjęcia paragonów

7. Kliknij **"New query"** ponownie
8. Skopiuj **CAŁY** kod z pliku `supabase/migrations/20260127112618_add_receipt_images_to_expenses.sql`
9. Wklej i kliknij **"Run"**

### Migracja 3: Integracja Stripe

10. Kliknij **"New query"** ponownie
11. Skopiuj **CAŁY** kod z pliku `supabase/migrations/20260127113550_add_stripe_integration.sql`
12. Wklej i kliknij **"Run"**

**✅ Baza danych gotowa!**

---

## KROK 6: Skonfiguruj Stripe

1. Idź na: https://dashboard.stripe.com/register
2. Załóż konto (podaj email, nazwę firmy)
3. **WAŻNE**: Zostań w trybie **"Test mode"** na razie
4. Przejdź do: **Developers → API keys**

### Skopiuj klucze (WAŻNE - ZAPISZ JE!):

- **Publishable key** (zaczyna się od `pk_test_...`)
- **Secret key** (kliknij "Reveal", zaczyna się od `sk_test_...`)

### Stwórz produkt:

5. Idź do: **Products → Add product**
6. Wypełnij:
   - **Name**: "Premium Plan"
   - **Description**: "Unlimited budgets and expenses"
   - **Pricing**: Wybierz **"Recurring"**
   - **Price**: Wpisz swoją cenę (np. 29 PLN)
   - **Billing period**: **"Monthly"**
7. Kliknij **"Save product"**
8. **ZAPISZ Price ID** (zaczyna się od `price_...`)

---

## KROK 7: Zainstaluj Supabase CLI

### Windows:

1. Pobierz ze: https://github.com/supabase/cli/releases
2. Pobierz plik `supabase_windows_amd64.zip`
3. Rozpakuj
4. Przenieś `supabase.exe` do `C:\Windows\System32\`
5. Otwórz CMD i wpisz: `supabase --version`

### Mac:

```bash
brew install supabase/tap/supabase
```

### Linux:

```bash
brew install supabase/tap/supabase
```

---

## KROK 8: Zaloguj się do Supabase CLI

1. Otwórz terminal/CMD
2. Wpisz:
```bash
supabase login
```
3. Naciśnij Enter
4. Otworzy się przeglądarka - zaloguj się
5. Wróć do terminala - powinieneś zobaczyć "Logged in"

---

## KROK 9: Połącz się z Projektem

1. W terminalu, przejdź do folderu projektu:
```bash
cd ścieżka/do/twojego/projektu
```

2. Połącz się z projektem Supabase:
```bash
supabase link --project-ref TWÓJ_PROJECT_REF
```

**Gdzie znaleźć PROJECT_REF?**
- Idź do dashboardu Supabase
- Kliknij **"Project Settings"** (ikona zębatki)
- **General → Reference ID** - to jest Twój `PROJECT_REF`

3. Wpisz hasło do bazy (które stworzyłeś w KROKU 4)

---

## KROK 10: Ustaw Sekrety dla Edge Functions

1. W terminalu, ustaw klucz Stripe:
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_TWÓJ_KLUCZ_TUTAJ
```

2. Stwórz webhook secret (za chwilę go użyjemy):
```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=TEMPORARY_VALUE
```

---

## KROK 11: Wdróż Edge Functions

1. W terminalu:
```bash
supabase functions deploy create-checkout-session
```

2. Poczekaj aż się wdroży (10-30 sekund)

3. Potem:
```bash
supabase functions deploy stripe-webhook --no-verify-jwt
```

4. Po wdrożeniu, skopiuj **URL** który zobaczysz (będzie wyglądał jak):
```
https://TWÓJ_PROJECT_REF.supabase.co/functions/v1/stripe-webhook
```

**ZAPISZ TEN URL!**

---

## KROK 12: Skonfiguruj Webhook w Stripe

1. Idź do: https://dashboard.stripe.com/webhooks
2. Kliknij **"Add endpoint"**
3. Wklej URL z poprzedniego kroku
4. W **"Events to send"** wybierz:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Kliknij **"Add endpoint"**
6. Kliknij na nowo utworzony webhook
7. Kliknij **"Reveal"** przy "Signing secret"
8. **SKOPIUJ** ten secret (zaczyna się od `whsec_...`)

### Zaktualizuj webhook secret:

9. W terminalu:
```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_TWÓJ_SECRET_TUTAJ
```

---

## KROK 13: Pobierz Dane Supabase

1. W dashboardzie Supabase, kliknij **"Project Settings"** (zębatka)
2. Kliknij **"API"**
3. **ZAPISZ te wartości:**
   - **Project URL**: `https://XXXX.supabase.co`
   - **anon public key**: `eyJh...` (długi token)

---

## KROK 14: Wdróż na Netlify

1. Zaloguj się na: https://app.netlify.com
2. Kliknij **"Add new site"** → **"Import an existing project"**
3. Wybierz **"GitHub"**
4. Znajdź swoje repozytorium `budget-tracker`
5. Kliknij na nie
6. Skonfiguruj build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
7. **STOP! Nie klikaj "Deploy" jeszcze!**

### Dodaj zmienne środowiskowe:

8. Kliknij **"Add environment variables"**
9. Dodaj te zmienne (każda osobno):

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://TWÓJ_PROJECT_REF.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJh...` (twój anon key) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` (z KROKU 6) |
| `VITE_STRIPE_PRICE_ID` | `price_...` (z KROKU 6) |

10. **TERAZ** kliknij **"Deploy"**
11. Poczekaj 2-3 minuty

---

## KROK 15: Podłącz Swoją Domenę

1. Po zakończeniu deploy, kliknij **"Domain settings"**
2. Kliknij **"Add custom domain"**
3. Wpisz swoją domenę (np. `mojaapka.pl`)
4. Netlify pokaże Ci instrukcje DNS:
   - Jeśli domena jest już na Netlify - automatycznie się podłączy
   - Jeśli nie - musisz zaktualizować DNS u swojego dostawcy

5. Poczekaj aż SSL się skonfiguruje (może to zająć do godziny)

---

## KROK 16: Dodaj Dozwolone Domeny w Supabase

1. Wróć do dashboardu Supabase
2. Kliknij **"Authentication"** → **"URL Configuration"**
3. W **"Site URL"** wpisz: `https://twoja-domena.pl`
4. W **"Redirect URLs"** dodaj:
   - `https://twoja-domena.pl`
   - `https://twoja-domena.pl/**`
5. Kliknij **"Save"**

---

## KROK 17: Testuj Aplikację

1. Otwórz swoją domenę w przeglądarce
2. Załóż konto (test)
3. Dodaj wydatek
4. Kliknij **"Upgrade to Premium"**
5. Użyj testowej karty Stripe:
   - Numer: `4242 4242 4242 4242`
   - Data: dowolna przyszła (np. 12/25)
   - CVC: dowolne 3 cyfry (np. 123)
6. Dokończ płatność
7. Sprawdź czy status zmienił się na Premium

---

## KROK 18: Przejdź na Tryb Produkcyjny

Gdy wszystko działa:

1. W Stripe dashboard, przełącz się z **"Test mode"** na **"Live mode"** (przełącznik w prawym górnym rogu)
2. Idź do **Developers → API keys**
3. Skopiuj **PRAWDZIWE** klucze (zaczynają się od `pk_live_...` i `sk_live_...`)
4. Stwórz prawdziwy produkt (KROK 6 ponownie, ale w trybie Live)
5. Skonfiguruj prawdziwy webhook (KROK 12 ponownie, ale w trybie Live)

### Zaktualizuj zmienne środowiskowe:

**W Supabase:**
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_TWÓJ_PRAWDZIWY_KLUCZ
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_TWÓJ_PRAWDZIWY_SECRET
```

**Na Netlify:**
1. Idź do **Site settings → Environment variables**
2. Edytuj:
   - `VITE_STRIPE_PUBLISHABLE_KEY` → `pk_live_...`
   - `VITE_STRIPE_PRICE_ID` → `price_...` (nowy prawdziwy)
3. Kliknij **"Save"**
4. Kliknij **"Trigger deploy"** → **"Deploy site"**

---

## 🎉 GOTOWE!

Twoja aplikacja jest teraz na produkcji i możesz zarabiać!

---

## 📞 Pomoc w Razie Problemów

### Problem: Nie mogę zalogować się w aplikacji
- Sprawdź czy dodałeś domenę w Supabase (KROK 16)
- Sprawdź console w przeglądarce (F12)

### Problem: Płatność nie przechodzi
- Sprawdź czy webhook działa: https://dashboard.stripe.com/webhooks
- Zobacz logi webhooków w Stripe
- Sprawdź logi edge functions w Supabase

### Problem: "Invalid JWT"
- Sprawdź czy zmienne środowiskowe są dobrze ustawione
- Sprawdź czy anon key jest poprawny

### Problem: Aplikacja się nie ładuje
- Sprawdź czy build się powiódł na Netlify
- Sprawdź logi deploy na Netlify
- Sprawdź czy zmienne środowiskowe są ustawione

---

## 💰 Ważne dla Zarabiania

1. **Stripe wymaga:**
   - Zweryfikowania tożsamości firmy/osoby
   - Podania danych podatkowych
   - Podłączenia konta bankowego

2. **Podatki:**
   - Musisz zgłosić działalność gospodarczą w Polsce
   - Lub wystaw fakturę jako osoba prywatna (do 200 zł/miesiąc bez działalności)
   - Skonsultuj się z księgowym

3. **RODO:**
   - Dodaj politykę prywatności
   - Dodaj regulamin
   - Informuj użytkowników o przetwarzaniu danych

---

## 📈 Co Dalej?

- Monitoruj błędy (dodaj Sentry)
- Zbieraj feedback od użytkowników
- Dodawaj nowe funkcje
- Promuj aplikację!

**Powodzenia! 🚀**
