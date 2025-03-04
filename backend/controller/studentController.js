const Attendance = require('../model/Attendance.js');
const Subject = require('../model/Subject.js');

exports.markAttendance = async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ msg: 'Unauthorized' });

  const { qrData } = req.body;
  console.log('Received QR Data:', qrData); // Debugging

  if (!qrData) return res.status(400).json({ msg: 'QR data is required' });

  try {
    const { subjectId } = JSON.parse(qrData);
    console.log('Parsed Subject ID:', subjectId); // Debugging

    if (!subjectId) return res.status(400).json({ msg: 'Invalid QR code: subjectId is missing' });

    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(400).json({ msg: 'Invalid QR code: subject not found' });

    // Check if attendance already marked for today
    const today = new Date().setHours(0, 0, 0, 0);
    const existingAttendance = await Attendance.findOne({
      student: req.user.id,
      subject: subjectId,
      date: { $gte: today },
    });
    if (existingAttendance) return res.status(400).json({ msg: 'Attendance already marked for today' });

    const attendance = new Attendance({
      student: req.user.id,
      subject: subjectId,
    });
    await attendance.save();
    console.log('Attendance saved:', attendance); // Debugging

    res.json({ msg: 'Attendance marked successfully', date: attendance.date });
  } catch (err) {
    console.error('Error in markAttendance:', err.message); // Debugging
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getAttendance = async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ msg: 'Unauthorized' });

  try {
    const attendance = await Attendance.find({ student: req.user.id })
      .populate('subject', 'name code')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};