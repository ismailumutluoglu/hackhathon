# TAZEKOY Hackathon Projesi

Bu repo, hackathona katilan 5 kisilik takimimizin gelistirdigi TAZEKOY uygulamasidir.

Proje amaci:
- Organik urunleri listelemek ve satin alma akisini yonetmek
- Uretici odakli seffaf bir pazar deneyimi sunmak
- AI destekli beslenme/urun onerisi altyapisi saglamak

## 1. Teknoloji Ozeti

Backend:
- Node.js + TypeScript + Express
- MongoDB + Mongoose
- JWT tabanli kimlik dogrulama

Frontend:
- React + TypeScript + Vite
- Tailwind CSS
- React Query, Zustand, React Router

## 2. Proje Yapisi

- backend: API ve veritabani katmani
- frontend: Web arayuzu
- docs: teknik dokumanlar

## 3. Gereksinimler

Projeyi sifirdan calistirmak icin sunlar kurulu olmali:

1. Node.js 20+ (onerilen LTS)
2. npm 10+
3. Git
4. MongoDB (lokal ya da bulut baglantisi)

Not:
- Proje kokunde package.json yok. Bu nedenle npm komutlari backend veya frontend klasorunde calistirilmalidir.

## 4. Projeyi Klonlama

```bash
git clone git@github.com:ismailumutluoglu/hackhathon.git
cd hackhathon
```

## 5. Backend Kurulumu

### 5.1 Bagimliliklari kur

```bash
cd backend
npm install
```

### 5.2 Ortam dosyasi olustur

```bash
cp .env.example .env
```

Ornek backend ortam degiskenleri:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tazekoy
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_EXPIRES_IN=7d
ANTHROPIC_API_KEY=sk-ant-...
AI_PROVIDER=anthropic
CLIENT_URL=http://localhost:5173
```

Onemli notlar:
- Anthropic API key yoksa AI ozellikleri calismayabilir.
- Localde 5000 portu doluysa PORT degerini 5001 yapabilirsiniz.

### 5.3 Backend calistir

```bash
npm run dev
```

Beklenen sonuc:
- API ayakta oldugunda health endpoint cevap verir:

```bash
curl http://localhost:5000/api/health
```

Eger portu 5001 yaptiysaniz:

```bash
curl http://localhost:5001/api/health
```

## 6. Frontend Kurulumu

Yeni bir terminal acin:

### 6.1 Bagimliliklari kur

```bash
cd frontend
npm install
```

### 6.2 Ortam dosyasi olustur

```bash
cp .env.example .env
```

Ornek frontend ortam degiskeni:

```env
VITE_API_PROXY_TARGET=http://localhost:5001
```

Not:
- Backend portunuz 5000 ise burayi 5000 yapin.
- Backend portunuz 5001 ise 5001 olarak birakin.

### 6.3 Frontend calistir

```bash
npm run dev
```

Beklenen sonuc:
- Uygulama su adreste acilir:
	http://localhost:5173

## 7. Hızlı Baslangic (Kopyala-Calistir)

Iki ayri terminalle calistirin.

Terminal 1 (backend):

```bash
cd hackhathon/backend
npm install
cp .env.example .env
npm run dev
```

Terminal 2 (frontend):

```bash
cd hackhathon/frontend
npm install
cp .env.example .env
npm run dev
```

## 8. Sık Karsilasilan Hatalar

### Hata: npm run dev komutu kokte calismiyor
Sebep:
- Kok klasorde package.json yok.

Cozum:
- Komutu backend veya frontend klasoru icinde calistirin.

### Hata: MongooseServerSelectionError / ECONNREFUSED 27017
Sebep:
- MongoDB calismiyor veya URI yanlis.

Cozum:
1. MongoDB servisinin calistigini kontrol edin.
2. Backend .env icindeki MONGODB_URI degerini dogrulayin.

### Hata: EADDRINUSE (Port zaten kullanimda)
Sebep:
- Secilen port baska bir proses tarafindan kullaniliyor.

Cozum:
1. Backend .env icinde PORT degerini degistirin (ornek 5001).
2. Frontend .env icinde VITE_API_PROXY_TARGET degerini ayni porta cekin.

### Hata: Bos sayfa
Sebep:
- Cogu zaman derleme/import/CSS hatasi veya cache.

Cozum:
1. Terminalde frontend hatalarini kontrol edin.
2. npm install tekrar calistirin.
3. Tarayicida hard refresh yapin.

## 9. Build Alma

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run build
```

## 10. Takim Ici Git Akisi (Oneri)

1. Ana branch'ten guncel kod cekin.
2. Kendi feature branch'inizi acin.
3. Degisiklikleri kucuk commitlerle ilerletin.
4. Pull Request acip review alin.

Ornek:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/urun-filtreleme
# degisiklikler
git add .
git commit -m "feat: urun filtreleme iyilestirmesi"
git push origin feature/urun-filtreleme
```

## 11. Iletisim

Takim ici kurulum sorunu yasarsaniz:
- Aldiginiz terminal hatasini ekran goruntusu ile paylasin
- Hangi adimda kaldiginizi belirtin
- Isletim sistemi bilgisini ekleyin

Bu bilgilerle sorunlar cok daha hizli cozulur.

## 12. GitHub'dan Yayinlama (Frontend)

Bu repoda otomatik deploy workflow'u eklidir:
- [.github/workflows/deploy-frontend-pages.yml](.github/workflows/deploy-frontend-pages.yml)

Calisma sekli:
1. `dev` branch'ine push yapildiginda workflow tetiklenir.
2. `frontend` klasoru build edilir.
3. Build sonucu GitHub Pages'e deploy edilir.

### 12.1 GitHub Pages ayari

Repo ayarlarinda su adimlari yapin:
1. GitHub'da repo > Settings > Pages
2. Source olarak `GitHub Actions` secin

Bu ayari bir kere yaptiktan sonra her `dev` push'unda yayin otomatik guncellenir.

### 12.2 Yayin URL'i

Repo adresinize gore sayfa su adreste olur:
- `https://ismailumutluoglu.github.io/hackhathon/`

### 12.3 Onemli Not (Backend)

GitHub Pages sadece statik frontend yayinlar.
Backend (Node.js + MongoDB) GitHub Pages'te calismaz.

Backend icin ayri bir servis kullanin:
1. Render
2. Railway
3. Fly.io
4. Azure App Service

Frontend'i backend'e baglamak icin production ortaminda frontend tarafinda API base URL'i ayrica ayarlanmalidir.