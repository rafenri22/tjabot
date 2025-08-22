const { MessageMedia } = require("whatsapp-web.js");
const sharp = require("sharp");
const BotHelpers = require("../utils/helpers");

class StickerHandlers {
  constructor(client) {
    this.client = client;
  }

  // Handler untuk command /stiker
  async handleStikerCommand(message) {
    try {
      // Check if message has media
      if (!message.hasMedia) {
        const noMediaResponses = [
          "❌ Eh mana fotonya? Masa mau bikin stiker dari angin? 🌪️",
          "❌ Foto kosong = stiker kosong! Logic banget kan? 🧠",
          "❌ Kirim foto dulu dong sebelum minta dibuatin stiker! 📸",
          "❌ Stiker tanpa gambar? Inovasi banget tuh! 😂",
          "❌ Mau bikin stiker invisible ya? Saya bukan sulap bos! 🎩✨",
          "❌ Format: Kirim foto + caption /stiker. Jangan setengah-setengah! 📷",
          "❌ Foto mana foto? Jangan cuma modal nekat doang! 😏",
          "❌ Saya butuh bahan mentah (foto) untuk bikin stiker! 🍯",
        ];
        const randomResponse =
          noMediaResponses[Math.floor(Math.random() * noMediaResponses.length)];
        await message.reply(randomResponse);
        return;
      }

      // Send processing message
      const processingMessages = [
        "🎨 Sedang memproses foto jadi stiker keren... Tunggu ya! ✨",
        "⚡ Mengaktifkan mesin pembuat stiker... Loading 99%... 🔄",
        "🖼️ Foto sedang dijadikan stiker premium... Almost done! 💫",
        "🎭 Transforming your image into awesome sticker... Wait! 🚀",
        "🌟 Magic is happening... Your sticker is being crafted! ✨",
        "💫 Proses konversi dimulai... Stiker akan segera jadi! 🎨",
        "🔮 Abracadabra! Foto lagi berubah jadi stiker... Tunggu! ⚡",
        "🎪 Pertunjukan sulap dimulai... Foto → Stiker! 🎭✨",
      ];
      const randomProcessing =
        processingMessages[
          Math.floor(Math.random() * processingMessages.length)
        ];
      await message.reply(randomProcessing);

      // Download the media
      const media = await message.downloadMedia();
      if (!media) {
        const downloadErrors = [
          "❌ Gagal download foto! Mungkin fotonya lagi malu 📸😳",
          "❌ Error download! Foto terlalu cantik sampai server minder 😅",
          "❌ Download failed! Koneksi lagi mood-an ya? 📡💢",
          "❌ Foto nggak bisa diambil! Mungkin dikunci password? 🔐",
        ];
        const randomError =
          downloadErrors[Math.floor(Math.random() * downloadErrors.length)];
        await message.reply(randomError);
        return;
      }

      // Check if it's an image
      if (!media.mimetype.startsWith("image/")) {
        const notImageResponses = [
          "❌ Ini bukan foto bos! Stiker cuma bisa dari gambar 🖼️",
          "❌ File type error! Saya butuh foto, bukan file random 📁",
          "❌ Hanya foto yang bisa dijadiin stiker! Try again! 📷",
          "❌ Format tidak supported! Kirim gambar dong, bukan dokumen 📋",
        ];
        const randomNotImage =
          notImageResponses[
            Math.floor(Math.random() * notImageResponses.length)
          ];
        await message.reply(randomNotImage);
        return;
      }

      // Convert image to sticker format using sharp
      const inputBuffer = Buffer.from(media.data, "base64");

      // Process image to be sticker-compatible (512x512 WebP with transparent background)
      const processedBuffer = await sharp(inputBuffer)
        .resize(512, 512, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
        })
        .webp({
          quality: 90,
          effort: 6,
        })
        .toBuffer();

      // Create MessageMedia for sticker
      const stickerMedia = new MessageMedia(
        "image/webp",
        processedBuffer.toString("base64"),
        "sticker.webp"
      );

      // Send as sticker
      await message.reply(stickerMedia, undefined, { sendAsSticker: true });

      // Send success message with random response
      const successMessages = [
        "✅ Tadaa! Stiker keren berhasil dibuat! Sip banget kan? 🎉✨",
        "🎨 Masterpiece stiker completed! Karyeni seni terbaru nih! 🖼️🏆",
        "🚀 Mission accomplished! Stiker premium ready to use! 💫",
        "⚡ Boom! Foto udah berubah jadi stiker kece! Magic! ✨🎭",
        "🎊 Success! Your custom sticker is ready to rock! 🔥",
        "💎 Perfect sticker created! Dijamin bikin chat makin seru! 🎪",
        "🌟 Voila! Stiker eksklusif hasil karya bot keren! 😎✨",
        "🏅 Stiker berkualitas tinggi berhasil diproduksi! Top! 🥇",
        "🎯 Bullseye! Stiker jadi dengan sempurna! 🎨🎉",
        "💫 Abracadabra! Foto transformation complete! 🔮✨",
      ];
      const randomSuccess =
        successMessages[Math.floor(Math.random() * successMessages.length)];

      await BotHelpers.delay(1000);
      await message.reply(randomSuccess);
    } catch (error) {
      console.error("Error handling stiker command:", error);
      const errorResponses = [
        "❌ Error bikin stiker! Mesin pembuat stiker lagi maintenance 🔧",
        "❌ Gagal convert foto! Mungkin fotonya terlalu perfect 😅",
        "❌ Processing error! Server lagi capek bikin stiker 💤",
        "❌ Oops! Ada gangguan di pabrik stiker digital 🏭💥",
        "❌ System malfunction! Coba lagi atau foto yang lain 🔄",
        "❌ Stiker machine breakdown! Engineer lagi dipanggil 👨‍🔧",
        "❌ Error 500: Terlalu banyak permintaan stiker hari ini 📊",
        "❌ Magic spell failed! Coba lagi dengan foto yang berbeda ✨💥",
      ];
      const randomError =
        errorResponses[Math.floor(Math.random() * errorResponses.length)];
      await message.reply(randomError);
    }
  }

  // Helper function to validate image dimensions and size
  async validateImage(buffer) {
    try {
      const metadata = await sharp(buffer).metadata();

      // Check file size (max 1MB for performance)
      if (buffer.length > 1024 * 1024) {
        return { valid: false, reason: "File terlalu besar! Max 1MB ya 📏" };
      }

      // Check if image has valid dimensions
      if (!metadata.width || !metadata.height) {
        return { valid: false, reason: "Format gambar tidak valid 🖼️" };
      }

      return { valid: true };
    } catch (error) {
      return { valid: false, reason: "Gagal memproses gambar 🔍" };
    }
  }

  // Advanced sticker with custom effects
  async createCustomSticker(inputBuffer, effect = "normal") {
    try {
      let sharpInstance = sharp(inputBuffer).resize(512, 512, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      });

      // Apply effects based on parameter
      switch (effect) {
        case "blur":
          sharpInstance = sharpInstance.blur(2);
          break;
        case "sharpen":
          sharpInstance = sharpInstance.sharpen();
          break;
        case "grayscale":
          sharpInstance = sharpInstance.grayscale();
          break;
        case "vintage":
          sharpInstance = sharpInstance.modulate({
            saturation: 0.8,
            brightness: 0.9,
            hue: 30,
          });
          break;
        default:
          // Normal processing
          break;
      }

      return await sharpInstance
        .webp({
          quality: 90,
          effort: 6,
        })
        .toBuffer();
    } catch (error) {
      throw new Error("Failed to create custom sticker: " + error.message);
    }
  }
}

module.exports = StickerHandlers;
