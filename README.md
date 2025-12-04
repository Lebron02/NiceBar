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

## Technologie użyte w projekcie
**Backend:**

- **Node.js** - środowisko uruchomieniowe.

- **Express.js** - framework serwerowy.

- **MongoDB & Mongoose** - baza danych NoSQL oraz ODM do modelowania danych.

- **Express-Session & Connect-Mongo** - obsługa sesji użytkowników i ich zapis w bazie.

- **Bcrypt** - hashowanie haseł.

**Frontend:**

- **React.js** - biblioteka do budowy interfejsu użytkownika.

- **Vite** - narzędzie do budowania i uruchamiania projektu.

- **React Router** - routing po stronie klienta.

- **Axios** - klient HTTP do komunikacji z API.

- **Tailwind CSS** - framework CSS do stylizacji.

- **Shadcn/ui** - biblioteka komponentów interfejsu.

**Narzędzia programistyczne**:

- **Docker & Docker Compose** - konteneryzacja i uruchomienie wielu serwisów na raz.

- **Git** - system kontroli wersji.
