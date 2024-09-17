import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { InfinitySpin } from "react-loader-spinner";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../service/firebaseConfig";
import scan from "../assets/scan.svg";
import { useLocation, useNavigate, useParams } from "react-router-dom";

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
  const [pdfUrl, setPdfUrl] = useState("");
  const [scale, setScale] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const [isPasswordEntered, setIsPasswordEntered] = useState(false);
  const [inputPassword, setInputPassword] = useState("");

  const correctPassword = "lab";

  const handlePasswordSubmit = () => {
    if (inputPassword === correctPassword) {
      setIsPasswordEntered(true);
    } else {
      alert("Incorrect password! Please try again");
    }
  };

  const handleScanClick = () => {
    navigate("/");
  };

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

        console.log("docRef", docRef);

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.pdfUrl) {
            setPdfUrl(data.pdfUrl);
            console.log("Pdf URL", pdfUrl);
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
    <div className="relative max-w-screen-sm min-h-[500px] flex items-center justify-center p-1 rounded-[4rem] border-[2px] border-solid border-custom-green mx-auto">
      <div className="max-w-screen-sm min-h-[500px] mx-auto block border-[4px] border-solid border-custom-green rounded-[4rem] w-full overflow-x-auto p-4">
        {!isPasswordEntered ? (
          <div className="flex flex-col items-center text-custom-green text-xl justify-center ">
            <h2 className="text-xl font-semibold mb-4">
              Enter Password to View PDF
            </h2>
            <input
              type="password"
              placeholder="Enter Password"
              className="border border-gray-300 rounded-xl p-2 mb-4 focus:outline-none focus:ring-2 focus:border-custom-green focus:ring-custom-green"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
            />
            <button
              className="bg-custom-green hover:bg-green-700 text-custom-bg font-semibold py-2 px-4 rounded-xl mb-4"
              onClick={handlePasswordSubmit}
            >
              Submit
            </button>
          </div>
        ) : (
          <>
            {loading ? (
              <div className="flex justify-center items-center min-h-[700px]">
                <InfinitySpin
                  visible={true}
                  width="200"
                  color="#43A047"
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
                      color="#43A047"
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
          </>
        )}

        {location.pathname !== "/" && (
          <div className="flex gap-x-4 text-3xl items-center justify-center cursor-pointer ">
            <img
              src={scan}
              className="w-8 h-10 cursor-pointer"
              alt="QR Scan"
              onClick={handleScanClick}
            />
            <h2
              className="cursor-pointer font-semibold text-custom-green"
              onClick={handleScanClick}
            >
              Scan
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pdf_Viewer;
