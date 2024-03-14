import { useEffect, useState } from "react";
import './Barcode.css'


const Barcode = () => {
    const [barcode, setBarcode] = useState(null);

    const sameCharacter = (myString) => {
        let firstChar = myString.charAt(0);

        for (let i = 0; i < myString.length; i += 1) {
            if (myString.charAt(i) != firstChar) {
                return false;
            }
        }
        return true;
    };


    const getBarcodeFromPLC = async() => {
        setBarcode('N/A')

        try {
            const response = await fetch('http://192.168.0.254:8081/grab-barcode');
            if (!response.ok) {
                throw new Error('Failed to fetch barcode');
            }
            const data = await response.json();
            
            if (sameCharacter(data.barcode)) {
                setBarcode('N/A');
            } else {
                setBarcode(data.barcode);
            }
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