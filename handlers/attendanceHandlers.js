const supabase = require("../config/database");
const BotHelpers = require("../utils/helpers");

class AttendanceHandlers {
  constructor(client) {
    this.client = client;
  }

  // Handler untuk command /hadir
  async handleHadirCommand(message, kodeUnit) {
    try {
      // Validate kode unit format
      if (!kodeUnit || !kodeUnit.toUpperCase().startsWith("TJA-")) {
        const formatErrors = [
          "❌ Format salah! Gunakan: /hadir TJA-XXX",
          "❌ Kode unitnya mana bos? Format: /hadir TJA-XXX",
          "❌ Format error! Contoh: /hadir TJA-001",
          "❌ Kok formatnya aneh? /hadir TJA-XXX dong!",
        ];
        const randomError =
          formatErrors[Math.floor(Math.random() * formatErrors.length)];
        await message.reply(randomError);
        return;
      }

      const kodeUnitUpper = kodeUnit.toUpperCase();

      // Check if member exists
      const { data: memberData, error: memberError } = await supabase
        .from("members")
        .select("*")
        .eq("kode_unit", kodeUnitUpper)
        .single();

      if (memberError || !memberData) {
        const notFoundResponses = [
          `❌ Kode unit ${kodeUnitUpper} tidak ditemukan! Mungkin armadanya lagi nyasar 🌀`,
          `❌ ${kodeUnitUpper}? Nggak ada bos! Coba cek lagi database 📋`,
          `❌ Armada ${kodeUnitUpper} hilang dari database! 404 Not Found 🔍`,
          `❌ ${kodeUnitUpper} tidak terdaftar! Atau mungkin ini armada siluman? 👻`,
        ];
        const randomResponse =
          notFoundResponses[
            Math.floor(Math.random() * notFoundResponses.length)
          ];
        await message.reply(randomResponse);
        return;
      }

      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      const crewName = memberData.crew || kodeUnitUpper;
      const dayOfWeek = new Date().getDay(); // 0 = Sunday, 5 = Friday

      // Determine attendance type based on day
      const jenisAbsensi = dayOfWeek === 5 ? "jumatan" : "harian";
      const attendanceLabel = dayOfWeek === 5 ? "Sholat Jumat" : "kerja";

      // Upsert attendance (insert or update if exists)
      const { error: upsertError } = await supabase.from("absensi").upsert(
        {
          kode_unit: kodeUnitUpper,
          tanggal: today,
          status: "hadir",
          jenis_absensi: jenisAbsensi,
          keterangan: null,
          sanksi: null, // Clear any previous sanctions
        },
        {
          onConflict: "kode_unit,tanggal,jenis_absensi",
          ignoreDuplicates: false,
        }
      );

      if (upsertError) {
        console.error("Error updating attendance:", upsertError);
        const dbErrors = [
          "❌ Gagal menyimpan absensi! Database lagi ngambek 😤",
          "❌ Error saat absensi! Server lagi bad mood 🙄",
          "❌ Database error! Mungkin kucing server lagi main kabel 🐱",
          "❌ Sistem absensi error! Coba lagi nanti ya 🔄",
        ];
        const randomDbError =
          dbErrors[Math.floor(Math.random() * dbErrors.length)];
        await message.reply(randomDbError);
        return;
      }

      // Different success messages for Friday vs regular days
      let successResponses;
      if (dayOfWeek === 5) {
        successResponses = [
          `✅🕌 Alhamdulillah! ${crewName} hadir Sholat Jumat! Barakallahu fiik! 🤲💚`,
          `✅📿 MasyaAllah ${crewName} sudah menunaikan Sholat Jumat! Semoga berkah! 🌟`,
          `✅🕌 ${crewName} hadir jumatan! Pahala berlipat untuk hari ini! ✨`,
          `✅💫 Barakallahu ${crewName}! Sholat Jumat tercatat! Selamat beribadah! 🤲`,
          `✅🌟 Alhamdulillah ${crewName} hadir di Sholat Jumat! Semoga diterima Allah! 📿`,
        ];
      } else {
        successResponses = [
          `✅ Absensi ${crewName} berhasil, kehadiran telah diperbaharui! Great job! 👏`,
          `✅ ${crewName} sudah absen hadir hari ini! Rajin banget! 🌟`,
          `✅ Kehadiran ${crewName} tercatat! Selamat bekerja dengan semangat! 💪`,
          `✅ Absensi berhasil! ${crewName} hadir dan siap beraksi! 🚀`,
          `✅ ${crewName} present and accounted for! Absensi sukses! ✨`,
          `✅ Perfect! ${crewName} sudah terdaftar hadir hari ini! 🎯`,
        ];
      }

      const randomSuccess =
        successResponses[Math.floor(Math.random() * successResponses.length)];
      await message.reply(randomSuccess);
    } catch (error) {
      console.error("Error handling hadir command:", error);
      const errorResponses = [
        "❌ Terjadi kesalahan saat absensi! Server lagi drama queen 👑",
        "❌ Error absensi! Mungkin sistemnya lagi PMS 😅",
        "❌ Absensi gagal! Coba lagi atau besok aja 🤷‍♂️",
      ];
      const randomError =
        errorResponses[Math.floor(Math.random() * errorResponses.length)];
      await message.reply(randomError);
    }
  }

