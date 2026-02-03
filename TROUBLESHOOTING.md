# 🔧 Rozwiązywanie Problemów

## 🚨 Najczęstsze Problemy

### 1. "Nie mogę się zalogować / zarejestrować"

**Objawy:**
- Po kliknięciu "Sign Up" nic się nie dzieje
- Widzę błąd w konsoli

**Rozwiązanie:**
1. Naciśnij F12 w przeglądarce
2. Sprawdź zakładkę "Console"
3. Szukaj błędów związanych z CORS lub "Redirect URL"

**Najprawdopodobniej:**
- Nie dodałeś swojej domeny w Supabase
- Idź do: Supabase Dashboard → Authentication → URL Configuration
- Dodaj: `https://twoja-domena.pl`
- Dodaj też: `https://twoja-domena.pl/**`

---

### 2. "Płatność nie przechodzi"

**Objawy:**
- Klikam "Subscribe" → płacę w Stripe → nie zmienia się na Premium

**Rozwiązanie:**

**Krok 1: Sprawdź webhook w Stripe**
1. Idź do: https://dashboard.stripe.com/webhooks
2. Kliknij na swój webhook
3. Sprawdź "Recent attempts"
4. Jeśli widzisz czerwone X → webhook nie działa

**Krok 2: Sprawdź co zwraca webhook**
1. Kliknij na nieudaną próbę
2. Zobacz "Response" od twojego serwera
3. Jeśli widzisz błąd 401/403 → problem z JWT
4. Jeśli widzisz błąd 400 → problem z webhook secret

**Krok 3: Sprawdź webhook secret**
```bash
supabase secrets list
```
- Sprawdź czy `STRIPE_WEBHOOK_SECRET` jest ustawiony
- Sprawdź czy zgadza się z Stripe

**Krok 4: Sprawdź logi edge function**
1. Idź do: Supabase Dashboard → Edge Functions
2. Kliknij "stripe-webhook"
3. Zobacz "Logs"
4. Szukaj błędów

---

### 3. "Internal Server Error" przy płatności

**Objawy:**
- Error 500 po kliknięciu "Upgrade to Premium"

**Rozwiązanie:**

**Sprawdź STRIPE_SECRET_KEY:**
```bash
supabase secrets list
```

