// server/controllers/dashboardController.js
const StudySession = require('../models/StudySessions');
const mongoose = require('mongoose');


exports.recordSession = async (req, res) => {
  try {
    const { userId, topic, level, success } = req.body;
    await StudySession.create({ user: userId, topic, level, success });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to record session' });
  }
};
// server/controllers/dashboardController.js
exports.getDashboard = async (req, res) => {
  try {
    const { userId } = req.params;
    const objectUserId = new mongoose.Types.ObjectId(String(userId)); // ✅ Safe string conversion

    const byTopic = await StudySession.aggregate([
      { $match: { user: objectUserId } },
      { $group: { _id: '$topic', count: { $sum: 1 } } }
    ]);

    const total = await StudySession.countDocuments({ user: objectUserId });
    const successes = await StudySession.countDocuments({ user: objectUserId, success: true });

    res.json({
      byTopic: byTopic.map(t => ({ topic: t._id, count: t.count })),
      successRate: total ? Math.round((successes / total) * 100) : 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
};