  // Handler untuk command /absen
  async handleAbsenCommand(message, text) {
    try {
      const parts = text.split(" ").slice(1); // Remove '/absen'

      if (parts.length < 2) {
        const formatErrors = [
          "❌ Format salah! Gunakan: /absen TJA-XXX keterangan",
          "❌ Keterangannya mana? Format: /absen TJA-XXX alasan",
          "❌ Format error! Contoh: /absen TJA-001 sakit demam",
          "❌ Kurang lengkap! /absen TJA-XXX [alasan izin]",
        ];
        const randomError =
          formatErrors[Math.floor(Math.random() * formatErrors.length)];
        await message.reply(randomError);
        return;
      }

      const kodeUnit = parts[0].toUpperCase();
      const keterangan = parts.slice(1).join(" ");

      // Validate kode unit format
      if (!kodeUnit.startsWith("TJA-")) {
        await message.reply(
          "❌ Format kode unit salah! Harus dimulai dengan TJA-"
        );
        return;
      }

      // Check if member exists
      const { data: memberData, error: memberError } = await supabase
        .from("members")
        .select("*")
        .eq("kode_unit", kodeUnit)
        .single();

      if (memberError || !memberData) {
        const notFoundResponses = [
          `❌ Kode unit ${kodeUnit} tidak ditemukan! Mungkin salah ketik 🤔`,
          `❌ ${kodeUnit}? Nggak ada di database! Coba cek lagi 📋`,
          `❌ Member ${kodeUnit} tidak terdaftar! 404 Not Found 🔍`,
        ];
        const randomResponse =
          notFoundResponses[
            Math.floor(Math.random() * notFoundResponses.length)
          ];
        await message.reply(randomResponse);
        return;
      }

      const today = new Date().toISOString().split("T")[0];
      const crewName = memberData.crew || kodeUnit;
      const dayOfWeek = new Date().getDay(); // 0 = Sunday, 5 = Friday

      // Determine attendance type based on day
      const jenisAbsensi = dayOfWeek === 5 ? "jumatan" : "harian";

      // Upsert attendance with izin status
      const { error: upsertError } = await supabase.from("absensi").upsert(
        {
          kode_unit: kodeUnit,
          tanggal: today,
          status: "izin",
          jenis_absensi: jenisAbsensi,
          keterangan: keterangan,
          sanksi: null, // Clear any previous sanctions
        },
        {
          onConflict: "kode_unit,tanggal,jenis_absensi",
          ignoreDuplicates: false,
        }
      );

      if (upsertError) {
        console.error("Error updating attendance:", upsertError);
        const dbErrors = [
          "❌ Gagal menyimpan izin! Database lagi maintenance 🔧",
          "❌ Error saat izin! Server lagi sibuk 📡",
          "❌ Database error! Coba lagi nanti ya 🔄",
        ];
        const randomDbError =
          dbErrors[Math.floor(Math.random() * dbErrors.length)];
        await message.reply(randomDbError);
        return;
      }

      // Different responses for Friday vs regular days
      let izinResponses;
      if (dayOfWeek === 5) {
        izinResponses = [
          `✅🏥 Izin Sholat Jumat ${crewName} tercatat! Alasan: ${keterangan}. Semoga Allah memberikan kemudahan! 🤲`,
          `✅💚 ${crewName} izin Jumatan berhasil dicatat! May Allah bless your recovery! 🌟`,
          `✅📿 Izin Sholat Jumat approved! ${crewName} take care and get well soon! 💫`,
          `✅🕌 ${crewName} izin Jumatan tersimpan! Semoga lekas sembuh dan bisa jumatan lagi! 🤲💚`,
        ];
      } else {
        izinResponses = [
          `✅ Izin berhasil, ${crewName} hari ini tidak bisa bekerja. Get well soon! 🏥`,
          `✅ ${crewName} izin tercatat! Alasan: ${keterangan}. Semoga cepet sembuh! 💊`,
          `✅ Izin approved! ${crewName} istirahat dulu ya. Take care! 🛌`,
          `✅ ${crewName} izin berhasil dicatat! Rest well and recover soon! 🌟`,
          `✅ Permission granted! ${crewName} take your time to recover! 💚`,
          `✅ Izin ${crewName} tersimpan! Jaga kesehatan ya! 🏠`,
        ];
      }

      const randomIzin =
        izinResponses[Math.floor(Math.random() * izinResponses.length)];
      await message.reply(randomIzin);
    } catch (error) {
      console.error("Error handling absen command:", error);
      const errorResponses = [
        "❌ Terjadi kesalahan saat izin! Server lagi drama 🎭",
        "❌ Error izin! Sistemnya lagi bermasalah 🤖",
        "❌ Gagal input izin! Coba refresh hidup anda 🔄",
      ];
      const randomError =
        errorResponses[Math.floor(Math.random() * errorResponses.length)];
      await message.reply(randomError);
    }
  }

