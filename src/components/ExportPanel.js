import React from 'react';
import styled from '@emotion/styled';

const ExportContainer = styled.div`
  position: absolute;
  right: 20px;
  top: 80px;
  z-index: 5;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ExportButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #4a90e2;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background 0.2s;
  width: 100%;

  &:hover {
    background: #357abd;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ExportPanel = ({ reactFlowInstance }) => {
  const exportToPdf = async () => {
    if (!reactFlowInstance) return;

    const flowWrapper = document.querySelector('.react-flow__viewport');
    if (!flowWrapper) return;

    try {
      // Get the current transform values
      const transform = flowWrapper.style.transform;
      const originalTransform = flowWrapper.style.transform;
      
      // Reset transform for proper capture
      flowWrapper.style.transform = 'translate(0,0) scale(1)';
      
      // Dynamically import html2canvas and jsPDF when needed
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      const canvas = await html2canvas(flowWrapper, {
        backgroundColor: '#ffffff',
      });

      // Restore original transform
      flowWrapper.style.transform = originalTransform;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('mindmap.pdf');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
    }
  };

  const exportToPng = async () => {
    if (!reactFlowInstance) return;

    const flowWrapper = document.querySelector('.react-flow__viewport');
    if (!flowWrapper) return;

    try {
      // Get the current transform values
      const transform = flowWrapper.style.transform;
      const originalTransform = flowWrapper.style.transform;
      
      // Reset transform for proper capture
      flowWrapper.style.transform = 'translate(0,0) scale(1)';
      
      // Dynamically import html2canvas when needed
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(flowWrapper, {
        backgroundColor: '#ffffff',
      });

      // Restore original transform
      flowWrapper.style.transform = originalTransform;

      // Create download link
      const link = document.createElement('a');
      link.download = 'mindmap.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error exporting to PNG:', error);
    }
  };

  return (
    <ExportContainer>
      <ExportButton onClick={exportToPdf} title="Export as PDF">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/>
        </svg>
        PDF
      </ExportButton>
      <ExportButton onClick={exportToPng} title="Export as PNG">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
        PNG
      </ExportButton>
    </ExportContainer>
  );
};

export default ExportPanel;
