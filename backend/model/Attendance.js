const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true }, // Ensure this matches the frontend's data
  code: { type: String, required: true },
  teacherName: { type: String, required: true },
  enrollmentNo: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, required: true },
}, { collection: 'attendances' });

module.exports = mongoose.model('Attendance', attendanceSchema);