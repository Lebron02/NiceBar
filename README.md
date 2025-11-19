# Testowanie i Jakość Oprogramowania

## Autor
**Szymon Adamczyk**<br>
nr. albumu: 36060

## Temat projektu
Sklep internetowy z artykułami barmańskimi i wbudowanym systemem treści edukacyjnych

## Opis projektu
NiceBar to pełnowymiarowa aplikacja typu Headless Commerce umożliwiająca prowadzenie bloga. System pozwala użytkownikom na przeglądanie treści, a po zalogowaniu na interakcję z serwisem.

**Główne funkcjonalności:**
- **Autentykacja i autoryzacja:** Bezpieczny system logowania i rejestracji oparty na sesjach serwerowych (server-side sessions) przechowywanych w bazie MongoDB oraz ciasteczkach `httpOnly`. Hasła użytkowników są szyfrowane.
- **Zarządzanie postami (CRUD):** Możliwość dodawania, edytowania, usuwania oraz przeglądania szczegółów postów.
- **System komentarzy:** Zalogowani użytkownicy mogą komentować wpisy.
- **Profile użytkowników:** Możliwość podglądu danych profilowych oraz uzupełnienia adresu.
- **Ochrona tras:** Dostęp do funkcji edycji i dodawania treści jest zabezpieczony przed niezalogowanymi użytkownikami.

Aplikacja została konteneryzowana przy użyciu platformy Docker, co zapewnia łatwość uruchomienia i spójność środowiska.

## Uruchomienie projektu

Projekt jest w pełni skonfigurowany do pracy z Dockerem. Aby uruchomić całe środowisko (Backend, frontend oraz bazę danych), należy wykonać poniższą komendę w głównym katalogu projektu:

```bash
docker-compose up --build
```

Aplikacja będzie dostępna pod adresem: **http://localhost:5173**<br>
Serwer będzie działał pod adresem: **http://localhost:5000**

### Alternatywnie (uruchomienie lokalne bez Dockera):

> **Uwaga:** Wymagana jest działająca lokalnie instancja MongoDB.

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

Wymagana lokalna instancja MongoDB.

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