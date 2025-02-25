/**
 * Base64 Encoder/Decoder App
 * A simple web app to encode files to base64 and decode base64 strings back to files
 */

// DOM Elements
const themeToggle = document.getElementById('theme-toggle') as HTMLButtonElement;
const fileDropzone = document.getElementById('file-dropzone') as HTMLDivElement;
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const encodeResult = document.getElementById('encode-result') as HTMLTextAreaElement;
const copyEncodeBtn = document.getElementById('copy-encode') as HTMLButtonElement;
const downloadEncodeBtn = document.getElementById('download-encode') as HTMLButtonElement;
const decodeInput = document.getElementById('decode-input') as HTMLTextAreaElement;
const decodeBtn = document.getElementById('decode-btn') as HTMLButtonElement;
const decodeResult = document.getElementById('decode-result') as HTMLDivElement;
const fileInfo = document.getElementById('file-info') as HTMLDivElement;
const downloadDecodeBtn = document.getElementById('download-decode') as HTMLButtonElement;
const fileTypeContainer = document.getElementById('file-type-container') as HTMLDivElement;
const fileExtensionInput = document.getElementById('file-extension') as HTMLInputElement;

// State variables
let decodedBlob: Blob | null = null;
let decodedFileName = 'decoded-file';
let encodedFileName = '';

// Initialize theme based on user preference
function initTheme(): void {
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
  } else {
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
  }
}

// Toggle theme between light and dark
function toggleTheme(): void {
  if (document.body.hasAttribute('data-theme')) {
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    themeToggle.textContent = '🌙';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    themeToggle.textContent = '☀️';
  }
}

// Encode a file to base64
function encodeFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Extract the base64 data without the prefix
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('Failed to read file as base64'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsDataURL(file);
  });
}

// Decode base64 string to file
function decodeBase64(base64String: string): Blob {
  try {
    // Try to clean up the base64 string by removing any potential prefixes
    const cleaned = base64String.trim().replace(/^data:[^;]+;base64,/, '');
    const binaryString = atob(cleaned);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes]);
  } catch (error) {
    console.error('Error decoding base64:', error);
    throw new Error('Invalid base64 string');
  }
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Copy text to clipboard
async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    showToast('copied to clipboard!');
  } catch (error) {
    console.error('Failed to copy:', error);

    // Fallback method for browsers that don't support clipboard API
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('copied to clipboard!');
  }
}

// Create a download link for encoded or decoded data
function createDownloadLink(data: string | Blob, fileName: string): void {
  const a = document.createElement('a');

  if (typeof data === 'string') {
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(data);
  } else {
    a.href = URL.createObjectURL(data);
  }

  a.download = fileName;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  if (typeof data !== 'string') {
    URL.revokeObjectURL(a.href);
  }
}

