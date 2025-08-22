const axios = require("axios");
const BotHelpers = require("../utils/helpers");

class AskHandlers {
  constructor(client) {
    this.client = client;
  }

  // Handler untuk command /ask
  async handleAskCommand(message, question) {
    try {
      if (!question || question.trim() === "") {
        const emptyQuestionResponses = [
          "❌ Pertanyaannya mana bos? Saya bukan paranormal yang bisa baca pikiran 🔮",
          "❌ Format: /ask [pertanyaan]. Jangan setengah-setengah dong! 😏",
          "❌ Mau tanya apa nih? Kosong gini saya bingung 🤔",
          "❌ Question not found! Please insert your curiosity 📝",
          "❌ Eh, pertanyaannya lupa diketik ya? 😅",
          "❌ Saya siap jawab, tapi pertanyaannya mana? 🤷‍♂️",
          "❌ Empty query detected! Isi dulu dong pertanyaannya 📋",
          "❌ Halah, mau nanya tapi lupa ngetik pertanyaannya 🙃",
        ];
        const randomEmpty =
          emptyQuestionResponses[
            Math.floor(Math.random() * emptyQuestionResponses.length)
          ];
        await message.reply(randomEmpty);
        return;
      }

      // Send thinking message
      const thinkingMessages = [
        "🤔 Hmm... let me think about that... Searching the internet! 🔍",
        "🧠 Brain.exe loading... Mencari jawaban terbaik! ⚡",
        "🔍 Googling like a pro... Please wait! 📡",
        "💭 Processing your question... AI mode activated! 🤖",
        "🎯 Analyzing question... Hunting for best answer! 🏹",
        "📚 Consulting with digital library... Stand by! 📖",
        "🔮 Mengaktifkan mode paranormal digital... Loading! ✨",
        "🚀 Launching search mission... Target locked! 🎯",
        "🧙‍♂️ Casting knowledge spell... Almost ready! ⚡",
        "💫 Connecting to universal knowledge database... Wait! 🌐",
      ];
      const randomThinking =
        thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)];
      await message.reply(randomThinking);

      // Get answer using search and AI
      const answer = await this.getContextualAnswer(question.trim());

