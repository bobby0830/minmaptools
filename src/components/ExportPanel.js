import React from 'react';
import { toPng } from 'html-to-image';

const ExportPanel = () => {
  // 導出為圖片
  const exportImage = () => {
    const flowElement = document.querySelector('.react-flow');
    if (flowElement) {
      toPng(flowElement, {
        backgroundColor: '#ffffff',
        quality: 1,
      })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'flowchart.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => {
          console.error('Error exporting image:', error);
          alert('無法導出圖片，請稍後再試。');
        });
    }
  };

  return (
    <button onClick={exportImage} className="export-btn" title="導出為圖片">
      🖼️ 導出圖片
    </button>
  );
};

export default ExportPanel;
