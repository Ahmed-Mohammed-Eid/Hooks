'use client';

import React, { useRef } from 'react'; // Added useRef
import useExportToPDF from './hooks/useExportToPDF';
import useExportToExcel from './hooks/useExportToExcel';
import useSwipe from './hooks/useSwipe'; // Added useSwipe import

const MyComponent = () => {
    const data = [
        { name: 'John Doe', age: 30, email: 'john.doe@example.com', arabicName: 'أحمد محمد', phone: '555-555-5555', address: '123 Main St, Springfield, IL', arabicAddress: ' شارع العربي شارع العربي شارع العربي شارع العربي شارع العربي' },
        // ... (keeping existing data for brevity, it was very long)
        { name: 'Jane Smith', age: 25, email: 'jane.smith@example.com', arabicName: 'فاطمة علي', phone: '555-123-4567', address: '456 Oak St, Anytown, USA', arabicAddress: 'شارع البلوط' }
    ];

    const columns = [
        { header: 'Name (English)', dataKey: 'name' },
        { header: 'Age', dataKey: 'age' },
        { header: 'Email', dataKey: 'email' },
        { header: 'Name (Arabic)', dataKey: 'arabicName', align: 'right' },
        { header: 'Phone', dataKey: 'phone' },
        { header: 'Address', dataKey: 'address', align: 'right' },
        { header: 'Address (Arabic)', dataKey: 'arabicAddress', align: 'right' }
    ];

    const excelColumns = [
        { header: 'Name (English)', accessor: 'name' },
        { header: 'Age', accessor: 'age' },
        { header: 'Email', accessor: 'email' },
        { header: 'Name (Arabic)', accessor: 'arabicName' },
        { header: 'Phone', accessor: 'phone' },
        { header: 'Address', accessor: 'address' },
        { header: 'Address (Arabic)', accessor: 'arabicAddress' }
    ];

    const { generatePDF } = useExportToPDF();
    const { generateExcel } = useExportToExcel();

    // --- Swipe Hook Example Start ---
    const swipeableRef = useRef(null);

    const logSwipe = (direction, type = '') => {
        console.log(`Swiped ${type} ${direction}`);
    };

    useSwipe({
        ref: swipeableRef,
        onSwipeLeft: () => logSwipe('left'),
        onShortSwipeLeft: () => logSwipe('left', 'short'),
        onLongSwipeLeft: () => logSwipe('left', 'long'),
        onSwipeRight: () => logSwipe('right'),
        onShortSwipeRight: () => logSwipe('right', 'short'),
        onLongSwipeRight: () => logSwipe('right', 'long'),
        onSwipeUp: () => logSwipe('up'),
        onShortSwipeUp: () => logSwipe('up', 'short'),
        onLongSwipeUp: () => logSwipe('up', 'long'),
        onSwipeDown: () => logSwipe('down'),
        onShortSwipeDown: () => logSwipe('down', 'short'),
        onLongSwipeDown: () => logSwipe('down', 'long'),
    });
    // --- Swipe Hook Example End ---

    return (
        <div>
            <h1>Export Examples</h1>
            <button onClick={() => generatePDF(data, columns, 'تقرير العملاء', { x: 167, y: 15 })}>Export to PDF</button>
            <button onClick={() => generateExcel(data, excelColumns, 'تقرير العملاء')}>Export to Excel</button>

            <hr style={{ margin: '20px 0' }} />

            <h1>Swipe Hook Example</h1>
            <div
                ref={swipeableRef}
                style={{
                    width: '300px',
                    height: '200px',
                    backgroundColor: 'lightcoral',
                    border: '1px solid darkred',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    userSelect: 'none', // Important for better swipe experience
                    touchAction: 'none', // May also be useful to prevent browser default touch actions
                    marginTop: '20px'
                }}
            >
                <p>Swipe this area!</p>
                <p>(Check the console for swipe events)</p>
            </div>
        </div>
    );
};

export default MyComponent;