  // Handler untuk command /rekap
  async handleRekapCommand(message) {
    try {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const dayOfWeek = today.getDay();
      const jenisAbsensi = dayOfWeek === 5 ? "jumatan" : "harian";
      const attendanceType = dayOfWeek === 5 ? "SHOLAT JUMAT" : "KERJA HARIAN";

      const dateFormatted = today.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // Get all members with their attendance today
      const { data: attendanceData, error: attendanceError } = await supabase
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
        .eq("absensi.jenis_absensi", jenisAbsensi)
        .neq("status", "Tidak Aktif");

      if (attendanceError) {
        console.error("Error fetching attendance data:", attendanceError);
        await message.reply(
          "❌ Gagal mengambil data absensi! Database lagi ngambek 😤"
        );
        return;
      }

      const emoji = dayOfWeek === 5 ? "🕌" : "📊";
      let rekapText = `${emoji} *REKAP ABSENSI ${attendanceType} TGL ${dateFormatted.toUpperCase()}* ${emoji}\n\n`;

      const stats = { hadir: 0, izin: 0, alfa: 0 };
      let sanksiList = [];

      attendanceData.forEach((member) => {
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

        rekapText += `${statusEmoji[status]} ${crewName} = ${status}`;
        if (status === "izin" && keterangan) {
          rekapText += ` (${keterangan})`;
        }
        if (status === "alfa" && sanksi && dayOfWeek === 5) {
          sanksiList.push(`🎭 ${crewName}: ${sanksi}`);
        }
        rekapText += "\n";
      });

      rekapText += `\n*📈 STATISTIK HARI INI:*\n`;
      if (dayOfWeek === 5) {
        rekapText += `✅ Hadir Sholat Jumat: ${stats.hadir} orang\n`;
        rekapText += `🏥 Izin: ${stats.izin} orang\n`;
        rekapText += `❌ Alfa (Bolos Jumatan): ${stats.alfa} orang\n\n`;

        if (sanksiList.length > 0) {
          rekapText += `*🎭 DAFTAR SANKSI LUCU:*\n`;
          sanksiList.forEach((sanksi) => (rekapText += `${sanksi}\n`));
          rekapText += `\n`;
        }
      } else {
        rekapText += `✅ Hadir: ${stats.hadir} orang\n`;
        rekapText += `🏥 Izin: ${stats.izin} orang\n`;
        rekapText += `❌ Alfa: ${stats.alfa} orang\n\n`;
      }

      const totalActive = stats.hadir + stats.izin + stats.alfa;
      const percentage =
        totalActive > 0 ? Math.round((stats.hadir / totalActive) * 100) : 0;
      rekapText += `📊 Tingkat Kehadiran: ${percentage}%\n\n`;

      if (dayOfWeek === 5) {
        rekapText += `_"Dan apabila telah ditunaikan sholat, maka bertebaranlah di muka bumi"_\n\n`;
      }

      rekapText += `_Generated by TJA Bot - ${new Date().toLocaleString(
        "id-ID"
      )}_`;

      await message.reply(rekapText);
    } catch (error) {
      console.error("Error handling rekap command:", error);
      const errorResponses = [
        "❌ Error generate rekap! Mungkin sistemnya lagi belajar matematika 🧮",
        "❌ Gagal buat rekap! Server lagi sibuk menghitung 🔢",
        "❌ Rekap error! Database lagi pusing 😵‍💫",
      ];
      const randomError =
        errorResponses[Math.floor(Math.random() * errorResponses.length)];
      await message.reply(randomError);
    }
  }

