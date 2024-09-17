import QrScanner from "../component/QrScanner";

const Home = () => {
  const handleScan = (result) => {
    if (result) {
      console.log("Scanned result:", result);
    }
  };

  const handleError = (error) => {
    console.error("Error with QR Scanner:", error);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-bold text-2xl text-custom-green">SCAN YOU QR</h1>
      <QrScanner onScan={handleScan} onError={handleError} />
    </div>
  );
};

export default Home;
