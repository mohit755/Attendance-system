import { useState } from 'react';
import QRCode from 'react-qr-code';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import QRScanner from './QRScanner';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

const TeacherPanel = () => {
  const [subject, setSubject] = useState('');
  const [code, setCode] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [scannedData, setScannedData] = useState(null);
  const [filteredAttendance, setFilteredAttendance] = useState([]);

  const generateQR = () => {
    const value = JSON.stringify({
      subject,
      code,
      teacherName: 'John Doe',
      date: selectedDate.toISOString(),
    });
    setQrValue(value);
  };

  const handleScan = (data) => {
    const parsedData = JSON.parse(data);
    setScannedData(parsedData);
  };

  const markAttendance = () => {
    if (scannedData) {
      const newAttendance = {
        date: new Date(scannedData.date).toLocaleDateString(),
        subject: scannedData.subject,
        code: scannedData.code,
        teacherName: scannedData.teacherName,
        enrollmentNo: '12345',
        status: 'Present',
      };
      setAttendance([...attendance, newAttendance]);
      setScannedData(null);
    }
  };

  const viewAttendanceByEnrollment = () => {
    const filtered = attendance.filter(
      (record) => record.enrollmentNo === enrollmentNo
    );
    setFilteredAttendance(filtered);
  };

  const filterAttendanceByDate = () => {
    const filtered = attendance.filter(
      (record) => record.date === selectedDate.toLocaleDateString()
    );
    setFilteredAttendance(filtered);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(attendance);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, 'attendance.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Attendance Records', 10, 10);
    attendance.forEach((record, index) => {
      doc.text(
        `${record.date} - ${record.subject} - ${record.code} - ${record.teacherName} - ${record.enrollmentNo} - ${record.status}`,
        10,
        20 + index * 10
      );
    });
    doc.save('attendance.pdf');
  };

  return (
    <div className="flex-grow flex-col p-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold text-white text-center mb-6">Teacher Dashboard</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-white mb-2">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-white mb-2">Code</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-white mb-2">Select Date</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <button onClick={generateQR} className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200">
        Generate QR Code
      </button>
      {qrValue && (
        <div className="mt-4 flex justify-center">
          <QRCode value={qrValue} />
        </div>
      )}
      <div className="mt-6">
        <h3 className="text-2xl font-bold text-white mb-4">Scan QR Code</h3>
        <QRScanner onScan={handleScan} />
        {scannedData && (
          <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white shadow-md">
            <h4 className="text-lg font-bold">Scanned Data</h4>
            <p>Subject: {scannedData.subject}</p>
            <p>Code: {scannedData.code}</p>
            <p>Teacher Name: {scannedData.teacherName}</p>
            <button onClick={markAttendance} className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition duration-200 mt-2">
              Mark Attendance
            </button>
          </div>
        )}
      </div>
      <div className="mt-6">
        <h3 className="text-2xl font-bold text-white mb-4">View Attendance by Enrollment No.</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2">Enrollment No.</label>
          <input
            type="text"
            value={enrollmentNo}
            onChange={(e) => setEnrollmentNo(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button onClick={viewAttendanceByEnrollment} className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition duration-200">
          View Attendance
        </button>
      </div>
      <div className="mt-6">
        <h3 className="text-2xl font-bold text-white mb-4">Filter Attendance by Date</h3>
        <button onClick={filterAttendanceByDate} className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition duration-200">
          Filter by Date
        </button>
      </div>
      <div className="mt-6">
        <h3 className="text-2xl font-bold text-white mb-4">Attendance Records</h3>
        <ul className="bg-white rounded-lg shadow-md p-4">
          {filteredAttendance.map((record, index) => (
            <li key={index} className="mt-2">
              {record.date} - {record.subject} - {record.code} - {record.teacherName} - {record.enrollmentNo} - {record.status}
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <button onClick={exportToExcel} className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200">
            Export to Excel
          </button>
          <button onClick={exportToPDF} className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition duration-200 ml-4">
            Export to PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherPanel;