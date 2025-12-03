# Privacy Blur

A React application for detecting and blurring faces in images using Google Cloud Vision API.

![Privacy Blur](https://via.placeholder.com/800x400?text=Privacy+Blur+Demo)

## Features

- 📤 **Drag & Drop Upload** - Upload images via drag & drop or file picker
- 🔍 **Face Detection** - Automatic face detection using Google Cloud Vision API
- 🌫️ **Smart Blurring** - Apply elliptical blur effect to detected faces
- 📊 **Before/After Comparison** - View original and processed images side by side
- 💾 **Download** - Download the processed image with blurred faces
- 🎨 **Modern UI** - Clean, dark-themed interface with smooth animations

## Tech Stack

- **React 18** - UI framework with hooks
- **Vite** - Build tool and dev server
- **Tailwind CSS 3** - Utility-first CSS framework
- **Google Cloud Vision API** - Face detection
- **Canvas API** - Client-side image processing


## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Cloud Platform account
- Cloud Vision API enabled
- API key with Vision API access

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd privacy-blur-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Google Cloud API key:
   ```
   VITE_GOOGLE_CLOUD_API_KEY=your_actual_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   
   Visit `http://localhost:5173` in your browser

## Getting a Google Cloud API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the [Cloud Vision API](https://console.cloud.google.com/apis/library/vision.googleapis.com)
4. Go to [Credentials](https://console.cloud.google.com/apis/credentials)
5. Click "Create Credentials" → "API Key"
6. (Recommended) Restrict the API key to Cloud Vision API only
7. Copy the API key to your `.env` file

## Usage

1. **Upload an Image**
   - Drag and drop an image onto the upload zone, or
   - Click to browse and select a file
   - Supported formats: JPG, PNG (max 10MB)

2. **Detect and Blur Faces**
   - Click the "Detect and Blur Faces" button
   - Wait for processing (typically 1-3 seconds)

3. **Review Results**
   - View the number of detected faces
   - Compare original and blurred images
   - Toggle between split, original, and processed views

4. **Download**
   - Click "Download Image" to save the processed image
   - The file is saved as a PNG with transparency preserved

## Project Structure

```
privacy-blur-fe/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── FileUpload.jsx      # Drag & drop file upload
│   │   ├── ImagePreview.jsx    # Image preview with file info
│   │   ├── ProcessButton.jsx   # Detection trigger button
│   │   ├── ResultDisplay.jsx   # Before/after comparison
│   │   └── ErrorMessage.jsx    # Error display component
│   ├── services/
│   │   └── visionApi.js        # Google Cloud Vision API integration
│   ├── utils/
│   │   └── imageBlur.js        # Canvas-based blur utility
│   ├── App.jsx                 # Main application component
│   ├── index.css               # Global styles with Tailwind
│   └── main.jsx                # Application entry point
├── .env.example                # Environment variables template
├── index.html                  # HTML template
├── package.json
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js
└── vite.config.js
```

## API Security Notes

- The API key is exposed in client-side code
- For production, consider:
  - Restricting API key to specific domains
  - Using a backend proxy to hide the API key
  - Setting up billing alerts in Google Cloud
  - Implementing rate limiting

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
