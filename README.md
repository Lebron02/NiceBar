# Testowanie i Jakość Oprogramowania

## Autor
**Szymon Adamczyk**<br>
nr. albumu: 36360

## Temat projektu
Sklep internetowy z artykułami barmańskimi i wbudowanym systemem treści edukacyjnych.

## Opis projektu
NiceBar to nowoczesna aplikacja webowa typu Headless Commerce umożliwiająca zakup sprzętu barmańskiego zintegrowanego z modułem bloga. Projekt symuluje realne środowisko sklepu internetowego, kładąc główny nacisk na proces zakupowy, bezpieczeństwo transakcji, logistykę zamówień oraz zarządzanie treścią.

System obsługuje dwie role użytkowników: Klienta oraz Administratora. Aplikacja realizuje pełną ścieżkę e-commerce: od przeglądania produktów, przez zarządzanie koszykiem i adresem dostawy, aż po bezpieczną płatność online i śledzenie statusu przesyłki.

**Główne funkcjonalności:**

### 1. Moduł sklepu i płatności
- **Katalog produktów:** Przeglądanie asortymentu z podziałem na ceny, kategorie i marki.
- **Koszyk zakupowy:** Dodawanie produktów, modyfikacja ilości oraz przeliczanie sumy zamówienia w czasie rzeczywistym.
- **Płatności online:** Pełna integracja z Stripe API. Obsługa bezpiecznych transakcji kartą oraz weryfikacja statusu płatności.

### 2. Panel użytkownika
- **Autentykacja i autoryzacja:** Bezpieczny system logowania i rejestracji oparty na sesjach serwerowych (Express-Session, MongoDB Store) oraz ciasteczkach `httpOnly`.
- **Zarządzanie profilem:** Edycja danych osobowych, bezpieczna zmiana hasła oraz zarządzanie domyślnym adresem dostawy.
- **Historia zamówień:** Podgląd złożonych zamówień wraz ze szczegółami produktów, kwotą oraz aktualnym statusem realizacji.

### 3. Panel administratora 
- **Zarządzanie produktami (CRUD):** Dodawanie nowych towarów, edycja cen, opisów i zdjęć oraz usuwanie produktów.
- **Zarządzanie zamówieniami:** Dostęp do listy wszystkich zamówień w systemie z możliwością podglądu danych do wysyłki.
- **Logistyka i statusy:** System zmiany statusów dostawy oparty na procesie, aktualizowany przez administratora, widoczny dla klienta.
- **Uprawnienia:** System umożliwiający w prosty, lecz bezpieczny sposób nadanie uprawnień administratora.

Aplikacja została skonteneryzowana przy użyciu platformy Docker, co zapewnia łatwość uruchomienia i spójność środowiska.

## Film z funkcjonowania aplikacji - blog
Film prezentuje uruchomienie środowiska Docker, wszystkie funkcjonalności aplikacji(moduł bloga), oraz obsługę autentykacji za pomocą **Express-Session i Connect-Mongo**  
**https://drive.google.com/file/d/1xTwAVIDrqsDtPar8HiEgixRw4RjM4r8o/view?usp=sharing**

## Film z funkcjonowania aplikacji - sklep
Film prezentuje wszystkie funkcjonalności modułu sprzedażowego, oraz obsługę płatności za pomocą **Stripe API**  
**https://drive.google.com/file/d/1htb5CCs3NcdDUMHNp0WUwT6Xm-fN0LEM/view?usp=drive_link**

## Uruchomienie projektu

> **Uwaga: Wymagane jest zainstalowane środowisko Docker oraz poprawnie skonfigurowany plik `.env`.**

**Projekt jest w pełni skonfigurowany do pracy z Dockerem. Aby uruchomić całe środowisko (Frontend, Backend, baza danych), należy wykonać poniższą komendę w głównym katalogu projektu:**

```bash
docker-compose up --build
```

Aplikacja będzie dostępna pod adresem: **http://localhost:5173**<br>
Serwer będzie działał pod adresem: **http://localhost:5000**

