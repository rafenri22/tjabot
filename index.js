const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const CommandHandlers = require("./handlers/commandHandlers");
const AttendanceHandlers = require("./handlers/attendanceHandlers");
const BotHelpers = require("./utils/helpers");

// Inisialisasi client WhatsApp
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "tja-bot",
  }),
  puppeteer: {
    headless: true,
    timeout: 60000,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu",
      "--disable-web-security",
      "--disable-features=VizDisplayCompositor",
      "--disable-extensions",
      "--disable-plugins",
      "--disable-images",
      "--disable-javascript",
      "--disable-default-apps",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
      "--disable-background-networking",
      "--no-default-browser-check",
      "--no-first-run",
      "--disable-logging",
      "--disable-gpu-logging",
      "--silent",
    ],
  },
});

const commandHandlers = new CommandHandlers(client);
const attendanceHandlers = new AttendanceHandlers(client);

// Variable untuk tracking last reset date
let lastResetDate = null;

// Event ketika QR code perlu di-scan
client.on("qr", (qr) => {
  console.log("📱 Scan QR Code di bawah ini untuk login WhatsApp:");
  qrcode.generate(qr, { small: true });
  console.log("✨ TJA Bot v2.0 - Now with 50+ meme responses! 🎭");
});

// Event ketika client sudah siap
client.on("ready", () => {
  console.log("✅ Bot WhatsApp TJA berhasil terhubung!");
  console.log("🤖 Bot siap menerima perintah di grup...");
  console.log("🎭 Now featuring 50+ hilarious responses!");
  console.log("📋 Commands available:");
  console.log("   - /TJA-XXX (info armada with style)");
  console.log("   - /jomox nama (cek jomok level - 50+ responses!)");
  console.log(
    "   - /siapa pertanyaan? (random member picker - sarcastic edition)"
  );
  console.log("   - /kembaran nama (NEW! find twin with photo)");
  console.log("   - /verifikasi (verifikasi armada - now with sass)");
  console.log("   - /hadir TJA-XXX (attendance system)");
  console.log("   - /absen TJA-XXX keterangan (leave request)");
  console.log("   - /rekap (daily attendance recap)");
  console.log("   - /jumlah TJA-XXX/all (monthly attendance report)");
  console.log("   - /info (help with personality)");
  console.log("🚀 TJA Bot v2.0 is ready to entertain!");
  console.log("📊 Attendance system initialized!");
  console.log("");

  // Initialize daily reset
  initializeDailyReset();
});

// Function untuk inisialisasi daily reset
async function initializeDailyReset() {
  const today = new Date().toISOString().split("T")[0];

  // Check if we need to reset attendance for today
  if (BotHelpers.hasDateChanged(lastResetDate)) {
    console.log("🔄 Initializing daily attendance reset...");
    await attendanceHandlers.resetDailyAttendance();
    lastResetDate = today;
    console.log(`✅ Daily attendance reset completed for ${today}`);
  }

  // Set interval untuk cek reset harian setiap jam
  setInterval(async () => {
    const currentDate = new Date().toISOString().split("T")[0];
    if (BotHelpers.hasDateChanged(lastResetDate)) {
      console.log("🔄 New day detected! Resetting daily attendance...");
      await attendanceHandlers.resetDailyAttendance();
      lastResetDate = currentDate;
      console.log(`✅ Daily attendance reset completed for ${currentDate}`);
    }
  }, 3600000); // Check every hour (3600000 ms)
}

// Event ketika ada pesan masuk
client.on("message", async (message) => {
  try {
    // Hanya respon di grup
    if (!BotHelpers.isFromGroup(message)) {
      return;
    }

    const text = message.body.trim();

    // Hanya proses jika pesan mengandung command yang valid
    if (!text || !BotHelpers.isValidCommand(text)) {
      return;
    }

    console.log(`📨 Pesan diterima dari grup: ${text}`);

    // Anti spam delay
    await BotHelpers.delay(500);

    const lowerText = text.toLowerCase();

    // Handle /TJA-xxx command
    if (lowerText.startsWith("/tja-")) {
      const kodeUnit = text.substring(1); // Remove /
      await commandHandlers.handleTJACommand(message, kodeUnit);
    }

    // Handle /jomox command
    else if (
      lowerText.startsWith("/jomox ") ||
      lowerText.startsWith("/JOMOX ")
    ) {
      const name = text.substring(7); // Remove '/jomox '
      if (name.trim()) {
        await commandHandlers.handleJomoxCommand(message, name.trim());
      }
    }

    // Handle /siapa command
    else if (lowerText.startsWith("/siapa ")) {
      const question = text.substring(7); // Remove '/siapa '
      if (question.trim()) {
        await commandHandlers.handleSiapaCommand(message, question.trim());
      }
    }

    // Handle /kembaran command
    else if (
      lowerText.startsWith("/kembaran ") ||
      lowerText.startsWith("/KEMBARAN ")
    ) {
      const name = text.substring(10); // Remove '/kembaran '
      if (name.trim()) {
        await commandHandlers.handleKembaranCommand(message, name.trim());
      }
    }

    // Handle /verifikasi command
    else if (lowerText.startsWith("/verifikasi ")) {
      await commandHandlers.handleVerifikasiCommand(message, text);
    }

    // Handle /hadir command (NEW ATTENDANCE FEATURE)
    else if (
      lowerText.startsWith("/hadir ") ||
      lowerText.startsWith("/HADIR ")
    ) {
      const kodeUnit = text.split(" ")[1]; // Get TJA-XXX
      if (kodeUnit) {
        await attendanceHandlers.handleHadirCommand(message, kodeUnit);
      } else {
        const formatErrors = [
          "❌ Format salah! Gunakan: /hadir TJA-XXX",
          "❌ Kode unitnya mana bos? Format: /hadir TJA-XXX",
          "❌ Format error! Contoh: /hadir TJA-001",
          "❌ Kok formatnya aneh? /hadir TJA-XXX dong!",
        ];
        const randomError =
          formatErrors[Math.floor(Math.random() * formatErrors.length)];
        await message.reply(randomError);
      }
    }

    // Handle /absen command (NEW ATTENDANCE FEATURE)
    else if (
      lowerText.startsWith("/absen ") ||
      lowerText.startsWith("/ABSEN ")
    ) {
      await attendanceHandlers.handleAbsenCommand(message, text);
    }

    // Handle /rekap command (NEW ATTENDANCE FEATURE)
    else if (lowerText === "/rekap" || lowerText === "/REKAP") {
      await attendanceHandlers.handleRekapCommand(message);
    }

    // Handle /jumlah command (NEW ATTENDANCE FEATURE)
    else if (
      lowerText.startsWith("/jumlah ") ||
      lowerText.startsWith("/JUMLAH ")
    ) {
      await attendanceHandlers.handleJumlahCommand(message, text);
    }

    // Handle /info command
    else if (lowerText === "/info") {
      await commandHandlers.handleInfoCommand(message);
    }
  } catch (error) {
    console.error("❌ Error processing message:", error);
    // Send funny error message
    const errorResponses = [
      "❌ Oops! Something went wrong. Mungkin kucing server lagi main yarn 🐱🧶",
      "❌ Error detected! Server lagi bad mood, coba lagi nanti ya 😤",
      "❌ System malfunction! Mungkin perlu kopi dulu ☕",
      "❌ Bot.exe has stopped working. Please restart your expectations 🤖💥",
      "❌ Attendance system temporarily unavailable! Server lagi absen juga 📊💔",
    ];
    const randomError =
      errorResponses[Math.floor(Math.random() * errorResponses.length)];
    try {
      await message.reply(randomError);
    } catch (replyError) {
      console.error("Failed to send error message:", replyError);
    }
  }
});

// Event untuk handle loading screen
client.on("loading_screen", (percent, message) => {
  console.log(`🔄 Loading: ${percent}% - ${message}`);
});

// Event untuk handle change state
client.on("change_state", (state) => {
  console.log(`🔄 State changed: ${state}`);
});

// Event ketika ada error autentikasi
client.on("auth_failure", (msg) => {
  console.error("❌ Authentication failed:", msg);
  console.log("🔐 Please try scanning QR code again or clear browser data");
});

// Event ketika client terputus
client.on("disconnected", (reason) => {
  console.log("❌ Client was logged out:", reason);
  console.log("🔄 Bot will attempt to reconnect...");
});

// Handle protocol errors specifically
process.on("unhandledRejection", (reason, promise) => {
  if (reason && reason.message && reason.message.includes("Protocol error")) {
    console.log(
      "⚠️ Protocol error detected (this is normal for WhatsApp Web.js):",
      reason.message
    );
    console.log("🔧 Bot will continue running normally...");
  } else {
    console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
    console.log("🔧 System akan mencoba handle rejection...");
  }
});

process.on("uncaughtException", (error) => {
  if (error && error.message && error.message.includes("Protocol error")) {
    console.log(
      "⚠️ Protocol exception detected (this is normal for WhatsApp Web.js):",
      error.message
    );
    console.log("🔧 Bot will continue running normally...");
  } else {
    console.error("❌ Uncaught Exception:", error);
    console.log("🔄 Bot akan mencoba recovery...");
  }
});

// Jalankan client
console.log("🚀 Starting WhatsApp Bot TJA v2.0...");
console.log("🎭 Loading 50+ hilarious responses...");
console.log("📸 Initializing twin finder system...");
console.log("📊 Loading attendance management system...");
client.initialize();

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Bot dihentikan oleh user");
  console.log("👋 TJA Bot v2.0 shutting down gracefully...");
  console.log("💾 Saving attendance data...");
  await client.destroy();
  process.exit(0);
});

console.log("🎉 TJA Bot v2.0 initialized successfully!");
console.log("💫 Ready to bring joy to your WhatsApp groups!");
console.log("📊 Attendance system ready for daily operations!");
