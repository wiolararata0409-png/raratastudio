# 🎯 INSTRUKCJA - JAK POBRAĆ PLIK

## SPOSÓB 1 - PRZEZ APLIKACJĘ (NAJŁATWIEJSZY!)

1. **Uruchom serwer**:
   - W terminalu wpisz: `npm run dev`
   - Poczekaj 30 sekund aż się uruchomi

2. **Otwórz przeglądarkę**:
   - Wejdź na: `http://localhost:5173`

3. **KLIKNIJ ZIELONY PRZYCISK** na stronie:
   - Zobaczysz duży zielony przycisk "POBIERZ DIST.ZIP"
   - **KLIKNIJ GO** - plik automatycznie się pobierze do folderu "Pobrane"

4. **Gotowe!** Masz plik dist.zip

---

## SPOSÓB 2 - ALTERNATYWNA STRONA

1. **Uruchom serwer**: `npm run dev`

2. **Otwórz**: `http://localhost:5173/download.html`

3. **Kliknij przycisk** na stronie

---

## SPOSÓB 3 - JEŚLI SERWER NIE DZIAŁA

Jeśli nie możesz uruchomić serwera, zrób tak:

1. **Otwórz terminal** w tym projekcie

2. **Wpisz**:
   ```bash
   cd /tmp/cc-agent/62941691/project
   python3 -m http.server 8000
   ```

3. **Otwórz przeglądarkę**: `http://localhost:8000`

4. **Kliknij** na `dist.zip`

---

## CO DALEJ?

Po pobraniu pliku:

1. **Rozpakuj** dist.zip (kliknij prawym → Wypakuj tutaj)

2. **Powinieneś mieć folder "dist"** z plikami:
   - index.html
   - folder "assets"

3. **Wejdź na Netlify**: https://app.netlify.com

4. **PRZECIĄGNIJ** folder "dist" na stronę Netlify

5. **Dodaj zmienne środowiskowe** (są w pliku `.env`)

6. **Kliknij "Redeploy"**

7. **GOTOWE!**

---

## ⚠️ NADAL NIE DZIAŁA?

Napisz mi DOKŁADNIE:
- Co robisz (krok po kroku)
- Co widzisz (jaki błąd, co się dzieje)
- Na którym kroku się zatrzymujesz

I naprawię to NATYCHMIAST!
