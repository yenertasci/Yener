CREATE DATABASE IF NOT EXISTS okey_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE okey_portal;

-- Kullanıcılar ve Çip / Cüzdan Tablosule
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Şifrelenmiş (bcrypt) parola
    chips BIGINT DEFAULT 100000,   -- Başlangıç hediyesi çip
    vip_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ticaret ve Çip Satış Geçmişi (Ödeme Entegrasyonları İçin)
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    order_code VARCHAR(100) NOT NULL UNIQUE,
    amount DECIMAL(10,2) NOT NULL, -- Ödenen Tutar (TL)
    chips_added BIGINT NOT NULL,   -- Hesaba yüklenen çip miktarı
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, SUCCESS, FAILED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Aktif Oyun Masaları Tablosu
CREATE TABLE IF NOT EXISTS game_tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_name VARCHAR(100) NOT NULL,
    min_chip BIGINT NOT NULL,
    current_players INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'WAITING'
);