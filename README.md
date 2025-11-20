# Testowanie i Jakość Oprogramowania

## Autor
**Szymon Adamczyk**<br>
nr. albumu: 36060

## Temat projektu
Sklep internetowy z artykułami barmańskimi i wbudowanym systemem treści edukacyjnych.

## Opis projektu
NiceBar to aplikacja typu Headless Commerce umożliwiająca prowadzenie bloga oraz sprzedaż produktów. **W ramach przedmiotu przetestowany zostanie moduł bloga oraz system autentykacji i autoryzacji.** System pozwala niezalogowanym użytkownikom na przeglądanie treści, a po zalogowaniu na interakcję z serwisem.

**Główne funkcjonalności:**
- **Autentykacja i autoryzacja:** Bezpieczny system logowania i rejestracji oparty na sesjach serwerowych (server-side sessions) przechowywanych w bazie MongoDB oraz ciasteczkach `httpOnly`. Hasła użytkowników są szyfrowane. Możliwa jest zmiana adresu przypisanego do konta użytkownika oraz hasło. Istnieje również możliwość zmiany uprawnień z użytkowinka na administratora po wpisaniu tajnego kodu. 
- **Zarządzanie postami (CRUD):** Możliwość dodawania, edytowania, usuwania oraz przeglądania szczegółów postów.
- **System komentarzy:** Zalogowani użytkownicy mogą komentować wpisy.
- **Profile użytkowników:** Możliwość podglądu danych profilowych oraz uzupełnienia adresu.
- **Ochrona tras:** Dostęp do funkcji edycji i dodawania treści jest zabezpieczony przed niezalogowanymi użytkownikami.

Aplikacja została konteneryzowana przy użyciu platformy Docker, co zapewnia łatwość uruchomienia i spójność środowiska.

## Film z funkcjonowania aplikacji
Film prezentuje uruchomienie środowiska Docker, wszystkie funkcjonalności aplikacji(moduł bloga), oraz obsługę autentykacji za pomocą **Express-Session i Connect-Mongo**  
**https://drive.google.com/file/d/1xTwAVIDrqsDtPar8HiEgixRw4RjM4r8o/view?usp=sharing**

## Uruchomienie projektu

> **Uwaga: Wymagane jest zainstalowane środowisko Docker. Baza danych automatycznie tworzy pusty wolumen na dysku twardym w formie folderu. Nie będzie on posiadał żadnych istniejących kont ani postów(trzeba utworzyć je własnoręcznie). Po wyłączeniu środowiska i jego ponownym uruchomieniu poprzednio utworzone dane w bazie danych zostaną pobrane z lokalnego wolumenu.**

**Projekt jest w pełni skonfigurowany do pracy z Dockerem. Aby uruchomić całe środowisko (Backend, Frontend oraz bazę danych), należy wykonać poniższą komendę w głównym katalogu projektu:**

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