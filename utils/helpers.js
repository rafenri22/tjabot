// Helper functions untuk bot
class BotHelpers {
  // Fungsi untuk mengecek apakah pesan dari grup
  static isFromGroup(message) {
    return message.from.includes("@g.us");
  }

  // Fungsi untuk mengecek apakah command valid (UPDATED - added /hari, /stiker, /ask)
  static isValidCommand(text) {
    const commands = [
      "/TJA-",
      "/jomox",
      "/JOMOX",
      "/siapa",
      "/verifikasi",
      "/VERIFIKASI",
      "/info",
      "/kembaran",
      "/KEMBARAN",
      "/hadir",
      "/HADIR",
      "/absen",
      "/ABSEN",
      "/rekap",
      "/REKAP",
      "/jumlah",
      "/JUMLAH",
      "/hari", // Daily greeting command
      "/HARI", // Daily greeting command
      "/stiker", // NEW: Sticker maker command
      "/STIKER", // NEW: Sticker maker command
      "/ask", // NEW: Ask/question command
      "/ASK", // NEW: Ask/question command
    ];
    return commands.some((cmd) =>
      text.toLowerCase().startsWith(cmd.toLowerCase())
    );
  }

  // 100 nama cowok Indonesia yang keliatan tua
  static getRandomOldIndonesianName() {
    const names = [
      "Pak Budi",
      "Bang Anto",
      "Om Slamet",
      "Pak Agus",
      "Bang Rudi",
      "Om Bambang",
      "Pak Dedi",
      "Bang Harto",
      "Om Sutrisno",
      "Pak Wawan",
      "Bang Iwan",
      "Om Tarno",
      "Pak Joko",
      "Bang Endro",
      "Om Sukimin",
      "Pak Dadang",
      "Bang Eko",
      "Om Purwanto",
      "Pak Hendra",
      "Bang Yanto",
      "Om Kusno",
      "Pak Supri",
      "Bang Gunawan",
      "Om Teguh",
      "Pak Wahyu",
      "Bang Indra",
      "Om Sugeng",
      "Pak Rohmat",
      "Bang Danu",
      "Om Winarto",
      "Pak Gito",
      "Bang Purnomo",
      "Om Suryono",
      "Pak Tri",
      "Bang Handoko",
      "Om Marno",
      "Pak Sarno",
      "Bang Mukidi",
      "Om Karno",
      "Pak Sugiarto",
      "Bang Hermanto",
      "Om Widodo",
      "Pak Sumadi",
      "Bang Ridwan",
      "Om Suharto",
      "Pak Yusuf",
      "Bang Syahrul",
      "Om Mulyo",
      "Pak Rizki Lama",
      "Bang Wahidin",
      "Om Supeno",
      "Pak Darno",
      "Bang Subur",
      "Om Kartono",
      "Pak Sundoro",
      "Bang Surono",
      "Om Prijono",
      "Pak Sutejo",
      "Bang Dwi Tua",
      "Om Harjono",
      "Pak Slamet Tua",
      "Bang Markum",
      "Om Sumanto",
      "Pak Sugito",
      "Bang Harsono",
      "Om Paijo",
      "Pak Kusman",
      "Bang Suparman",
      "Om Sukirno",
      "Pak Sugimin",
      "Bang Suryadi",
      "Om Parto",
      "Pak Supriyanto",
      "Bang Sutikno",
      "Om Sukardi",
      "Pak Sunaryo",
      "Bang Roni Tua",
      "Om Martono",
      "Pak Subagyo",
      "Bang Wasono",
      "Om Parmin",
      "Pak Sukino",
      "Bang Setyo",
      "Om Pardjo",
      "Pak Sunarto",
      "Bang Mulyono",
      "Om Sastro",
      "Pak Sugiyanto",
      "Bang Suratman",
      "Om Parjono",
      "Pak Mulyadi Tua",
      "Bang Suyono",
      "Om Sukamto",
      "Pak Suryanto",
      "Bang Sugianto",
      "Om Pariman",
      "Pak Sungguh",
      "Bang Suhendra Tua",
      "Om Subardi",
      "Pak Suparto",
      "Bang Sukamdi",
      "Om Pardi",
      "Pak Sukatno",
      "Bang Suroyo",
      "Om Sutarjo",
      "Pak Suradi",
      "Bang Suparno",
      "Om Pariyo",
    ];
    return names[Math.floor(Math.random() * names.length)];
  }

