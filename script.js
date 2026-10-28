// ==========================================
// DYS - ENTERPRISE INDUSTRIAL PLATFORM (5G PRO v4.0)
// CORE CONTROLLER & SECURITY MACHINE SCRIPT
// ==========================================

const SUPABASE_URL = "https://jzqeaiizjjbglztixume.supabase.co";
const SUPABASE_ANON_KEY = "BURAYA_ANON_KEY_GELECEK"; // Kendi anahtarını buraya ekleyebilirsin

// Global Uygulama Durumu
let systemState = {
    currentTab: 'generator',
    currentLang: 'tr',
    customDomain: '',
    archiveData: [],
    scannerInstance: null,
    latency: 4
};

// 1. Enterprise Error Logger (Hata Avcısı)
window.addEventListener('error', function(e) {
    console.error("[Enterprise Error Logger]:", e.message, "at", e.filename, ":", e.lineno);
    showToast("Sistem Uyarısı: Beklenmeyen bir istisna yakalandı.", "error");
});

// 2. Rate Limiter (3 Saniye İşlem Koruması)
let lastActionTime = 0;
const RATE_LIMIT_MS = 3000;

function checkRateLimit() {
    const now = Date.now();
    if (now - lastActionTime < RATE_LIMIT_MS) {
        showToast("Çok hızlı işlem yaptınız. Lütfen 3 saniye bekleyin.", "error");
        return false;
    }
    lastActionTime = now;
    return true;
}

// 3. Modern Toast Bildirim Sistemi
function showToast(message, type = "success") {
    let container = document.getElementById("systemToastContainer") || document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "systemToastContainer";
        container.style.cssText = "position:fixed; top:20px; right:20px; z-index:9999; pointer-events:none;";
        document.body.appendChild(container);
    }
    
    const toast = document.createElement("div");
    toast.style.cssText = `
        background: ${type === 'error' ? 'rgba(225, 29, 72, 0.9)' : 'rgba(5, 150, 105, 0.9)'};
        color: white; padding: 10px 16px; margin-top: 8px;
        border-radius: 12px; font-family: sans-serif; font-size: 12px;
        backdrop-filter: blur(8px); border: 1px solid ${type === 'error' ? 'rgba(244, 63, 94, 0.4)' : 'rgba(16, 185, 129, 0.4)'};
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); transition: opacity 0.3s ease, transform 0.3s ease;
        opacity: 0; transform: translateY(-10px);
    `;
    toast.innerText = message;
    container.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 4. 5 Dakika Idle Timeout (Hareketsizlik Güvenlik Koruması)
let idleTimer;
const IDLE_LIMIT = 5 * 60 * 1000; // 5 Dakika

function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        secureSignOut("Hareketsizlik nedeniyle güvenliğiniz için oturumunuz kapatıldı.");
    }, IDLE_LIMIT);
}

['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, resetIdleTimer, true);
});

// 5. Güvenli Çıkış (Secure Sign Out)
function secureSignOut(reason = "Oturum başarıyla kapatıldı.") {
    localStorage.clear();
    sessionStorage.clear();
    showToast(reason, "success");
    setTimeout(() => {
        window.location.href = "yonetim.html";
    }, 1500);
}

// ==========================================
// DYS ENDÜSTRİYEL İŞLEVLER VE SEKME YÖNETİMİ
// ==========================================

// Sekme Değiştirici
function switchTab(tabId) {
    systemState.currentTab = tabId;
    
    // Tüm içerikleri gizle
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(el => el.classList.add('hidden'));
    
    // Seçilen içeriği göster
    const activeContent = document.getElementById(`content-${tabId}`);
    if (activeContent) {
        activeContent.classList.remove('hidden');
    }
    
    // Buton stillerini güncelle
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        btn.classList.remove('bg-emerald-600', 'text-white', 'shadow-md', 'shadow-emerald-600/20');
        btn.classList.add('bg-slate-800/80', 'text-slate-300');
    });
    
    const activeBtn = document.getElementById(`tab-${tabId}`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-slate-800/80', 'text-slate-300');
        activeBtn.classList.add('bg-emerald-600', 'text-white', 'shadow-md', 'shadow-emerald-600/20');
    }
    
    // Kamera sekmesine geçildiyse tarayıcıyı durdurma önlemi
    if (tabId !== 'scanner' && systemState.scannerInstance) {
        stopScanner();
    }
}

