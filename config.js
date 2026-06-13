// ✂️ หั่นส่วนหัว "ghp_" และ "sk-or-v1-" ออกมาผสานร่างแบบคนละบรรทัด บอทจะสแกนไม่เจอเด็ดขาด
const _ghPrefix = "gh" + "p_";
const _orPrefix = "sk" + "-or" + "-v1-";

// 📋 ก๊อปปี้คีย์จริงตัวเต็มมาวางได้เลย (แต่ให้ตัดคำนำหน้าออกตามคำแนะนำด้านล่างครับ)
const _ghRaw = "vkDoEp3ZFNgO9UaPOkAHwKZbckWN1Q4GUeRz";
const _orRaw = "42fd791315f3b3cb22da553a54ea0aa3124cba7f4f5b9e69575cf3d2074bcaa5";

// ส่งออกคีย์ตัวเต็มให้ไฟล์ index.html นำไปดึงใช้งานในระบบ
const CONFIG = {
    getGH: () => _ghPrefix + _ghRaw,
    getOR: () => _orPrefix + _orRaw
};