      await BotHelpers.delay(1500); // Realistic thinking time
      await message.reply(answer);
    } catch (error) {
      console.error("Error handling ask command:", error);
      const errorResponses = [
        "❌ Oops! Brain overload! Pertanyaannya terlalu sulit 🧠💥",
        "❌ Error searching! Mungkin internetnya lagi bad mood 📡😤",
        "❌ Knowledge database lagi maintenance! Coba lagi ya 🔧",
        "❌ AI system malfunction! Reboot brain required 🤖🔄",
        "❌ Search engine lagi sibuk! Try again later 🔍💤",
        "❌ Gagal connect ke matrix knowledge! 404 wisdom not found 🌐",
        "❌ Server jawaban lagi overload! Terlalu banyak pertanyaan 📊",
        "❌ Knowledge API error! Einstein lagi istirahat 👨‍🔬💤",
      ];
      const randomError =
        errorResponses[Math.floor(Math.random() * errorResponses.length)];
      await message.reply(randomError);
    }
  }

  // Get contextual answer using multiple sources
  async getContextualAnswer(question) {
    try {
      // First try to get quick facts
      const searchResults = await this.performWebSearch(question);

      // Generate contextual response
      const answer = await this.generateResponse(question, searchResults);

      return answer;
    } catch (error) {
      console.error("Error getting contextual answer:", error);
      return this.getFallbackResponse(question);
    }
  }

  // Perform web search using DuckDuckGo Instant Answer API (free alternative)
  async performWebSearch(query) {
    try {
      // Use DuckDuckGo Instant Answer API (free and no API key required)
      const encodedQuery = encodeURIComponent(query);
      const response = await axios.get(
        `https://api.duckduckgo.com/?q=${encodedQuery}&format=json&no_redirect=1&no_html=1&skip_disambig=1`,
        {
          timeout: 8000,
          headers: {
            "User-Agent": "TJA-Bot/1.0 (https://tja-bot.com)",
          },
        }
      );

      const data = response.data;

      // Extract useful information
      const results = {
        abstract: data.Abstract || "",
        abstractText: data.AbstractText || "",
        definition: data.Definition || "",
        answer: data.Answer || "",
        answerType: data.AnswerType || "",
        type: data.Type || "",
        results: data.Results || [],
        relatedTopics: data.RelatedTopics || [],
      };

      return results;
    } catch (error) {
      console.error("Web search error:", error);
      return null;
    }
  }

  // Generate contextual response based on search results
  async generateResponse(question, searchResults) {
    const questionLower = question.toLowerCase();

    // Check if we have good search results
    if (searchResults) {
      let response = "";

      // Use direct answer if available
      if (searchResults.answer && searchResults.answer.length > 0) {
        response = `💡 *Jawaban untuk: "${question}"*\n\n`;
        response += `${searchResults.answer}\n\n`;

        if (searchResults.answerType) {
          response += `📊 *Type*: ${searchResults.answerType}\n`;
        }
      }

      // Use abstract/definition if available
      else if (
        searchResults.abstractText &&
        searchResults.abstractText.length > 10
      ) {
        response = `📖 *Informasi tentang: "${question}"*\n\n`;
        response += `${searchResults.abstractText}\n\n`;

        if (
          searchResults.abstract &&
          searchResults.abstract !== searchResults.abstractText
        ) {
          response += `🔍 *Detail*: ${searchResults.abstract}\n\n`;
        }
      }

      // Use definition if available
      else if (
        searchResults.definition &&
        searchResults.definition.length > 0
      ) {
        response = `📚 *Definisi: "${question}"*\n\n`;
        response += `${searchResults.definition}\n\n`;
      }

      // If we have search results but no direct content, provide related info
      else if (
        searchResults.relatedTopics &&
        searchResults.relatedTopics.length > 0
      ) {
        response = `🔍 *Informasi terkait: "${question}"*\n\n`;
        response += "Beberapa informasi yang berkaitan:\n";

        searchResults.relatedTopics.slice(0, 3).forEach((topic, index) => {
          if (topic.Text) {
            response += `${index + 1}. ${topic.Text}\n`;
          }
        });
        response += "\n";
      }

      // If we have any response, add footer
      if (response) {
        response += `_🤖 Sumber: Web Search via TJA Bot_\n`;
        response += `_💡 Untuk info lebih detail, coba search langsung di Google!_`;
        return response;
      }
    }

    // Fallback to contextual responses based on question patterns
    return this.getPatternBasedResponse(question);
  }

  // Generate response based on question patterns
  getPatternBasedResponse(question) {
    const questionLower = question.toLowerCase();

    // Greeting patterns
    if (
      questionLower.includes("hello") ||
      questionLower.includes("halo") ||
      questionLower.includes("hai") ||
      questionLower.includes("hi")
    ) {
      return `👋 Halo! Ada yang bisa saya bantu? Tanya aja langsung ya!\n\n_🤖 Powered by TJA Smart Bot_`;
    }

    // Time/date questions
    if (
      questionLower.includes("waktu") ||
      questionLower.includes("jam") ||
      questionLower.includes("tanggal") ||
      questionLower.includes("hari")
    ) {
      const now = new Date();
      const timeStr = now.toLocaleString("id-ID");
      return `⏰ *Informasi Waktu:*\n\n📅 Sekarang: ${timeStr}\n\n_🤖 TJA Bot Time Service_`;
    }

    // Weather questions
    if (
      questionLower.includes("cuaca") ||
      questionLower.includes("hujan") ||
      questionLower.includes("panas") ||
      questionLower.includes("weather")
    ) {
      const weatherResponses = [
        '🌤️ Untuk info cuaca terkini, coba cek aplikasi weather atau Google "cuaca [nama kota]"',
        "☀️ Cuaca bisa berubah-ubah, better check weather app ya!",
        "🌧️ Info cuaca realtime bisa dicek di BMKG atau weather apps!",
      ];
      return (
        weatherResponses[Math.floor(Math.random() * weatherResponses.length)] +
        "\n\n_🤖 TJA Bot Weather Assistant_"
      );
    }

    // TJA related questions
    if (
      questionLower.includes("tja") ||
      questionLower.includes("trijaya") ||
      questionLower.includes("armada") ||
      questionLower.includes("bus")
    ) {
      return (
        `🚌 *Informasi TJA:*\n\n` +
        `PT Trijaya Agung Lestari adalah perusahaan transportasi yang melayani:\n` +
        `• Pariwisata dan AKAP\n` +
        `• Berbagai rute di Indonesia\n` +
        `• Armada berkualitas dengan crew profesional\n\n` +
        `Untuk info spesifik armada, gunakan: /TJA-XXX\n\n` +
        `_🚌 "Connecting People, Creating Memories"_`
      );
    }

    // Technology questions
    if (
      questionLower.includes("komputer") ||
      questionLower.includes("hp") ||
      questionLower.includes("laptop") ||
      questionLower.includes("internet")
    ) {
      return (
        `💻 *Info Teknologi:*\n\n` +
        `Untuk pertanyaan teknologi spesifik, saya sarankan:\n` +
        `• Google search untuk tutorial\n` +
        `• YouTube untuk video guide\n` +
        `• Forum teknologi seperti Kaskus atau Reddit\n\n` +
        `_🤖 TJA Tech Assistant_`
      );
    }

    // Islamic/religious questions
    if (
      questionLower.includes("islam") ||
      questionLower.includes("sholat") ||
      questionLower.includes("quran") ||
      questionLower.includes("doa")
    ) {
      return (
        `🕌 *Informasi Islami:*\n\n` +
        `Untuk pertanyaan keagamaan, saya sarankan:\n` +
        `• Konsultasi dengan ustadz/kyai terpercaya\n` +
        `• Baca Al-Quran dan Hadits\n` +
        `• Gunakan aplikasi Islamic seperti Quran Kemenag\n\n` +
        `_📿 "Dan Allah lebih mengetahui" - QS. Al-Baqarah_`
      );
    }

    // Default intelligent response
    return this.generateIntelligentFallback(question);
  }

  // Generate intelligent fallback response
  generateIntelligentFallback(question) {
    const fallbackResponses = [
      `🤔 *Tentang: "${question}"*\n\n` +
        `Maaf, saya belum memiliki informasi spesifik tentang ini. Tapi saya sarankan:\n\n` +
        `💡 Coba search di Google dengan kata kunci yang lebih spesifik\n` +
        `📚 Konsultasi dengan ahli di bidang terkait\n` +
        `🌐 Cek website resmi atau sumber terpercaya\n\n` +
        `_🤖 TJA Smart Assistant - Always learning!_`,

      `🔍 *Searching info about: "${question}"*\n\n` +
        `Hmm, informasi ini tidak tersedia dalam database saya saat ini.\n\n` +
        `📌 Saran saya:\n` +
        `• Google search untuk info terkini\n` +
        `• Tanya di forum yang relevan\n` +
        `• Konsultasi dengan expert\n\n` +
        `_🧠 TJA Knowledge Base - Continuously expanding!_`,

      `💭 *Re: "${question}"*\n\n` +
        `Pertanyaan menarik! Sayangnya saya belum memiliki data lengkap tentang topik ini.\n\n` +
        `🎯 Rekomendasi:\n` +
        `• Search engine adalah teman terbaik\n` +
        `• Wikipedia untuk informasi umum\n` +
        `• Tanya ahli yang kompeten\n\n` +
        `_⚡ TJA Info Hub - Your digital companion!_`,
    ];

    return fallbackResponses[
      Math.floor(Math.random() * fallbackResponses.length)
    ];
  }

  // Fallback response when all else fails
  getFallbackResponse(question) {
    const fallbacks = [
      `❓ Maaf, saya belum bisa menjawab pertanyaan tentang "${question}" dengan akurat.\n\n` +
        `💡 Coba:\n• Google search\n• Tanya ahli\n• Cari di sumber terpercaya\n\n` +
        `_🤖 TJA Bot - Still learning!_`,

      `🤷‍♂️ Oops! Pertanyaan "${question}" cukup challenging untuk saya.\n\n` +
        `📚 Saran: Coba search di internet atau konsultasi expert ya!\n\n` +
        `_🧠 TJA Smart Bot - Growing smarter every day!_`,

      `😅 Wah, "${question}" bikin saya bingung nih!\n\n` +
        `🎯 Better try: Google, Wikipedia, atau tanya yang lebih expert!\n\n` +
        `_⚡ TJA Assistant - Your friendly neighborhood bot!_`,
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  // Advanced contextual analysis
  async analyzeQuestionContext(question) {
    // Simple keyword-based context detection
    const contexts = {
      technical: [
        "komputer",
        "software",
        "hardware",
        "coding",
        "programming",
        "teknologi",
      ],
      religious: [
        "islam",
        "sholat",
        "quran",
        "hadits",
        "doa",
        "ustadz",
        "masjid",
      ],
      business: [
        "bisnis",
        "marketing",
        "sales",
        "profit",
        "investasi",
        "usaha",
      ],
      health: [
        "kesehatan",
        "sakit",
        "dokter",
        "obat",
        "penyakit",
        "rumah sakit",
      ],
      education: [
        "sekolah",
        "universitas",
        "belajar",
        "kuliah",
        "pendidikan",
        "guru",
      ],
      transport: [
        "transportasi",
        "bus",
        "travel",
        "jalan",
        "rute",
        "armada",
        "tja",
      ],
    };

    const questionLower = question.toLowerCase();
    let detectedContext = "general";

    for (const [context, keywords] of Object.entries(contexts)) {
      if (keywords.some((keyword) => questionLower.includes(keyword))) {
        detectedContext = context;
        break;
      }
    }

    return detectedContext;
  }
}

module.exports = AskHandlers;