  // Handler untuk command /jumlah (updated to handle both daily and Friday attendance)
  async handleJumlahCommand(message, text) {
    try {
      const parts = text.split(" ").slice(1); // Remove '/jumlah'

      if (parts.length === 0) {
        const formatErrors = [
          "❌ Format salah! Gunakan: /jumlah TJA-XXX atau /jumlah all atau /jumlah jumatan",
        ];
        const randomError =
          formatErrors[Math.floor(Math.random() * formatErrors.length)];
        await message.reply(randomError);
        return;
      }

      const param = parts[0].toLowerCase();
      const currentMonth = new Date().getMonth() + 1; // 1-12
      const currentYear = new Date().getFullYear();
      const monthName = new Date(
        currentYear,
        currentMonth - 1
      ).toLocaleDateString("id-ID", { month: "long" });

      if (param === "jumatan") {
        // Generate Friday prayer attendance report
        await this.generateJumatanReport(
          message,
          currentYear,
          currentMonth,
          monthName
        );
      } else if (param === "all") {
        // Generate report for all members (daily attendance)
        await this.generateAllMembersReport(
          message,
          currentYear,
          currentMonth,
          monthName
        );
      } else {
        // Generate report for specific member (daily attendance)
        const kodeUnit = parts[0].toUpperCase();
        await this.generateSingleMemberReport(
          message,
          kodeUnit,
          currentYear,
          currentMonth,
          monthName
        );
      }
    } catch (error) {
      console.error("Error handling jumlah command:", error);
      const errorResponses = [
        "❌ Error generate laporan! Mungkin sistemnya lagi belajar akuntansi 📊",
        "❌ Gagal buat laporan! Server lagi sibuk menghitung 🧮",
        "❌ Laporan error! Database lagi pusing matematika 😵‍💫",
      ];
      const randomError =
        errorResponses[Math.floor(Math.random() * errorResponses.length)];
      await message.reply(randomError);
    }
  }

