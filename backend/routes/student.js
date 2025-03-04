const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const studentController = require('../controller/studentController.js');

router.post('/attendance', auth, studentController.markAttendance);
router.get('/attendance', auth, studentController.getAttendance);

module.exports = router;