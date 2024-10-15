const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys');

const {
  Boom
} = require('@hapi/boom');
const pino = require('pino');
const path = require('path');
const qrCode = require('qrcode');

module.exports = async (inputs) => {
  const nama = inputs.nama;

  const authPath = path.resolve(__dirname, '../../auth/' + inputs.token);
  const {
    state,
    saveCreds
  } = await useMultiFileAuthState(authPath);

  const connectToWhatsApp = async (Reconnect = 0) => {
    var sock = makeWASocket({
      printQRInTerminal: true,
      auth: state,
      browser: [nama, 'Desktop', '1.0.0'],
      logger: pino({
        level: 'silent'
      })
    });

    sock.ev.on('connection.update', async (update) => {
      const connection = update.connection;
      const qr = update.qr;
      const lastDisconnect = update.lastDisconnect;

      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect.error instanceof Boom) ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut : false;

        if (shouldReconnect) {
          if (inputs.onQR || Reconnect <= 2) {
            console.log('Reconnecting...');
            Reconnect += 1;

            await connectToWhatsApp(Reconnect);
          }
        } else {
          console.log('Logged out, not reconnecting.');
        }
      }

      if (qr) {
        qrCode.toDataURL(qr).then(async (url) => {
          if (inputs.onQR) {
            await inputs.onQR(url);
          }
        });
      }

      if (connection === 'open') {
        console.log('Connected');

        if (inputs.onConnect) {
          await inputs.onConnect(sock);
        }
      }
    });

    sock.ev.on('messages.upsert', async () => {
      // let info = m.messages[0];
    });

    sock.ev.on('creds.update', saveCreds);

    return sock;
  };

  const sock = await connectToWhatsApp();
  return sock;
}