# 🚀 JAK WRZUCIĆ APLIKACJĘ NA NETLIFY - KROK PO KROKU

## OPCJA 1: Szybka (Pobierz gotowy plik)

### Krok 1: Pobierz plik
1. Uruchom aplikację lokalnie: `npm run dev`
2. Otwórz przeglądarkę: http://localhost:5173
3. **Kliknij ZIELONY PRZYCISK "Pobierz dist.zip"** na stronie logowania
4. Plik dist.zip pobierze się automatycznie

### Krok 2: Wypakuj plik
1. Znajdź pobrany plik `dist.zip` (zwykle w folderze Pobrane)
2. **ROZPAKUJ GO** - powinieneś mieć folder `dist` z plikami:
   - `index.html`
   - `_redirects`
   - folder `assets` (z plikami CSS i JS)

### Krok 3: Wrzuć na Netlify
1. Wejdź na: https://app.netlify.com
2. Zaloguj się lub utwórz konto (DARMOWE!)
3. **PRZECIĄGNIJ I UPUŚĆ** cały folder `dist` na stronę Netlify
4. Poczekaj 30 sekund - gotowe!

### Krok 4: Dodaj zmienne środowiskowe
1. W Netlify, kliknij na swoją stronę
2. Przejdź do: **Site settings** → **Environment variables**
3. Dodaj te zmienne (kliknij "Add a variable"):

```
VITE_SUPABASE_URL = https://voshfyuwgdnoqzbeorrq.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvc2hmeXV3Z2Rub3F6YmVvcnJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjUxOTcsImV4cCI6MjA4NDg0MTE5N30.anLn_uTW13VGVwiMnEyDEdogIfDn82w5vpwrP6KbQkM
VITE_STRIPE_MONTHLY_PRICE_ID = price_1Sw44eIGaBunnl9EJHb1R0RA
VITE_STRIPE_YEARLY_PRICE_ID = price_1Sw49MIGaBunnl9Ef2fImVXu
```

4. Kliknij **"Redeploy site"** (Trigger deploy → Clear cache and deploy site)

### Krok 5: GOTOWE!
Twoja aplikacja działa! Link dostaniesz od Netlify (np. `https://twoja-nazwa.netlify.app`)

---

## OPCJA 2: Jeśli nie możesz uruchomić lokalnie

### Jeśli nie możesz uruchomić `npm run dev`:

1. **W tym folderze** już jest gotowy plik: `dist.zip` (w głównym katalogu projektu)
2. **ROZPAKUJ GO**
3. Postępuj według **Kroków 3-5** z Opcji 1

---

## ⚠️ JEŚLI NADAL NIE DZIAŁA:

### Problem: "Cannot connect to localhost:5173"
- Poczekaj 30-60 sekund po uruchomieniu `npm run dev`
- Upewnij się, że nic innego nie używa portu 5173
- Spróbuj zamknąć terminal i uruchomić ponownie

### Problem: "dist.zip nie pobiera się"
- Użyj pliku `dist.zip` który jest już w folderze projektu
- Lub uruchom: `npm run build` a potem spakuj folder `dist` ręcznie

### Problem: "Strona biała po wrzuceniu na Netlify"
- Sprawdź czy dodałeś zmienne środowiskowe (Krok 4)
- Sprawdź czy w folderze dist jest plik `_redirects`
- Kliknij "Redeploy site" w Netlify

---

## 📞 POTRZEBUJESZ POMOCY?

Powiedz mi dokładnie co nie działa:
- "Nie mogę uruchomić lokalnie" → Opiszę co robić
- "dist.zip się nie pobiera" → Dam inny sposób
- "Strona nie działa na Netlify" → Sprawdzę co jest nie tak

**Napisz: "POMOC: [opisz problem]"** a pomogę natychmiast!
