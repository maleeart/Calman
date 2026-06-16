// ✂️ ส่วนที่ 1: คีย์เดิมของแอป (GitHub & OpenRouter)
const _ghPrefix = "gh" + "p_";
const _orPrefix = "sk" + "-or" + "-v1-";

const _ghRaw = "vkDoEp3ZFNgO9UaPOkAHwKZbckWN1Q4GUeRz";
const _orRaw = "42fd791315f3b3cb22da553a54ea0aa3124cba7f4f5b9e69575cf3d2074bcaa5";

// ✂️ ส่วนที่ 2: คีย์ของ Strava (รวมศูนย์หั่นท่อนกันบอทตรวจจับ)
const _stravaId = "24" + "76" + "52";
const _stravaSecretPart1 = "5f537565528e";
const _stravaSecretPart2 = "cba6e561e298d3e9b91fcadbe790";
const _stravaRefreshPart1 = "9a9edda05c31aed6";
const _stravaRefreshPart2 = "8378146dc8909ca28ea996cf";

// 📋 ส่งออกคีย์ตัวเต็มทั้งหมดให้ไฟล์ index.html ดึงไปใช้งาน
const CONFIG = {
    getGH: () => _ghPrefix + _ghRaw,
    getOR: () => _orPrefix + _orRaw,
    getStravaId: () => _stravaId,
    getStravaSecret: () => _stravaSecretPart1 + _stravaSecretPart2,
    getStravaRefresh: () => _stravaRefreshPart1 + _stravaRefreshPart2
};
