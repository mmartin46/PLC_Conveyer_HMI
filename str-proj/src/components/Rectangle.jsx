import React from 'react'

class Rectangle extends React.Component 
{
    render() 
    {
        const { w, h, c, text, onClick } = this.props;
        const rectangleStyle = 
        {
            width: w,
            height: h,
            backgroundColor : c,
            border: '0px solid black',
            borderRadius: '5px',
            display: 'flex',
            fontStyle: 'bold',
            margin: '10px',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 5px 5px rgba(0, 50, 100, 0.2)'
        };

        return (
            <div style={rectangleStyle} onClick={onClick}>
                {text && <span>{text}</span>}
            </div>
        )
    }
}

export default Rectangle;