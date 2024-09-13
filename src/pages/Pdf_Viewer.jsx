// import { useState, useEffect } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css"; // For annotations (optional)
// import "react-pdf/dist/esm/Page/TextLayer.css";
// import { InfinitySpin } from "react-loader-spinner";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../service/firebaseConfig";
// import { useParams } from "react-router-dom";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.mjs",
//   import.meta.url
// ).toString();

// const Pdf_Viewer = () => {
//   const { qrId } = useParams();
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState("");
//   const [scale, setScale] = useState(1);

//   useEffect(() => {
//     const fetchPdfUrl = async () => {
//       try {
//         const docRef = doc(db, "smartlabsqr", qrId);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           setPdfUrl(docSnap.data().fileUrl);
//         } else {
//           console.log("No such document!");
//           setError(true);
//         }
//       } catch (err) {
//         console.error("Error fetching document: ", err);
//         setError(true);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (qrId) {
//       fetchPdfUrl();
//     }
//   }, [qrId]);

//   useEffect(() => {
//     const handleResize = () => {
//       const containerWidth = window.innerWidth;
//       setScale(containerWidth > 1000 ? 1.5 : 1);
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   const goToPrevPage = () => {
//     setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
//   };

//   const goToNextPage = () => {
//     setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages));
//   };

//   return (
//     <div className="relative pdf-viewer-container">
//       <div className="pdf-viewer" style={{ width: "100%", height: "100%" }}>
//         {loading ? (
//           <div className="flex justify-center items-center min-h-[700px]">
//             <InfinitySpin
//               visible={true}
//               width="200"
//               color="#FDB623"
//               ariaLabel="infinity-spin-loading"
//             />
//           </div>
//         ) : error ? (
//           <div className="flex justify-center items-center min-h-[400px] text-2xl text-red-500">
//             <p>Error loading PDF. Please try again later.</p>
//           </div>
//         ) : (
//           <Document
//             file={pdfUrl}
//             onLoadSuccess={() => onDocumentLoadSuccess}
//             className="w-full"
//             options={{ scale }}
//           >
//             <Page pageNumber={pageNumber} scale={scale} />
//           </Document>
//         )}
//         {!loading && !error && numPages && (
//           <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center pdf-navigation">
//             <button
//               className="px-4 py-2 rounded hover:scale-110 bg-blue-500 text-white cursor-pointer"
//               onClick={() => goToPrevPage}
//               disabled={pageNumber <= 1}
//             >
//               Prev
//             </button>
//             <span className="mx-4">
//               Page {pageNumber} of {numPages}
//             </span>
//             <button
//               className="px-4 py-2 rounded hover:scale-110 bg-blue-500 text-white"
//               onClick={() => goToNextPage}
//               disabled={pageNumber >= numPages}
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Pdf_Viewer;

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

    // Choose the larger scale factor to make sure the PDF fits the screen width
    return Math.min(widthRatio, heightRatio, 2); // Cap the scale to a maximum of 2x
  };

  useEffect(() => {
    const handleResize = () => {
      setScale(calculateScale());
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial scale calculation

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative pdf-viewer-container">
      <div className="max-w-screen-lg pdf-viewer">
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
            className="pdf-document"
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