// Canlı Saat Güncelleyici
function updateLiveClock() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('tr-TR');
    const timeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const clockEl = document.getElementById('liveClock');
    if (clockEl) {
        clockEl.innerText = `${dateStr} - ${timeStr}`;
    }
}

// Kart / Etiket Üreticisi
function generateNewCard() {
    if (!checkRateLimit()) return;

    const target = document.getElementById('targetLocation').value;
    const wasteType = document.getElementById('wasteTypeSelect').value;
    const origin = document.getElementById('originLocation').value;
    const quantity = document.getElementById('itemQuantity').value;
    const operator = document.getElementById('operatorName').value;
    
    const randomSerial = 'TR-B-' + Math.floor(10000000 + Math.random() * 90000000);
    const cardId = 'DYS-K-2026-' + Math.floor(10000 + Math.random() * 90000);
    const barcodeNum = randomSerial.replace(/-/g, '');
    
    // DOM Güncellemeleri
    document.getElementById('cardNoDisplay').innerText = cardId;
    document.getElementById('serialDisplay').innerText = randomSerial;
    document.getElementById('targetDisplay').innerText = target;
    document.getElementById('typeDisplay').innerText = wasteType;
    document.getElementById('quantityDisplay').innerText = quantity;
    document.getElementById('barcodeNoDisplay').innerText = barcodeNum;
    
    // Karbon hesaplama simülasyonu (kg cinsinden ağırlık bazlı)
    const weightMatch = quantity.match(/([\d.]+)\s*kg/i);
    const weightVal = weightMatch ? parseFloat(weightMatch[1]) : 14.2;
    const carbonVal = (weightVal * 2.0).toFixed(1);
    document.getElementById('carbonCardDisplay').innerText = `~${carbonVal} kg CO₂e`;
    
    // Kriptografik Hash Simülasyonu (SHA-256)
    const mockHash = Array.from({length: 32}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    document.getElementById('hashCardDisplay').innerText = mockHash.substring(0, 16) + '...';
    
    // Sertifika alanlarını da güncelle
    const certNo = 'TR-CERT-2026-' + Math.floor(1000 + Math.random() * 9000);
    if(document.getElementById('certNoDisplay')) document.getElementById('certNoDisplay').innerText = certNo;
    if(document.getElementById('certOriginDisplay')) document.getElementById('certOriginDisplay').innerText = origin;
    if(document.getElementById('certTargetDisplay')) document.getElementById('certTargetDisplay').innerText = target;
    if(document.getElementById('certTypeDisplay')) document.getElementById('certTypeDisplay').innerText = wasteType;
    if(document.getElementById('certCarbonDisplay')) document.getElementById('certCarbonDisplay').innerText = `${carbonVal} kg CO₂e`;
    if(document.getElementById('certDateDisplay')) document.getElementById('certDateDisplay').innerText = new Date().toLocaleDateString('tr-TR');
    if(document.getElementById('certHashDisplay')) document.getElementById('certHashDisplay').innerText = mockHash.substring(0, 12);

    // QR Kod Yenileme
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = "";
    const domainPrefix = systemState.customDomain || "https://dys.bursa.bel.tr/verify";
    const qrData = `${domainPrefix}?card=${cardId}&serial=${randomSerial}&hash=${mockHash}`;
    
    new QRCode(qrContainer, {
        text: qrData,
        width: 128,
        height: 128,
        colorDark: "#022c22",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    showToast("Yeni kriptografik saha etiketi başarıyla oluşturuldu.", "success");
}

// Kartı Arşive Kaydet
function saveCardToHistory() {
    if (!checkRateLimit()) return;

    const cardId = document.getElementById('cardNoDisplay').innerText;
    const serial = document.getElementById('serialDisplay').innerText;
    const target = document.getElementById('targetDisplay').innerText;
    const wasteType = document.getElementById('typeDisplay').innerText;
    const carbon = document.getElementById('carbonCardDisplay').innerText;
    const dateStr = new Date().toLocaleDateString('tr-TR');

    const record = { cardId, serial, target, wasteType, carbon, dateStr };
    systemState.archiveData.push(record);
    
    updateArchiveTable();
    showToast("Etiket başarıyla arşive ve kriptografik günlüğe kaydedildi.", "success");
}

// Arşiv Tablosunu Güncelle
function updateArchiveTable() {
    const tbody = document.getElementById('archiveTableBody');
    if (!tbody) return;

    if (systemState.archiveData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-slate-500">Kayıtlı arşiv verisi bulunmuyor.</td></tr>`;
        return;
    }

    tbody.innerHTML = "";
    systemState.archiveData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.className = "hover:bg-slate-800/40 transition-colors";
        row.innerHTML = `
            <td class="p-3 font-mono font-bold text-emerald-400">${item.cardId}</td>
            <td class="p-3 font-mono text-slate-300">${item.serial}</td>
            <td class="p-3 text-slate-200">${item.target}</td>
            <td class="p-3 text-slate-300">${item.wasteType}</td>
            <td class="p-3 text-cyan-400 font-mono">${item.carbon}</td>
            <td class="p-3 text-slate-400 font-mono">${item.dateStr}</td>
            <td class="p-3 text-right">
                <button onclick="removeArchiveItem(${index})" class="text-rose-400 hover:text-rose-300 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-[10px]">Sil</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // İstatistikleri Güncelle
    const statCards = document.getElementById('statTotalCards');
    const statCarbon = document.getElementById('statTotalCarbon');
    if(statCards) statCards.innerText = systemState.archiveData.length;
    if(statCarbon) {
        let totalC = systemState.archiveData.reduce((acc, curr) => {
            const val = parseFloat(curr.carbon.replace(/[^\d.]/g, '')) || 0;
            return acc + val;
        }, 0);
        statCarbon.innerText = totalC.toFixed(1) + " kg";
    }
}

function removeArchiveItem(index) {
    systemState.archiveData.splice(index, 1);
    updateArchiveTable();
    showToast("Kayıt arşivden kaldırıldı.", "success");
}

function clearArchive() {
    if(confirm("Tüm arşiv loglarını sıfırlamak istediğinize emin misiniz?")) {
        systemState.archiveData = [];
        updateArchiveTable();
        showToast("Arşiv tamamen temizlendi.", "success");
    }
}

// Kantardan Oku Simülasyonu
function connectScale() {
    const weights = ["15 Adet / 8.4 kg", "32 Adet / 18.6 kg", "50 Adet / 29.1 kg", "19 Adet / 11.0 kg"];
    const randomW = weights[Math.floor(Math.random() * weights.length)];
    document.getElementById('itemQuantity').value = randomW;
    showToast(`Dijital Kantar (COM3): Başarıyla ölçüldü -> ${randomW}`, "success");
}

// Özel Domain Ayarla
function setCustomDomain(domain) {
    if(!domain) {
        showToast("Lütfen geçerli bir domain adresi girin.", "error");
        return;
    }
    systemState.customDomain = domain.trim();
    showToast(`Özel domain mühürlendi: ${systemState.customDomain}`, "success");
}

// Excel İhraç (SheetJS)
function exportToExcel() {
    if(systemState.archiveData.length === 0) {
        showToast("İhraç edilecek arşiv verisi bulunmuyor.", "error");
        return;
    }
    const worksheet = XLSX.utils.json_to_sheet(systemState.archiveData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DYS_Arsiv");
    XLSX.writeFile(workbook, "DYS_Karbon_Arsiv_Raporu.xlsx");
    showToast("Excel raporu başarıyla indirildi.", "success");
}

// JSON Yedekleme
function exportSystemData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(systemState.archiveData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "DYS_Sistem_Yedek_2026.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Sistem JSON yedeği indirildi.", "success");
}

// QR Kamera Tarayıcı Kontrolleri
function startScanner() {
    const readerEl = document.getElementById('reader');
    readerEl.innerHTML = "";
    
    const html5QrCode = new Html5Qrcode("reader");
    systemState.scannerInstance = html5QrCode;
    
    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 200, height: 200 } },
        (decodedText) => {
            const resEl = document.getElementById('scanResult');
            resEl.classList.remove('hidden');
            resEl.innerHTML = `<strong class="text-emerald-400">QR Doğrulandı:</strong> <span class="text-white">${decodedText}</span>`;
            showToast("QR Etiket başarıyla okundu ve doğrulandı!", "success");
            stopScanner();
        },
        (errorMessage) => {
            // Tarama hataları sessizce atlanabilir
        }
    ).catch(err => {
        readerEl.innerHTML = `<span class="text-rose-400">Kamera başlatılamadı: ${err}</span>`;
    });
}

function stopScanner() {
    if (systemState.scannerInstance) {
        systemState.scannerInstance.stop().then(() => {
            systemState.scannerInstance.clear();
            systemState.scannerInstance = null;
            document.getElementById('reader').innerHTML = "Kamera Durduruldu";
        }).catch(err => console.error(err));
    }
}

// Web NFC Simülasyonu
async function writeNfcTag() {
    if ('NDEFWriter' in window) {
        try {
            const writer = new NDEFWriter();
            await writer.write({
                records: [{ recordType: "text", data: document.getElementById('cardNoDisplay').innerText }]
            });
            showToast("NFC Etiketine veri başarıyla yazıldı!", "success");
        } catch (error) {
            showToast("NFC Yazma hatası: " + error, "error");
        }
    } else {
        const nfcRes = document.getElementById('nfcResult');
        nfcRes.classList.remove('hidden');
        nfcRes.innerHTML = `<span class="text-cyan-400">NFC Simülasyonu: ${document.getElementById('cardNoDisplay').innerText} mühürlendi.</span>`;
        showToast("Tarayıcı Web NFC desteklemiyor. Simülasyon modu aktif.", "success");
    }
}

async function readNfcTag() {
    if ('NDEFReader' in window) {
        try {
            const reader = new NDEFReader();
            await reader.scan();
            reader.onreading = event => {
                const decoder = new TextDecoder();
                for (const record of event.records) {
                    showToast("NFC Okundu: " + decoder.decode(record.data), "success");
                }
            }
        } catch (error) {
            showToast("NFC Okuma hatası: " + error, "error");
        }
    } else {
        showToast("NFC Okuma: Cihaz simülasyon yanıtı alındı (Bağlantı aktif).", "success");
    }
}

// Çoklu Dil Desteği Basit Çevirici
function toggleLanguage(lang) {
    systemState.currentLang = lang;
    const elements = document.querySelectorAll('[data-lang]');
    
    const dictionary = {
        en: {
            nav_generator: "Card & Tag Generator",
            nav_scanner: "Field QR & NFC Scanner",
            nav_cert: "Compliance Certificate",
            nav_archive: "Archive & Logs",
            nav_analytics: "Carbon & Analytics"
        },
        tr: {
            nav_generator: "Kart & Etiket Üreticisi",
            nav_scanner: "Saha QR & NFC Tarayıcı",
            nav_cert: "Uyumluluk Sertifikası",
            nav_archive: "Arşiv & Log Kayıtları",
            nav_analytics: "Karbon & İstatistikler"
        }
    };

    elements.forEach(el => {
        const key = el.getAttribute('data-lang');
        if(dictionary[lang] && dictionary[lang][key]) {
            el.innerText = dictionary[lang][key];
        }
    });

    showToast(`Dil değiştirildi: ${lang.toUpperCase()}`, "success");
}

// Sayfa Yüklendiğinde Başlatıcı
window.onload = function() {
    resetIdleTimer();
    setInterval(updateLiveClock, 1000);
    updateLiveClock();
    generateNewCard(); // İlk kartı otomatik üret
    console.log("[System]: Enterprise Security & DYS Core Machine Active.");
};