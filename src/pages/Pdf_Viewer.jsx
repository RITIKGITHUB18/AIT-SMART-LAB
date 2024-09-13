import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { InfinitySpin } from "react-loader-spinner";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../service/firebaseConfig";
import { useParams } from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const A4_WIDTH = 8.27 * 96;
const A4_HEIGHT = 11.69 * 96;

const Pdf_Viewer = () => {
  const { qrId } = useParams();
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const docRef = doc(db, "smartlabsqr", qrId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPdfUrl(docSnap.data().fileUrl);
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

    if (qrId) {
      fetchPdfUrl();
    }
  }, [qrId]);

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
    <div className="relative max-w-screen-sm flex items-center justify-center overflow-hidden p-4 rounded-[4rem] border-[2px] border-solid border-custom-ylw mx-auto shadow-3xl">
      <div className="max-w-screen-sm mx-auto block border-[5px] border-solid border-custom-ylw rounded-[3rem] bg-custom-bg h-full w-full overflow-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center min-h-[700px]">
            <InfinitySpin
              visible={true}
              width="200"
              color="#FDB623"
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
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                scale={scale}
                className="pdf-page"
              />
            ))}
          </Document>
        )}
      </div>
    </div>
  );
};

export default Pdf_Viewer;