**Jeśli nie ma:**
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_TWÓJ_KLUCZ
```

**Sprawdź VITE_STRIPE_PRICE_ID:**
1. Idź do Netlify → Site settings → Environment variables
2. Sprawdź czy `VITE_STRIPE_PRICE_ID` jest ustawiony
3. Sprawdź czy to poprawny Price ID z Stripe (zaczyna się od `price_`)

---

### 4. "Application error" na Netlify

**Objawy:**
- Biała strona z napisem "Application error"

**Rozwiązanie:**

**Krok 1: Sprawdź logi deploy**
1. Netlify Dashboard → Deploys
2. Kliknij ostatni deploy
3. Zobacz "Deploy log"
4. Szukaj błędów przy `npm run build`

**Krok 2: Sprawdź zmienne środowiskowe**
- Wszystkie 4 zmienne muszą być ustawione PRZED deploy
- Jeśli dodałeś je później → trigger nowy deploy

**Krok 3: Sprawdź czy dist/ się zbudował**
- W logu deploy szukaj "Build succeeded"
- Szukaj "dist/" w wynikach

---

### 5. Stripe webhook zwraca "Invalid signature"

**Objawy:**
- W Stripe webhook logs widzisz error "Invalid signature"

**Rozwiązanie:**

**To oznacza że webhook secret się nie zgadza.**

1. Idź do Stripe Dashboard → Webhooks
2. Kliknij na swój webhook
3. Kliknij "Reveal" przy "Signing secret"
4. Skopiuj cały secret (whsec_...)
5. Uruchom:
```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_DOKŁADNIE_TEN_SEKRET
```

**WAŻNE:** Nie używaj spacji ani cudzysłowów!

---

### 6. "Cannot read property 'map' of undefined"

**Objawy:**
- Aplikacja się ładuje ale crashuje przy próbie zobaczenia wydatków

**Rozwiązanie:**

**Problem z danymi z bazy:**

1. Sprawdź czy migracje się wykonały
2. Idź do: Supabase → SQL Editor
3. Uruchom:
```sql
SELECT * FROM expenses LIMIT 5;
```
4. Jeśli widzisz błąd "relation does not exist" → migracje się nie wykonały
5. Wykonaj ponownie migracje z KROKU 5 przewodnika

---

### 7. Edge Function timeout

**Objawy:**
- Długie ładowanie przy płatności
- Error "Function timeout"

**Rozwiązanie:**

**To może oznaczać problem z Stripe API:**

1. Sprawdź czy `STRIPE_SECRET_KEY` jest poprawny
2. Sprawdź czy nie używasz klucza z Test mode w Live mode (lub odwrotnie)
3. Sprawdź internet - może być problem z połączeniem

---

### 8. "User already registered" ale nie mogę się zalogować

**Objawy:**
- Rejestracja mówi że email istnieje
- Przy logowaniu: "Invalid credentials"

**Rozwiązanie:**

**Supabase domyślnie wymaga potwierdzenia emaila w niektórych przypadkach:**

1. Idź do: Supabase → Authentication → Users
2. Znajdź swojego usera
3. Sprawdź kolumnę "Confirmed At"
4. Jeśli jest pusta → kliknij trzy kropki → "Send Magic Link"
5. Albo kliknij trzy kropki → "Confirm User"

**Żeby wyłączyć potwierdzanie emaili:**
1. Authentication → Settings
2. Wyłącz "Enable email confirmations"

---

### 9. SSL/HTTPS errors

**Objawy:**
- "Your connection is not private"
- "NET::ERR_CERT_AUTHORITY_INVALID"

**Rozwiązanie:**

**Poczekaj na SSL:**
1. SSL certificate może zająć do 24 godzin
2. Zwykle jest gotowy w 10-30 minut
3. Sprawdź status: Netlify → Domain settings

**Jeśli nadal nie działa po 24h:**
1. Sprawdź DNS - czy wskazuje na Netlify
2. Spróbuj odnowić certyfikat: Domain settings → HTTPS → Renew certificate

---

### 10. Build działa lokalnie ale nie na Netlify

**Objawy:**
- `npm run build` działa na twoim komputerze
- Na Netlify deploy failuje

**Rozwiązanie:**

**Sprawdź wersję Node.js:**

1. Utwórz plik `.nvmrc` w głównym folderze projektu:
```
18
```

2. Albo dodaj do `package.json`:
```json
"engines": {
  "node": "18.x"
}
```

3. Commit i push

---

## 📞 Dalej nie działa?

### Debug krok po kroku:

1. **Otwórz Console (F12)**
   - Szukaj czerwonych błędów
   - Skopiuj cały komunikat

2. **Sprawdź Network (F12 → Network)**
   - Odśwież stronę
   - Szukaj requestów ze statusem 400/500
   - Kliknij → Response → zobacz co zwraca

3. **Sprawdź wszystkie zmienne:**
   ```bash
   # Netlify
   VITE_SUPABASE_URL=?
   VITE_SUPABASE_ANON_KEY=?
   VITE_STRIPE_PUBLISHABLE_KEY=?
   VITE_STRIPE_PRICE_ID=?

   # Supabase
   supabase secrets list
   STRIPE_SECRET_KEY=?
   STRIPE_WEBHOOK_SECRET=?
   ```

4. **Sprawdź czy wszystko jest wdrożone:**
   - GitHub: czy kod jest tam?
   - Supabase: czy edge functions są ACTIVE?
   - Netlify: czy ostatni deploy sukces?
   - Stripe: czy webhook jest aktywny?

---

## 🆘 Pytania?

Jeśli nic z powyższego nie pomogło:

1. Sprawdź dokładnie wszystkie kroki w DEPLOYMENT_GUIDE.md
2. Upewnij się że wykonałeś KAŻDY krok
3. Sprawdź czy nie pominąłeś żadnych zmiennych środowiskowych
4. Sprawdź logi wszystkich serwisów (Netlify, Supabase, Stripe)

**Najczęstszy problem:** Zapomniane zmienne środowiskowe lub źle skopiowane klucze!
