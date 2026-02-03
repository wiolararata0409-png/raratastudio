# ✅ Szybka Checklista Wdrożenia

Zaznaczaj kolejne kroki gdy je wykonasz:

## Przygotowanie
- [ ] Pobierz kod z bolt.new (ZIP)
- [ ] Rozpakuj folder
- [ ] Załóż konto GitHub
- [ ] Wrzuć kod na GitHub

## Supabase
- [ ] Załóż konto na supabase.com
- [ ] Stwórz nowy projekt
- [ ] **ZAPISZ hasło do bazy!**
- [ ] Uruchom 3 migracje przez SQL Editor
- [ ] Zapisz Project URL
- [ ] Zapisz anon key

## Stripe
- [ ] Załóż konto na stripe.com
- [ ] Skopiuj Publishable key (pk_test_...)
- [ ] Skopiuj Secret key (sk_test_...)
- [ ] Stwórz produkt Premium
- [ ] **Zapisz Price ID!**

## Supabase CLI
- [ ] Zainstaluj Supabase CLI
- [ ] Zaloguj się: `supabase login`
- [ ] Połącz z projektem: `supabase link`
- [ ] Ustaw STRIPE_SECRET_KEY
- [ ] Ustaw STRIPE_WEBHOOK_SECRET (tymczasowo)

## Edge Functions
- [ ] Wdróż: `supabase functions deploy create-checkout-session`
- [ ] Wdróż: `supabase functions deploy stripe-webhook --no-verify-jwt`
- [ ] **Zapisz URL stripe-webhook!**

## Webhook Stripe
- [ ] Dodaj webhook w Stripe Dashboard
- [ ] Dodaj 3 eventy (checkout, updated, deleted)
- [ ] Skopiuj webhook secret (whsec_...)
- [ ] Zaktualizuj: `supabase secrets set STRIPE_WEBHOOK_SECRET=...`

## Netlify
- [ ] Zaloguj się na netlify.com
- [ ] Import z GitHub
- [ ] Dodaj 4 zmienne środowiskowe:
  - [ ] VITE_SUPABASE_URL
  - [ ] VITE_SUPABASE_ANON_KEY
  - [ ] VITE_STRIPE_PUBLISHABLE_KEY
  - [ ] VITE_STRIPE_PRICE_ID
- [ ] Deploy!
- [ ] Podłącz swoją domenę
- [ ] Poczekaj na SSL

## Finalizacja
- [ ] Dodaj domenę w Supabase (Authentication → URL Configuration)
- [ ] Przetestuj rejestrację
- [ ] Przetestuj dodanie wydatku
- [ ] Przetestuj płatność (karta 4242...)
- [ ] Sprawdź czy Premium działa

## Produkcja
- [ ] Przełącz Stripe na Live mode
- [ ] Nowe klucze API
- [ ] Nowy produkt
- [ ] Nowy webhook (Live)
- [ ] Zaktualizuj wszystkie zmienne
- [ ] Trigger deploy na Netlify
- [ ] Finalny test z prawdziwą kartą

## 🎉 GOTOWE!

---

## Zapisane Wartości (wypełnij!)

**Supabase:**
- Project URL: _______________________
- Anon Key: _______________________
- Project REF: _______________________

**Stripe Test:**
- Publishable Key: _______________________
- Secret Key: _______________________
- Price ID: _______________________
- Webhook Secret: _______________________

**Stripe Live:**
- Publishable Key: _______________________
- Secret Key: _______________________
- Price ID: _______________________
- Webhook Secret: _______________________

**Inne:**
- Moja domena: _______________________
- GitHub repo: _______________________
