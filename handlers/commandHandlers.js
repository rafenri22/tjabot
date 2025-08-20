const supabase = require('../config/database');
const BotHelpers = require('../utils/helpers');
const { MessageMedia } = require('whatsapp-web.js');

class CommandHandlers {
  constructor(client) {
    this.client = client;
  }

  // Handler untuk command /TJA-xxx
  async handleTJACommand(message, kodeUnit) {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('kode_unit', kodeUnit.toUpperCase())
        .single();

      if (error || !data) {
        await message.reply(`❌ Kode unit ${kodeUnit.toUpperCase()} tidak ditemukan!`);
        return;
      }

      const armadaInfo = BotHelpers.formatArmadaInfo(data);
      
      // Kirim foto dengan caption jika ada foto
      if (armadaInfo.imageUrl && armadaInfo.imageUrl !== 'https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png') {
        try {
          const media = await MessageMedia.fromUrl(armadaInfo.imageUrl);
          await message.reply(media, undefined, { caption: armadaInfo.message });
        } catch (mediaError) {
          console.log('Error loading image, sending text only:', mediaError);
          await message.reply(armadaInfo.message);
        }
      } else {
        await message.reply(armadaInfo.message);
      }
    } catch (error) {
      console.error('Error handling TJA command:', error);
      await message.reply('❌ Terjadi kesalahan saat mengambil data armada');
    }
  }

  // Handler untuk command /jomox
  async handleJomoxCommand(message, name) {
    try {
      const response = BotHelpers.getRandomJomoxResponse(name);
      await BotHelpers.delay(1000); // Anti spam delay
      await message.reply(response);
    } catch (error) {
      console.error('Error handling jomox command:', error);
    }
  }

  // Handler untuk command /siapa
  async handleSiapaCommand(message, question) {
    try {
      const response = await BotHelpers.getRandomMemberForSiapa(supabase, question);
      await BotHelpers.delay(1500); // Anti spam delay
      await message.reply(response);
    } catch (error) {
      console.error('Error handling siapa command:', error);
    }
  }

  // Handler untuk command /verifikasi
  async handleVerifikasiCommand(message, text) {
    try {
      const parts = text.split(' ');
      const kodeUnit = parts[1]?.toUpperCase();

      if (!kodeUnit) {
        await message.reply('❌ Format salah! Gunakan: /VERIFIKASI TJA-XXX NICKNAME=nama atau kirim foto dengan caption /VERIFIKASI TJA-XXX FOTO');
        return;
      }

      // Cek apakah armada exists
      const { data: existingData, error: checkError } = await supabase
        .from('members')
        .select('*')
        .eq('kode_unit', kodeUnit)
        .single();

      if (checkError || !existingData) {
        await message.reply(`❌ Kode unit ${kodeUnit} tidak ditemukan!`);
        return;
      }

      // Handle nickname update
      if (parts[2]?.startsWith('NICKNAME=')) {
        const nickname = parts[2].replace('NICKNAME=', '');
        
        const { error: updateError } = await supabase
          .from('members')
          .update({ nickname: nickname })
          .eq('kode_unit', kodeUnit);

        if (updateError) {
          await message.reply('❌ Gagal mengupdate nickname!');
          return;
        }

        await message.reply(`✅ Nickname untuk ${kodeUnit} berhasil diupdate: ${nickname}`);
        
        // Cek apakah sudah lengkap untuk verifikasi
        await this.checkAndUpdateVerificationStatus(kodeUnit, message);
      }

      // Handle foto upload
      if (parts[2] === 'FOTO' && message.hasMedia) {
        try {
          const media = await message.downloadMedia();
          
          if (!media) {
            await message.reply('❌ Gagal mengunduh foto!');
            return;
          }

          // Convert base64 to buffer
          const buffer = Buffer.from(media.data, 'base64');
          const fileName = `armada-${kodeUnit}-${Date.now()}.jpg`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('photos_url')
            .upload(fileName, buffer, {
              contentType: 'image/jpeg',
              upsert: true
            });

          if (uploadError) {
            console.error('Upload error:', uploadError);
            await message.reply('❌ Gagal mengupload foto!');
            return;
          }

          const { data: publicUrlData } = supabase.storage
            .from('photos_url')
            .getPublicUrl(fileName);

          const fotoUrl = publicUrlData.publicUrl;

          const { error: updateError } = await supabase
            .from('members')
            .update({ foto_armada: fotoUrl })
            .eq('kode_unit', kodeUnit);

          if (updateError) {
            await message.reply('❌ Gagal menyimpan URL foto!');
            return;
          }

          await message.reply(`✅ Foto untuk ${kodeUnit} berhasil diupload!`);

          // Cek apakah sudah lengkap untuk verifikasi
          await this.checkAndUpdateVerificationStatus(kodeUnit, message);
        } catch (error) {
          console.error('Upload error:', error);
          await message.reply('❌ Terjadi kesalahan saat mengupload foto!');
        }
      }

      // Jika tidak ada NICKNAME= atau FOTO
      if (!parts[2]?.startsWith('NICKNAME=') && parts[2] !== 'FOTO') {
        await message.reply('❌ Format salah! Gunakan: /VERIFIKASI TJA-XXX NICKNAME=nama atau kirim foto dengan caption /VERIFIKASI TJA-XXX FOTO');
      }
    } catch (error) {
      console.error('Error handling verifikasi command:', error);
      await message.reply('❌ Terjadi kesalahan saat memproses verifikasi');
    }
  }

  // Function untuk cek dan update status verifikasi
  async checkAndUpdateVerificationStatus(kodeUnit, message) {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('kode_unit', kodeUnit)
        .single();

      if (error || !data) return;

      // Cek apakah semua data sudah lengkap
      if (data.nickname && data.foto_armada && data.crew) {
        const { error: updateError } = await supabase
          .from('members')
          .update({ status: 'Terverifikasi' })
          .eq('kode_unit', kodeUnit);

        if (!updateError) {
          await message.reply(`🎉 *${kodeUnit} TELAH TERVERIFIKASI LENGKAP!* 🎉\n\nSemua data armada telah lengkap dan resmi digunakan.`);
        }
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  }

  // Handler untuk command /info
  async handleInfoCommand(message) {
    const infoText = `📋 *PANDUAN PENGGUNAAN BOT TJA*

🚌 */TJA-XXX* 
Menampilkan informasi armada
Contoh: /TJA-001

🤪 */jomox nama* 
Mengecek tingkat jomok seseorang
Contoh: /jomox agung

🎯 */siapa pertanyaan?* 
Random pilih member untuk menjawab
Contoh: /siapa yang paling ganteng?

ℹ️ */info*
Menampilkan panduan ini

_PT TRIJAYA AGUNG LESTARI @2025_`;

    await message.reply(infoText);
  }
}

module.exports = CommandHandlers;