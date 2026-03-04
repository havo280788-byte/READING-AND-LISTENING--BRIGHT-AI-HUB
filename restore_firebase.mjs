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

// Dữ liệu từ file CSV của giáo viên
// Định dạng: [completedModules, xp]
const DATA = [
    [20, 884],   // HS01
    [2, 693],    // HS02
    [12, 938],   // HS03
    [17, 2704],  // HS04
    [27, 1966],  // HS05
    [13, 1707],  // HS06
    [17, 1966],  // HS07
    [12, 2912],  // HS08
    [29, 511],   // HS09
    [22, 802],   // HS10
    [22, 912],   // HS11
    [24, 2512],  // HS12
    [5, 2470],   // HS13
    [12, 2502],  // HS14
    [2, 1070],   // HS15
    [22, 1143],  // HS16
    [9, 2651],   // HS17
    [3, 2089],   // HS18
    [4, 1558],   // HS19
    [20, 201],   // HS20
    [25, 2420],  // HS21
    [11, 1243],  // HS22
    [16, 1762],  // HS23
    [28, 1850],  // HS24
    [2, 1248],   // HS25
    [19, 689],   // HS26
    [19, 499],   // HS27
    [17, 1065],  // HS28
    [9, 2309],   // HS29
    [30, 913],   // HS30
    [10, 2149],  // HS31
    [27, 1913],  // HS32
    [14, 2103],  // HS33
    [24, 834],   // HS34
    [13, 2680],  // HS35
    [7, 127],    // HS36
    [17, 961],   // HS37
    [11, 2832],  // HS38
    [14, 1428],  // HS39
    [11, 1185],  // HS40
    [3, 1940],   // HS41
    [27, 1586],  // HS42
    [4, 1704],   // HS43
    [28, 2800],  // HS44
    [20, 2952],  // HS45
    [17, 173],   // HS46
    [10, 226],   // HS47
    [9, 1914],   // HS48
    [8, 2335],   // HS49
    [20, 2830],  // HS50
    [26, 2964],  // HS51
    [27, 2500],  // HS52
    [1, 1515],   // HS53
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
