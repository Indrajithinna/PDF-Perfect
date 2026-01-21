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
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
