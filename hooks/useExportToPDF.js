import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { font } from './fonts/Amiri-Regular';

const useExportToPDF = () => {
    const generatePDF = async (data, columns, outputName, headerposition = { x: 165, y: 15 }, datePosition = { x: 15, y: 15 }) => {
        const doc = new jsPDF({
            // Use UTF-8 encoding
            encoding: 'UTF-8'
        });

        doc.addFileToVFS('Amiri-Regular.ttf', font);
        doc.addFont('Amiri-Regular.ttf', 'Amiri-Regular', 'normal');
        doc.setFont('Amiri-Regular');

        // Add the title
        doc.setFontSize(20);
        // if text is RTL make the text align right
        doc.text('تقرير العملاء', headerposition.x, headerposition.y);

        // GET THE DATE
        const date = new Date().toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: '2-digit'
        });

        // ADD STYLE TO THE TEXT
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`التاريخ: ${date}`, datePosition.x, datePosition.y);

        // Add the table
        doc.autoTable({
            columns: columns,
            body: data,
            startY: 20,
            didParseCell: (dataCell) => {
                const column = columns[dataCell.column.index];
                if (column.align === 'right') {
                    dataCell.cell.styles.halign = 'right';
                    // ADD THE FONT (Scheherazade)
                    dataCell.cell.styles.font = 'Amiri-Regular';
                }
            }
        });

        // Save the PDF
        let updatedOutputName = outputName || 'report';
        updatedOutputName = updatedOutputName.replace(/ /g, '_');
        updatedOutputName =
            updatedOutputName +
            new Date().toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: '2-digit'
            });
        doc.save(updatedOutputName + '.pdf');
    };

    return { generatePDF };
};

export default useExportToPDF;
