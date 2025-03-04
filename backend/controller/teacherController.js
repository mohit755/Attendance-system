const Subject = require('../model/Subject.js');
const Attendance = require('../model/Attendance.js');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');

exports.addSubject = async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ msg: 'Unauthorized' });

  const { name, code } = req.body;
  try {
    const existingSubject = await Subject.findOne({ code });
    if (existingSubject) return res.status(400).json({ msg: 'Subject code already exists' });

    const subject = new Subject({
      name,
      code,
      teacher: req.user.id,
    });
    await subject.save();

    const qrData = JSON.stringify({ 
      teacherId: req.user.id, 
      teacherName: req.user.name, // Include the teacher's name
      subjectId: subject._id, 
      code 
    });
    const qrCode = await QRCode.toDataURL(qrData);

    res.json({ subject, qrCode });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getAttendance = async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ msg: 'Unauthorized' });

  try {
    const attendance = await Attendance.find()
      .populate('student', 'username enrollmentNo')
      .populate('subject', 'name code')
      .populate('teacher', 'name') // Include the teacher's name
      .sort({ date: -1 });
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.exportAttendancePDF = async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ msg: 'Unauthorized' });

  try {
    const attendance = await Attendance.find()
      .populate('student', 'username enrollmentNo')
      .populate('subject', 'name code')
      .populate('teacher', 'name'); // Include the teacher's name

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance-report.pdf');
    
    doc.pipe(res);
    
    // Header
    doc.fontSize(20).text('Attendance Report', { align: 'center' });
    doc.moveDown();
    
    // Table headers
    doc.fontSize(12);
    const tableTop = 100;
    doc.text('Student', 50, tableTop);
    doc.text('Subject', 200, tableTop);
    doc.text('Code', 350, tableTop);
    doc.text('Teacher', 450, tableTop); // Add teacher's name column
    doc.text('Date', 550, tableTop);
    doc.moveTo(50, tableTop + 15).lineTo(650, tableTop + 15).stroke();

    // Table rows
    let y = tableTop + 25;
    attendance.forEach(record => {
      doc.text(record.student.username, 50, y);
      doc.text(record.subject.name, 200, y);
      doc.text(record.subject.code, 350, y);
      doc.text(record.teacher.name, 450, y); // Include the teacher's name
      doc.text(new Date(record.date).toLocaleDateString(), 550, y);
      y += 20;
      if (y > 700) {
        doc.addPage();
        y = 50;
      }
    });

    doc.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};