import cv2
import requests
import time
from flask import Flask, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Kamera Akışı Başlatılıyor (0: Varsayılan Kamera)
camera = cv2.VideoCapture(0)

# OpenCV Yüz Tanıma Sınıflandırıcısı
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Telegram Bot Konfigürasyonu (Kendi Bot Token ve Chat ID'nizi buraya girebilirsiniz)
TELEGRAM_BOT_TOKEN = "YOUR_BOT_TOKEN"
TELEGRAM_CHAT_ID = "YOUR_CHAT_ID"

last_alert_time = 0

def send_telegram_alert(frame_bytes):
    """Odada hareket veya yabancı algılandığında Telegram hesabına anlık görsel gönderir."""
    if TELEGRAM_BOT_TOKEN == "YOUR_BOT_TOKEN":
        return
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendPhoto"
    try:
        files = {'photo': ('alert.jpg', frame_bytes, 'image/jpeg')}
        data = {'chat_id': TELEGRAM_CHAT_ID, 'caption': '🚨 DYS GÜVENLİK UYARI: Odada Hareket / Kişi Algılandı!'}
        requests.post(url, files=files, data=data, timeout=3)
    except Exception as e:
        print("Telegram Bildirim Hatası:", e)

def generate_frames():
    global last_alert_time
    while True:
        success, frame = camera.read()
        if not success:
            break
        
        # Gri tonlamalı yüz analizi
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        # Tespit edilen yüzlerin etrafına fütüristik yeşil çerçeve çizilmesi
        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 170), 2)
            cv2.putText(frame, "KISI ALGILANDI", (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 170), 2)

        # 10 saniyede bir Telegram bildirim spam korumalı tetikleyicisi[span_2](start_span)[span_2](end_span)
        if len(faces) > 0 and (time.time() - last_alert_time > 10):
            ret, buffer = cv2.imencode('.jpg', frame)
            if ret:
                send_telegram_alert(buffer.tobytes())
            last_alert_time = time.time()

        # Web paneli için optimize edilmiş JPEG akış sıkıştırması
        ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 75])
        frame = buffer.tobytes()
        yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    print("DYS Yapay Zeka Akış Sunucusu Aktif: http://localhost:5000/video_feed")
    app.run(host='0.0.0.0', port=5000, threaded=True)