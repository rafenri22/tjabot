const supabase = require("../config/database");
const BotHelpers = require("../utils/helpers");
const { MessageMedia } = require("whatsapp-web.js");

class CommandHandlers {
  constructor(client) {
    this.client = client;
  }

  // Handler untuk command /TJA-xxx
  async handleTJACommand(message, kodeUnit) {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("kode_unit", kodeUnit.toUpperCase())
        .single();

      if (error || !data) {
        const notFoundResponses = [
          `❌ Kode unit ${kodeUnit.toUpperCase()} tidak ditemukan! Mungkin armadanya lagi nyasar di dimensi lain 🌀`,
          `❌ ${kodeUnit.toUpperCase()}? Nggak ada bos! Coba cek lagi, jangan-jangan typo 🤔`,
          `❌ Armada ${kodeUnit.toUpperCase()} hilang! Terakhir terlihat di area Bermuda Triangle 🛸`,
          `❌ 404 Armada Not Found! ${kodeUnit.toUpperCase()} mungkin sedang traveling ke Mars 🚀`,
          `❌ ${kodeUnit.toUpperCase()} tidak terdaftar di sistem! Atau mungkin ini armada siluman? 👻`,
        ];
        const randomResponse =
          notFoundResponses[
            Math.floor(Math.random() * notFoundResponses.length)
          ];
        await message.reply(randomResponse);
        return;
      }

      const armadaInfo = BotHelpers.formatArmadaInfo(data);

      // Kirim foto dengan caption jika ada foto
      if (
        armadaInfo.imageUrl &&
        armadaInfo.imageUrl !==
          "https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png"
      ) {
        try {
          const media = await MessageMedia.fromUrl(armadaInfo.imageUrl);
          await message.reply(media, undefined, {
            caption: armadaInfo.message,
          });
        } catch (mediaError) {
          console.log("Error loading image, sending text only:", mediaError);
          await message.reply(
            armadaInfo.message +
              "\n\n*Note: Fotonya lagi malu-malu, jadi nggak mau muncul 📸*"
          );
        }
      } else {
        await message.reply(armadaInfo.message);
      }
    } catch (error) {
      console.error("Error handling TJA command:", error);
      const errorResponses = [
        "❌ Terjadi kesalahan saat mengambil data armada. Server lagi bad mood 😤",
        "❌ Database lagi ngambek, coba lagi nanti ya 🙄",
        "❌ Error 500: Internal server drama! Coba refresh hidup anda 🔄",
        "❌ Oops! Something went wrong. Mungkin kucing server lagi main kabel 🐱",
      ];
      const randomError =
        errorResponses[Math.floor(Math.random() * errorResponses.length)];
      await message.reply(randomError);
    }
  }

  // Handler untuk command /jomox
  async handleJomoxCommand(message, name) {
    try {
      const response = BotHelpers.getRandomJomoxResponse(name);
      await BotHelpers.delay(1000); // Anti spam delay
      await message.reply(response);
    } catch (error) {
      console.error("Error handling jomox command:", error);
      await message.reply(
        "❌ Error calculating jomok level! Mungkin jomoknya terlalu tinggi sampai sistem crash 💥"
      );
    }
  }

  // Handler untuk command /siapa
  async handleSiapaCommand(message, question) {
    try {
      const response = await BotHelpers.getRandomMemberForSiapa(
        supabase,
        question
      );
      await BotHelpers.delay(1500); // Anti spam delay
      await message.reply(response);
    } catch (error) {
      console.error("Error handling siapa command:", error);
      await message.reply(
        "❌ Terjadi kesalahan saat menghubungi paranormal digital 🔮💫"
      );
    }
  }

  // Handler untuk command /kembaran (NEW!)
  async handleKembaranCommand(message, name) {
    try {
      if (!name || name.trim() === "") {
        const emptyResponses = [
          "❌ Nama mana bos? Masa mau nyari kembaran hantu 👻",
          "❌ Format: /kembaran [nama]. Jangan setengah-setengah dong! 😏",
          "❌ Isi namanya dong! Saya bukan paranormal yang bisa baca pikiran 🔮",
          "❌ Nama kosong = kembaran kosong juga. Logic! 🧠",
        ];
        const randomEmpty =
          emptyResponses[Math.floor(Math.random() * emptyResponses.length)];
        await message.reply(randomEmpty);
        return;
      }

      // Get random image from bucket "gambar"
      const imageUrl = await BotHelpers.getRandomImageFromBucket(supabase);

      // Get random Indonesian old man name
      const kembaranName = BotHelpers.getRandomOldIndonesianName();

      // Get random response
      const response = BotHelpers.getRandomKembaranResponse(
        name.trim(),
        kembaranName
      );

      // Anti spam delay
      await BotHelpers.delay(1500);

      if (imageUrl) {
        try {
          const media = await MessageMedia.fromUrl(imageUrl);
          await message.reply(media, undefined, { caption: response });
        } catch (mediaError) {
          console.log(
            "Error loading kembaran image, sending text only:",
            mediaError
          );
          await message.reply(
            response +
              "\n\n*Note: Fotonya malu-malu, tapi trust me kembarannya mirip banget! 📸*"
          );
        }
      } else {
        await message.reply(
          response +
            "\n\n*Note: Foto kembarannya lagi nggak ada, tapi percaya deh mereka mirip! 🖼️*"
        );
      }
    } catch (error) {
      console.error("Error handling kembaran command:", error);
      const kembaranErrors = [
        "❌ Error saat mencari kembaran! Mungkin kembarannya lagi main hide and seek 🫣",
        "❌ Database kembaran lagi maintenance! Coba lagi nanti ya 🔧",
        "❌ Sistem pencarian kembaran overload! Terlalu banyak yang mirip 😵‍💫",
        "❌ Error 404: Kembaran not found! Mungkin kembarannya extinct 🦕",
      ];
      const randomError =
        kembaranErrors[Math.floor(Math.random() * kembaranErrors.length)];
      await message.reply(randomError);
    }
  }

  // Handler untuk command /verifikasi
  async handleVerifikasiCommand(message, text) {
    try {
      const parts = text.split(" ");
      const kodeUnit = parts[1]?.toUpperCase();

      if (!kodeUnit) {
        const formatErrors = [
          "❌ Format salah bang! Gunakan: /VERIFIKASI TJA-XXX NICKNAME=nama atau kirim foto dengan caption /VERIFIKASI TJA-XXX FOTO",
          "❌ Waduh formatnya ngaco! Coba baca manual dulu deh 📖",
          "❌ Format error detected! Mungkin perlu kursus cara chat yang benar 🎓",
          "❌ Kok formatnya aneh gitu? Ini WhatsApp bukan telegram alien 👽",
        ];
        const randomFormatError =
          formatErrors[Math.floor(Math.random() * formatErrors.length)];
        await message.reply(randomFormatError);
        return;
      }

      // Cek apakah armada exists
      const { data: existingData, error: checkError } = await supabase
        .from("members")
        .select("*")
        .eq("kode_unit", kodeUnit)
        .single();

      if (checkError || !existingData) {
        const notExistResponses = [
          `❌ Kode unit ${kodeUnit} tidak ditemukan! Coba cek lagi, jangan asal tebak 🤔`,
          `❌ ${kodeUnit} nggak ada di database! Mungkin armada dari masa depan? 🚀`,
          `❌ Armada ${kodeUnit} tidak terdaftar! Atau mungkin ini armada siluman? 👻`,
          `❌ 404: Armada ${kodeUnit} not found! Coba reset router dulu 📡`,
        ];
        const randomNotExist =
          notExistResponses[
            Math.floor(Math.random() * notExistResponses.length)
          ];
        await message.reply(randomNotExist);
        return;
      }

      // Handle nickname update
      if (parts[2]?.startsWith("NICKNAME=")) {
        const nickname = parts[2].replace("NICKNAME=", "");

        const { error: updateError } = await supabase
          .from("members")
          .update({ nickname: nickname })
          .eq("kode_unit", kodeUnit);

        if (updateError) {
          const updateErrors = [
            "❌ Gagal mengupdate nickname! Database lagi ngambek 😤",
            "❌ Update gagal! Mungkin nicknamenya terlalu keren untuk sistem 😎",
            "❌ Error saat update! Coba nickname yang lebih simple 🤷‍♂️",
          ];
          const randomUpdateError =
            updateErrors[Math.floor(Math.random() * updateErrors.length)];
          await message.reply(randomUpdateError);
          return;
        }

        const successNickname = [
          `✅ Nickname untuk ${kodeUnit} berhasil diupdate: ${nickname}! Keren banget! 😎`,
          `✅ Update nickname sukses! ${kodeUnit} sekarang punya identitas: ${nickname} 🎭`,
          `✅ Nickname ${nickname} untuk ${kodeUnit} berhasil disimpan! Welcome to the club! 🎉`,
          `✅ Great! ${kodeUnit} sekarang dikenal sebagai ${nickname}! 🏆`,
        ];
        const randomSuccess =
          successNickname[Math.floor(Math.random() * successNickname.length)];
        await message.reply(randomSuccess);

        // Cek apakah sudah lengkap untuk verifikasi
        await this.checkAndUpdateVerificationStatus(kodeUnit, message);
      }

      // Handle foto upload
      if (parts[2] === "FOTO" && message.hasMedia) {
        try {
          const media = await message.downloadMedia();

          if (!media) {
            const downloadErrors = [
              "❌ Gagal mengunduh foto! Mungkin fotonya lagi malu 📸",
              "❌ Download foto error! Coba foto yang lebih photogenic 😅",
              "❌ Foto nggak bisa diunduh! Mungkin perlu izin dari fotografer 📷",
            ];
            const randomDownloadError =
              downloadErrors[Math.floor(Math.random() * downloadErrors.length)];
            await message.reply(randomDownloadError);
            return;
          }

          // Convert base64 to buffer
          const buffer = Buffer.from(media.data, "base64");
          const fileName = `armada-${kodeUnit}-${Date.now()}.jpg`;

          const { data: uploadData, error: uploadError } =
            await supabase.storage.from("photos_url").upload(fileName, buffer, {
              contentType: "image/jpeg",
              upsert: true,
            });

          if (uploadError) {
            console.error("Upload error:", uploadError);
            const uploadErrors = [
              "❌ Gagal mengupload foto! Server lagi diet, nggak mau terima foto 📸",
              "❌ Upload error! Mungkin fotonya terlalu keren sampai server shock 😱",
              "❌ Foto gagal diupload! Coba yang lebih simple 🤳",
            ];
            const randomUploadError =
              uploadErrors[Math.floor(Math.random() * uploadErrors.length)];
            await message.reply(randomUploadError);
            return;
          }

          const { data: publicUrlData } = supabase.storage
            .from("photos_url")
            .getPublicUrl(fileName);

          const fotoUrl = publicUrlData.publicUrl;

          const { error: updateError } = await supabase
            .from("members")
            .update({ foto_armada: fotoUrl })
            .eq("kode_unit", kodeUnit);

          if (updateError) {
            const saveErrors = [
              "❌ Gagal menyimpan URL foto! Database lagi picky 🙄",
              "❌ Error saat simpan foto! Mungkin URLnya terlalu panjang 📏",
              "❌ Foto upload sukses tapi gagal disimpan! Aneh banget 🤔",
            ];
            const randomSaveError =
              saveErrors[Math.floor(Math.random() * saveErrors.length)];
            await message.reply(randomSaveError);
            return;
          }

          const photoSuccess = [
            `✅ Foto untuk ${kodeUnit} berhasil diupload! Bagus banget fotonya! 📸✨`,
            `✅ Upload foto sukses! ${kodeUnit} sekarang punya foto kece! 📷🔥`,
            `✅ Foto berhasil disimpan! ${kodeUnit} makin photogenic nih! 📸😎`,
            `✅ Great shot! Foto ${kodeUnit} sudah tersimpan dengan aman! 🏆📷`,
          ];
          const randomPhotoSuccess =
            photoSuccess[Math.floor(Math.random() * photoSuccess.length)];
          await message.reply(randomPhotoSuccess);

          // Cek apakah sudah lengkap untuk verifikasi
          await this.checkAndUpdateVerificationStatus(kodeUnit, message);
        } catch (error) {
          console.error("Upload error:", error);
          await message.reply(
            "❌ Terjadi kesalahan saat mengupload foto! Mungkin kucing server lagi main kabel 🐱💻"
          );
        }
      }

      // Jika tidak ada NICKNAME= atau FOTO
      if (!parts[2]?.startsWith("NICKNAME=") && parts[2] !== "FOTO") {
        const formatReminders = [
          "❌ Format salah! Gunakan: /VERIFIKASI TJA-XXX NICKNAME=nama atau kirim foto dengan caption /VERIFIKASI TJA-XXX FOTO",
          "❌ Formatnya kurang tepat! Coba baca petunjuk dengan teliti ya 📖",
          "❌ Format error! Mungkin perlu kacamata baca manual 👓",
          "❌ Waduh formatnya ngaco! Ini bukan kode Enigma loh 🔐",
        ];
        const randomReminder =
          formatReminders[Math.floor(Math.random() * formatReminders.length)];
        await message.reply(randomReminder);
      }
    } catch (error) {
      console.error("Error handling verifikasi command:", error);
      const verifikasiErrors = [
        "❌ Terjadi kesalahan saat memproses verifikasi! Server lagi drama queen 👑",
        "❌ Error verifikasi! Mungkin sistemnya lagi PMS 😅",
        "❌ Proses verifikasi gagal! Coba lagi atau mungkin besok aja 🤷‍♂️",
      ];
      const randomVerifikasiError =
        verifikasiErrors[Math.floor(Math.random() * verifikasiErrors.length)];
      await message.reply(randomVerifikasiError);
    }
  }

  // Function untuk cek dan update status verifikasi
  async checkAndUpdateVerificationStatus(kodeUnit, message) {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("kode_unit", kodeUnit)
        .single();

      if (error || !data) return;

      // Cek apakah semua data sudah lengkap
      if (data.nickname && data.foto_armada && data.crew) {
        const { error: updateError } = await supabase
          .from("members")
          .update({ status: "Terverifikasi" })
          .eq("kode_unit", kodeUnit);

        if (!updateError) {
          const celebrationMessages = [
            `🎉 *${kodeUnit} TELAH TERVERIFIKASI LENGKAP!* 🎉\n\nSemua data armada telah lengkap dan resmi digunakan! Welcome to the verified club! 🏆`,
            `🚀 *CONGRATULATIONS!* ${kodeUnit} berhasil terverifikasi! 🚀\n\nArmada ini sekarang official dan siap beroperasi! Let's go! 💪`,
            `✨ *VERIFICATION COMPLETE!* ✨\n\n${kodeUnit} sekarang sudah lengkap dan terverifikasi! Time to celebrate! 🎊`,
            `🏅 *MISSION ACCOMPLISHED!* 🏅\n\n${kodeUnit} berhasil melewati semua tahap verifikasi! Ready to rock! 🎸`,
          ];
          const randomCelebration =
            celebrationMessages[
              Math.floor(Math.random() * celebrationMessages.length)
            ];
          await message.reply(randomCelebration);
        }
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
    }
  }

  // Handler untuk command /info (Updated to include new commands)
  async handleInfoCommand(message) {
    const infoTexts = [
      `📋 *PANDUAN PENGGUNAAN BOT TJA* 🤖

🚌 */TJA-XXX* 
Menampilkan informasi armada lengkap
Contoh: /TJA-001

🤪 */jomox nama* 
Mengecek tingkat jomok seseorang (scientifically proven!)
Contoh: /jomox agung

🎯 */siapa pertanyaan?* 
Random pilih member untuk menjawab (by AI algorithm)
Contoh: /siapa yang paling ganteng?

👥 */kembaran nama* 
Mencari kembaran seseorang dengan foto
Contoh: /kembaran agungg

🌅 */hari*
Pengantar harian dari bot (beda setiap hari!)
✨ Khusus Jumat: Ajakan sholat Jumat + absensi!

🔧 */verifikasi TJA-XXX NICKNAME=nama* 
Verifikasi armada dengan nickname

📷 */verifikasi TJA-XXX FOTO* 
Upload foto armada (kirim foto dengan caption ini)

✅ */hadir TJA-XXX*
Absensi kehadiran (harian/jumatan)
Contoh: /hadir TJA-001

🏥 */absen TJA-XXX keterangan*
Izin dengan alasan (harian/jumatan)
Contoh: /absen TJA-001 sakit demam

ℹ️ */info*
Menampilkan panduan ini

_PT TRIJAYA AGUNG LESTARI @2025_
*"Connecting People, Creating Memories"* ✨`,

      `🤖 *BOT TJA - YOUR DIGITAL ASSISTANT* 📱

*Available Commands:*

🚍 **Armada Info**: /TJA-XXX
   Get complete armada information

😂 **Jomok Checker**: /jomox [nama]
   Check someone's jomok level (AI-powered!)

🎲 **Random Picker**: /siapa [pertanyaan?]
   Let AI choose someone randomly

👫 **Twin Finder**: /kembaran [nama]
   Find someone's lookalike (with photo!)

🌤️ **Daily Greeting**: /hari
   Get daily greeting (special Friday features!)

✅ **Verification**: /verifikasi [kode] [action]
   Verify your armada data

📋 **Attendance System**:
   • /hadir TJA-XXX - Mark attendance (daily/Friday)
   • /absen TJA-XXX reason - Request leave
   • /rekap - Daily attendance summary
   • /jumlah [option] - Monthly reports

❓ **Help**: /info
   Show this guide

*Made with ❤️ by TJA Tech Team*
_"Innovation in Transportation & Islamic Values"_ 🚀🕌`,
    ];

    const randomInfo = infoTexts[Math.floor(Math.random() * infoTexts.length)];
    await message.reply(randomInfo);
  }
}

module.exports = CommandHandlers;