### Alternatywnie (uruchomienie lokalne bez Dockera):

**Backend:**
```bash
cd backend
npm install
npm run dev 
```

Frontend:
```bash 
cd frontend  
npm install 
npm run dev
```

## Testy aplikacji

W projekcie zastosowano wielowarstwowe podejście do testowania, obejmujące testy jednostkowe komponentów (Frontend) oraz testy integracyjne API (Backend).

### 1. Testy jednostkowe (Frontend)
Testy frontendowe zostały zrealizowane przy użyciu **Vitest** oraz **React Testing Library**. Skupiają się na renderowaniu komponentów, interakcjach użytkownika oraz logice routingu.

* **Lokalizacja:** `frontend/src/Tests/`
* **Zakres testów:**
    * `Auth.test.jsx` – Weryfikacja formularzy logowania i rejestracji, sprawdzanie walidacji haseł oraz wywoływania funkcji autoryzacyjnych.
    * `Shop.test.jsx` – Testowanie wyświetlania produktów, logiki dodawania do koszyka, obsługi stanów magazynowych (brak towaru) oraz galerii zdjęć.
    * `Blog.test.jsx` – Sprawdzanie renderowania postów, sekcji komentarzy (dla zalogowanych/niezalogowanych) oraz powiązanych produktów.
    * `Routing.test.jsx` – Testowanie poprawności nawigacji oraz przekierowań (np. obsługa błędów 404).

**Uruchomienie testów frontendu:**
```bash
docker exec -it nicebar-frontend-1 npm test
```

### 2. Testy integracyjne (Backend)
Testy backendowe zrealizowane za pomocą **Jest** oraz **Supertest**. Weryfikują one poprawność działania endpointów API, komunikację z bazą danych MongoDB oraz mechanizmy bezpieczeństwa.

* **Lokalizacja:** `backend/tests/integration.test.js`
* **Zakres testów:**
    * **Autentykacja** – Rejestracja, logowanie, obsługa sesji i ciasteczek **httpOnly**.
    * **Produkty (CRUD):** – Tworzenie, odczyt, aktualizacja i usuwanie produktów.
    * **Bezpieczeństwo:** – Weryfikacja, czy zwykły użytkownik nie ma dostępu do zasobów administratora (np. usuwanie produktów).
    * **Walidacja:** – Sprawdzanie poprawności danych wejściowych (np. blokada ujemnych cen).

**Uruchomienie testów backendu:**
```bash
docker exec -it nicebar-backend-1 npm test
```

## Technologie użyte w projekcie
**Backend:**
- **Node.js** - środowisko uruchomieniowe.
- **Express.js** - framework serwerowy.
- **MongoDB & Mongoose** - baza danych NoSQL oraz ODM do modelowania danych.
- **Express-Session & Connect-Mongo** - obsługa sesji użytkowników i ich zapis w bazie.
- **Bcrypt** - bezpieczne hashowanie haseł.
- **Stripe API** - obsługa płatności online.
- **Gemini API** - generowanie sugestii treści przez AI dla powiązań produktów i postów.
- **Multer** - obsługa przesyłania plików (zdjęcia produktów).

**Frontend:**
- **React.js** - biblioteka do budowy interfejsu użytkownika.
- **Vite** - narzędzie do budowania i uruchamiania projektu.
- **React Router** - routing po stronie klienta.
- **Axios** - klient HTTP do komunikacji z API.
- **Stripe.js & React Stripe** - bezpieczne komponenty płatności.
- **Tailwind CSS** - framework CSS do stylizacji.
- **Shadcn/ui & Lucide React** - biblioteka komponentów interfejsu i ikon.

**Testowanie:**
- **Vitest** - runner testów dla aplikacji Vite (Frontend).
- **React Testing Library** - testowanie komponentów React.
- **Jest** - framework testowy (Backend).
- **Supertest** - testowanie endpointów HTTP.

**Narzędzia programistyczne:**
- **Docker & Docker Compose** - konteneryzacja i orkiestracja serwisów.
- **Git** - system kontroli wersji.
