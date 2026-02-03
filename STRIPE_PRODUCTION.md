# 💳 Aktywacja Stripe - Tryb Produkcyjny

## ⚠️ WAŻNE: Test vs Production

**Test Mode** (gdzie jesteś teraz):
- ❌ Nie akceptuje prawdziwych płatności
- ✅ Idealny do testowania
- ✅ Testowa karta: 4242 4242 4242 4242

**Production Mode** (do zarabiania):
- ✅ Akceptuje prawdziwe płatności
- ✅ Pieniądze trafiają na Twoje konto
- ⚠️ Wymaga weryfikacji firmy

---

## 🚀 Krok po Kroku: Aktywacja Produkcji

### KROK 1: Aktywuj Konto Stripe

1. Zaloguj się na: https://dashboard.stripe.com
2. W górnym bannerze zobaczysz: **"Activate your account"**
3. Kliknij **"Activate account"**

### KROK 2: Wypełnij Dane Firmy/Osoby

**Będziesz musiał podać:**

#### Dane osobowe:
- Imię i nazwisko
- Data urodzenia
- Adres zamieszkania
- Numer telefonu

#### Dane firmy (jeśli masz działalność):
- Nazwa firmy
- NIP
- Adres siedziby
- Rodzaj działalności: wybierz **"Software / SaaS"**

#### Jeśli NIE masz działalności:
- Możesz wystawić **do 200 zł** miesięcznie bez działalności
- Wybierz "Individual" (osoba prywatna)
- Stripe wyśle Ci PIT na koniec roku

#### Dane bankowe:
- Numer konta bankowego (IBAN)
- Wszystkie płatności trafią na to konto

#### Weryfikacja tożsamości:
- Zdjęcie dowodu osobistego
- Lub paszport
- Lub prawo jazdy

### KROK 3: Poczekaj na Weryfikację

- ⏳ Weryfikacja trwa **1-2 dni robocze**
- Dostaniesz email gdy konto będzie aktywne
- Możesz już przygotować aplikację (kroki poniżej)

---

## 🔄 Przełączenie Aplikacji na Production

### KROK 4: Przełącz Stripe na Live Mode

1. W Stripe Dashboard, w **prawym górnym rogu** znajdziesz przełącznik:
   ```
   Test mode ⚡ Live mode
   ```
2. Kliknij i przełącz na **"Live mode"**

### KROK 5: Pobierz Live API Keys

1. Idź do: **Developers → API keys**
2. **UPEWNIJ SIĘ ŻE JESTEŚ W LIVE MODE!** (nie Test)
3. Skopiuj i **ZAPISZ BEZPIECZNIE**:
   - **Publishable key** (zaczyna się od `pk_live_...`)
   - **Secret key** (kliknij "Reveal", zaczyna się od `sk_live_...`)

### KROK 6: Stwórz Produkt w Live Mode

1. Idź do: **Products → Add product**
2. Wypełnij:
   - **Name**: "Premium Plan"
   - **Description**: "Unlimited budgets and expenses tracking"
   - **Pricing**:
     - Model: **"Recurring"**
     - Price: **Twoja cena** (np. 29 PLN)
     - Billing: **"Monthly"**
3. Kliknij **"Save product"**
4. **SKOPIUJ Price ID** (zaczyna się od `price_...`)

⚠️ To jest **NOWY** Price ID, inny niż w Test mode!

### KROK 7: Skonfiguruj Live Webhook

1. Idź do: **Developers → Webhooks**
2. **UPEWNIJ SIĘ ŻE JESTEŚ W LIVE MODE!**
3. Kliknij **"Add endpoint"**
4. Wklej URL:
   ```
   https://TWÓJ_PROJECT_REF.supabase.co/functions/v1/stripe-webhook
   ```
5. W **"Events to send"** wybierz:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
6. Kliknij **"Add endpoint"**
7. Kliknij na nowo utworzony webhook
8. Kliknij **"Reveal"** przy **"Signing secret"**
9. **SKOPIUJ signing secret** (zaczyna się od `whsec_...`)

### KROK 8: Zaktualizuj Supabase Secrets

Otwórz terminal w folderze projektu:

```bash
# Zaktualizuj Stripe Secret Key
supabase secrets set STRIPE_SECRET_KEY=sk_live_TWÓJ_PRAWDZIWY_KLUCZ

# Zaktualizuj Webhook Secret
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_TWÓJ_PRAWDZIWY_SECRET
```

### KROK 9: Zaktualizuj Zmienne na Netlify

1. Zaloguj się na: https://app.netlify.com
2. Wybierz swój projekt (budget-tracker)
3. Idź do: **Site settings → Environment variables**
4. Zaktualizuj te zmienne:

**VITE_STRIPE_PUBLISHABLE_KEY**
- Stara wartość: `pk_test_...`
- **Nowa wartość**: `pk_live_TWÓJ_PRAWDZIWY_KLUCZ`

**VITE_STRIPE_PRICE_ID**
- Stara wartość: `price_test...`
- **Nowa wartość**: `price_TWÓJ_NOWY_LIVE_PRICE_ID`

