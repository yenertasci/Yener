const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL Bağlantı Ayarları
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sifreniz',
    database: 'okey_portal'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Veritabanına başarıyla bağlanıldı.');
});

// Statik Frontend Dosyaları
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// --- TİCARET / ÇİP YÜKLEME API (Shopier / PayTR Webhook Örneği) ---
app.post('/api/buy-chips', (req, res) => {
    const { userId, packageId, amount, chips } = req.body;

    // Ödeme entegrasyonu başarılı olduğunda çalışacak mantık:
    const orderCode = 'ORD-' + Date.now();

    db.query('INSERT INTO transactions (user_id, order_code, amount, chips_added, status) VALUES (?, ?, ?, ?, ?)',
        [userId, orderCode, amount, chips, 'SUCCESS'], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: 'İşlem hatası' });

            // Kullanıcının cüzdanına çiplerini ekle
            db.query('UPDATE users SET chips = chips + ? WHERE id = ?', [chips, userId], (updateErr) => {
                if (updateErr) return res.status(500).json({ success: false, message: 'Çip yüklenemedi' });
                res.json({ success: true, message: 'Çip başarıyla hesaba yüklendi!', orderCode });
            });
        });
});

// --- REAL-TIME OKEY / WEBSOCKET YÖNETİMİ ---
io.on('connection', (socket) => {
    console.log('Bir oyuncu bağlandı:', socket.id);

    // Odaya Katılma
    socket.on('join_room', (data) => {
        socket.join(data.roomName);
        console.log(`${data.username} kullanıcısı ${data.roomName} odasına girdi.`);
        
        // Masadakilere oyuncu katıldığını bildir
        io.to(data.roomName).emit('player_joined', { username: data.username });
    });

    // Taş Atma ve Sıra Değiştirme
    socket.on('play_tile', (data) => {
        io.to(data.roomName).emit('tile_played', {
            player: data.username,
            tile: data.tile
        });
    });

    socket.on('disconnect', () => {
        console.log('Bir oyuncu ayrıldı:', socket.id);
    });
});

// Sunucuyu Başlat
server.listen(3000, () => {
    console.log('Ticari Okey Sunucusu 3000 portunda aktif!');
});