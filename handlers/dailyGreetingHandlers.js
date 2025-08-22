const supabase = require("../config/database");
const BotHelpers = require("../utils/helpers");

class DailyGreetingHandlers {
  constructor(client) {
    this.client = client;
  }

  // Handler untuk command /hari
  async handleHariCommand(message) {
    try {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const dayNames = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ];
      const currentDay = dayNames[dayOfWeek];

      let greeting;

      switch (dayOfWeek) {
        case 0: // Sunday
          greeting = this.getSundayGreeting();
          break;
        case 1: // Monday
          greeting = this.getMondayGreeting();
          break;
        case 2: // Tuesday
          greeting = this.getTuesdayGreeting();
          break;
        case 3: // Wednesday
          greeting = this.getWednesdayGreeting();
          break;
        case 4: // Thursday
          greeting = this.getThursdayGreeting();
          break;
        case 5: // Friday
          greeting = await this.getFridayGreeting(message);
          return; // Friday has special handling, so return early
        case 6: // Saturday
          greeting = this.getSaturdayGreeting();
          break;
      }

      await message.reply(greeting);
    } catch (error) {
      console.error("Error handling hari command:", error);
      const errorResponses = [
        "❌ Error mengecek hari! Mungkin kalendernya lagi rusak 📅💥",
        "❌ Sistem hari bermasalah! GPS waktu lagi error 🌍⏰",
        "❌ Gagal detect hari ini! Mungkin kita di dimensi paralel 🌀",
      ];
      const randomError =
        errorResponses[Math.floor(Math.random() * errorResponses.length)];
      await message.reply(randomError);
    }
  }

  getSundayGreeting() {
    const greetings = [
      `🌅 *SELAMAT HARI MINGGU!* 🌅

Hari yang perfect untuk rebahan maksimal! 🛌
Tapi ingat, besok udah Senin lagi... jangan sampai kaget ya! 😱

*Sunday Mood:*
- 70% tidur 😴
- 20% makan 🍕  
- 10% mikir besok kerja 😭

Have a blessed Sunday, TJA Family! 🙏✨`,

      `☀️ *HAPPY SUNDAY EVERYONE!* ☀️

Hari Minggu = Hari libur resmi untuk jadi pemalas professional! 🏆

*Sunday Checklist:*
✅ Bangun siang
✅ Scroll media sosial 3 jam
✅ Makan sambil tiduran
✅ Berpikir produktif (tapi gak ngapa-ngapain)

Enjoy your lazy Sunday, armada TJA! 🚌💤`,

      `🎉 *MINGGU MANISSSS!* 🎉

Weekend terakhir sebelum kembali ke realita pahit! 🥲

*Sunday Vibes:*
🌈 Santai tapi gelisah
🍃 Damai tapi deg-degan  
☁️ Happy tapi sedih (besok Senin)

Make the most of it, TJA Squad! 💪😎`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  getMondayGreeting() {
    const greetings = [
      `😤 *SELAMAT HARI SENIN!* 😤

Monday Blues is real, tapi semangat harus lebih real! 💪

*Monday Survival Kit:*
☕ Kopi extra strong
💊 Vitamin semangat
🎵 Playlist motivasi
🤣 Meme lucu biar gak stress

Let's conquer this Monday, TJA Warriors! ⚔️🔥`,

      `🚀 *MONDAY MOTIVATION INCOMING!* 🚀

Senin = Start Engine untuk minggu yang produktif! 

*Monday Mantra:*
"I can do this! I am strong! I am TJA Armada!"

Semangat kerja hari ini, besok masih panjang! 💼✨`,

      `⚡ *MONDAY MONDAY MONDAY!* ⚡

Hari paling ditakutin se-Indonesia! 😱
Tapi kita TJA Family, Monday is our playground! 🎮

Stay strong, stay motivated, stay awesome! 
Week ini bakalan amazing! 🌟💯`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  getTuesdayGreeting() {
    const greetings = [
      `🎯 *SELAMAT HARI SELASA!* 🎯

Selasa = Selasa-nya semangat! 💪

*Tuesday Facts:*
- Masih fresh dari Monday motivation
- Weekend masih keliatan dari kejauhan  
- Perfect day untuk ngegas produktivitas

Keep the momentum, TJA Champions! 🏆⚡`,

      `🌊 *TUESDAY ENERGY!* 🌊

Hari kedua dalam seminggu, masih semangat kan? 😎

*Tuesday Mood:*
🔋 Battery 85% charged
🎵 Playlist masih oke
☕ Kopi masih wirr
💼 Semangat kerja on point

Let's make Tuesday awesome, team! 🌟`,

      `🔥 *TUESDAY VIBES!* 🔥

Selasa yang indah untuk para pejuang TJA! 

Ingat: "Tuesday is just Monday's younger sibling!"
Jadi treat it better! 😂

Have a fantastic Tuesday, everyone! 🎊✨`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  getWednesdayGreeting() {
    const greetings = [
      `🐪 *HAPPY HUMP DAY!* 🐪

RABU = Hari tengah minggu! Separuh jalan menuju weekend! 🎉

*Wednesday Wisdom:*
"We're halfway to Friday!" 📈

*Current Status:*
- Semangat: 60% (menurun dari Senin)
- Harapan weekend: 90% (meningkat drastis)
- Produktivitas: Variable 📊

Keep pushing, TJA Team! Weekend is coming! 🏁`,

      `⚡ *WEDNESDAY WARRIORS!* ⚡

Rabu = Hari dimana kita mulai ngelirik kalender! 📅

*Wednesday Checklist:*
✅ Survive Monday & Tuesday  
🔄 Loading Wednesday...
⏳ Counting down to Friday
🎯 Still maintaining sanity

You're doing great, TJA Family! 💪🌟`,

      `🌈 *WONDERFUL WEDNESDAY!* 🌈

Pertengahan minggu yang penuh warna! 

*Wednesday Fact:* 
Statistik menunjukkan 73% orang mulai mikir weekend di hari Rabu! 📊😂

So you're perfectly normal, TJA Squad! 🤣✨`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  getThursdayGreeting() {
    const greetings = [
      `🎊 *THURSDAY THRILLS!* 🎊

KAMIS = "Kamu Ini Semangat!" 💪

*Thursday Status Update:*
- Weekend radar: DETECTED 📡
- Friday feeling: ACTIVATED ⚡  
- Work motivation: Holding strong 💼
- Weekend planning: INITIATED 🗓️

Almost there, TJA Heroes! One more day! 🏁🔥`,

      `🚀 *THURSDAY POWER!* 🚀

Kamis yang fantastis untuk tim TJA! 

*Today's Vibe:*
"Thank God it's Almost Friday!" 🙏

*Thursday Mood:*
😎 Cool & confident
⚡ Energized for the final push  
🎯 Weekend target: LOCKED

Let's finish strong, champions! 💯⭐`,

      `🌟 *THURSDAY THROWBACK!* 🌟

Remember kemarin pas Monday blues? Now look at us! 📈

*Thursday Achievement Unlocked:*
🏅 Survived 4 days of the week
🎯 Only 1 day left to weekend
💪 Still alive and kicking
🧠 Sanity level: Acceptable

Keep it up, TJA Superstars! 🚀✨`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  async getFridayGreeting(message) {
    const greetings = [
      `🕌 *ALHAMDULILLAH, JUMAT BERKAH!* 🕌

Hari yang paling dinanti umat Islam sedunia! 🤲

*Jumat Special Program:*
📿 Sholat Jumat = Wajib hukumnya
🤝 Silaturahmi dengan sesama
💫 Berbagi kebaikan
🙏 Doa dan dzikir

*PENGUMUMAN PENTING:*
⚠️ ABSENSI SHOLAT JUMAT DIBUKA! ⚠️

Ketik:
✅ */hadir TJA-XXX* - untuk absensi hadir sholat Jumat
Yang TIDAK HADIR akan dapat sanksi lucu dari owner! 😈

"Barangsiapa meninggalkan sholat Jumat 3 kali berturut-turut,
akan dicap sebagai armada paling jomok!" 😂

Yuk berangkat ke masjid terdekat! 🚶‍♂️🕌
Jumat Mubarak, TJA Family! 🌟`,
    ];

    const randomGreeting =
      greetings[Math.floor(Math.random() * greetings.length)];

    // Initialize Friday attendance system
    await this.initializeFridayAttendance();

    await message.reply(randomGreeting);
  }

  getSaturdayGreeting() {
    const greetings = [
      `🎉 *SATURDAY VIBES!* 🎉

SABTU = "Saatnya Bebas Totally Unlimited!" 🕺💃

*Saturday Checklist:*
✅ Bangun siang (legal!)
✅ Netflix marathon  
✅ Makan enak sepuasnya
✅ Quality time with family
✅ Prepare mental untuk Senin 😂

Enjoy your Saturday, TJA Legends! 🌟🎊`,

      `🌈 *SATURDAY FUNDAY!* 🌈

Weekend oficial dimulai! 🚀

*Saturday Energy:*
⚡ 100% charged
🎵 Playlist weekend ON
🍕 Cheat day activated  
😎 Zero work stress

*Weekend Goals:*
- Have fun ✅
- Rest well ✅  
- Create memories ✅
- Forget Monday exists ✅

Live it up, TJA Family! 🎸🔥`,

      `🏖️ *SATURDAY PARADISE!* 🏖️

The day we've all been waiting for! 

*Saturday Status:*
🌅 No alarm clock
🛌 Unlimited sleep mode
🎮 Fun activities unlocked
🍔 Food without guilt

Remember: "Saturday adalah hadiah untuk yang survive weekdays!"

Make it count, TJA Superstars! ⭐💫`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Initialize Friday attendance system
  async initializeFridayAttendance() {
    try {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      // Only run on Friday
      if (today.getDay() !== 5) return;

      // Get all active members
      const { data: activeMembers, error: membersError } = await supabase
        .from("members")
        .select("kode_unit")
        .neq("status", "Tidak Aktif");

      if (membersError) {
        console.error(
          "Error fetching active members for Friday attendance:",
          membersError
        );
        return;
      }

      // Check existing Friday attendance
      const { data: existingAttendance, error: checkError } = await supabase
        .from("absensi")
        .select("kode_unit")
        .eq("tanggal", todayStr)
        .eq("jenis_absensi", "jumatan");

      if (checkError) {
        console.error("Error checking existing Friday attendance:", checkError);
        return;
      }

      // Get members without Friday attendance
      const existingUnits = new Set(
        existingAttendance?.map((a) => a.kode_unit) || []
      );
      const membersToInitialize = activeMembers.filter(
        (m) => !existingUnits.has(m.kode_unit)
      );

      if (membersToInitialize.length > 0) {
        // Initialize as alfa (will be updated when they attend)
        const alfaRecords = membersToInitialize.map((member) => ({
          kode_unit: member.kode_unit,
          tanggal: todayStr,
          status: "alfa",
          jenis_absensi: "jumatan",
          keterangan: "Belum absensi sholat Jumat",
          sanksi: null,
        }));

        const { error: insertError } = await supabase
          .from("absensi")
          .insert(alfaRecords);

        if (!insertError) {
          console.log(
            `✅ Friday attendance initialized: ${alfaRecords.length} members`
          );
        } else {
          console.error("Error initializing Friday attendance:", insertError);
        }
      }
    } catch (error) {
      console.error("Error in initializeFridayAttendance:", error);
    }
  }

  // Apply funny sanctions for those who skip Friday prayer
  async applyFridaySanctions() {
    try {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      // Only run on Friday after Asr time (assume 15:00)
      const currentHour = today.getHours();
      if (today.getDay() !== 5 || currentHour < 15) return;

      // Get members who are alfa for Friday prayer
      const { data: alfaMembers, error: alfaError } = await supabase
        .from("absensi")
        .select("kode_unit, sanksi")
        .eq("tanggal", todayStr)
        .eq("jenis_absensi", "jumatan")
        .eq("status", "alfa")
        .is("sanksi", null);

      if (alfaError || !alfaMembers || alfaMembers.length === 0) {
        return;
      }

      // Apply sanctions
      for (const member of alfaMembers) {
        const sanksi = this.getRandomFridaySanction();

        const { error: updateError } = await supabase
          .from("absensi")
          .update({ sanksi: sanksi })
          .eq("kode_unit", member.kode_unit)
          .eq("tanggal", todayStr)
          .eq("jenis_absensi", "jumatan");

        if (!updateError) {
          console.log(`✅ Sanksi applied to ${member.kode_unit}: ${sanksi}`);
        }
      }

      return alfaMembers.length;
    } catch (error) {
      console.error("Error applying Friday sanctions:", error);
      return 0;
    }
  }

  // Get random funny sanction for missing Friday prayer
  getRandomFridaySanction() {
    const sanctions = [
      "Wajib jadi tukang cuci armada selama seminggu! 🧽🚌 (Sampai kinclong kayak hati yang bersih)",
      "Harus nyanyiin lagu religi di grup setiap hari selama 3 hari! 🎵🎤 (Biar inget sholat Jumat)",
      "Diwajibkan jadi alarm hidup untuk teman-teman sholat subuh! ⏰😴 (Bangunin yang lain jam 4 pagi)",
      "Harus bikin status Instagram story dakwah setiap hari selama seminggu! 📱📿 (Biar tambah ilmu agama)",
      "Diwajibkan jadi penyambut tamu di kantor dengan senyuman 24/7! 😁🤝 (Latihan sabar dan ikhlas)",
      "Harus masak untuk semua crew TJA! 👨‍🍳🍛 (Biar tau susahnya ngurus orang banyak)",
      "Jadi cleaning service kantor selama 3 hari! 🧹🏢 (Bersih-bersih hati sekalian tempat kerja)",
      "Wajib hafal 5 ayat Al-Quran dan setorin ke grup! 📖💚 (Biar makin cinta sama kitab suci)",
      "Harus jadi tukang parkir gratis di masjid terdekat! 🚗🕌 (Pahala dobel: ngebantu + tobat)",
      "Diwajibkan jadi badut penghibur anak-anak di panti asuhan! 🤡👶 (Biar hatinya lembut lagi)",
      "Harus push-up 50x sambil baca istighfar! 💪📿 (Sehat jasmani rohani)",
      "Jadi tukang sapu jalanan depan rumah selama seminggu! 🧹🛣️ (Biar inget kebersihan itu sebagian dari iman)",
      "Wajib sedekah 50ribu ke kotak amal masjid! 💰🕌 (Biar rezeki makin lancar)",
      "Harus jadi ojek gratis untuk orang tua ke masjid! 🛵👴 (Berbakti sama yang lebih tua)",
      "Diwajibkan jaga warung makan padang tanpa digaji! 🍛😅 (Biar tau nikmatnya kerja halal)",
      "Harus jadi guru ngaji anak-anak kampung! 👨‍🏫📖 (Ngajari sambil belajar)",
      "Jadi tukang cuci piring di rumah makan warteg! 🍽️💦 (Rendah hati itu kunci surga)",
      "Wajib tidur di teras masjid semalam! 🕌😴 (Biar makin deket sama Allah)",
      "Harus jogging keliling kompleks sambil teriak 'Sholat Jumat penting!' 🏃‍♂️📢 (Olahraga sambil dakwah)",
      "Jadi tukang becak gratis untuk ibu-ibu belanja! 🚲👵 (Latihan keikhlasan dan kekuatan)",
      "Diwajibkan puasa senin kamis selama sebulan! 🌙⭐ (Biar makin taqwa dan sehat)",
      "Harus jadi satpam masjid volunteer selama seminggu! 👮‍♂️🕌 (Jaga rumah Allah = pahala berlipat)",
      "Wajib baca Yasin 3x setiap habis maghrib! 📿🌅 (Biar hati tenang dan berkah)",
      "Harus jadi tukang pel lantai masjid setiap Ba'da subuh! 🧽🕌 (Bangun pagi + pahala + bersih-bersih)",
      "Jadi volunteer bagi-bagi takjil gratis! 🥤🍞 (Berbagi kebahagiaan bulan puasa... eh salah, berbagi kebaikan)",
    ];

    return sanctions[Math.floor(Math.random() * sanctions.length)];
  }

  // Get Friday attendance summary with sanctions
  async getFridayAttendanceSummary() {
    try {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const dateFormatted = today.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // Get Friday attendance data
      const { data: fridayData, error: fridayError } = await supabase
        .from("members")
        .select(
          `
          kode_unit,
          crew,
          absensi!left(
            status,
            keterangan,
            sanksi
          )
        `
        )
        .eq("absensi.tanggal", todayStr)
        .eq("absensi.jenis_absensi", "jumatan")
        .neq("status", "Tidak Aktif");

      if (fridayError) {
        console.error("Error fetching Friday attendance:", fridayError);
        return "❌ Gagal mengambil data absensi Jumatan! Database lagi sholat juga 😅🕌";
      }

      let summary = `🕌 *REKAP ABSENSI SHOLAT JUMAT TGL ${dateFormatted.toUpperCase()}* 🕌\n\n`;

      const stats = { hadir: 0, izin: 0, alfa: 0 };
      let sanksiList = [];

      fridayData.forEach((member) => {
        const crewName = member.crew || member.kode_unit;
        let status = "alfa"; // Default
        let keterangan = "";
        let sanksi = "";

        if (member.absensi && member.absensi.length > 0) {
          status = member.absensi[0].status;
          keterangan = member.absensi[0].keterangan || "";
          sanksi = member.absensi[0].sanksi || "";
        }

        stats[status]++;

        const statusEmoji = {
          hadir: "✅",
          izin: "🏥",
          alfa: "❌",
        };

        summary += `${statusEmoji[status]} ${crewName} = ${status}`;
        if (status === "izin" && keterangan) {
          summary += ` (${keterangan})`;
        }
        if (status === "alfa" && sanksi) {
          sanksiList.push(`🎭 ${crewName}: ${sanksi}`);
        }
        summary += "\n";
      });

      summary += `\n*📊 STATISTIK SHOLAT JUMAT:*\n`;
      summary += `✅ Hadir: ${stats.hadir} orang (Masuk surga! 🎉)\n`;
      summary += `🏥 Izin: ${stats.izin} orang (Masih dimaafkan 😊)\n`;
      summary += `❌ Alfa: ${stats.alfa} orang (Kena sanksi! 😈)\n\n`;

      if (sanksiList.length > 0) {
        summary += `*🎭 DAFTAR SANKSI LUCU:*\n`;
        sanksiList.forEach((sanksi) => (summary += `${sanksi}\n`));
        summary += `\n*Note: Sanksi ini untuk kebaikan dunia akhirat! 😇*\n\n`;
      }

      const totalActive = stats.hadir + stats.izin + stats.alfa;
      const percentage =
        totalActive > 0 ? Math.round((stats.hadir / totalActive) * 100) : 0;
      summary += `📈 Tingkat Kehadiran Sholat Jumat: ${percentage}%\n`;

      if (percentage >= 90) {
        summary += `🏆 MasyaAllah! Jamaah TJA luar biasa! Berkah melimpah! 💫\n`;
      } else if (percentage >= 70) {
        summary += `👍 Alhamdulillah, masih bagus! Tingkatkan lagi ya! 📈\n`;
      } else {
        summary += `⚠️ Hm... perlu ditingkatkan nih jamaah TJA! Yuk semangat! 💪\n`;
      }

      summary += `\n_"Dan apabila telah ditunaikan sholat, maka bertebaranlah di muka bumi; dan carilah karunia Allah"_ 📖\n`;
      summary += `\n_Generated by TJA Islamic Bot - ${new Date().toLocaleString(
        "id-ID"
      )}_`;

      return summary;
    } catch (error) {
      console.error("Error getting Friday attendance summary:", error);
      return "❌ Error generate rekap Jumatan! Mungkin sistemnya lagi sholat juga 🕌😅";
    }
  }
}

module.exports = DailyGreetingHandlers;
