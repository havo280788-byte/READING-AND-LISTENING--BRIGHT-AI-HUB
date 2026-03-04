/**
 * restore_firebase.mjs
 * Đẩy dữ liệu học sinh lên Firebase Realtime Database
 * Chạy: node restore_firebase.mjs
 */

const FIREBASE_URL = 'https://elite-eng-default-rtdb.asia-southeast1.firebasedatabase.app';

// Danh sách tên học sinh (đúng thứ tự student01 → student53)
const NAMES = [
    "HOA QUANG AN",        // student01
    "PHAM QUYNH ANH",      // student02
    "HA THI MINH ANH",     // student03
    "CAO NGUYEN QUYNH ANH",// student04
    "TRAN NGUYET ANH",     // student05
    "HOA GIA BINH",        // student06
    "HOANG VAN CONG CHINH",// student07
    "NGUYEN MANH CUONG",   // student08
    "TRAN THI DUNG",       // student09
    "NGUYEN THANH DAT",    // student10
    "NGUYEN PHUC DIEN",    // student11
    "NGUYEN TRUNG DUC",    // student12
    "NGUYEN LE GIA HAN",   // student13
    "NGUYEN PHUONG HIEN",  // student14
    "NGUYEN HOANG GIA HUYNH",// student15
    "DUONG GIA HUNG",      // student16
    "DINH VAN HUNG",       // student17
    "LE DINH KHOI",        // student18
    "NGUYEN THI NGOC LAN", // student19
    "HUYNH DANG KHANH LINH",// student20
    "PHAM VU THUY LINH",   // student21
    "NGUYEN BUI YEN LINH", // student22
    "DANG HOANG LONG",     // student23
    "NGUYEN KHANH LY",     // student24
    "TRAN HOANG MINH",     // student25
    "TRAN NU NGUYET NGA",  // student26
    "TRAN NHU NGOC",       // student27
    "LE THI NHU NGOC",     // student28
    "TRAN NU BAO NGOC",    // student29
    "TRAN HOANG NGUYEN",   // student30
    "NGUYEN THAO NGUYEN",  // student31
    "PHAN DUY NGUYEN",     // student32
    "NGUYEN THI THANH NHAN",// student33
    "BUI THIEN NHAN",      // student34
    "NGUYEN NGOC UYEN NHI",// student35
    "VU NGUYEN TUE NHI",   // student36
    "NGUYEN HOANG TAM NHU",// student37
    "LE KIM PHAT",         // student38
    "NGUYEN BA PHI",       // student39
    "DINH XUAN HOANG PHUC",// student40
    "TA PHAM MINH PHUC",   // student41
    "TRAN HUU QUANG",      // student42
    "NGUYEN TIEN SANG",    // student43
    "TRAN MINH THONG",     // student44
    "VU LE PHUONG THUY",   // student45
    "VO BAO THUY",         // student46
    "NGUYEN ANH THU",      // student47
    "LE TRINH ANH THU",    // student48
    "PHAM ANH THU",        // student49
    "NGUYEN THUY TIEN",    // student50
    "NGUYEN PHUONG UYEN",  // student51
    "VU THI HA VY",        // student52
    "NGUYEN THI THU HA",   // student53
];

// Dữ liệu từ file CSV của giáo viên (cập nhật mới nhất)
// Định dạng: [completedModules, xp]
const DATA = [
    [26, 2964],  // HS01
    [18, 2160],  // HS02
    [30, 3000],  // HS03
    [22, 2580],  // HS04
    [17, 1980],  // HS05
    [28, 2970],  // HS06
    [20, 2400],  // HS07
    [15, 1800],  // HS08
    [24, 2820],  // HS09
    [19, 2280],  // HS10
    [27, 2940],  // HS11
    [16, 1920],  // HS12
    [23, 2700],  // HS13
    [25, 2860],  // HS14
    [21, 2520],  // HS15
    [29, 2976],  // HS16
    [18, 2100],  // HS17
    [17, 2040],  // HS18
    [20, 2340],  // HS19
    [28, 2952],  // HS20
    [22, 2640],  // HS21
    [15, 1740],  // HS22
    [26, 2900],  // HS23
    [19, 2220],  // HS24
    [30, 2912],  // HS25
    [24, 2780],  // HS26
    [16, 1860],  // HS27
    [27, 2960],  // HS28
    [18, 2160],  // HS29
    [23, 2740],  // HS30
    [21, 2460],  // HS31
    [25, 2880],  // HS32
    [17, 2100],  // HS33
    [20, 2400],  // HS34
    [28, 2980],  // HS35
    [15, 1650],  // HS36
    [22, 2600],  // HS37
    [24, 2800],  // HS38
    [19, 2250],  // HS39
    [26, 2920],  // HS40
    [30, 2990],  // HS41
    [16, 1900],  // HS42
    [18, 2050],  // HS43
    [21, 2500],  // HS44
    [29, 2988],  // HS45
    [15, 1720],  // HS46
    [23, 2760],  // HS47
    [27, 2950],  // HS48
    [20, 2380],  // HS49
    [25, 2890],  // HS50
    [16, 1950],  // HS51
    [28, 2975],  // HS52
    [22, 2620],  // HS53
];

async function pushStudent(username, name, completedModules, xp) {
    const payload = {
        name,
        username,
        xp,
        completedModules,
        moduleProgress: {},
        progress: { vocabulary: 0, grammar: 0, speaking: 0, reading: 0, listening: 0, challenge: 0 },
        selectedUnitId: 'u1',
        lastUpdated: new Date().toISOString(),
        restoredByTeacher: true,
    };

    const res = await fetch(`${FIREBASE_URL}/students/${username}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const ok = res.ok;
    const status = res.status;
    return { ok, status };
}

async function main() {
    console.log(`\n🔥 Đang kết nối Firebase: ${FIREBASE_URL}\n`);
    console.log(`📊 Tổng số học sinh cần khôi phục: ${DATA.length}\n`);
    console.log('─'.repeat(60));

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < DATA.length; i++) {
        const username = `student${String(i + 1).padStart(2, '0')}`;
        const name = NAMES[i];
        const [completedModules, xp] = DATA[i];

        process.stdout.write(`[${String(i + 1).padStart(2, '0')}/53] ${username} | ${name.padEnd(30)} | Modules: ${completedModules} | XP: ${xp} → `);

        try {
            const { ok, status } = await pushStudent(username, name, completedModules, xp);
            if (ok) {
                console.log('✅ OK');
                successCount++;
            } else {
                console.log(`❌ FAIL (HTTP ${status})`);
                failCount++;
            }
        } catch (err) {
            console.log(`❌ ERROR: ${err.message}`);
            failCount++;
        }

        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 100));
    }

    console.log('\n' + '─'.repeat(60));
    console.log(`\n✅ Thành công: ${successCount}/53`);
    if (failCount > 0) {
        console.log(`❌ Thất bại: ${failCount}/53`);
        console.log('\n⚠️  Nếu bị lỗi, kiểm tra Firebase Rules:');
        console.log('   Vào Firebase Console → Realtime Database → Rules');
        console.log('   Đặt: { "rules": { ".read": true, ".write": true } }');
    } else {
        console.log('\n🎉 Khôi phục dữ liệu thành công! Mở Teacher View để kiểm tra.');
    }
}

main().catch(err => {
    console.error('\n❌ Lỗi nghiêm trọng:', err.message);
    console.error('\n⚠️  Có thể Firebase Rules đang chặn. Kiểm tra:');
    console.error('   Vào Firebase Console → Realtime Database → Rules');
    console.error('   Đặt: { "rules": { ".read": true, ".write": true } }');
});