5. Kliknij **"Save"**

### KROK 10: Redeploy Aplikacji

1. W Netlify, idź do zakładki **"Deploys"**
2. Kliknij **"Trigger deploy"**
3. Wybierz **"Deploy site"**
4. Poczekaj 2-3 minuty

---

## ✅ Testowanie Produkcji

### ⚠️ WAŻNE: Teraz to będą PRAWDZIWE płatności!

1. Otwórz swoją aplikację
2. Zaloguj się (lub stwórz nowe konto)
3. Kliknij **"Upgrade to Premium"**
4. Użyj **PRAWDZIWEJ karty kredytowej**
5. Dokończ płatność

**Sprawdź czy:**
- ✅ Płatność przeszła w Stripe Dashboard
- ✅ Status zmienił się na Premium w aplikacji
- ✅ Masz dostęp do funkcji Premium

---

## 💰 Monitoring Przychodów

### Gdzie sprawdzić zarobki:

1. **Stripe Dashboard → Home**
   - Widzisz całkowity przychód
   - Widzisz liczbę klientów
   - Widzisz nadchodzące płatności (recurring)

2. **Stripe Dashboard → Payments**
   - Lista wszystkich płatności
   - Status każdej płatności
   - Szczegóły klienta

3. **Stripe Dashboard → Customers**
   - Lista wszystkich klientów
   - Aktywne subskrypcje
   - Historia płatności każdego klienta

### Wypłaty na konto:

- Stripe automatycznie wypłaca pieniądze na Twoje konto
- **Domyślnie**: co 7 dni
- **Możesz zmienić na**: codziennie lub co miesiąc
- Idź do: **Settings → Business settings → Payouts**

---

## 🔐 Bezpieczeństwo w Production

### ✅ Sprawdź przed startem:

- [ ] Używasz HTTPS (Netlify automatycznie)
- [ ] Wszystkie zmienne środowiskowe są ustawione
- [ ] Webhook secret jest poprawny (Live, nie Test)
- [ ] RLS jest włączone na wszystkich tabelach
- [ ] Masz politykę prywatności
- [ ] Masz regulamin
- [ ] Informujesz o RODO

### ⚠️ NIGDY NIE:

- ❌ Commituj Secret keys do GitHub
- ❌ Udostępniaj Secret keys nikomu
- ❌ Używaj Test keys w Production
- ❌ Wyłączaj webhook verification

---

## 📊 Analityka i Podatki

### Dane do księgowości:

1. **Stripe Dashboard → Reports**
   - Export wszystkich transakcji
   - Formaty: CSV, Excel
   - Filtry: daty, produkty, status

2. **Stripe → Tax Settings**
   - Możesz skonfigurować automatyczne podatki
   - Stripe może wystawiać faktury za Ciebie (Stripe Tax)

### Co musisz zgłosić:

**Jeśli masz działalność gospodarczą:**
- Wszystkie przychody w rocznym PIT
- Prowizje Stripe możesz odliczyć jako koszt
- Skonsultuj się z księgową

**Jeśli nie masz działalności:**
- Do 200 zł/miesiąc: wystarczy PIT
- Powyżej: musisz założyć działalność

---

## 🎯 Optymalizacja Sprzedaży

### Zwiększ konwersję:

1. **Darmowy trial**
   - Stripe obsługuje darmowy trial
   - Np. 14 dni za darmo, potem płatność

2. **Różne plany**
   - Basic: 19 PLN/m
   - Pro: 39 PLN/m
   - Business: 79 PLN/m

3. **Roczne subskrypcje z rabatem**
   - Zamiast 29 PLN/m
   - Zapłać 299 PLN/rok (oszczędź 49 PLN)

4. **Kody rabatowe**
   - Stripe → Products → Coupons
   - Np. LAUNCH50 - 50% rabatu przez 3 miesiące

---

## 🆘 Problemy w Production

### "Payment failed" dla klientów:

**Możliwe przyczyny:**
1. Brak środków na karcie
2. Karta zablokowana przez bank (zabezpieczenie 3D Secure)
3. Zagraniczny klient (sprawdź czy akceptujesz międzynarodowe płatności)

**Rozwiązanie:**
- Stripe → Settings → Payment methods
- Włącz więcej metod płatności (Google Pay, Apple Pay)

### Webhook nie działa:

1. Sprawdź: Stripe → Webhooks → Recent attempts
2. Zobacz błędy (czerwone X)
3. Sprawdź czy URL jest poprawny
4. Sprawdź czy secret jest z Live mode (nie Test!)

---

## 🎉 Gratulacje!

Twoja aplikacja jest teraz **w pełni funkcjonalna** i **generuje przychody**!

### Co dalej?

1. **Marketing** - przyciągnij użytkowników
2. **Rozwój** - dodawaj funkcje na podstawie feedbacku
3. **Skalowanie** - gdy będziesz mieć 100+ klientów, rozważ:
   - Upgrade Supabase do Pro
   - Własny serwer
   - Aplikacja mobilna

**Powodzenia w biznesie! 💰**
