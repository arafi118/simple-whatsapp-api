function format(Number) {
  const phoneNumber = Number.replace(/\D/g, '');

  if (phoneNumber.startsWith('0')) {
    return '62' + phoneNumber.slice(1) + '@s.whatsapp.net';
  } else if (phoneNumber.startsWith('62')) {
    return phoneNumber + '@s.whatsapp.net';
  } else if (phoneNumber.startsWith('628')) {
    return phoneNumber + '@s.whatsapp.net';
  } else if (phoneNumber.startsWith('+62')) {
    return phoneNumber.replace('+', '') + '@s.whatsapp.net';
  } else {
    throw new Error('Nomor telepon tidak valid');
  }
}

module.exports = {
  send_message: async (req, res) => {
    const token = req.params.token;
    const number = format(req.body.number);
    const message = req.body.message;

    const client = await req.server.Whatsapp.findOne({
      token
    });

    if (!client) {
      return res.send({
        success: false,
        msg: 'Whatsapp belum terdaftar. Silahkan lakukan scan dahulu.'
      });
    }

    try {
      const sock = await req.server.helperWhatsapp({
        nama: client.nama,
        token,
        onConnect: async (sock) => {
          await sock.sendMessage(number, {
            text: message
          });
        }
      });

      if (sock) {
        return res.send({
          success: true,
          msg: 'Pesan berhasil dikirim ke nomor ' + req.body.number
        });
      }

      return res.send({
        success: false,
        msg: 'Pesan gagal dikirim.'
      });
    } catch (error) {
      return res.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      })
    }
  },

  send_messages: async (req, res) => {
    const token = req.params.token;
    const messages = req.body.messages;

    const client = await req.server.Whatsapp.findOne({
      token
    });

    if (!client) {
      return res.send({
        success: false,
        msg: 'Whatsapp belum terdaftar. Silahkan lakukan scan dahulu.'
      });
    }

    try {
      const sock = await req.server.helperWhatsapp({
        nama: client.nama,
        token,
        onConnect: async (sock) => {
          for (let i = 0; i < messages.length; i++) {
            setTimeout(async () => {
              await sock.sendMessage(format(messages[i].number), {
                text: messages[i].message
              });
            }, 1000 * i);
          }
        }
      });

      if (sock) {
        return res.send({
          success: true,
          msg: 'Pesan berhasil dikirim.'
        });
      }

      return res.send({
        success: false,
        msg: 'Pesan gagal dikirim.'
      });
    } catch (error) {
      return res.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      })
    }
  }
}