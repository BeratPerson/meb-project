<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://github.com/uixmat/firestarta-ghassets/blob/main/assets/logo-dark.png">
<img alt="Firestarta.dev" src="https://github.com/uixmat/firestarta-ghassets/blob/main/assets/logo-light.png" width="320">
</picture>

# MEB 1416 YLSY Bursiyer Platformu

MEB 1416 bursiyerlerini, dünya çapında en iyi doktora programlarını keşfetme ve alanlarındaki eski bursiyerlerle bağlantı kurma konusunda destekleyen merkezi rehberlik ve mentorluk platformu.

## 🎯 Proje Amacı

Bu yazılım, MEB 1416 YLSY bursiyerleri için geliştirilmiş merkezi bir rehberlik ve mentorluk platformudur. Temel işlevleri:

- Öğrencilerin alanlarına uygun dünya çapında en iyi doktora programlarını keşfetmelerini sağlamak
- Benzer alanda eğitim almış eski bursiyerlerle bağlantı kurarak mentorluk almalarına yardımcı olmak
- İlgili yılın öncelikli araştırma alanlarını bursiyerlere sunmak
- Güvenli, kullanıcı dostu ve ölçeklenebilir bir dijital platform sunmak

## 👥 Kullanıcı Rolleri

### 1. MEB Yöneticisi
- O yılın bursiyer listesini platforma yükler
- Öncelikli araştırma alanlarını belirler
- Eski bursiyer profillerini yönetir
- Sistem ayarlarını yapılandırır

### 2. Bursiyer (Öğrenci)
- Kendisine gönderilen bilgilerle giriş yapar
- Araştırma alanlarını inceleyerek seçim yapar
- İlgili doktora programlarını keşfeder
- Dilerse eski bursiyerlerle iletişime geçer

### 3. Mentor (Eski Bursiyer)
- Bursiyerlerle mentorluk ilişkisi kurar
- Deneyimlerini paylaşır
- Mesajlaşma sistemi üzerinden iletişim kurar

## 🖥️ Uygulama Özellikleri

### Bursiyer Paneli
- **Araştırma Alanları**: MEB tarafından belirlenen öncelikli alanlar
- **Doktora Programları**: Alan bazlı en iyi programlar
- **Mentorlar**: Aynı alanda eğitim almış eski bursiyerler
- **Profil Yönetimi**: Kişisel bilgiler ve tercihler

### Mentor Paneli
- **Mentor Profili**: Kişisel bilgiler ve mentorluk durumu
- **Mesajlaşma**: Bursiyerlerle iletişim
- **İstatistikler**: Mentorluk aktiviteleri
- **Mentorluk Alanları**: Hangi alanlarda mentorluk yapıyor

### Yönetici Paneli
- **İçerik Yönetimi**: Araştırma alanları ve programlar
- **Kullanıcı Yönetimi**: Bursiyer ve mentor hesapları
- **Veri Yükleme**: Excel/CSV ile toplu veri yükleme
- **Sistem Ayarları**: Platform konfigürasyonu

## 🛠️ Teknolojiler

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Framework**: Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: SCSS Modules
- **Theme**: next-themes (Açık/Koyu/Sistem modu desteği)
- **External APIs**: OpenAlex, Semantic Scholar, Wikipedia (sadece görüntüleme, veritabanına kaydedilmez)

## 📊 Veri Kaynakları

### Harici API'ler (Sadece Görüntüleme)
- **OpenAlex API**: Üniversite, akademik çalışma ve kavram verileri
- **Semantic Scholar API**: Akademik makaleler ve yazarlar
- **Wikipedia API**: Üniversite bilgileri ve koordinatlar

### Veritabanı (Kalıcı Veriler)
- **Kullanıcı Profilleri**: Bursiyer ve mentor bilgileri
- **Araştırma Alanları**: MEB tarafından belirlenen öncelikli alanlar
- **Mesajlaşma**: Kullanıcılar arası iletişim
- **Sistem Ayarları**: Platform konfigürasyonu

**Not**: Harici API'lerden gelen üniversite ve program verileri sadece görüntüleme amaçlı kullanılır, veritabanına kaydedilmez.

