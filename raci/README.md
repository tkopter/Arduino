# RACI Proje Yönetimi (Frontend + Backend)

## Çalıştırma (Frontend)
1. `index.html` dosyasını doğrudan tarayıcıda açın.
2. Ayarlar menüsünden (⚙️) kişi, durum, sütun ve Gemini API anahtarını düzenleyin.
3. Satırlar sürükle-bırak yapılabilir; alt görevler ebeveynleriyle birlikte taşınır.
4. Gantt görünümünde barları sürükleyerek tarih ve süreyi değiştirin, hayalet bar hareketi yönlendirir.

## Backend (Node.js + MySQL + Socket.io)
1. `raci` klasöründe `npm install` çalıştırın.
2. MySQL erişim bilgilerinizi ortam değişkeniyle ya da `server.js` içindeki varsayılanlar ile ayarlayın.
3. `npm start` komutuyla sunucuyu başlatın (varsayılan port: 3000).
4. İlk çalıştırmada `raci_db` veritabanı ve `board_state` tablosu otomatik oluşur.
5. Frontend tarafında "Kaydet & Senkronize" butonu veriyi `/api/save` endpointine POST eder. `/api/load` ile başlangıç verisi çekilir.
6. Socket.io sayesinde aynı projeyi iki sekmede açtığınızda değişiklikler anında aktarılır.

## SQL Şeması
İsterseniz `schema.sql` dosyasını manuel olarak çalıştırabilirsiniz.
