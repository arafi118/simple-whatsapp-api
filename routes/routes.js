module.exports = {
  'GET /': (req, res) => {
    return res.view('homepage');
  },

  // API CLIENT ROUTES
  'GET /api/client': 'clientController.index',
  'POST /api/client': 'clientController.store',
  'GET /api/client/:token': 'clientController.show',
  'DELETE /api/client/:token': 'clientController.destroy',

  // API MESSAGE ROUTES
  'POST /api/message/:token/send_message': 'messageController.send_message',
  'POST /api/message/:token/send_messages': 'messageController.send_messages',
};