  // Generate Friday prayer attendance report
  async generateJumatanReport(message, year, month, monthName) {
    try {
      // Get all Friday attendance data for the month
      const { data: jumatanData, error: jumatanError } = await supabase
        .from("members")
        .select(
          `
          kode_unit,
          crew,
          absensi!left(
            status,
            tanggal,
            keterangan,
            sanksi
          )
        `
        )
        .neq("status", "Tidak Aktif")
        .eq("absensi.jenis_absensi", "jumatan")
        .gte(
          "absensi.tanggal",
          `${year}-${month.toString().padStart(2, "0")}-01`
        )
        .lt(
          "absensi.tanggal",
          `${year}-${(month + 1).toString().padStart(2, "0")}-01`
        )
        .order("absensi.tanggal", { foreignTable: "absensi", ascending: true });

      if (jumatanError) {
        console.error("Error fetching Jumatan data:", jumatanError);
        await message.reply(
          "❌ Gagal mengambil data absensi Jumatan! Database lagi sholat 🕌😅"
        );
        return;
      }

      let reportText = `🕌 *REKAP ABSENSI SHOLAT JUMAT BULAN ${monthName.toUpperCase()} ${year}* 🕌\n\n`;

      // Get all Fridays in the month
      const fridaysInMonth = this.getFridaysInMonth(year, month);
      const totalFridays = fridaysInMonth.length;

      const memberStats = new Map();
      let totalSanctions = 0;

      // Process each member's Friday attendance
      jumatanData.forEach((member) => {
        const crewName = member.crew || member.kode_unit;
        const stats = { hadir: 0, izin: 0, alfa: 0, sanctions: [] };

        if (member.absensi) {
          member.absensi.forEach((record) => {
            stats[record.status]++;
            if (record.status === "alfa" && record.sanksi) {
              stats.sanctions.push(record.sanksi);
              totalSanctions++;
            }
          });
        }

        // Add missing Fridays as alfa
        const recordedFridays = member.absensi ? member.absensi.length : 0;
        stats.alfa += totalFridays - recordedFridays;

        const attendanceRate =
          totalFridays > 0 ? Math.round((stats.hadir / totalFridays) * 100) : 0;
        memberStats.set(crewName, { ...stats, rate: attendanceRate });
      });

      // Sort by attendance rate (descending)
      const sortedMembers = Array.from(memberStats.entries()).sort(
        (a, b) => b[1].rate - a[1].rate
      );

      sortedMembers.forEach(([name, stats], index) => {
        const medal =
          index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🕌";
        reportText += `${medal} *${name}*\n`;
        reportText += `   ✅ ${stats.hadir}x | 🏥 ${stats.izin}x | ❌ ${stats.alfa}x (${stats.rate}%)\n`;

        if (stats.sanctions.length > 0) {
          reportText += `   🎭 Sanksi: ${stats.sanctions.length}x\n`;
        }
        reportText += `\n`;
      });

      // Overall statistics
      const totalMembers = sortedMembers.length;
      const avgAttendanceRate =
        totalMembers > 0
          ? Math.round(
              sortedMembers.reduce((sum, [, stats]) => sum + stats.rate, 0) /
                totalMembers
            )
          : 0;

      reportText += `*📊 STATISTIK SHOLAT JUMAT:*\n`;
      reportText += `👥 Total Member: ${totalMembers} orang\n`;
      reportText += `🕌 Total Jumat di bulan ini: ${totalFridays} hari\n`;
      reportText += `📈 Rata-rata Kehadiran: ${avgAttendanceRate}%\n`;
      reportText += `🎭 Total Sanksi Diberikan: ${totalSanctions} sanksi\n\n`;

      if (avgAttendanceRate >= 90) {
        reportText += `🏆 MasyaAllah! Jamaah TJA luar biasa! Berkah melimpah! 💫\n`;
      } else if (avgAttendanceRate >= 70) {
        reportText += `👍 Alhamdulillah, masih bagus! Mari tingkatkan lagi! 📈\n`;
      } else {
        reportText += `⚠️ Perlu peningkatan kehadiran Sholat Jumat! Yuk semangat! 💪\n`;
      }

      reportText += `\n_"Barangsiapa yang meninggalkan sholat Jumat tanpa uzur, maka Allah akan mencap hatinya" - HR. Ibn Majah_\n\n`;
      reportText += `_Generated by TJA Islamic Bot - ${new Date().toLocaleString(
        "id-ID"
      )}_`;

      await message.reply(reportText);
    } catch (error) {
      console.error("Error generating Jumatan report:", error);
      await message.reply(
        "❌ Error generate laporan Jumatan! Server lagi tadarus 📖😅"
      );
    }
  }

  // Helper function to get all Fridays in a month
  getFridaysInMonth(year, month) {
    const fridays = [];
    const date = new Date(year, month - 1, 1); // Start of month

    // Find first Friday
    while (date.getDay() !== 5) {
      date.setDate(date.getDate() + 1);
    }

    // Collect all Fridays in the month
    while (date.getMonth() === month - 1) {
      fridays.push(date.toISOString().split("T")[0]);
      date.setDate(date.getDate() + 7); // Next Friday
    }

    return fridays;
  }

