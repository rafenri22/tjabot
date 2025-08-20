const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const CommandHandlers = require('./handlers/commandHandlers');
const BotHelpers = require('./utils/helpers');

// Inisialisasi client WhatsApp
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "tja-bot"
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

const commandHandlers = new CommandHandlers(client);

// Event ketika QR code perlu di-scan
client.on('qr', (qr) => {
    console.log('📱 Scan QR Code di bawah ini untuk login WhatsApp:');
    qrcode.generate(qr, { small: true });
});

// Event ketika client sudah siap
client.on('ready', () => {
    console.log('✅ Bot WhatsApp TJA berhasil terhubung!');
    console.log('🤖 Bot siap menerima perintah di grup...');
    console.log('📋 Commands available:');
    console.log('   - /TJA-XXX (info armada)');
    console.log('   - /jomox nama (cek jomok level)');
    console.log('   - /siapa pertanyaan? (random member picker)');
    console.log('   - /verifikasi (verifikasi armada)');
    console.log('   - /info (help)');
    console.log('');
});

// Event ketika ada pesan masuk
client.on('message', async (message) => {
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
        if (lowerText.startsWith('/tja-')) {
            const kodeUnit = text.substring(1); // Remove /
            await commandHandlers.handleTJACommand(message, kodeUnit);
        }
        
        // Handle /jomox command
        else if (lowerText.startsWith('/jomox ') || lowerText.startsWith('/JOMOX ')) {
            const name = text.substring(7); // Remove '/jomox '
            if (name.trim()) {
                await commandHandlers.handleJomoxCommand(message, name.trim());
            }
        }
        
        // Handle /siapa command
        else if (lowerText.startsWith('/siapa ')) {
            const question = text.substring(7); // Remove '/siapa '
            if (question.trim()) {
                await commandHandlers.handleSiapaCommand(message, question.trim());
            }
        }
        
        // Handle /verifikasi command
        else if (lowerText.startsWith('/verifikasi ')) {
            await commandHandlers.handleVerifikasiCommand(message, text);
        }
        
        // Handle /info command
        else if (lowerText === '/info') {
            await commandHandlers.handleInfoCommand(message);
        }

    } catch (error) {
        console.error('❌ Error processing message:', error);
    }
});

// Event ketika ada error autentikasi
client.on('auth_failure', (msg) => {
    console.error('❌ Authentication failed:', msg);
});

// Event ketika client terputus
client.on('disconnected', (reason) => {
    console.log('❌ Client was logged out:', reason);
});

// Jalankan client
console.log('🚀 Starting WhatsApp Bot TJA...');
client.initialize();

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Bot dihentikan oleh user');
    await client.destroy();
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});