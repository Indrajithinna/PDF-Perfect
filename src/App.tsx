import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import MergePDF from './pages/MergePDF';
import SplitPDF from './pages/SplitPDF';
import CompressPDF from './pages/CompressPDF';
import ConvertToPDF from './pages/ConvertToPDF';
import PDFToImages from './pages/PDFToImages';
import SignPDF from './pages/SignPDF';
import PasswordProtect from './pages/PasswordProtect';
import WatermarkPDF from './pages/WatermarkPDF';
import PageOrganizer from './pages/PageOrganizer';

const App: React.FC = () => {
    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/merge" element={<MergePDF />} />
                        <Route path="/split" element={<SplitPDF />} />
                        <Route path="/compress" element={<CompressPDF />} />
                        <Route path="/convert" element={<ConvertToPDF />} />
                        <Route path="/pdf-to-images" element={<PDFToImages />} />
                        <Route path="/password-protect" element={<PasswordProtect />} />
                        <Route path="/watermark" element={<WatermarkPDF />} />
                        <Route path="/page-organizer" element={<PageOrganizer />} />
                        <Route path="/sign" element={<SignPDF />} />
                        <Route path="/page-numbers" element={<div>Page Numbers (Coming Soon)</div>} />
                        <Route path="/unlock" element={<div>Unlock PDF (Coming Soon)</div>} />
                        <Route path="/metadata" element={<div>Edit Metadata (Coming Soon)</div>} />
                        <Route path="/flatten" element={<div>Flatten PDF (Coming Soon)</div>} />
                        <Route path="/pdf-to-text" element={<div>PDF to Text (Coming Soon)</div>} />
                        <Route path="/ocr" element={<div>OCR (Coming Soon)</div>} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