// Show a toast notification
function showToast(message: string): void {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Handle file selection for encoding
async function handleFileSelect(file: File): Promise<void> {
  try {
    encodedFileName = file.name;
    showToast(`processing file: ${file.name}`);
    encodeResult.value = 'encoding...';

    const base64String = await encodeFile(file);
    encodeResult.value = base64String;

    showToast('file encoded successfully!');
  } catch (error) {
    console.error('Error encoding file:', error);
    encodeResult.value = 'error encoding file. please try again.';
  }
}

// Handle decoding base64 to file
function handleDecode(): void {
  const base64String = decodeInput.value.trim();

  if (!base64String) {
    showToast('please enter a base64 string');
    return;
  }

  try {
    decodedBlob = decodeBase64(base64String);

    // Show file information
    const size = formatFileSize(decodedBlob.size);
    const type = decodedBlob.type || 'unknown type';

    fileInfo.innerHTML = `
      <p><strong>file size:</strong> ${size}</p>
      <p><strong>file type:</strong> ${type}</p>
    `;

    // Update UI
    decodeResult.innerHTML = '<p>decoding successful! click the download button to save the file.</p>';
    downloadDecodeBtn.style.display = 'inline-block';

    // Show or hide file type input based on whether the type was detected
    if (!decodedBlob.type || decodedBlob.type === 'application/octet-stream') {
      fileTypeContainer.style.display = 'block';
      fileExtensionInput.focus();
    } else {
      fileTypeContainer.style.display = 'none';
    }

    showToast('base64 decoded successfully!');
  } catch (error) {
    console.error('Decoding error:', error);
    decodeResult.innerHTML = '<p>error decoding base64. please check your input and try again.</p>';
    fileInfo.innerHTML = '';
    downloadDecodeBtn.style.display = 'none';
    fileTypeContainer.style.display = 'none';
  }
}

// Event Listeners
window.addEventListener('DOMContentLoaded', () => {
  initTheme();

  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);

  // Dropzone events
  fileDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileDropzone.classList.add('active');
  });

  fileDropzone.addEventListener('dragleave', () => {
    fileDropzone.classList.remove('active');
  });

  fileDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    fileDropzone.classList.remove('active');

    if (e.dataTransfer?.files.length) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  });

  // File input change
  fileInput.addEventListener('change', () => {
    if (fileInput.files?.length) {
      handleFileSelect(fileInput.files[0]);
    }
  });

  // Dropzone click should trigger file input
  fileDropzone.addEventListener('click', (e) => {
    // Check if the click target is the file input itself or its label - if so, don't trigger another click
    const target = e.target as HTMLElement;
    if (target === fileInput ||
      target.tagName === 'LABEL' && target.getAttribute('for') === 'file-input') {
      return;
    }
    fileInput.click();
  });

  // Copy encoded result
  copyEncodeBtn.addEventListener('click', () => {
    if (encodeResult.value) {
      copyToClipboard(encodeResult.value);
    }
  });

  // Download encoded result as text file
  downloadEncodeBtn.addEventListener('click', () => {
    if (encodeResult.value) {
      const fileName = encodedFileName ? `${encodedFileName}.txt` : 'encoded-base64.txt';
      createDownloadLink(encodeResult.value, fileName);
    }
  });

  // Decode button
  decodeBtn.addEventListener('click', () => {
    // Clear any previous file extension input
    fileExtensionInput.value = '';
    handleDecode();
  });

  // Download decoded file
  downloadDecodeBtn.addEventListener('click', () => {
    if (decodedBlob) {
      let fileName = decodedFileName;

      // Check if a file extension was provided by the user
      const userExtension = fileExtensionInput.value.trim();
      if (userExtension) {
        // Clean the extension format (make sure it starts with a dot)
        const cleanExtension = userExtension.startsWith('.')
          ? userExtension
          : '.' + userExtension;

        // Add the extension to the filename
        fileName = fileName + cleanExtension;
      } else if (decodedBlob.type && decodedBlob.type !== 'application/octet-stream') {
        // If no user extension but the blob has a known type, use a default extension based on MIME type
        const mimeToExt: Record<string, string> = {
          'image/jpeg': '.jpg',
          'image/png': '.png',
          'image/gif': '.gif',
          'image/svg+xml': '.svg',
          'application/pdf': '.pdf',
          'text/plain': '.txt',
          'text/html': '.html',
          'text/css': '.css',
          'text/javascript': '.js',
          'application/json': '.json',
          'application/xml': '.xml',
          'application/zip': '.zip',
        };

        const ext = mimeToExt[decodedBlob.type] || '';
        if (ext) {
          fileName = fileName + ext;
        }
      }

      createDownloadLink(decodedBlob, fileName);
    }
  });

  // Initially hide the download button for decoded file
  downloadDecodeBtn.style.display = 'none';
});

// Add toast styles dynamically
const style = document.createElement('style');
style.textContent = `
  .toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background-color: var(--color-surface);
    color: var(--color-text);
    padding: 12px 24px;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
    z-index: 1000;
  }

  .toast.show {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
`;
document.head.appendChild(style);

// Auto-demo function - will add a sample base64 string after 1 second
setTimeout(() => {
  // Show a sample base64 string to decode (this is a tiny text file)
  const sampleBase64 = 'SGVsbG8gV29ybGQhIFRoaXMgaXMgYSB0ZXN0IGZpbGUuDQpUaGFuayB5b3UgZm9yIHVzaW5nIEJhc2U2NCBBbnl0aGluZy4=';
  showToast('💡 tip: try decoding the sample base64 that was just added!');

  if (decodeInput) {
    decodeInput.value = sampleBase64;
  }
}, 1000);
