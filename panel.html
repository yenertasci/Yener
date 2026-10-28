<?php
// panel.php - Veritabanı Bağlantısı ve Yönetim Paneli
$db = new PDO("mysql:host=localhost;dbname=metal_takip;charset=utf8", "root", "");

// Yeni İş Emri Kaydı
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['is_emri_ekle'])) {
    $is_emri_no = "IE-" . date("Ymd") . "-" . rand(100, 999);
    $stok_id = $_POST['stok_id'];
    $musteri = $_POST['musteri_adi'];
    $kesim = $_POST['kesim_olcusu'];
    $adet = $_POST['kullanilan_adet'];

    // 1. İş Emrini Kaydet
    $query = $db->prepare("INSERT INTO is_emirleri (is_emri_no, stok_id, musteri_adi, kesim_olcusu, kullanilan_adet) VALUES (?, ?, ?, ?, ?)");
    $query->execute([$is_emri_no, $stok_id, $musteri, $kesim, $adet]);

    // 2. Stoktan Miktarı Düş
    $stokDus = $db->prepare("UPDATE metal_stok SET stok_miktari = stok_miktari - ? WHERE id = ?");
    $stokDus->execute([$adet, $stok_id]);

    header("Location: panel.php?basarili=1");
    exit;
}

// Stok Listesini Çek
$stoklar = $db->query("SELECT * FROM metal_stok")->fetchAll(PDO::FETCH_ASSOC);

// İş Emirlerini Çek
$isEmirleri = $db->query("SELECT i.*, m.malzeme_adi, m.kalite FROM is_emirleri i JOIN metal_stok m ON i.stok_id = m.id ORDER BY i.id DESC")->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title>Metal İş Emri ve Stok Paneli</title>
    <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f4f7f6; }
        .container { display: flex; gap: 20px; }
        .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .form-card { flex: 1; }
        .table-card { flex: 2; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #2c3e50; color: white; }
        .btn { background: #27ae60; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 4px; }
        .btn-print { background: #2980b9; text-decoration: none; padding: 4px 8px; color: white; border-radius: 3px; font-size: 12px; }
    </style>
</head>
<body>

<h2>Metal Üretim & Stok Takip Paneli</h2>

<div class="container">
    <!-- İş Emri Oluşturma Formu -->
    <div class="card form-card">
        <h3>Yeni İş Emri Oluştur</h3>
        <form method="POST">
            <input type="hidden" name="is_emri_ekle" value="1">
            
            <label>Metal Malzeme (Stok):</label><br>
            <select name="stok_id" required style="width:100%; padding:8px; margin:5px 0 15px;">
                <?php foreach($stoklar as $stok): ?>
                    <option value="<?= $stok['id'] ?>">
                        <?= $stok['malzeme_adi'] ?> (<?= $stok['kalite'] ?>) - Stok: <?= $stok['stok_miktari'] ?> Adet
                    </option>
                <?php endforeach; ?>
            </select><br>

            <label>Müşteri / Proje Adı:</label><br>
            <input type="text" name="musteri_adi" required style="width:100%; padding:8px; margin:5px 0 15px;"><br>

            <label>Kesim Ölçüsü (mm):</label><br>
            <input type="text" name="kesim_olcusu" placeholder="Örn: 500x1200" required style="width:100%; padding:8px; margin:5px 0 15px;"><br>

            <label>Kullanılacak Adet:</label><br>
            <input type="number" name="kullanilan_adet" required style="width:100%; padding:8px; margin:5px 0 15px;"><br>

            <button type="submit" class="btn">İş Emri Ver ve Stok Düş</button>
        </form>
    </div>

    <!-- İş Emirleri Listesi -->
    <div class="card table-card">
        <h3>Aktif İş Emirleri</h3>
        <table>
            <thead>
                <tr>
                    <th>İş Emri No</th>
                    <th>Malzeme</th>
                    <th>Müşteri</th>
                    <th>Kesim Ölçüsü</th>
                    <th>Adet</th>
                    <th>Barkod</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach($isEmirleri as $emirm): ?>
                <tr>
                    <td><strong><?= $emirm['is_emri_no'] ?></strong></td>
                    <td><?= $emirm['malzeme_adi'] ?> (<?= $emirm['kalite'] ?>)</td>
                    <td><?= $emirm['musteri_adi'] ?></td>
                    <td><?= $emirm['kesim_olcusu'] ?></td>
                    <td><?= $emirm['kullanilan_adet'] ?> Adet</td>
                    <td>
                        <svg class="barcode" data-value="<?= $emirm['is_emri_no'] ?>"></svg>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

<script>
    // Tablodaki her iş emri için otomatik barkod çizer
    document.querySelectorAll('.barcode').forEach(function(element) {
        JsBarcode(element, element.getAttribute('data-value'), {
            format: "CODE128",
            width: 1.5,
            height: 35,
            displayValue: true,
            fontSize: 10
        });
    });
</script>

</body>
</html>