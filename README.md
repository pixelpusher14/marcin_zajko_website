# Marcin Zajko — Portfolio

Statyczne portfolio UI/UX Designera zbudowane w HTML i CSS. Strona główna przedstawia autora i wybrane realizacje, a katalog `projects/` zawiera case studies projektów Traficar i ReadMe.

## Struktura

- `index.html` — strona główna.
- `projects/` — podstrony projektów.
- `css/styles.css` — główny arkusz CSS.
- `css/reset.css` — reset stylów przeglądarki.
- `css/font.css` — lokalna definicja Inter Variable.
- `css/variables.css` — kolory i współdzielone wartości CSS.
- `assets/` — font, obrazy, ikony i favicon.

Dokumenty HTML ładują jeden arkusz `styles.css`, który importuje pozostałe pliki CSS. Projekt nie ma zależności, procesu budowania ani skonfigurowanych testów automatycznych.
