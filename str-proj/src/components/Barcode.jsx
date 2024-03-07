import { useEffect, useState } from "react";
import './Barcode.css'


const Barcode = () => {
    const [barcode, setBarcode] = useState(null);

    const getBarcodeFromPLC = async() => {
        setBarcode('N/A')

        try {
            const response = await fetch('http://localhost:5000/grab-barcode');
            if (!response.ok) {
                throw new Error('Failed to fetch barcode');
            }
            const data = await response.json();
            setBarcode(data.barcode);
        } catch (error) {
            setBarcode('N/A');
        }
    };

    const whichDiv = (barcode) => {
        console.log(barcode)
        if (barcode === 'N/A') {
            return <div className="invalid" onClick={handleClick}>{barcode}</div>
        }
    
        return <div className="success" onClick={handleClick}>{barcode}</div>
    }

    const handleClick = () => {
        getBarcodeFromPLC();
    };

    useEffect(() => {
        getBarcodeFromPLC();
    }, []); // Run once
    
    return whichDiv(barcode);
}

export default Barcode;