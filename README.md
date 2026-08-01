# PadSync — Akıllı Not Defteri

<div align="center">

![PadSync Logo](public/favicon.svg)

**Notlarınızı organize edin, paylaşın ve her yerden erişin.**

[![Deploy](https://github.com/github/docs/actions/workflows/deploy.yml/badge.svg)](../../actions)

</div>

---

## ✨ Özellikler

- 🔐 **Google ile Giriş** — Güvenli Google OAuth kimlik doğrulaması
- 📝 **Zengin Editör** — TipTap tabanlı WYSIWYG + Markdown editör
- 📁 **Dizin Yapısı** — İç içe dizinlerle notlarınızı organize edin
- 🔒 **Şifreli Notlar** — Not ve dizinlerinizi şifre ile koruyun (kurtarma imkanlı)
- 🔗 **Link Paylaşımı** — Notları public veya key korumalı linkle paylaşın
- 📱 **Responsive** — Masaüstü, tablet ve mobilde mükemmel deneyim
- 📄 **PDF Export** — Notları PDF olarak indirin
- 🖼️ **Resim Yükleme** — Kullanıcı başına 10 resim, max 4MB
- 🎥 **Link Önizleme** — YouTube, Twitter vb. linkleri otomatik embed
- 🌙 **Dark Theme** — Göz yorulmayan premium koyu tema

## 🛠 Teknoloji Yığını

| Teknoloji | Kullanım |
|:---|:---|
| Vite + React 18 | Frontend framework |
| Supabase | Veritabanı, Auth, Storage |
| TipTap | Zengin metin editörü |
| Vanilla CSS | Stil sistemi |
| GitHub Actions | CI/CD Deploy |

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+
- npm 9+
- Supabase hesabı
- Google Cloud Console OAuth kimlik bilgileri

### 1. Projeyi klonlayın

```bash
git clone https://github.com/KULLANICI_ADI/notepaddonline.git
cd notepaddonline
npm install
```

### 2. Ortam değişkenlerini ayarlayın

`.env.example` dosyasını `.env` olarak kopyalayın ve değerleri doldurun:

```env
VITE_BASE_URL=/
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Supabase veritabanını kurun

Supabase Dashboard → SQL Editor'e gidin ve `supabase_setup.sql` içeriğini çalıştırın.

### 4. Geliştirme sunucusunu başlatın

```bash
npm run dev
```

`http://localhost:5173` adresinde açılacak.

## 📦 GitHub Pages Deploy

### GitHub Secrets

Repository → Settings → Secrets → Actions:

| Secret | Değer |
|:---|:---|
| `VITE_BASE_URL` | `/notepaddonline/` veya custom domain için `/` |
| `VITE_SUPABASE_URL` | Supabase proje URL'niz |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key'iniz |

### Custom Domain

Custom domain kullanıyorsanız (ör: `padsync.easywaytools.online`):
1. `VITE_BASE_URL` secret'ını `/` olarak ayarlayın
2. GitHub Pages settings'ten custom domain ekleyin
3. DNS'te CNAME kaydı oluşturun

## 📄 Lisans

MIT License

---

<div align="center">
  <sub>PadSync ile oluşturuldu ❤️</sub>
</div>
