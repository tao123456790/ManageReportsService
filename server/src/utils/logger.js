const fs = require('fs');
const path = require('path');

// สร้างโฟลเดอร์ logs ถ้ายังไม่มี
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Utility function สำหรับเขียน log ลงไฟล์
function writeLog(level, message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;

  // เขียนลง console
  console.log(logMessage.trim());

  // เขียนลงไฟล์
  fs.appendFileSync(path.join(logDir, 'app.log'), logMessage);
}

// Export ฟังก์ชัน logger แบบเรียบง่าย
module.exports = {
  info: (msg) => writeLog('info', msg),
  warn: (msg) => writeLog('warn', msg),
  error: (msg) => writeLog('error', msg),
};
