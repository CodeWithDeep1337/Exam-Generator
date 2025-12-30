// PDF Generation utilities for downloading content as PDF
import { jsPDF } from 'jspdf';

/**
 * Generate and download PDF from HTML content
 * @param {string} htmlContent - HTML content to convert to PDF
 * @param {string} fileName - Name of the PDF file (without extension)
 * @param {object} options - Additional PDF options
 */
export const generatePdfFromHtml = (htmlContent, fileName = 'document', options = {}) => {
  try {
    const {
      orientation = 'portrait',
      format = 'a4',
      fontSize = 10,
      margin = 10,
    } = options;

    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const marginLeft = margin;
    const marginTop = margin;
    const marginRight = margin;
    const pageMargin = margin;

    // Create a temporary div to render HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.padding = `${margin}mm`;
    tempDiv.style.width = `${pageWidth - marginLeft - marginRight}mm`;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);

    // Use html2canvas and jsPDF to convert HTML to PDF
    pdf.html(tempDiv, {
      x: marginLeft,
      y: marginTop,
      width: pageWidth - marginLeft - marginRight,
      windowHeight: tempDiv.scrollHeight,
      callback: (instance) => {
        document.body.removeChild(tempDiv);
        instance.save(`${fileName}.pdf`);
        console.log(`[PDF] Generated and downloaded: ${fileName}.pdf`);
      },
    });
  } catch (error) {
    console.error('[PDF ERROR] Failed to generate PDF:', error.message);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

/**
 * Generate PDF from text content
 * @param {string} textContent - Plain text content
 * @param {string} title - Title for the document
 * @param {string} fileName - Name of the PDF file
 */
export const generatePdfFromText = (textContent, title = '', fileName = 'document') => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const lineHeight = 7;
    const maxWidth = pageWidth - 2 * margin;

    let yPosition = margin;

    // Add title if provided
    if (title) {
      pdf.setFontSize(16);
      pdf.text(title, margin, yPosition);
      yPosition += lineHeight + 5;
    }

    // Add content
    pdf.setFontSize(11);
    const lines = pdf.splitTextToSize(textContent, maxWidth);

    lines.forEach((line) => {
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
    });

    pdf.save(`${fileName}.pdf`);
    console.log(`[PDF] Generated and downloaded: ${fileName}.pdf`);
  } catch (error) {
    console.error('[PDF ERROR] Failed to generate PDF from text:', error.message);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

/**
 * Download existing file as PDF
 * Uses the existing file download mechanism
 * @param {string} fileUrl - URL of the file to download
 * @param {string} fileName - Name for the downloaded file
 */
export const downloadFileAsPdf = async (fileUrl, fileName = 'document') => {
  try {
    const token = localStorage.getItem('authToken');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(fileUrl, {
      headers,
      mode: 'cors',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const blob = await response.blob();

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log(`[PDF] File downloaded as: ${fileName}.pdf`);
  } catch (error) {
    console.error('[PDF ERROR] Failed to download file as PDF:', error.message);
    throw new Error(`Failed to download PDF: ${error.message}`);
  }
};

/**
 * Convert course/subject/topic content to PDF
 * @param {object} content - Content object with structure like { title, description, items }
 * @param {string} fileName - Name of the PDF file
 */
export const generateCourseContentPdf = (content, fileName = 'course_material') => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const lineHeight = 7;
    const maxWidth = pageWidth - 2 * margin;

    let yPosition = margin;

    // Title
    if (content.title) {
      pdf.setFontSize(18);
      pdf.setFont(undefined, 'bold');
      const titleLines = pdf.splitTextToSize(content.title, maxWidth);
      titleLines.forEach((line) => {
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      yPosition += 5;
    }

    // Description
    if (content.description) {
      pdf.setFontSize(11);
      pdf.setFont(undefined, 'normal');
      const descLines = pdf.splitTextToSize(content.description, maxWidth);
      descLines.forEach((line) => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      yPosition += 5;
    }

    // Content items
    if (content.items && Array.isArray(content.items)) {
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');

      content.items.forEach((item, index) => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.text(`${index + 1}. ${item.title || item.name}`, margin, yPosition);
        yPosition += lineHeight;

        if (item.description) {
          pdf.setFontSize(10);
          pdf.setFont(undefined, 'normal');
          const itemLines = pdf.splitTextToSize(item.description, maxWidth - 5);
          itemLines.forEach((line) => {
            if (yPosition > pageHeight - margin) {
              pdf.addPage();
              yPosition = margin;
            }
            pdf.text(line, margin + 5, yPosition);
            yPosition += lineHeight;
          });
        }

        yPosition += 3;
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
      });
    }

    pdf.save(`${fileName}.pdf`);
    console.log(`[PDF] Course content PDF generated: ${fileName}.pdf`);
  } catch (error) {
    console.error('[PDF ERROR] Failed to generate course content PDF:', error.message);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};
