import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCamera } from 'react-icons/fa'; // Webcam icon
import jsQR from 'jsqr';

const StudentPanel = () => {
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scannedData, setScannedData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const webcamRef = useRef(null);

  // Request Camera Permission
  const requestCameraPermission = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        setCameraPermission(true);
        setIsScanning(true);
      })
      .catch((err) => {
        console.error('Camera Permission Denied:', err);
        alert('Camera permission is required to scan QR codes.');
      });
  };

  // Handle QR Code Scan
  const handleScan = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;
          const context = canvas.getContext('2d');
          context.drawImage(image, 0, 0, image.width, image.height);
          const imageData = context.getImageData(0, 0, image.width, image.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            try {
              const parsedData = JSON.parse(code.data);
              setScannedData(parsedData);
              setIsScanning(false);
            } catch (error) {
              console.error('Invalid QR Code:', error);
            }
          }
        };
      }
    }
  };

  // Automatically scan for QR codes every 500ms
  useEffect(() => {
    let interval;
    if (isScanning) {
      interval = setInterval(handleScan, 500);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  // Mark Attendance
  const markAttendance = async () => {
    if (scannedData) {
      const newAttendance = {
        date: new Date(scannedData.date).toISOString(), // Use ISO string for consistency
        subject: scannedData.subject,
        code: scannedData.code,
        teacherName: scannedData.teacherName,
        enrollmentNo: '12345', // Replace with actual enrollment number
        status: 'Present',
      };
  
      try {
        // Send a POST request to the backend
        const response = await fetch('/api/attendance/mark', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAttendance),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Attendance saved:', data);
          setAttendance([...attendance, newAttendance]); // Update local state
          setScannedData(null); // Clear scanned data
        } else {
          console.error('Failed to save attendance:', response.statusText);
        }
      } catch (error) {
        console.error('Error saving attendance:', error);
      }
    }
  };
  // View Attendance by Date
  const viewAttendanceByDate = () => {
    const filtered = attendance.filter(
      (record) => record.date === selectedDate.toLocaleDateString()
    );
    console.log(filtered);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8 space-y-6">
        {/* Header */}
        <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          Student Dashboard
        </h2>

        {/* Scan QR Code Button */}
        <div className="flex justify-center">
          <button
            onClick={requestCameraPermission}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
          >
            <FaCamera /> Scan QR Code
          </button>
        </div>

        {/* Webcam Section */}
        {isScanning && (
          <div className="relative bg-gray-100 rounded-lg p-4 shadow-inner">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="100%"
              height="auto"
              videoConstraints={{ facingMode: 'environment' }}
              className="rounded-lg"
            />
            <div className="absolute top-4 right-4 text-indigo-600">
              <FaCamera size={28} />
            </div>
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
              Point your camera at the QR code
            </div>
          </div>
        )}

        {/* Scanned Data */}
        {scannedData && (
          <div className="bg-gradient-to-r from-green-100 to-teal-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-green-700">Scanned Details</h3>
            <div className="mt-2 space-y-1 text-gray-700">
              <p><span className="font-medium">Subject:</span> {scannedData.subject}</p>
              <p><span className="font-medium">Code:</span> {scannedData.code}</p>
              <p><span className="font-medium">Teacher:</span> {scannedData.teacherName}</p>
              <p><span className="font-medium">Date:</span> {new Date(scannedData.date).toLocaleDateString()}</p>
            </div>
            <button
              onClick={markAttendance}
              className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all duration-300"
            >
              Mark Attendance
            </button>
          </div>
        )}

        {/* Date Picker and View Attendance */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">View Attendance</h3>
          <div className="flex items-center gap-4">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={viewAttendanceByDate}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300"
            >
              View
            </button>
          </div>
        </div>

        {/* Attendance Records */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Attendance History</h3>
          {attendance.length > 0 ? (
            <ul className="space-y-3">
              {attendance.map((record, index) => (
                <li
                  key={index}
                  className="p-4 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg shadow-sm text-gray-700"
                >
                  {record.date} - {record.subject} - {record.code} - {record.teacherName} -{' '}
                  <span className="font-semibold text-green-600">{record.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">No records yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPanel;