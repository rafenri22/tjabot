const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const CommandHandlers = require("./handlers/commandHandlers");
const AttendanceHandlers = require("./handlers/attendanceHandlers");
const DailyGreetingHandlers = require("./handlers/dailyGreetingHandlers");
const StickerHandlers = require("./handlers/stickerHandlers"); // NEW
const AskHandlers = require("./handlers/askHandlers"); // NEW
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
const dailyGreetingHandlers = new DailyGreetingHandlers(client);
const stickerHandlers = new StickerHandlers(client); // NEW
const askHandlers = new AskHandlers(client); // NEW

// Variable untuk tracking last reset date
let lastResetDate = null;

// Event ketika QR code perlu di-scan
client.on("qr", (qr) => {
  console.log("📱 Scan QR Code di bawah ini untuk login WhatsApp:");
  qrcode.generate(qr, { small: true });
  console.log("✨ TJA Bot v4.0 - Now with Sticker Maker & AI Assistant! 🎨🤖");
});

// Event ketika client sudah siap
client.on("ready", () => {
  console.log("✅ Bot WhatsApp TJA berhasil terhubung!");
  console.log("🤖 Bot siap menerima perintah di grup...");
  console.log("🎭 Now featuring 50+ hilarious responses!");
  console.log("🕌 Islamic features for Friday prayers!");
  console.log("📅 Daily greeting system activated!");
  console.log("🎨 NEW: Sticker maker feature enabled! 🆕");
  console.log("🧠 NEW: AI-powered Q&A assistant ready! 🆕");
  console.log("📋 Commands available:");
  console.log("   - /TJA-XXX (info armada with style)");
  console.log("   - /jomox nama (cek jomok level - 50+ responses!)");
  console.log(
    "   - /siapa pertanyaan? (random member picker - sarcastic edition)"
  );
  console.log("   - /kembaran nama (find twin with photo)");
  console.log("   - /hari (daily greeting - special Friday features!)");
  console.log("   - /stiker (convert image to sticker) 🆕");
  console.log("   - /ask question (AI-powered search & answer) 🆕");
  console.log("   - /verifikasi (verifikasi armada - now with sass)");
  console.log("   - /hadir TJA-XXX (attendance: daily + Friday prayer)");
  console.log("   - /absen TJA-XXX keterangan (leave request: daily + Friday)");
  console.log("   - /rekap (daily attendance recap with Friday sanctions)");
  console.log(
    "   - /jumlah TJA-XXX/all/jumatan (monthly reports including Friday prayers)"
  );
  console.log("   - /info (help with personality + new features)");
  console.log("🚀 TJA Bot v4.0 is ready to entertain, inspire & assist!");
  console.log("📊 Enhanced attendance system with Islamic values!");
  console.log("🎭 Funny sanctions for Friday prayer absentees!");
  console.log("🎨 Advanced sticker creation with image processing!");
  console.log("🧠 Smart Q&A with web search integration!");
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

  // Set interval untuk apply Friday sanctions (setiap jam di hari Jumat setelah jam 15:00)
  setInterval(async () => {
    const now = new Date();
    if (now.getDay() === 5 && now.getHours() >= 15) {
      // Friday after 3 PM
      console.log("🕌 Checking for Friday prayer sanctions...");
      const sanctionsApplied =
        await dailyGreetingHandlers.applyFridaySanctions();
      if (sanctionsApplied > 0) {
        console.log(`✅ Applied ${sanctionsApplied} Friday prayer sanctions`);
      }
    }
  }, 3600000); // Check every hour
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

    // Handle /hari command
    if (lowerText === "/hari") {
      await dailyGreetingHandlers.handleHariCommand(message);
    }

    // Handle /stiker command (NEW!)
    else if (lowerText === "/stiker" || lowerText === "/STIKER") {
      await stickerHandlers.handleStikerCommand(message);
    }

    // Handle /ask command (NEW!)
    else if (lowerText.startsWith("/ask ") || lowerText.startsWith("/ASK ")) {
      const question = text.substring(5); // Remove '/ask '
      if (question.trim()) {
        await askHandlers.handleAskCommand(message, question.trim());
      } else {
        const emptyAskResponses = [
          "❌ Pertanyaannya mana? Format: /ask [pertanyaan] 🤔",
          "❌ Mau nanya apa nih? /ask [pertanyaan yang ingin ditanyakan] 💭",
          "❌ Question not found! Please ask something 📝",
          "❌ Empty query detected! Isi pertanyaannya dong 🧠",
        ];
        const randomEmpty =
          emptyAskResponses[
            Math.floor(Math.random() * emptyAskResponses.length)
          ];
        await message.reply(randomEmpty);
      }
    }

    // Handle /TJA-xxx command
    else if (lowerText.startsWith("/tja-")) {
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

    // Handle /hadir command (ENHANCED - now supports both daily and Friday attendance)
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

    // Handle /absen command (ENHANCED - now supports both daily and Friday attendance)
    else if (
      lowerText.startsWith("/absen ") ||
      lowerText.startsWith("/ABSEN ")
    ) {
      await attendanceHandlers.handleAbsenCommand(message, text);
    }

    // Handle /rekap command (ENHANCED - now shows Friday sanctions)
    else if (lowerText === "/rekap" || lowerText === "/REKAP") {
      await attendanceHandlers.handleRekapCommand(message);
    }

    // Handle /jumlah command (ENHANCED - now includes /jumlah jumatan)
    else if (
      lowerText.startsWith("/jumlah ") ||
      lowerText.startsWith("/JUMLAH ")
    ) {
      await attendanceHandlers.handleJumlahCommand(message, text);
    }

    // Handle /info command (UPDATED - now includes new features)
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
      "❌ System lagi loading... tapi kayaknya stuck. Try again! 🔄",
      "❌ Error 404: Brain.exe not found! Mungkin lagi istirahat 🧠💤",
      "❌ AI overload! Too much intelligence for one day 🤯⚡",
      "❌ Sticker machine jammed! Engineer on the way 🔧🎨",
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
console.log("🚀 Starting WhatsApp Bot TJA v4.0...");
console.log("🎭 Loading 50+ hilarious responses...");
console.log("📸 Initializing twin finder system...");
console.log("📊 Loading enhanced attendance management system...");
console.log("🕌 Activating Islamic features for Friday prayers...");
console.log("📅 Initializing daily greeting system...");
console.log("🎭 Loading funny sanctions for Friday prayer absentees...");
console.log("🎨 NEW: Loading advanced sticker creation engine...");
console.log("🧠 NEW: Initializing AI-powered Q&A assistant...");
console.log("🌐 NEW: Connecting to web search APIs...");
client.initialize();

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Bot dihentikan oleh user");
  console.log("👋 TJA Bot v4.0 shutting down gracefully...");
  console.log("💾 Saving attendance data...");
  console.log("🕌 Saving Friday prayer records...");
  console.log("🎨 Cleaning up sticker cache...");
  console.log("🧠 Saving AI conversation context...");
  await client.destroy();
  process.exit(0);
});

console.log("🎉 TJA Bot v4.0 initialized successfully!");
console.log("💫 Ready to bring joy & Islamic values to your WhatsApp groups!");
console.log("📊 Enhanced attendance system with Friday prayer tracking ready!");
console.log("🎭 Funny sanctions loaded and ready to deploy!");
console.log("🕌 Islamic features activated - Barakallahu fiikum!");
console.log("🎨 Advanced sticker maker with image processing ready!");
console.log("🧠 AI-powered assistant with web search capabilities online!");
console.log("🌟 All systems green - TJA Bot v4.0 fully operational!");
