const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 0;
        const sort = req.query.sort === 'desc' ? -1 : 1;
        const messages = await Message.find({ roomId: req.params.roomId })
            .sort({ timestamp: sort })
            .limit(limit);
        res.send(messages);
    } catch (err) {
        res.send({ success: false, message: err.message });
    }
};

exports.addMessage = async (req, res) => {
    try {
        if (req.body.message && req.body.message.length > 200) {
            return res.status(400).send({
                success: false,
                message: 'Message exceeds 200 characters'
            });
        }
        const msg = await Message.create({
            roomId: req.body.roomId,
            uid: req.user._id,
            message: req.body.message,
            file: req.body.file || false
        });
        res.send(msg);
    } catch (err) {
        res.send({ success: false, message: err.message });
    }
};