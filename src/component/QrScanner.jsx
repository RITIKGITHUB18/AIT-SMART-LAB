import { Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";

const QrScanner = ({ onScan, onError }) => {
  const [scannedData, setScannedData] = useState(null);
  const customConstraints = {
    video: {
      facingMode: "environment",
    },
  };

  const handleScan = (result) => {
    if (result && result.length > 0) {
      const rawValue = result[0].rawValue;
      console.log(rawValue);
      setScannedData(rawValue);
    }
  };

  return (
    <div className="qr-scanner-container flex-col">
      <Scanner
        onScan={handleScan}
        onError={onError}
        constraints={customConstraints}
        formats={["qr_code", "code_128"]}
        scanDelay={500}
        styles={{
          container: {
            width: window.innerWidth <= 768 ? "80%" : "50%",
            height: window.innerWidth <= 768 ? "80%" : "50%", // Adjust height based on screen width
          },
          video: {
            objectFit: "cover",
            borderColor: "#fdb623",
            borderRadius: window.innerWidth <= 768 ? "20px" : "20px", // Adjust border-radius for mobile
          },
        }}
      />

      {scannedData && (
        <div className="flex-col mt-4 items-center justify-center text-custom-ylw">
          <p className="font-bold text-xl">Please Click: </p>
          <div className="overflow-hidden hover:text-yellow-800">
            <a href={scannedData} target="_blank" rel="noopener noreferrer">
              {scannedData}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrScanner;
