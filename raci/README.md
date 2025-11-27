# RACI Proje Yöneticisi

Notion görünümlü, RACI matrisine sahip proje yönetim aracı. HTML tarafı tek başına çalışır; Node.js + MySQL backend ile gerçek zamanlı (Socket.io) senkronizasyon yapar.

## Özellikler
- Liste ve Gantt görünümleri arasında geçiş
- Dark mode
- Görevler için sürükle-bırak (alt görevlerle birlikte) ve Gantt üzerinde sürükle/uzat kısalt
- R/A/C/I sütunları, notlar, aciliyet, dosya ekleme
- Dinamik sütun, kişi ve durum yönetimi (ekle/sil/yeniden adlandır)
- AI sihirli değnek/analiz (Gemini API anahtarını ayarlardan girerek)
- LocalStorage veya Node.js backend ile kayıt

## Kurulum (Frontend)
1. `raci/index.html` dosyasını tarayıcıda açın. Tüm özellikler LocalStorage ile çalışır.
2. Ayarlar > AI sekmesinden Gemini API anahtarınızı girerseniz sihirli değnek/analiz aktif olur.

## Backend Kurulumu
1. Terminalde `raci` klasörüne geçin:
   ```bash
   cd raci
   npm install
   ```
2. MySQL çalıştığından emin olun. Gerekirse `schema.sql` dosyasını çalıştırın veya `server.js` otomatik oluşturur.
3. Gerekirse bağlantı bilgilerini `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_PORT` ortam değişkenleriyle ayarlayın.
4. Sunucuyu başlatın:
   ```bash
   npm start
   ```
   Konsolda `🚀 Sunucu çalışıyor: http://localhost:3000` görmelisiniz.

## Frontend'i Backende Bağlama
- `index.html` sayfasını açtığınızda backend açıksa Socket.io otomatik bağlanır ve "Online" yazar.
- "Kaydet & Senkronize Et" butonu LocalStorage'a kaydeder ve `POST http://localhost:3000/api/save` çağrısı yapar.

## MySQL Şeması
`schema.sql` dosyası aşağıdaki temel yapıyı oluşturur:
```sql
CREATE DATABASE raci_db;
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  data JSON,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Gantt ve Drag&Drop İpuçları
- Liste görünümünde bir üst görevi sürüklediğinizde alt görevleriyle birlikte blok halinde taşınır.
- Gantt çubuğunu ortasından tutarak tarih aralığını taşır, uçlarından tutarak süreyi uzatıp kısaltırsınız. Şeffaf hayalet bar hareketi görmenizi sağlar.

## AI Anahtarı
- Ayarlar > AI sekmesinde Gemini API anahtarınızı girin (`AIza...`). Anahtar girilmezse AI çağrıları pasif kalır.
