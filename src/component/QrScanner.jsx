import { Scanner } from "@yudiel/react-qr-scanner";
import { useEffect, useRef, useState } from "react";

const QrScanner = ({ onScan, onError }) => {
  const [scannedData, setScannedData] = useState(null);
  const videoRef = useRef(null);
  const customConstraints = {
    video: {
      facingMode: "environment",
    },
  };

  useEffect(() => {
    const videoElement = document.querySelector("video"); // Access the video element directly
    if (videoElement) {
      videoElement.muted = true; // Force mute the video element
    }
  }, []);

  const handleScan = (result) => {
    if (result && result.length > 0) {
      const rawValue = result[0].rawValue;
      console.log(rawValue);
      setScannedData(rawValue);

      if (rawValue) {
        window.open(rawValue, "_blank");
      }
    }
  };

  const shortenUrlDisplay = (url) => {
    const sliceLength = 20;
    if (url.length > sliceLength * 2) {
      return `${url.slice(0, sliceLength)}...${url.slice(-sliceLength)}`;
    }
    return url;
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
            width: window.innerWidth <= 768 ? "90%" : "60%",
            height: window.innerWidth <= 768 ? "90%" : "60%",
          },
          video: {
            objectFit: "cover",
            borderColor: "#43a047",
            borderRadius: window.innerWidth <= 768 ? "20px" : "20px",
            muted: true,
          },
        }}
        videoConstraints={{ muted: true }}
      />

      {scannedData && (
        <div className="flex-col mt-4 items-center justify-center text-#EE764D">
          <p className="font-bold text-2xl">Please Click: </p>
          <div className="overflow-hidden hover:text-[#EE764D] text-xl">
            <a href={scannedData} target="_blank" rel="noopener noreferrer">
              {shortenUrlDisplay(scannedData)}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrScanner;