  async generateSingleMemberReport(message, kodeUnit, year, month, monthName) {
    // Check if member exists
    const { data: memberData, error: memberError } = await supabase
      .from("members")
      .select("*")
      .eq("kode_unit", kodeUnit)
      .single();

    if (memberError || !memberData) {
      const notFoundResponses = [
        `❌ Member ${kodeUnit} tidak ditemukan! Mungkin salah ketik 🤔`,
        `❌ ${kodeUnit}? Nggak ada di database! Double check dong 📋`,
        `❌ Kode unit ${kodeUnit} tidak terdaftar! 404 Member Not Found 🔍`,
      ];
      const randomResponse =
        notFoundResponses[Math.floor(Math.random() * notFoundResponses.length)];
      await message.reply(randomResponse);
      return;
    }

    // Get attendance data for the month (daily attendance only)
    const { data: attendanceData, error: attendanceError } = await supabase
      .from("absensi")
      .select("status, keterangan, tanggal")
      .eq("kode_unit", kodeUnit)
      .eq("jenis_absensi", "harian")
      .gte("tanggal", `${year}-${month.toString().padStart(2, "0")}-01`)
      .lt("tanggal", `${year}-${(month + 1).toString().padStart(2, "0")}-01`)
      .order("tanggal", { ascending: true });

    if (attendanceError) {
      console.error("Error fetching monthly attendance:", attendanceError);
      await message.reply(
        "❌ Gagal mengambil data absensi bulanan! Database error 📊"
      );
      return;
    }

    const crewName = memberData.crew || kodeUnit;
    const stats = { hadir: 0, izin: 0, alfa: 0 };

    // Count attendance by status
    const attendanceMap = new Map();
    if (attendanceData) {
      attendanceData.forEach((record) => {
        attendanceMap.set(record.tanggal, record.status);
        stats[record.status]++;
      });
    }

    // Calculate total days in month and alfa days
    const daysInMonth = new Date(year, month, 0).getDate();
    const recordedDays = stats.hadir + stats.izin + stats.alfa;
    stats.alfa += daysInMonth - recordedDays; // Add missing days as alfa

    let reportText = `*📊 REKAP ABSENSI HARIAN ${crewName.toUpperCase()} PADA BULAN ${monthName.toUpperCase()} ${year}*\n\n`;
    reportText += `✅ Hadir = ${stats.hadir}x\n`;
    reportText += `🏥 Izin = ${stats.izin}x\n`;
    reportText += `❌ Alfa = ${stats.alfa}x\n\n`;

    const attendanceRate =
      daysInMonth > 0 ? Math.round((stats.hadir / daysInMonth) * 100) : 0;
    reportText += `📈 Tingkat Kehadiran: ${attendanceRate}%\n`;
    reportText += `📅 Total Hari Kerja: ${daysInMonth} hari\n\n`;

    if (attendanceRate >= 80) {
      reportText += `🏆 Great job ${crewName}! Kehadiran excellent!\n`;
    } else if (attendanceRate >= 60) {
      reportText += `👍 Good job ${crewName}! Keep it up!\n`;
    } else {
      reportText += `⚠️ ${crewName} perlu improve kehadiran nih!\n`;
    }

    reportText += `\n_Generated by TJA Bot - ${new Date().toLocaleString(
      "id-ID"
    )}_`;

    await message.reply(reportText);
  }

