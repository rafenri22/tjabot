// Helper functions untuk bot
class BotHelpers {
    // Fungsi untuk mengecek apakah pesan dari grup
    static isFromGroup(message) {
      return message.from.includes('@g.us');
    }
  
    // Fungsi untuk mengecek apakah command valid
    static isValidCommand(text) {
      const commands = ['/TJA-', '/jomox', '/JOMOX', '/siapa', '/verifikasi', '/VERIFIKASI', '/info'];
      return commands.some(cmd => text.toLowerCase().startsWith(cmd.toLowerCase()));
    }
  
    // Fungsi untuk random jomox responses
    static getRandomJomoxResponse(name) {
      const responses = [
        `Ternyata ${name} adalah raja jomok! 👑`,
        `${Math.floor(Math.random() * 100)}% ${name} punya sifat jomok`,
        `${name} tingkat jomoknya ${Math.floor(Math.random() * 10) + 1}/10`,
        `Waduh ${name} jomok banget sih`,
        `${name} jomoknya kebangetan dah`,
        `Hmm... ${name} sepertinya ${Math.floor(Math.random() * 80) + 20}% jomok`,
        `Analysis complete: ${name} = jomok level maksimal!`,
        `${name}? Oh itu mah jomok sejati!`,
        `${name} certified jomok ✅`,
        `Jomok meter: ${name} = ${Math.floor(Math.random() * 100)}%`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  
    // Fungsi untuk random member picker
    static async getRandomMemberForSiapa(supabase, question) {
      try {
        // Cek apakah ada tanda tanya
        if (!question.includes('?')) {
          const randomResponses = [
            'Maaf anda jelek 😏',
            'Hah? Pertanyaannya mana?',
            'Kurang lengkap pertanyaannya tuh',
            'Coba tanya yang bener dong',
            'Eh, ada yang salah nih',
            'Pertanyaan kok gak ada tanda tanyanya?',
            'Maaf, saya hanya menjawab pertanyaan yang benar',
            'Hmm... sepertinya ada yang kurang'
          ];
          return randomResponses[Math.floor(Math.random() * randomResponses.length)];
        }
  
        const { data: members, error } = await supabase
          .from('members')
          .select('crew')
          .not('crew', 'is', null);
  
        if (error || !members || members.length === 0) {
          return 'Error: Tidak dapat mengambil data member';
        }
  
        const randomMember = members[Math.floor(Math.random() * members.length)];
        const cleanQuestion = question.replace('/siapa ', '').toLowerCase();
        
        return `Yang ${cleanQuestion.replace('?', '')} adalah *${randomMember.crew}*! 🎯`;
      } catch (error) {
        return 'Terjadi kesalahan saat mengambil data member';
      }
    }
  
    // Fungsi untuk format info armada
    static formatArmadaInfo(data) {
      const fotoUrl = data.foto_armada || 'https://tillrohfkuxhpokqevbu.supabase.co/storage/v1/object/public/photos_url/tja.jpg';
      const nickname = data.nickname || 'Tidak Ada';
      const crew = data.crew || 'Tidak Ada';
      
      let statusInfo = '';
      switch(data.status) {
        case 'Belum Diverifikasi':
          statusInfo = 
    `ARMADA INI BELUM DIVERIFIKASI, SILAHKAN VERIFIKASI ARMADA DENGAN MENGIRIM KE GRUP INI DENGAN:
  - /VERIFIKASI ${data.kode_unit} NICKNAME=NAMA NICKNAME
  - kirim foto kemudian beri caption /VERIFIKASI ${data.kode_unit} FOTO`;
          break;
        case 'Terverifikasi':
          statusInfo = 'ARMADA TELAH DIVERIFIKASI DAN RESMI DIGUNAKAN';
          break;
        case 'Tidak Aktif':
          statusInfo = 'ARMADA TIDAK AKTIF ATAU SOLD OUT';
          break;
      }
  
      return {
        imageUrl: fotoUrl,
        message: `*🚌 INFORMASI ARMADA PO TRIJAYA AGUNG*
      
      ━━━━━━━━━━━━━━━
      🔖 Kode Unit : ${data.kode_unit}
      🏷️ Nickname : ${nickname}
      🏢 Divisi   : ${data.divisi}
      👥 Crew     : ${crew}
      ━━━━━━━━━━━━━━━
      
      ${statusInfo}`
      };        
    }
  
    // Delay function untuk anti banned
    static delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  
    // Function untuk convert buffer ke base64
    static bufferToBase64(buffer) {
      return buffer.toString('base64');
    }
  }
  
  module.exports = BotHelpers;