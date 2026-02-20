# 🚀 Hızlı Okuma Platformu - Docker Deployment Rehberi

## Gereklilikler

- Docker (https://docs.docker.com/get-docker/)
- Docker Compose (genellikle Docker ile birlikte gelir)

## Lokal Ortamda Test Etme

### 1️⃣ Docker Image'i Oluştur

```bash
# Proje dizinine git
cd hizliokuma

# Image'i build et
docker-compose build
```

### 2️⃣ Uygulamayı Çalıştır

```bash
# Arka planda çalıştır
docker-compose up -d

# Veya ön planda çalıştır (logları görmek için)
docker-compose up
```

### 3️⃣ Test Et

Tarayıcıda aç: http://localhost:3000

### 4️⃣ Durumu Kontrol Et

```bash
# Running container'ları listele
docker-compose ps

# Logları göster
docker-compose logs -f

# Konteyner sistemi kapat
docker-compose down
```

---

## 🖥️ Sunucuya Deployment

### Opsiyonlar:

#### **A) DigitalOcean / Linode / AWS EC2 (Linux Sunucu)**

1. **SSH ile sunucuya bağlan**
   ```bash
   ssh root@sunucu_ip
   ```

2. **Docker ve Docker Compose kur**
   ```bash
   # Docker install
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Docker Compose install
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   
   # Doğrula
   docker --version
   docker-compose --version
   ```

3. **Projeyi sunucuya kopyala**
   ```bash
   # Lokal makinenden
   scp -r hizliokuma root@sunucu_ip:/home/
   
   # Veya Git kullan
   cd /home
   git clone <your-repo-url> hizliokuma
   cd hizliokuma
   ```

4. **Çalıştır**
   ```bash
   cd /home/hizliokuma
   docker-compose up -d --build
   ```

5. **Port Yönlendirmesi (Nginx)")
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

#### **B) Render / Railway (Managed Hosting)**

1. GitHub'a push et
2. Render/Railway dashboard'a git
3. "New Web Service" seç
4. GitHub repo'yu select et
5. Dockerfile'ı otomatik detect eder
6. Deploy! ✅

#### **C) Docker Hub'a Push (Reusable Image)**

```bash
# Docker Hub account oluştur (hub.docker.com)

# Login
docker login

# Build with tag
docker build -t kullaniciadi/hizliokuma:1.0 .

# Push
docker push kullaniciadi/hizliokuma:1.0

# Başka sunucuda çalıştır
docker run -d -p 3000:3000 kullaniciadi/hizliokuma:1.0
```

---

## 📊 Production Checklist

- [ ] Environment variables set (.env.local)
- [ ] Security: Non-root user running (Dockerfile'da var)
- [ ] Health checks enabled (docker-compose.yml'da var)
- [ ] Restart policy: unless-stopped (docker-compose.yml'da var)
- [ ] SSL/HTTPS configured (Nginx/Reverse proxy ile)
- [ ] Logs monitoring setup
- [ ] Backup strategy planını
- [ ] Load balancing (yüksek traffic için)

---

## 🛠️ Troubleshooting

### Container crashes
```bash
docker-compose logs -f  # Logları kontrol et
docker-compose down
docker-compose up -d --build  # Rebuild et
```

### Port zaten kullanılıyor
```bash
# docker-compose.yml'da port değiştir
# "3000:3000" → "8080:3000"
```

### Build hataları
```bash
# Cache temizle
docker-compose build --no-cache
```

---

## 📈 Scaling

Yüksek traffic için:

```yaml
# docker-compose.yml'a ekle
services:
  hizliokuma:
    deploy:
      replicas: 3  # 3 instance
  
  nginx:  # Load balancer
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

---

## 💾 Data Persistence

Eğer database eklenemezse:

```yaml
volumes:
  app-data:

services:
  hizliokuma:
    volumes:
      - app-data:/app/data
```

---

## ❓ Sorular?

- Docker docs: https://docs.docker.com
- Deployment: https://nextjs.org/docs/deployment
- Security: https://docs.docker.com/engine/security/

---

**Happy Deploying!** 🚀
