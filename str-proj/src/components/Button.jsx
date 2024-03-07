import Rectangle from "./Rectangle";


const Button = ({c, x, y, w, h, text, onClick}) => 
{
    return (
        <div className="button">
            <Rectangle c={c}
                       x={x}
                       y={y}
                       w={w}
                       h={h}
                       text={text}
                       onClick={onClick}/>
        </div>
    );
};

export default Button;