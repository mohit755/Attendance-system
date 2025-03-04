// src/components/QRScanner.jsx
import  { useState } from 'react';
import PropTypes from 'prop-types';
import {QrReader} from 'react-qr-reader';

const QRScanner = ({ onScan }) => {
  const [result, setResult] = useState('');

  const handleScan = (data) => {
    if (data) {
      setResult(data);
      onScan(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div className='flex flex-col items-center mb-5'>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '50%' }}
      />
      <p>Scanned Data: {result}</p>
    </div>
  );
};
QRScanner.propTypes = {
  onScan: PropTypes.func.isRequired,
};

export default QRScanner;
