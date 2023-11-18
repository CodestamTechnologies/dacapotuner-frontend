
export default function downloadBlobAsFile(blob) {
    let timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    let downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = timestamp;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(blob);
  }