#  FoodHelper_PAW

Aplikacja wspomagająca zarządzanie jedzeniem i przepisami, zbudowana w oparciu o Node.js, React oraz Docker.

## Wymagania wstępne

Do uruchomienia aplikacji niezbędne są zainstalowane narzędzia:
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (lub Docker Compose)
* [Git](https://git-scm.com/downloads)

## Instalacja

1. Otwórz terminal w lokalizacji docelowej i sklonuj repozytorium:

```
git clone https://github.com/Kornacy/FoodHelper_PAW.git
```
2. Przechodzimy do folderu głównego:
```
cd FoodHelper_PAW
```
3. Aby aplikacja działała poprawnie należy przekopiować i ustawić zmienne środowiskowe. W pliku .env.example znajdują się wszystkie potrzebne zmienne oraz przykładowe wartości dla których aplikacja zadziała.

#### Na Windows:
```
copy .env.example .env
copy frontend\.env.example frontend\.env
copy backend\.env.example backend\.env
```
#### Na Linux:
```
cp .env.example .env
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```
4. Uruchomienie kontenerów:
```
docker-compose up -d --build
```
Po tym poleceniu uruchomią się kontenery z aplikacją. 

5. Aby wgrać przykładowe dane należy uruchomić polecenie:
```
docker-compose exec backend npm run seed
```

Po tej operacji można uruchomić aplikację frontendową. Na domyślnych ustawieniach powinna znajdować się pod adresem:

http://localhost:5173/

## Dokumentacja

[Dokumentacja](https://docs.google.com/document/d/1sYcHNcNo6S8q-F-a3eEuLTXEkFZ7k9T5AhWYwOgaNlY/edit?usp=sharing)