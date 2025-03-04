const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], required: true },
  enrollmentNo: { type: String, required: function() { return this.role === 'student'; } },
  teacherName: { type: String, required: function() { return this.role === 'teacher'; } },
});

module.exports = mongoose.model('User', userSchema);