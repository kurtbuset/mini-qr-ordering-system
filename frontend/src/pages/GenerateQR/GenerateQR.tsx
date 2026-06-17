import { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import PageMeta from "../../components/common/PageMeta";

export default function GenerateQR() {
  const [url, setUrl] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

  // Get the base URL from environment or current location
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;

  useEffect(() => {
    // Set default URL to products page
    const defaultUrl = `${baseUrl}/products`;
    setUrl(defaultUrl);
    setGeneratedUrl(defaultUrl);
  }, [baseUrl]);

  const handleGenerateQR = () => {
    setGeneratedUrl(url);
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    // Convert SVG to canvas for download
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();

    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      // Download as PNG
      canvas.toBlob((blob) => {
        if (!blob) return;
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "qr-code.png";
        link.click();
        URL.revokeObjectURL(downloadUrl);
      });
    };

    img.src = url;
  };

  const handlePrintQR = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !qrRef.current) return;

    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - Products Menu</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
              font-family: system-ui, -apple-system, sans-serif;
            }
            .container {
              text-align: center;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 10px;
              color: #111827;
            }
            p {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 20px;
            }
            .url {
              font-size: 12px;
              color: #9ca3af;
              margin-top: 20px;
              word-break: break-all;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Scan to View Menu</h1>
            <p>Use your phone camera to scan this QR code</p>
            ${svgData}
            <p class="url">${generatedUrl}</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Auto print after a delay
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const presetUrls = [
    { label: "Products Menu", value: `${baseUrl}/products` },
    { label: "Home Page", value: `${baseUrl}/` },
  ];

  return (
    <>
      <PageMeta
        title="Generate QR Code | Mini QR Ordering System"
        description="Create QR codes for customer access to menu and ordering"
      />
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Generate QR Code
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Create QR codes for your products menu or any custom URL
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column - Configuration */}
        <div className="space-y-6">
          {/* URL Input Card */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-dark dark:border-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Configure QR Code
            </h2>

            {/* Preset URLs */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Quick Select
              </label>
              <div className="flex flex-wrap gap-2">
                {presetUrls.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setUrl(preset.value)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      url === preset.value
                        ? "bg-brand-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom URL Input */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL to encode"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enter any URL you want to encode in the QR code
              </p>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateQR}
              disabled={!url.trim()}
              className="w-full px-4 py-2.5 bg-brand-500 text-white font-semibold rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Generate QR Code
            </button>
          </div>

          {/* Instructions Card */}
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
            <h3 className="flex items-center mb-3 text-sm font-semibold text-blue-900 dark:text-blue-300">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              How to Use
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                <span>Select a preset or enter a custom URL</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                <span>Click "Generate QR Code" to create the code</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                <span>Download or print the QR code for your customers</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">4.</span>
                <span>
                  Customers can scan with their phone camera to access the menu
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column - QR Code Preview */}
        <div className="space-y-6">
          {/* QR Code Display Card */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-dark dark:border-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              QR Code Preview
            </h2>

            {generatedUrl ? (
              <div className="space-y-4">
                {/* QR Code */}
                <div
                  ref={qrRef}
                  className="flex items-center justify-center p-8 bg-white border-2 border-gray-200 border-dashed rounded-lg"
                >
                  <QRCodeSVG
                    value={generatedUrl}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                {/* URL Display */}
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Encoded URL:
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white break-all">
                    {generatedUrl}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleDownloadQR}
                    className="flex items-center justify-center px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download
                  </button>
                  <button
                    onClick={handlePrintQR}
                    className="flex items-center justify-center px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                    Print
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <svg
                  className="w-24 h-24 mb-4 text-gray-300 dark:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No QR Code Generated
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter a URL and click "Generate QR Code" to get started
                </p>
              </div>
            )}
          </div>

          {/* Tips Card */}
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
            <h3 className="flex items-center mb-3 text-sm font-semibold text-green-900 dark:text-green-300">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              Tips
            </h3>
            <ul className="space-y-2 text-sm text-green-800 dark:text-green-300">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Print QR codes at 300 DPI for best quality</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Place QR codes on tables, menus, or at the entrance</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Test the QR code before printing in bulk</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Keep QR codes at least 1 inch (2.5cm) in size</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
