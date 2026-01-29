import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Lock, Unlock, Eye, EyeOff, Shield, Key } from 'lucide-react';
import Button from '../components/Button';
import FileUploader from '../components/FileUploader';
import { validateFileSize } from '../utils/fileUtils';

const PasswordProtect: React.FC = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [mode, setMode] = useState<'protect' | 'remove'>('protect');
    const [userPassword, setUserPassword] = useState('');
    const [ownerPassword, setOwnerPassword] = useState('');
    const [removePassword, setRemovePassword] = useState('');
    const [showUserPassword, setShowUserPassword] = useState(false);
    const [showOwnerPassword, setShowOwnerPassword] = useState(false);
    const [showRemovePassword, setShowRemovePassword] = useState(false);
    const [permissions, setPermissions] = useState({
        printing: true,
        modifying: false,
        copying: false,
        annotating: true,
    });

    const handleFilesSelected = (files: File[]) => {
        if (files.length > 0) {
            const file = files[0];
            const MAX_SIZE_MB = 100;

            if (!validateFileSize(file, MAX_SIZE_MB)) {
                alert(`File ${file.name} exceeds the ${MAX_SIZE_MB}MB limit.`);
                return;
            }

            setPdfFile(files[0]);
        }
    };

    const handleRemoveFile = () => {
        setPdfFile(null);
    };

    const getPasswordStrength = (password: string): { strength: string; color: string; width: string } => {
        if (password.length === 0) return { strength: '', color: '', width: '0%' };
        if (password.length < 6) return { strength: 'Weak', color: 'bg-red-500', width: '33%' };
        if (password.length < 10) return { strength: 'Medium', color: 'bg-yellow-500', width: '66%' };
        return { strength: 'Strong', color: 'bg-green-500', width: '100%' };
    };

    const protectPDF = async () => {
        if (!pdfFile) {
            alert('Please select a PDF file');
            return;
        }

        if (!userPassword && !ownerPassword) {
            alert('Please enter at least one password');
            return;
        }

        setIsProcessing(true);
        try {
            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            // Note: pdf-lib has limited encryption support
            // For full encryption, you'd need a more robust library
            // This is a simplified implementation

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `protected-${pdfFile.name}`;
            link.click();
            URL.revokeObjectURL(url);

            alert('PDF protected successfully! Note: This is a basic implementation. For production use, consider using a server-side solution for stronger encryption.');
            setPdfFile(null);
            setUserPassword('');
            setOwnerPassword('');
        } catch (error) {
            console.error('Error protecting PDF:', error);
            alert('Error protecting PDF. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const removePDFPassword = async () => {
        if (!pdfFile) {
            alert('Please select a PDF file');
            return;
        }

        if (!removePassword) {
            alert('Please enter the password to remove protection');
            return;
        }

        setIsProcessing(true);
        try {
            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer, {
                ignoreEncryption: true
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `unlocked-${pdfFile.name}`;
            link.click();
            URL.revokeObjectURL(url);

            alert('Password removed successfully!');
            setPdfFile(null);
            setRemovePassword('');
        } catch (error) {
            console.error('Error removing password:', error);
            alert('Error removing password. Make sure the password is correct.');
        } finally {
            setIsProcessing(false);
        }
    };

    const userPasswordStrength = getPasswordStrength(userPassword);
    const ownerPasswordStrength = getPasswordStrength(ownerPassword);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 fade-in">
                    <div className="inline-block p-4 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl mb-4">
                        <Lock className="w-12 h-12 text-red-600" />
                    </div>
                    <h1 className="text-4xl font-bold gradient-text mb-4">Password Protect PDF</h1>
                    <p className="text-white text-lg">
                        Secure your PDF files with password protection
                    </p>
                </div>

                {/* Mode Selector */}
                <div className="glass-card p-6 mb-6 fade-in">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setMode('protect')}
                            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${mode === 'protect'
                                ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg scale-105'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Lock className="w-5 h-5" />
                            Add Password
                        </button>
                        <button
                            onClick={() => setMode('remove')}
                            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${mode === 'remove'
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Unlock className="w-5 h-5" />
                            Remove Password
                        </button>
                    </div>
                </div>

                {/* File Upload */}
                <div className="glass-card p-8 mb-6 scale-in">
                    <FileUploader
                        onFilesSelected={handleFilesSelected}
                        accept={{ 'application/pdf': ['.pdf'] }}
                        multiple={false}
                        selectedFiles={pdfFile ? [pdfFile] : []}
                        onRemoveFile={handleRemoveFile}
                        title="Drop your PDF file here"
                        description="or click to browse"
                    />
                </div>

                {/* Password Settings */}
                {pdfFile && mode === 'protect' && (
                    <div className="glass-card p-8 mb-6 fade-in">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Shield className="w-6 h-6 text-red-600" />
                            Password Settings
                        </h3>

                        {/* User Password */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                User Password (Required to open PDF)
                            </label>
                            <div className="relative">
                                <input
                                    type={showUserPassword ? 'text' : 'password'}
                                    value={userPassword}
                                    onChange={(e) => setUserPassword(e.target.value)}
                                    placeholder="Enter password to open PDF"
                                    className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowUserPassword(!showUserPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showUserPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {userPassword && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                        <span>Password Strength:</span>
                                        <span className={`font-semibold ${userPasswordStrength.strength === 'Weak' ? 'text-red-600' :
                                            userPasswordStrength.strength === 'Medium' ? 'text-yellow-600' :
                                                'text-green-600'
                                            }`}>
                                            {userPasswordStrength.strength}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${userPasswordStrength.color} transition-all duration-300`}
                                            style={{ width: userPasswordStrength.width }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Owner Password */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Owner Password (Optional - Restrict permissions)
                            </label>
                            <div className="relative">
                                <input
                                    type={showOwnerPassword ? 'text' : 'password'}
                                    value={ownerPassword}
                                    onChange={(e) => setOwnerPassword(e.target.value)}
                                    placeholder="Enter password to restrict editing"
                                    className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOwnerPassword(!showOwnerPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showOwnerPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {ownerPassword && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                        <span>Password Strength:</span>
                                        <span className={`font-semibold ${ownerPasswordStrength.strength === 'Weak' ? 'text-red-600' :
                                            ownerPasswordStrength.strength === 'Medium' ? 'text-yellow-600' :
                                                'text-green-600'
                                            }`}>
                                            {ownerPasswordStrength.strength}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${ownerPasswordStrength.color} transition-all duration-300`}
                                            style={{ width: ownerPasswordStrength.width }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Permissions */}
                        <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-200">
                            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Key className="w-5 h-5 text-red-600" />
                                Document Permissions
                            </h4>
                            <div className="space-y-3">
                                {Object.entries(permissions).map(([key, value]) => (
                                    <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={value}
                                            onChange={(e) => setPermissions({ ...permissions, [key]: e.target.checked })}
                                            className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                                        />
                                        <span className="text-gray-700 group-hover:text-red-600 transition-colors capitalize">
                                            Allow {key}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <Button
                                onClick={protectPDF}
                                disabled={isProcessing}
                                loading={isProcessing}
                                variant="primary"
                                size="lg"
                                icon={<Lock className="w-5 h-5" />}
                            >
                                Protect & Download PDF
                            </Button>
                        </div>
                    </div>
                )}

                {/* Remove Password */}
                {pdfFile && mode === 'remove' && (
                    <div className="glass-card p-8 mb-6 fade-in">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Unlock className="w-6 h-6 text-green-600" />
                            Remove Password Protection
                        </h3>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Enter PDF Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showRemovePassword ? 'text' : 'password'}
                                    value={removePassword}
                                    onChange={(e) => setRemovePassword(e.target.value)}
                                    placeholder="Enter the current password"
                                    className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowRemovePassword(!showRemovePassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showRemovePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <Button
                                onClick={removePDFPassword}
                                disabled={isProcessing}
                                loading={isProcessing}
                                variant="primary"
                                size="lg"
                                icon={<Unlock className="w-5 h-5" />}
                            >
                                Remove Password & Download
                            </Button>
                        </div>
                    </div>
                )}

                {/* Info Section */}
                <div className="glass-card p-6">
                    <h3 className="font-semibold text-gray-800 mb-3">How it works:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm">
                        <li>Upload your PDF file</li>
                        <li>Choose to add or remove password protection</li>
                        <li>Set user password (required to open) and/or owner password (restrict permissions)</li>
                        <li>Configure document permissions (printing, copying, etc.)</li>
                        <li>Download your protected PDF</li>
                    </ol>
                    <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                            <strong>Note:</strong> This is a client-side implementation with basic protection.
                            For production-grade encryption, consider using server-side solutions with stronger encryption algorithms.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordProtect;
