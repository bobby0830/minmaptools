import React, { useCallback } from 'react';
import { Panel, useReactFlow } from 'reactflow';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function ExportPanel() {
  const { getNodes, getEdges } = useReactFlow();

  const downloadImage = useCallback(async (type) => {
    const flow = document.querySelector('.react-flow');
    if (!flow) return;

    try {
      // Reset zoom and center the view
      const flowWrapper = document.querySelector('.react-flow__viewport');
      const originalTransform = flowWrapper.style.transform;
      flowWrapper.style.transform = 'translate(0,0) scale(1)';

      const canvas = await html2canvas(flow, {
        backgroundColor: '#ffffff',
        useCORS: true,
        scale: 2, // Higher resolution
      });

      // Restore original transform
      flowWrapper.style.transform = originalTransform;

      if (type === 'png') {
        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'mindmap.png';
        a.click();
        a.remove();
      } else if (type === 'pdf') {
        const width = canvas.width;
        const height = canvas.height;
        const pdf = new jsPDF({
          orientation: width > height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [width, height]
        });
        
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          0,
          width,
          height,
          '',
          'FAST'
        );
        pdf.save('mindmap.pdf');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  }, []);

  return (
    <Panel position="top-right" className="export-panel">
      <div className="export-buttons">
        <button 
          className="action-button export png" 
          onClick={() => downloadImage('png')}
          title="Export as PNG image"
        >
          <span role="img" aria-label="image">🖼️</span> PNG
        </button>
        <button 
          className="action-button export pdf" 
          onClick={() => downloadImage('pdf')}
          title="Export as PDF document"
        >
          <span role="img" aria-label="pdf">📄</span> PDF
        </button>
      </div>
    </Panel>
  );
}

export default ExportPanel;