  async generateAllMembersReport(message, year, month, monthName) {
    // Get all active members with their attendance data (daily attendance only)
    const { data: membersData, error: membersError } = await supabase
      .from("members")
      .select(
        `
        kode_unit,
        crew,
        absensi!left(
          status,
          tanggal
        )
      `
      )
      .neq("status", "Tidak Aktif")
      .eq("absensi.jenis_absensi", "harian")
      .gte("absensi.tanggal", `${year}-${month.toString().padStart(2, "0")}-01`)
      .lt(
        "absensi.tanggal",
        `${year}-${(month + 1).toString().padStart(2, "0")}-01`
      );

    if (membersError) {
      console.error("Error fetching all members attendance:", membersError);
      await message.reply(
        "❌ Gagal mengambil data absensi semua member! Database error 📊"
      );
      return;
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    let reportText = `*📊 REKAP ABSENSI HARIAN SEMUA MEMBER BULAN ${monthName.toUpperCase()} ${year}*\n\n`;

    const memberStats = new Map();

    // Process each member's attendance
    membersData.forEach((member) => {
      const crewName = member.crew || member.kode_unit;
      const stats = { hadir: 0, izin: 0, alfa: 0 };

      if (member.absensi) {
        member.absensi.forEach((record) => {
          stats[record.status]++;
        });
      }

      // Add missing days as alfa
      const recordedDays = stats.hadir + stats.izin + stats.alfa;
      stats.alfa += daysInMonth - recordedDays;

      const attendanceRate = Math.round((stats.hadir / daysInMonth) * 100);
      memberStats.set(crewName, { ...stats, rate: attendanceRate });
    });

    // Sort by attendance rate (descending)
    const sortedMembers = Array.from(memberStats.entries()).sort(
      (a, b) => b[1].rate - a[1].rate
    );

    sortedMembers.forEach(([name, stats], index) => {
      const medal =
        index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "👤";
      reportText += `${medal} *${name}*\n`;
      reportText += `   ✅ ${stats.hadir}x | 🏥 ${stats.izin}x | ❌ ${stats.alfa}x (${stats.rate}%)\n\n`;
    });

    // Overall statistics
    const totalMembers = sortedMembers.length;
    const avgAttendanceRate = Math.round(
      sortedMembers.reduce((sum, [, stats]) => sum + stats.rate, 0) /
        totalMembers
    );

    reportText += `*📈 STATISTIK KESELURUHAN:*\n`;
    reportText += `👥 Total Member: ${totalMembers} orang\n`;
    reportText += `📊 Rata-rata Kehadiran: ${avgAttendanceRate}%\n`;
    reportText += `📅 Periode: ${daysInMonth} hari kerja\n\n`;
    reportText += `_Generated by TJA Bot - ${new Date().toLocaleString(
      "id-ID"
    )}_`;

    await message.reply(reportText);
  }

  // Function to reset daily attendance at start of new day
  async resetDailyAttendance() {
    try {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const dayOfWeek = today.getDay(); // 0 = Sunday, 5 = Friday

      // Get all active members
      const { data: activeMembers, error: membersError } = await supabase
        .from("members")
        .select("kode_unit")
        .neq("status", "Tidak Aktif");

      if (membersError) {
        console.error("Error fetching active members for reset:", membersError);
        return;
      }

      // Determine what type of attendance to initialize
      const attendanceTypes =
        dayOfWeek === 5 ? ["harian", "jumatan"] : ["harian"];

      for (const jenisAbsensi of attendanceTypes) {
        // Check if attendance records already exist for today
        const { data: existingAttendance, error: checkError } = await supabase
          .from("absensi")
          .select("kode_unit")
          .eq("tanggal", todayStr)
          .eq("jenis_absensi", jenisAbsensi);

        if (checkError) {
          console.error(
            `Error checking existing ${jenisAbsensi} attendance:`,
            checkError
          );
          continue;
        }

        // Get members that don't have attendance record for today
        const existingUnits = new Set(
          existingAttendance?.map((a) => a.kode_unit) || []
        );
        const membersToReset = activeMembers.filter(
          (m) => !existingUnits.has(m.kode_unit)
        );

        if (membersToReset.length > 0) {
          // Insert alfa records for members without attendance today
          const alfaRecords = membersToReset.map((member) => ({
            kode_unit: member.kode_unit,
            tanggal: todayStr,
            status: "alfa",
            jenis_absensi: jenisAbsensi,
            keterangan:
              jenisAbsensi === "jumatan" ? "Belum absensi sholat Jumat" : null,
            sanksi: null,
          }));

          const { error: insertError } = await supabase
            .from("absensi")
            .insert(alfaRecords);

          if (!insertError) {
            console.log(
              `✅ ${jenisAbsensi} attendance reset: ${alfaRecords.length} members set to alfa`
            );
          } else {
            console.error(
              `Error inserting ${jenisAbsensi} alfa records:`,
              insertError
            );
          }
        }
      }
    } catch (error) {
      console.error("Error in resetDailyAttendance:", error);
    }
  }
}

module.exports = AttendanceHandlers;
