# PDF Perfect

![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel&style=for-the-badge)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-purple?logo=pwa&style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**A professional, privacy-first PDF manipulation suite running entirely in your browser.**

[**View Live Demo**](https://pdf-perfect.vercel.app/)

---

## 🧐 The Problem
Traditional online PDF tools operate on a **Server-Side** model. When you merge or compress a PDF, you are forced to upload your sensitive files (bank statements, legal contracts, medical records) to a remote server. This creates significant security and privacy risks:
- ❌ **Data Exposure:** Your files leave your device.
- ❌ **Latency:** Large files take time to upload and download.
- ❌ **Reliability:** Requires a stable internet connection.

## 🛡️ The Solution: Zero-Knowledge Architecture
**PDF Perfect** fundamentally shifts this paradigm by moving the computational workload from the server to the **Client (Browser)**. By leveraging modern Web APIs and WebAssembly (WASM), all PDF operations—merging, splitting, compressing, and even OCR—occur locally on your device.

Your files **never** leave your computer.

### Architecture Comparison

```mermaid
graph TD
    subgraph "Legacy PDF Tools"
    User1[User Device] -->|Upload File ⚠️| Server[Remote Server]
    Server -->|Process File| Server
    Server -->|Download File| User1
    end

    subgraph "PDF Perfect"
    User2[User Device] <-->|⚡ Process Locally| Browser[Browser Engine (WASM)]
    User2 -.->|No Network Request| Cloud[Cloud Server]
    end
```

## ✨ Key Features

- **🔒 Privacy First & Zero-Knowledge**
  Built on a "Local-First" philosophy. Since no files are uploaded, we cannot see, store, or share your data. It is physically impossible for us to leak your documents.

- **⚡ Zero Latency Performance**
   Eliminates the "Upload → Process → Download" round trip. Modifications happen instantly, leveraging your device's multi-core processor for operations like OCR and image compression.

- **📱 Progressive Web App (PWA)**
  Install PDF Perfect as a native application on Windows, macOS, iOS, and Android. It feels and performs like a native desktop app.

- **🛠 Offline Capable**
  Thanks to Service Workers and intelligent caching, PDF Perfect works simply without an internet connection. Perfect for working on the go or in air-gapped environments.

- **📂 Comprehensive Suite**
  - **Organization:** Merge, Split, Rotate, Remove Pages, Sort.
  - **Optimization:** Compress PDF, Convert to Images.
  - **Security:** Password Protect, Unlock, Add Watermarks.
  - **Advanced:** OCR (Optical Character Recognition), PDF to Text, Metadata Editing.

## 💻 Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **PDF Core:** `pdf-lib` (Document modification), `pdf.js` (Rendering & Text)
- **OCR Engine:** `tesseract.js` (WASM-based local OCR)
- **UI/UX:** Tailwind CSS, Lucide React, Framer Motion
- **PWA:** Vite PWA Plugin

## 🚀 Local Development

To run PDF Perfect locally for development or contribution:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Indrajithinna/PDF-Perfect.git
   cd PDF-Perfect
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:5173`

---

*Engineered with precision. Built for privacy.*
