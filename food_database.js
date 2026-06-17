const FOOD_DB = {
  "7-11": {
    "อกไก่นึ่ง": { kcal: 110, protein: 23 },
    "อกไก่พริกไทยดำ": { kcal: 120, protein: 22 },
    "ไข่ต้ม": { kcal: 70, protein: 6 },
    "ไข่ตุ๋นคัพ": { kcal: 80, protein: 7 },
    "ข้าวกะเพราอกไก่": { kcal: 330, protein: 28 },
    "ข้าวผัดอกไก่": { kcal: 420, protein: 25 },
    "ข้าวกล้อง": { kcal: 170, protein: 4 },
    "นมโปรตีนสูง (รสจืด)": { kcal: 170, protein: 30 },
    "โยเกิร์ตไขมันต่ำ (รสธรรมชาติ)": { kcal: 80, protein: 5 },
    "ดัชมิลล์ ดีไลท์ (สูตรน้ำตาล 0.1%)": { kcal: 30, protein: 2 },
    "ดัชชี่ ไขมัน 0% (รสธรรมชาติ)": { kcal: 80, protein: 5 },
    "เมจิ บัลแกเรีย (รสธรรมชาติ)": { kcal: 60, protein: 5 },
    "เมจิ บัลแกเรีย (รสกลมกล่อม)": { kcal: 90, protein: 4 },
    "โยลิดา (Yolida) โยเกิร์ตไขมันต่ำ": { kcal: 100, protein: 7 },
    "คาโรลีน กรีกโยเกิร์ต (รสธรรมชาติ)": { kcal: 130, protein: 10 },
    "เมจิ ไฮโปรตีน กรีกสไตล์ (รสธรรมชาติ)": { kcal: 100, protein: 10 }
  },

  "Amazon": {
    "อเมริกาโน่เย็น (ไม่หวาน)": { kcal: 5, protein: 0 },
    "แบล็คคอฟฟี่น้ำผึ้ง": { kcal: 70, protein: 0 },
    "ลาเต้เย็น": { kcal: 180, protein: 8 },
    "คาปูชิโน่เย็น": { kcal: 170, protein: 7 },
    "ชาเขียวนมเย็น": { kcal: 250, protein: 6 }
  },

  "Starbucks": {
    "Iced Caffe Americano": { kcal: 10, protein: 0 },
    "Iced Caffe Latte (Whole Milk)": { kcal: 130, protein: 7 },
    "Iced Caffe Latte (Almond Milk)": { kcal: 80, protein: 2 },
    "Iced Caffe Latte (Soy Milk)": { kcal: 110, protein: 6 },
    "Cold Brew (Plain)": { kcal: 5, protein: 0 }
  },

  "KFC": {
    "ไก่ทอดสูตรผู้พัน (อก)": { kcal: 320, protein: 33 },
    "ไก่ทอดสูตรผู้พัน (สะโพก)": { kcal: 340, protein: 21 },
    "ไก่ทอดฮอตแอนด์สไปซี่ (อก)": { kcal: 390, protein: 30 },
    "ไก่ทอดฮอตแอนด์สไปซี่ (สะโพก)": { kcal: 410, protein: 19 },
    "วิงซ์แซ่บ 2 ชิ้น": { kcal: 180, protein: 12 },
    "ทาร์ตไข่ 1 ชิ้น": { kcal: 220, protein: 3 }
  },

  "MK": {
    "หมูนุ่ม 1 จาน": { kcal: 180, protein: 18 },
    "เนื้อไก่ 1 จาน": { kcal: 145, protein: 24 },
    "ลูกชิ้น MK 1 จาน": { kcal: 160, protein: 14 },
    "บะหมี่หยก 1 ก้อน (ไม่กระเทียมเจียว)": { kcal: 160, protein: 5 },
    "ผักรวมชุดเล็ก": { kcal: 90, protein: 4 },
    "เป็ดย่าง MK (จานเล็ก)": { kcal: 340, protein: 23 }
  },

  "Yayoi": {
    "ข้าวหน้าไก่ (Oyako Don)": { kcal: 550, protein: 30 },
    "ชุดหมูชุบแป้งทอด (Tonkatsu)": { kcal: 780, protein: 32 },
    "ชุดปลาซาบะย่างซีอิ๊ว": { kcal: 620, protein: 35 },
    "ชุดไก่ทอดซอสนัมบัน": { kcal: 890, protein: 28 },
    "หมูกระทะร้อน (Buta Shogayaki)": { kcal: 510, protein: 24 }
  },

  "Shabu_Yakiniku": {
    "สไลด์เนื้อวัว (ริบอาย/ใบพาย) 1 ถาด": { kcal: 120, protein: 18 },
    "สไลด์เนื้อหมู (สันนอก) 1 ถาด": { kcal: 110, protein: 16 },
    "สไลด์หมูสามชั้น 1 ถาด": { kcal: 240, protein: 10 },
    "เนื้อไก่หมัก 1 ถาด": { kcal: 90, protein: 15 },
    "กุ้งสด 5 ตัว": { kcal: 50, protein: 10 },
    "น้ำจิ้มสุกี้ 1 ถ้วยตวง (ประมาณ 2 ช้อนโต๊ะ)": { kcal: 60, protein: 1 },
    "น้ำซุปดำ (ต่อการซด 1 ถ้วยเล็ก)": { kcal: 40, protein: 1 }
  },

  "Street_Food": {
    "ข้าวมันไก่ต้ม (ไม่หนัง)": { kcal: 500, protein: 26 },
    "ข้าวมันไก่ทอด": { kcal: 700, protein: 20 },
    "ข้าวขาหมู (เนื้อล้วน ไม่หนัง)": { kcal: 430, protein: 25 },
    "ก๋วยเตี๋ยวเส้นหมี่น้ำใสไก่ฉีก": { kcal: 320, protein: 18 },
    "ข้าวราดกะเพราหมูสับ+ไข่ดาว": { kcal: 650, protein: 24 },
    "ส้มตำไทย 1 จาน": { kcal: 120, protein: 3 },
    "ไก่ย่างส่วนอก (ไม่หนัง) 1 ไม้ใหญ่": { kcal: 160, protein: 28 }
  },

  "Snacks_Desserts": {
    "เจเล่บิวตี้ (รสเบอร์รี่)": { kcal: 40, protein: 0 },
    "ทาโร่รสเข้มข้น (ซองเล็ก 20g)": { kcal: 70, protein: 5 },
    "ถั่วอัลมอนด์อบเกลือ (30g)": { kcal: 170, protein: 6 },
    "เบนโตะปลาหมึกอบทรงเครื่อง (ซองเล็ก)": { kcal: 20, protein: 2 },
    "ขนมปังโฮลวีตตบแปะ 7-11 (ไส้ยำทูน่า)": { kcal: 220, protein: 9 },
    "ไอศกรีมแดรี่ควีน บลิซซาร์ดโอรีโอ้ (S)": { kcal: 380, protein: 7 },
    "เฉาก๊วยในน้ำเชื่อม 1 ถ้วย": { kcal: 90, protein: 0 }
  },

  "Fruits": {
    "กล้วยหอม 1 ลูกกลาง": { kcal: 100, protein: 1 },
    "กล้วยน้ำว้า 1 ลูก": { kcal: 60, protein: 1 },
    "แอปเปิ้ลเขียว 1 ลูก": { kcal: 60, protein: 0 },
    "ฝรั่ง 1 ลูกกลาง": { kcal: 120, protein: 2 },
    "มะละกอสุก 8 ชิ้นคำ": { kcal: 60, protein: 1 }
  },

  "Clean_Diet": {
    "อกไก่นึ่ง/ต้ม (ปรุงน้อย) 100g": { kcal: 120, protein: 25 },
    "สันในหมูอบ 100g": { kcal: 140, protein: 22 },
    "ปลาแซลมอนย่างนาบกระทะ 100g": { kcal: 200, protein: 20 },
    "ปลากะพงนึ่งซีอิ๊ว 100g": { kcal: 110, protein: 19 },
    "เต้าหู้ขาวหลอด 1 หลอด": { kcal: 60, protein: 6 },
    "ไข่ต้มเอาแต่ไข่ขาว 1 ฟอง": { kcal: 17, protein: 4 },
    "ข้าวไรซ์เบอร์รี่หุงสุก 1 ทัพพี (100g)": { kcal: 130, protein: 3 },
    "มันหวานญี่ปุ่นนึ่ง 100g": { kcal: 120, protein: 2 },
    "คีนัวหุงสุก 1 ทัพพี": { kcal: 120, protein: 4 },
    "สลัดผักรวม (ไม่รวมน้ำสลัด)": { kcal: 40, protein: 2 },
    "น้ำสลัดงาญี่ปุ่นซีอิ๊วญี่ปุ่น 2 ช้อนโต๊ะ": { kcal: 55, protein: 1 },
    "น้ำสลัดครีมไขมันต่ำ 2 ช้อนโต๊ะ": { kcal: 80, protein: 0 }
  },

  "Fast_Food_Chain": {
    "McDonalds แฮมเบอร์เกอร์เนื้อ": { kcal: 250, protein: 13 },
    "McDonalds แมคฟิช": { kcal: 330, protein: 14 },
    "McDonalds เฟรนช์ฟรายส์ (M)": { kcal: 320, protein: 4 },
    "Burger King วอปเปอร์ จูเนียร์": { kcal: 310, protein: 14 },
    "The Pizza Company ซูเปอร์ดีลักซ์ (แป้งหนานุ่ม 1 ชิ้น)": { kcal: 280, protein: 12 },
    "The Pizza Company ฮาวายเอี้ยน (แป้งบางกรอบ 1 ชิ้น)": { kcal: 190, protein: 9 },
    "Subway แซนด์วิชอกไก่สไลด์ 6 นิ้ว (ไม่รวมซอส)": { kcal: 280, protein: 18 }
  },

  "Supplements_Ingredients": {
    "BAAM!! MY WHEY (Whey Concentrate) 1 scoop": { kcal: 140, protein: 25 },
    "BAAM!! 100% ISOLATE 1 scoop": { kcal: 120, protein: 27 },
    "BAAM!! SOY PROTEIN ISOLATE 1 scoop": { kcal: 110, protein: 25 },
    "Instant Oats / Rolled Oats (ข้าวโอ๊ตดิบ) 1 ทัพพี (35g)": { kcal: 130, protein: 5 },
    "ข้าวโอ๊ตปรุงสุกผสมน้ำ 1 ถ้วยตวง": { kcal: 150, protein: 6 },
    "เมล็ดอัลมอนด์ดิบ/อบแกะเปลือก 10 เม็ด (ประมาณ 12g)": { kcal: 70, protein: 3 },
    "เนยถั่วอัลมอนด์ 1 ช้อนโต๊ะ (15g)": { kcal: 95, protein: 3 },
    "นมอัลมอนด์ Blue Diamond Almond Breeze (รสจืด) 1 กล่อง 180ml": { kcal: 25, protein: 1 },
    "นมอัลมอนด์ 137 Degrees (สูตรดั้งเดิม) 1 กล่อง 180ml": { kcal: 60, protein: 2 },
    "นมโอ๊ต Oatside (สูตร Barista Blend) 1 กล่อง 200ml": { kcal: 130, protein: 2 }
  }
};
