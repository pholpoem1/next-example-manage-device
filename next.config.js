module.exports = {
  // กำหนดให้ Next.js รู้จักกับ CSS ไฟล์
  // และเปิดใช้ PostCSS
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")]
    }
  }
};