## 🌙 Tema Desteği

Platform, kullanıcıların tercihlerine göre tema değiştirmelerine olanak tanır:

### Tema Seçenekleri
- **Açık Tema**: Beyaz arka plan, koyu metin
- **Koyu Tema**: Koyu arka plan, açık metin  
- **Sistem**: Kullanıcının işletim sistemi ayarlarına göre otomatik tema

### Tema Değiştirme
- Header'da bulunan tema toggle butonu ile tema değiştirilebilir
- Seçilen tema tarayıcıda saklanır ve sonraki ziyaretlerde hatırlanır
- Sistem teması seçildiğinde, işletim sistemi ayarları değiştiğinde otomatik olarak güncellenir

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL veritabanı
- Supabase hesabı (opsiyonel)

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd firestarta
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Ortam değişkenlerini ayarlayın**
```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Veritabanını hazırlayın**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Uygulamayı başlatın**
```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## 📊 Veritabanı Şeması

### Ana Modeller
- **User**: Kullanıcı bilgileri ve rolleri
- **BursiyerProfile**: Bursiyer profilleri
- **MentorProfile**: Mentor profilleri
- **ResearchArea**: Araştırma alanları
- **University**: Üniversite bilgileri
- **DoctoralProgram**: Doktora programları
- **Message**: Mesajlaşma sistemi

## 🔧 API Endpoints

### Doktora Programları
- `GET /api/programs?field={field}&country={country}&limit={limit}` - Alan bazlı program arama
- `GET /api/universities?field={field}&country={country}&top=true` - En iyi üniversiteler

### Araştırma Alanları
- `GET /api/research-fields?query={query}&limit={limit}` - Araştırma alanı arama

### Mentorlar
- `GET /api/mentors?field={field}` - Alan bazlı mentor arama

### Kullanıcı Yönetimi
- `GET /api/users` - Kullanıcı listesi
- `POST /api/auth/register` - Kullanıcı kaydı

### Test Verisi
- `POST /api/seed-data` - Test verisi ekleme

## 📝 Geliştirme

### Kod Yapısı
```
src/
├── app/                    # Next.js App Router
│   ├── (screens)/         # Sayfa bileşenleri
│   ├── api/               # API routes
│   └── globals.css        # Global stiller
├── components/            # React bileşenleri
│   ├── core/             # Temel bileşenler
│   ├── meb/              # MEB platform bileşenleri
│   └── ui/               # UI bileşenleri
├── lib/                  # Yardımcı kütüphaneler
│   ├── auth/             # Kimlik doğrulama
│   ├── prisma/           # Veritabanı işlemleri
│   └── utils/            # Yardımcı fonksiyonlar
└── types/                # TypeScript tipleri
```

### Yaygın Komutlar
```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Production sunucusu
npm start

# Linting
npm run lint

# Veritabanı migration
npx prisma migrate dev

# Prisma Studio
npx prisma studio
```

## 🔒 Güvenlik

- JWT tabanlı kimlik doğrulama
- Şifre hashleme (bcrypt)
- Role-based access control
- CSRF koruması
- Input validation

## 📈 Gelecek Özellikler

- [x] OpenAlex/Semantic Scholar API entegrasyonu
- [x] Wikipedia API entegrasyonu
- [x] Gerçek zamanlı üniversite ve program verisi (sadece görüntüleme)
- [x] Harici API verilerinin veritabanına kaydedilmemesi
- [ ] AI destekli program önerileri
- [ ] E-posta bildirimleri
- [ ] Dosya yükleme sistemi
- [ ] Mobil uygulama
- [ ] Çoklu dil desteği
- [ ] Gelişmiş arama filtreleri
- [ ] Raporlama sistemi
- [ ] QS/Times Higher Education API entegrasyonu

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Geliştirici**: Yazılım Geliştirme Ekibi
- **E-posta**: [e-posta adresi]
- **Proje Linki**: [GitHub repository]

---

**MEB 1416 YLSY Bursiyer Platformu** - Geleceğin akademisyenlerini destekliyoruz! 🎓
