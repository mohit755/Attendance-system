const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const teacherController = require('../controller/teacherController.js');

router.post('/subject', auth, teacherController.addSubject);
router.get('/attendance', auth, teacherController.getAttendance);
router.get('/attendance/export', auth, teacherController.exportAttendancePDF);

module.exports = router;