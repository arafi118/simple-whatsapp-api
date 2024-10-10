const fs = require('fs');
const path = require('path');

module.exports = {
  index: async (req, res) => {
    const whatsapp = await req.server.Whatsapp.findAll();

    return res.send({
      success: true,
      data: whatsapp
    });
  },

  store: async (req, res) => {
    const nama = req.body.nama
    const token = req.body.token
    const socketId = req.body.socketId

    const whatsapp = await req.server.Whatsapp.findOne({
      where: {
        token: token
      }
    });

    if (whatsapp) {
      return res.send({
        success: false,
        msg: 'Token sudah terdaftar.'
      });
    }

    try {
      const client = await req.server.helperWhatsapp({
        nama,
        token,
        onConnect: async (sock) => {
          const registerClient = await req.server.Whatsapp.create({
            nama,
            token
          });
        },
        onQR: async (url) => {
          const Qr = await req.server.io.to(socketId).emit('QR', {
            url
          });
        }
      });

      return res.send({
        success: true,
      });
    } catch (error) {
      return res.code(500).send({
        error: 'Internal Server Error',
        message: error.message
      })
    }
  },

  show: async (req, res) => {
    const token = req.params.token;

    const whatsapp = await req.server.Whatsapp.findOne({
      where: {
        token
      }
    });

    return res.send({
      success: true,
      data: whatsapp
    });
  },

  destroy: async (req, res) => {
    const token = req.params.token;

    const whatsapp = await req.server.Whatsapp.findOne({
      where: {
        token
      }
    });

    if (!whatsapp) {
      return res.send({
        success: false,
        msg: 'Client tidak ditemukan.'
      });
    }

    await req.server.Whatsapp.destroy({
      where: {
        token
      },
    });

    const authPath = path.join(__dirname, '../../auth/' + whatsapp.token);
    if (fs.existsSync(authPath)) {
      fs.rmSync(authPath, {
        recursive: true,
        force: true
      });
    }

    return res.send({
      success: true,
      data: whatsapp
    });
  }
}