  // 50+ improvisasi jomox responses yang meme dan sarkastik
  static getRandomJomoxResponse(name) {
    const responses = [
      `Wah ternyata ${name} adalah raja jomok se-Indonesia! 👑🤡`,
      `${Math.floor(
        Math.random() * 100
      )}% ${name} punya gen jomok turunan keluarga`,
      `${name} tingkat jomoknya ${
        Math.floor(Math.random() * 10) + 1
      }/10, udah kayak rating ojol aja`,
      `Waduh ${name} jomok banget sih, kompetitor berat pak RT`,
      `${name} jomoknya kebangetan dah, bikin adem ayem lingkungan`,
      `Hmm... ${name} sepertinya ${
        Math.floor(Math.random() * 80) + 20
      }% jomok, sisanya 20% kepo`,
      `Analysis complete: ${name} = jomok level maksimal! Certified by ISO 9001`,
      `${name}? Oh itu mah jomok sejati! Udah punya sertifikat resmi`,
      `${name} certified jomok ✅ dengan akreditasi A++`,
      `Jomok meter: ${name} = ${Math.floor(
        Math.random() * 100
      )}% loading... error! kebanyakan jomok`,
      `${name} ini tuh jomoknya udah level internasional, bisa jadi duta jomok Indonesia`,
      `Astaga ${name}, jomoknya udah kayak warisan nenek moyang ya`,
      `${name} kalau jadi presiden, Indonesia bakal jadi negara paling jomok sedunia`,
      `Gila ${name} jomoknya udah masuk kategori UNESCO World Heritage`,
      `${name} tuh bukti nyata kalau jomok itu bisa diwariskan secara genetik`,
      `Selamat! ${name} berhasil meraih gelar Sarjana Jomok (S.Jom) dengan IPK 4.0`,
      `${name} jomoknya udah level PhD, Permanent head Damage karena kebanyakan jomok`,
      `Kalau ada kejuaraan jomok sedunia, ${name} juara 1 tanpa lawan`,
      `${name} ini inspiring banget deh, dari kecil udah jomok sampai tua tetep jomok`,
      `Research shows: ${name} adalah 99.9% jomok, 0.1% sisanya adalah keajaiban alam`,
      `${name} jomoknya legendary, udah masuk ke buku rekor MURI`,
      `Guys, ${name} ini contoh nyata kalau jomok itu nggak mengenal usia`,
      `${name} certified jomok by Komisi Pemberantasan Jomok (KPJ)`,
      `Breaking news: ${name} dinobatkan sebagai Jomok of the Year 2025!`,
      `${name} jomoknya konsisten dari lahir sampai sekarang, salut deh!`,
      `Kalau ${name} bikin startup, pasti nama perusahaannya PT. Jomok Berkah Abadi`,
      `${name} ini brand ambassador-nya jomok Indonesia, udah punya kontrak eksklusif`,
      `Subhanallah ${name}, jomoknya udah bisa dijadiin renewable energy`,
      `${name} kalau jalan, GPS bingung karena jomoknya menganggu sinyal satelit`,
      `Confirmed: ${name} adalah reinkarnasi dari Dewi Jomok masa lampau`,
      `${name} jomoknya udah trademarked®, siapa yang mau plagiat harus bayar royalti`,
      `National Geographic mau bikin dokumenter tentang ${name}: "The Last Jomok Bender"`,
      `${name} ini proof of concept kalau jomok itu real dan bisa diukur secara ilmiah`,
      `Kalau ${name} masuk angkot, supirnya langsung naikin tarif karena jomoknya berlebihan`,
      `${name} jomoknya udah kayak aura, bisa dirasain dari jarak 5 kilometer`,
      `Plot twist: ${name} sebenernya alien jomok yang nyamar jadi manusia`,
      `${name} ini role model buat generasi jomok masa depan Indonesia`,
      `Fun fact: ${name} jomoknya bisa jadi pembangkit listrik alternatif`,
      `${name} kalau selfie, kameranya otomatis detect jomok level extreme`,
      `Kabar gembira: ${name} akan menerbitkan buku "How to Be Jomok in 30 Days"`,
      `${name} jomoknya udah masuk kategori Intangible Cultural Heritage Indonesia`,
      `Medical mystery: Dokter sampai sekarang belum bisa menjelaskan jomoknya ${name}`,
      `${name} ini bukti kalau Tuhan punya sense of humor yang tinggi`,
      `Breaking: ${name} akan jadi maskot Asian Games 2026 kategori Jomok Sports`,
      `${name} jomoknya sustainable dan eco-friendly, nggak bikin polusi udara`,
      `Researchers bingung, ${name} jomoknya defying all laws of physics`,
      `${name} ini inspiration buat film Hollywood: "Jomok: Impossible Mission"`,
      `BMKG issued warning: Jomok level ${name} mencapai kategori berbahaya`,
      `${name} jomoknya legendary, akan dikenang sampai 7 turunan`,
      `Final answer: ${name} = 1000% jomok with extra jomok sauce on top! 🎯🔥`,
      `Congratulations ${name}! You've unlocked the "Supreme Jomok Master" achievement! 🏆`,
      `${name} jomoknya certified halal by MUI (Majelis Ulama Indonesia) 📜✅`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // 50+ improvisasi kalimat untuk kembaran
  static getRandomKembaranResponse(name, kembaranName) {
    const responses = [
      `Ini loh kembarannya ${name}, yaitu ${kembaranName}! Mirip banget kan? 🤭`,
      `Plot twist! Ternyata ${name} punya kembaran yaitu ${kembaranName}, tapi yang satu jomok yang satu enggak 😂`,
      `Astaga! ${name} kembarannya ${kembaranName}! Tapi ${kembaranName} lebih ganteng dikit sih 🙈`,
      `Eh ternyata ${name} ada kembarannya! Namanya ${kembaranName}, tapi sayang udah nikah 💔`,
      `Surprise! ${name} punya twin bernama ${kembaranName}! Tapi ${kembaranName} lebih sukses hidupnya 📈`,
      `OMG! ${name} kembarannya ${kembaranName}! Mirip banget, cuma beda di dompet doang 💸`,
      `Breaking news: ${name} ketemu kembarannya yang bernama ${kembaranName}! Reunion after 30 years! 👥`,
      `Ini dia kembarannya ${name}, si ${kembaranName}! Tapi ${kembaranName} lebih pinter dikit ya 🧠`,
      `Wah ${name} ternyata punya kembaran! Namanya ${kembaranName}, tapi dia lebih beruntung dalam cinta 💕`,
      `Shocking revelation! ${name} kembarannya ${kembaranName}! Tapi ${kembaranName} udah punya rumah sendiri 🏠`,
      `DNA test confirmed: ${name} dan ${kembaranName} adalah kembar terpisah! Tapi beda nasib 🧬`,
      `${name} meet your doppelganger: ${kembaranName}! Kalian berdua kompak jomoknya 😭`,
      `Eureka! ${name} kembarannya ${kembaranName}! Tapi ${kembaranName} lebih rajin nabung 💰`,
      `Alert! ${name} ada kembarannya namanya ${kembaranName}! Mirip tapi ${kembaranName} lebih bisa masak 👨‍🍳`,
      `Discovery of the century: ${name} punya twin ${kembaranName}! Sayangnya ${kembaranName} lebih tinggi 📏`,
      `Ini kembarannya ${name} nih, si ${kembaranName}! Bedanya ${kembaranName} udah punya motor 🏍️`,
      `Found it! Kembarannya ${name} adalah ${kembaranName}! Tapi ${kembaranName} lebih rajin sholat 🕌`,
      `Tada! ${name} kembarannya ${kembaranName}! Mirip banget, cuma ${kembaranName} lebih sehat 💪`,
      `Behold! The twin of ${name}: ${kembaranName}! Sama-sama ganteng kok (dalam mimpi) 😴`,
      `${name} vs ${kembaranName}: Battle of the twins! Tapi ${kembaranName} menang karena punya pacar 💑`,
      `Kembarannya ${name} ketemu nih! Namanya ${kembaranName}, tapi ${kembaranName} lebih langsing 🏃‍♂️`,
      `Surprise surprise! ${name} punya kembaran bernama ${kembaranName}! Same energy, different bank account 🏦`,
      `${name} meet ${kembaranName}! Kalian kembar tapi ${kembaranName} lebih beruntung dapat kerja 💼`,
      `Ini dia! Kembarannya ${name} adalah ${kembaranName}! Mirip tapi ${kembaranName} punya skill masak 🍳`,
      `Woah! ${name} kembarannya ${kembaranName}! Sama-sama cool tapi ${kembaranName} punya mobil 🚗`,
      `${name} bertemu ${kembaranName}! Twin telepathy activated, sama-sama bokek 📱💸`,
      `Kembarannya ${name} nih guys: ${kembaranName}! Bedanya ${kembaranName} udah wisuda 🎓`,
      `Plot twist: ${name} punya kembaran ${kembaranName}! Tapi ${kembaranName} lebih rajin olahraga 🏋️‍♂️`,
      `${name} and ${kembaranName}: The ultimate twin combo! Sama-sama jomblo sih 💔`,
      `Kembarannya ${name} adalah ${kembaranName}! Mirror mirror on the wall, siapa yang lebih tajir? 🪞💎`,
      `Berita terkini: ${name} ketemu kembarannya ${kembaranName}! Tapi ${kembaranName} udah punya rumah 🏡`,
      `${name} = ${kembaranName}! Same face, different fate! Yang satu sukses yang satu... ya gitu deh 📊`,
      `Kembarannya ${name} revealed: ${kembaranName}! Sama-sama ganteng di foto KTP 📷`,
      `${name} dan ${kembaranName}: Separated at birth, reunited in this chat! Tapi beda rekening 🏧`,
      `Ini kembarannya ${name}: ${kembaranName}! Sama-sama punya mimpi jadi sultan 👑`,
      `${name} meets ${kembaranName}: The twin phenomenon! Bedanya ${kembaranName} punya skill memasak 👨‍🍳`,
      `Kembarannya ${name} adalah ${kembaranName}! Same DNA, different WiFi password 📶`,
      `${name} dan ${kembaranName}: Twin brothers from another mother! Tapi ${kembaranName} lebih beruntung 🍀`,
      `Discovery: ${name} punya kembaran ${kembaranName}! Mirip tapi ${kembaranName} udah punya BPJS 🏥`,
      `${name} bertemu ${kembaranName}! The twin saga continues... tapi ${kembaranName} punya tabungan 💰`,
      `Kembarannya ${name} nih: ${kembaranName}! Same vibes, different credit score 📈`,
      `${name} vs ${kembaranName}: Ultimate twin battle! Yang menang yang udah nikah 💒`,
      `Ini dia kembarannya ${name}: ${kembaranName}! Mirip banget, bedanya ${kembaranName} rajin gym 💪`,
      `${name} meet your twin ${kembaranName}! Sama-sama handsome tapi beda ATM 🏧`,
      `Kembarannya ${name} ketemu: ${kembaranName}! Twin power activated, tapi ${kembaranName} punya skill 🎯`,
      `${name} dan ${kembaranName}: The identical twins! Bedanya ${kembaranName} udah lulus 🎓`,
      `Surprise! Kembarannya ${name} adalah ${kembaranName}! Same face, different life choices 🤷‍♂️`,
      `${name} bertemu ${kembaranName}: The twin reunion! Tapi ${kembaranName} punya pacar cantik 😍`,
      `Ini kembarannya ${name}: ${kembaranName}! Mirror image tapi ${kembaranName} lebih beruntung 🎰`,
      `${name} and ${kembaranName}: Two peas in a pod! Bedanya ${kembaranName} udah punya SIM 🚗`,
      `Final reveal: Kembarannya ${name} adalah ${kembaranName}! Same genes, different dreams! 🌟`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // 50+ improvisasi untuk random member picker (siapa command)
  static async getRandomMemberForSiapa(supabase, question) {
    try {
      // Respon sarkastik kalau tidak ada tanda tanya
      if (!question.includes("?")) {
        const sarkasticResponses = [
          "Maaf anda jelek 😏 dan juga pertanyaannya nggak ada tanda tanya",
          "Hah? Pertanyaannya mana? Atau ini cuma statement random?",
          "Kurang lengkap pertanyaannya tuh, masa iya saya paranormal yang bisa nebak?",
          "Coba tanya yang bener dong, saya bot bukan dukun",
          "Eh, ada yang salah nih. Ini bot bukan mesin wishful thinking",
          "Pertanyaan kok gak ada tanda tanyanya? Saya bukan Mbah Mijan loh",
          "Maaf, saya hanya menjawab pertanyaan yang benar. Bukan ceramah dadakan",
          "Hmm... sepertinya ada yang kurang. Atau mungkin yang kurang adalah otaknya?",
          "Error 404: Tanda tanya not found. Please try again with proper punctuation",
          "Ini bot WhatsApp bukan ChatGPT yang bisa nebak maksud hati anda",
          "Saya bingung, ini mau nanya atau mau curhat sih?",
          "Format salah bos! Ini bukan aplikasi jodoh yang bisa baca pikiran",
          "Kok kayaknya ada yang missing ya? Oh iya, tanda tanyanya!",
          "Sorry not sorry, saya nggak nerima pertanyaan setengah matang",
          "Pertanyaan incomplete detected! Please insert proper question mark to continue",
          "Maaf ya, saya educated bot yang butuh tanda tanya untuk bekerja",
          "Ini mau nanya atau mau ngomong sendiri sih? Saya jadi bingung",
          "Question mark hilang? Mungkin jatuh bareng sama common sense anda",
        ];
        return sarkasticResponses[
          Math.floor(Math.random() * sarkasticResponses.length)
        ];
      }

      const { data: members, error } = await supabase
        .from("members")
        .select("crew")
        .not("crew", "is", null);

      if (error || !members || members.length === 0) {
        const errorResponses = [
          "Error: Database lagi main petak umpet sama saya",
          "Waduh, servernya lagi bad mood nih",
          "Database-nya lagi ngambek, coba lagi nanti ya",
          "Error 500: Internal server drama",
          "Maaf, member database-nya lagi pada libur",
        ];
        return errorResponses[
          Math.floor(Math.random() * errorResponses.length)
        ];
      }

      const randomMember = members[Math.floor(Math.random() * members.length)];
      const cleanQuestion = question.replace("/siapa ", "").toLowerCase();

      const memberResponses = [
        `Yang ${cleanQuestion.replace("?", "")} adalah *${
          randomMember.crew
        }*! 🎯 (Berdasarkan survei lapangan yang sangat akurat)`,
        `Menurut algoritma canggih saya, yang ${cleanQuestion.replace(
          "?",
          ""
        )} adalah *${randomMember.crew}*! 📊`,
        `Setelah konsultasi dengan Mbah Google, jawabannya *${randomMember.crew}*! 🔮`,
        `Random number generator says: *${randomMember.crew}*! Congratulations! 🎉`,
        `Berdasarkan riset mendalam selama 0.1 detik, *${randomMember.crew}* is the chosen one! ⚡`,
        `Plot twist! Yang ${cleanQuestion.replace("?", "")} ternyata *${
          randomMember.crew
        }*! Unexpected banget kan? 😱`,
        `Breaking news: *${randomMember.crew}* dinobatkan sebagai jawaban dari pertanyaan "${cleanQuestion}"! 📰`,
        `Setelah voting ketat di grup internal bot, pemenangnya *${randomMember.crew}*! 🗳️`,
        `Machine learning algorithm result: 99.9% chance it's *${randomMember.crew}*! 🤖`,
        `Cosmic alignment indicates: *${randomMember.crew}* is the answer! ⭐`,
        `Setelah meditasi sejenak, saya mendapat pencerahan bahwa itu *${randomMember.crew}*! 🧘‍♂️`,
        `Quantum physics says: In parallel universe, it's definitely *${randomMember.crew}*! 🌌`,
        `Survey 1000 responden imaginer menunjukkan: *${randomMember.crew}*! 📈`,
        `Setelah konsultasi sama kucing tetangga, jawabannya *${randomMember.crew}*! 🐱`,
        `AI prediction with 101% accuracy: *${randomMember.crew}*! (Yes, I'm that good) 🎯`,
        `Berdasarkan analisis body language virtual, *${randomMember.crew}* is the winner! 💃`,
        `Fortune cookie says: "Your answer is *${randomMember.crew}*" 🥠`,
        `Setelah flip coin 100x, hasilnya menunjuk ke *${randomMember.crew}*! 🪙`,
        `DNA test confirmed (somehow): It's *${randomMember.crew}*! 🧬`,
        `Berdasarkan posisi bintang hari ini, jawabannya *${randomMember.crew}*! ✨`,
        `Random fact generator says: *${randomMember.crew}* adalah jawaban yang tepat! 📋`,
        `Setelah konsultasi dengan Wikipedia, ternyata *${randomMember.crew}*! 📚`,
        `Magic 8-ball digital says: "It is decidedly *${randomMember.crew}*" 🎱`,
        `Berdasarkan research dari grup WhatsApp lain, *${randomMember.crew}*! 💬`,
        `Setelah googling selama 5 menit, jawabannya *${randomMember.crew}*! 🔍`,
      ];

      return memberResponses[
        Math.floor(Math.random() * memberResponses.length)
      ];
    } catch (error) {
      return "Terjadi kesalahan saat mengambil data member. Server lagi PMS kayaknya 😅";
    }
  }

  // Fungsi untuk format info armada dengan improvisasi
  static formatArmadaInfo(data) {
    const fotoUrl =
      data.foto_armada ||
      "https://tillrohfkuxhpokqevbu.supabase.co/storage/v1/object/public/photos_url/tja.jpg";
    const nickname = data.nickname || "Tidak Ada (Kasihan banget)";
    const crew = data.crew || "Tidak Ada (Mungkin lagi cari jodoh)";

    let statusInfo = "";
    switch (data.status) {
      case "Belum Diverifikasi":
        statusInfo = `⚠️ ARMADA INI BELUM DIVERIFIKASI! ⚠️
    Silahkan verifikasi dengan cara:
    🔹 /VERIFIKASI ${data.kode_unit} NICKNAME=NAMA_KEREN_LU
    🔹 Kirim foto terus kasih caption: /VERIFIKASI ${data.kode_unit} FOTO
    
    *Note: Jangan lupa foto yang bagus ya, jangan yang blur kayak masa depan*`;
        break;
      case "Terverifikasi":
        statusInfo =
          "✅ ARMADA TELAH DIVERIFIKASI DAN RESMI DIGUNAKAN! Congrats! 🎉";
        break;
      case "Tidak Aktif":
        statusInfo = "❌ ARMADA TIDAK AKTIF ATAU SOLD OUT (RIP) 🪦";
        break;
    }

    const armadaEmojis = ["🚌", "🚐", "🚍", "🚎"];
    const randomEmoji =
      armadaEmojis[Math.floor(Math.random() * armadaEmojis.length)];

    return {
      imageUrl: fotoUrl,
      message: `*${randomEmoji} INFORMASI ARMADA PO TRIJAYA AGUNG ${randomEmoji}*
      
━━━━━━━━━━━━━━━━━━━━━━
🏷️ **Kode Unit** : \`${data.kode_unit}\`
🎭 **Nickname** : \`${nickname}\`
🏢 **Divisi** : \`${data.divisi}\`
👤 **Crew** : \`${crew}\`
━━━━━━━━━━━━━━━━━━━━━━

${statusInfo}

*Powered by TJA Bot™ - "Making Transport Great Again"* 🚀`,
    };
  }

  // Delay function untuk anti banned
  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Function untuk convert buffer ke base64
  static bufferToBase64(buffer) {
    return buffer.toString("base64");
  }

  // Fungsi untuk get random image dari bucket "gambar"
  static async getRandomImageFromBucket(supabase) {
    try {
      const { data: files, error } = await supabase.storage
        .from("gambar")
        .list("", {
          limit: 100,
          offset: 0,
        });

      if (error || !files || files.length === 0) {
        console.error("Error fetching images:", error);
        return null;
      }

      // Filter hanya file gambar
      const imageFiles = files.filter((file) =>
        file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/)
      );

      if (imageFiles.length === 0) {
        return null;
      }

      // Pilih random image
      const randomImage =
        imageFiles[Math.floor(Math.random() * imageFiles.length)];

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("gambar")
        .getPublicUrl(randomImage.name);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Error getting random image:", error);
      return null;
    }
  }

  // Utility function untuk mengecek apakah tanggal sudah berganti
  static hasDateChanged(lastResetDate) {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    return lastResetDate !== today;
  }

  // Utility function untuk format tanggal Indonesia
  static formatIndonesianDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

module.exports = BotHelpers;
