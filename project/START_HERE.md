# 🚀 JAK POBRAĆ DIST.ZIP - ZACZNIJ TUTAJ!

## ⚡ NAJPROSTSZA METODA - 4 KROKI:

### KROK 1: Uruchom serwer
W terminalu wpisz i naciśnij ENTER:
```bash
npm run dev
```
**POCZEKAJ 30 SEKUND** aż zobaczysz komunikat z adresem

---

### KROK 2: Otwórz przeglądarkę
W przeglądarce wpisz DOKŁADNIE:
```
http://localhost:5173/pobierz.html
```

---

### KROK 3: Kliknij ZIELONY PRZYCISK
Zobaczysz WIELKI ZIELONY PRZYCISK "⬇️ KLIKNIJ TUTAJ"

**KLIKNIJ GO** - plik pobierze się automatycznie

---

### KROK 4: Znajdź plik
Otwórz folder "Pobrane" - tam jest **dist.zip**

---

## ✅ CO DALEJ PO POBRANIU?

1. **Rozpakuj** dist.zip (prawy klik → Wypakuj)
2. **Wejdź na** https://app.netlify.com
3. **Przeciągnij** folder "dist" na stronę
4. **GOTOWE!**

---

## 📚 POTEM przeczytaj:

### Co masz teraz:
- ✅ Aplikację zbudowaną w bolt.new
- ✅ Działającą bazę danych
- ✅ Gotowy kod

### Co musisz zrobić żeby zarabiać:

```
┌─────────────────────────────────────────────────┐
│  1. Pobierz kod z bolt.new (ZIP)                │
│  2. Wrzuć na GitHub                             │
│  3. Stwórz projekt Supabase (darmowy)           │
│  4. Uruchom 3 migracje SQL                      │
│  5. Załóż konto Stripe (darmowe)                │
│  6. Wdróż 2 edge functions                      │
│  7. Podłącz webhook Stripe                      │
│  8. Deploy na Netlify (masz już konto)          │
│  9. Testuj z kartą 4242...                      │
│  10. Przełącz na prawdziwe płatności            │
└─────────────────────────────────────────────────┘
```

**Czas: 2-3 godziny (pierwszy raz)**

---

## 📚 Dokumenty (czytaj po kolei):

### 1. ZACZNIJ OD: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
   - Szczegółowa instrukcja krok po kroku
   - Jak dziecko za rączkę
   - **Przeczytaj to najpierw!**

### 2. UŻYJ: [QUICK_CHECKLIST.md](./QUICK_CHECKLIST.md)
   - Wydrukuj to
   - Zaznaczaj co zrobiłaś
   - Nie pomiń żadnego kroku

### 3. GDY COŚ NIE DZIAŁA: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
   - Najczęstsze problemy
   - Gotowe rozwiązania
   - Debug krok po kroku

### 4. PRAWDZIWE PŁATNOŚCI: [STRIPE_PRODUCTION.md](./STRIPE_PRODUCTION.md)
   - Jak przejść z testów na produkcję
   - Jak aktywować prawdziwe płatności
   - Jak zarabiać

### 5. INFORMACJE: [README.md](./README.md)
   - Przegląd projektu
   - Stack technologiczny
   - FAQ

---

## ⚠️ NAJWAŻNIEJSZE!

### Nie pomiń tych kroków (inaczej nie zadziała):

1. **Uruchom WSZYSTKIE 3 migracje** w Supabase
2. **Ustaw WSZYSTKIE 4 zmienne** na Netlify:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - VITE_STRIPE_PUBLISHABLE_KEY
   - VITE_STRIPE_PRICE_ID
3. **Ustaw 2 sekrety** w Supabase:
   - STRIPE_SECRET_KEY
   - STRIPE_WEBHOOK_SECRET
4. **Skonfiguruj webhook** w Stripe (3 eventy!)
5. **Dodaj domenę** w Supabase → Authentication

---

## 💰 Ile to kosztuje?

### DARMOWE:
- ✅ Supabase (do 500 MB)
- ✅ Netlify (do 100 GB bandwidth)
- ✅ GitHub (publiczne repo)
- ✅ Stripe (płacisz tylko prowizje od sprzedaży)

### ZAROBISZ:
- Ustawiasz cenę (np. 29 PLN/miesiąc)
- Stripe pobiera ~1.40 PLN
- **Dostajesz ~27.60 PLN** czystego

---

## 🎯 Szybka ścieżka (jeśli znasz się na kodzie):

```bash
# 1. Pobierz i rozpakuj
# 2. GitHub
git init
git add .
git commit -m "Initial"
git push

# 3. Supabase - stwórz projekt przez GUI
# 4. Migracje - skopiuj SQL przez GUI
# 5. Stripe - załóż konto przez GUI

# 6. CLI
npm install -g supabase
supabase login
supabase link --project-ref TWÓJ_REF
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_WEBHOOK_SECRET=TEMP

# 7. Edge Functions
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook --no-verify-jwt

# 8. Webhook - skonfiguruj przez Stripe GUI
# Potem:
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...

# 9. Netlify - połącz z GitHub
# Dodaj 4 zmienne VITE_*
# Deploy!
```

---

## 🆘 Zgubiłaś się?

### Wróć do: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

To jest główny przewodnik z dokładnymi instrukcjami.

**Czytaj krok po kroku i nie pomiń NICZEGO!**

---

## ✅ Checklist Ultra-Mini

- [ ] Kod na GitHub
- [ ] Projekt Supabase
- [ ] 3 migracje SQL ✓
- [ ] Konto Stripe
- [ ] 2 edge functions wdrożone
- [ ] Webhook Stripe skonfigurowany
- [ ] 4 zmienne na Netlify
- [ ] 2 sekrety w Supabase
- [ ] Deploy na Netlify
- [ ] Domena podłączona
- [ ] Test z kartą 4242
- [ ] Production mode (po testach)

---

## 🚀 GO!

Teraz idź do [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) i zacznij od KROKU 1!

**Powodzenia! 💪**
