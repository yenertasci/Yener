<div align="center">

# ⚡ Tasarruf Devri | Autonomous Financial Engine

![Platform Version](https://img.shields.io/badge/Version-1.0.0-cyan?style=for-the-badge&logo=codeforces&logoColor=black)
![Security](https://img.shields.io/badge/Security-RLS_Protected-emerald?style=for-the-badge&logo=security&logoColor=white)
![Database](https://img.shields.io/badge/Database-Autonomous_Clean-blue?style=for-the-badge&logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/License-Protected-crimson?style=for-the-badge&logo=opensourceinitiative&logoColor=white)

> **Yeni nesil varlık yönetimi, otonom veri optimizasyonu ve sıfır tavizli güvenlik mimarisi.**

</div>

---

## 🚀 Proje Hakkında

**Tasarruf Devri**, bireysel ve kurumsal finansal akışları yapay zeka destekli otonom sistemlerle optimize eden, yüksek performanslı ve modern bir web platformudur. Gelişmiş veri tabanı temizleme mekanizmaları ve katı güvenlik katmanlarıyla kesintisiz bir deneyim sunar.

---

## 🛠️ Kullanılan Teknolojiler ve Altyapı

* 💻 **Frontend:** HTML5, CSS3 (`stylee.css`), JavaScript (`script.js`)
* 📄 **Arayüz Sayfaları:** `index.html`, `Panel.html`, `Profil.html`, `yonetim.html`
* 🛡️ **Güvenlik & Veritabanı:** 
  * `RLS (Row Level Security)` Güvenlik Politikaları
  * Otonom Veritabanı Temizlik Mekanizmaları (`clean_old_audit_logs()`)
* 📦 **Paket Yönetimi:** Node.js / `package.json`

---

## 🔒 Sistem ve Güvenlik Mimarisi

* 🟢 **Satır Düzeyinde Güvenlik (RLS):** Veri bütünlüğünü ve kullanıcı gizliliğini en üst düzeyde koruyan aktif güvenlik politikaları.
* 🔵 **Otonom Veri Optimizasyonu:** Belirli periyotlarda (90 günlük döngülerle) eski log ve verilerin otomatik olarak temizlenmesiyle maksimum sistem performansı.
* ⚡ **Merkezi Yönetim Paneli:** Sistem loglarını, kullanıcı profillerini ve finansal akışları tek ekrandan kontrol etme imkanı.

---

## 📁 Proje Dosya Yapısı

```text
├── index.html         # Ana Giriş Sayfası
├── Panel.html         # Yönetim ve Kontrol Paneli
├── yonetim.html       # Sistem Yönetim Arayüzü
├── Profil.html        # Kullanıcı Profil Ekranı
├── script.js          # Temel Mantık ve İşlevsellik Dosyası
├── stylee.css         # Özel Tasarım ve Stil Dosyası
├── Package.json       # Bağımlılıklar ve Proje Konfigürasyonu
└── LICENSE            # Telif Hakları ve Lisans Belgesi