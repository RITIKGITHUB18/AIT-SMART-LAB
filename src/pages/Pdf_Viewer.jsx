import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { InfinitySpin } from "react-loader-spinner";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../service/firebaseConfig";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { scannerLogo } from "../assets";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const A4_WIDTH = 8.27 * 96;
const A4_HEIGHT = 11.69 * 96;

const Pdf_Viewer = () => {
  const { userid, folderName, docId } = useParams();
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [wifiPassword, setWifiPassword] = useState("");
  const [assetPassword, setAssetPassword] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [scale, setScale] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const [isPasswordEntered, setIsPasswordEntered] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Handle password submission
  const handlePasswordSubmit = () => {
    if (inputPassword === assetPassword) {
      setIsPasswordEntered(true);
      setShowPasswordModal(false);
    } else {
      alert("Incorrect password! Please try again");
    }
  };

  const handleScanClick = () => {
    navigate("/");
  };

  // Fetch PDF and passwords from Firebase
  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        let docRef;

        if (folderName) {
          docRef = doc(
            db,
            "smartlabsusers",
            userid,
            "folders",
            folderName,
            "independent_qr_code",
            docId
          );
        } else {
          docRef = doc(
            db,
            "smartlabsusers",
            userid,
            "independent_qr_code",
            docId
          );
        }

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.pdfUrl) {
            setPdfUrl(data.pdfUrl);
            setWifiPassword(data?.wifi_password);
            setAssetPassword(data?.asset_password);
            console.log("Pdf URL", data.pdfUrl);
          } else {
            console.log("PDF URL not found in document!");
            setError(true);
          }
        } else {
          console.log("No such document!");
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching document: ", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (userid && docId) {
      fetchPdfUrl();
    }
  }, [userid, folderName, docId]);

  // Handle screen resize for PDF scaling
  const calculateScale = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const widthRatio = viewportWidth / A4_WIDTH;
    const heightRatio = viewportHeight / A4_HEIGHT;

    return Math.min(widthRatio, heightRatio, 2);
  };

  useEffect(() => {
    const handleResize = () => {
      setScale(calculateScale());
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {wifiPassword ? (
        <div className="mb-4 text-center text-lg font-semibold text-[#EE764D]">
          <h1>Computer/PC Password: {wifiPassword}</h1>
        </div>
      ) : (
        "No password is present"
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4 text-[#EE764D]">
              Enter Password
            </h2>
            <input
              type="password"
              placeholder="Enter Asset Password"
              className="border border-gray-300 rounded-xl p-2 mb-4 focus:outline-none focus:ring-1 ring-[#EE764D] text-[#EE764D]"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
            />
            <div className="flex justify-center gap-4">
              <button
                className="bg-[#EE764D] text-white px-4 py-2 rounded-lg"
                onClick={handlePasswordSubmit}
              >
                Submit
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded-lg"
                onClick={() => setShowPasswordModal(false)} // Close modal
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer */}
      {isPasswordEntered ? ( // Ensure PDF is only shown after password is entered
        <div className="relative max-w-screen-sm min-h-[500px] flex items-center justify-center p-1 rounded-[4rem] border-[2px] border-solid border-[#EE764D] mx-auto">
          <div className="max-w-screen-sm min-h-[500px] mx-auto block border-[4px] border-solid border-[#EE764D] rounded-[4rem] w-full overflow-x-auto p-4">
            {loading ? (
              <div className="flex justify-center items-center min-h-[700px]">
                <InfinitySpin
                  visible={true}
                  width="200"
                  color="#EE764D"
                  ariaLabel="infinity-spin-loading"
                />
              </div>
            ) : error ? (
              <div className="flex justify-center items-center min-h-[400px] text-2xl text-red-500">
                <p>Error loading PDF. Please try again later.</p>
              </div>
            ) : (
              <Document
                file={pdfUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                className="w-full sm:p-4 flex flex-col items-center justify-center"
                loading={
                  <div className="flex justify-center items-center min-h-[700px]">
                    <InfinitySpin
                      visible={true}
                      width="200"
                      color="#EE764D"
                      ariaLabel="infinity-spin-loading"
                    />
                  </div>
                }
                error={
                  <div className="flex justify-center items-center min-h-[400px] text-2xl text-red-500">
                    <p>Error loading PDF. Please try again later.</p>
                  </div>
                }
                noData={
                  <div className="flex justify-center items-center min-h-[400px] text-2xl text-red-500">
                    <p>No PDF data available.</p>
                  </div>
                }
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    scale={scale}
                    className="pdf-page"
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                ))}
              </Document>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-lg text-[#EE764D]">
          Enter password to view the document.
        </p>
      )}

      <div className="flex justify-center mb-4 mt-5 font-semibold">
        <button
          onClick={() => setShowPasswordModal(true)} // Show modal on click
          className="bg-[#EE764D] text-white px-4 py-2 rounded-lg"
        >
          View System Document
        </button>
      </div>

      {location.pathname !== "/" && (
        <div className="flex gap-x-4 text-3xl items-center justify-center cursor-pointer ">
          <img
            src={scannerLogo}
            className="w-8 h-10 cursor-pointer"
            alt="QR Scan"
            onClick={handleScanClick}
          />
          <h2
            className="cursor-pointer font-semibold text-[#EE764D]"
            onClick={handleScanClick}
          >
            Scan
          </h2>
        </div>
      )}
    </>
  );
};

export default Pdf_Viewer;
