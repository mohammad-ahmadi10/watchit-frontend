import styles from "../styles/Slider.module.scss";
import mapRange from "../utils/ReMap";
import useLayoutEffect from "../utils/IsOrmorphicLayoutEffect";
import { useRef, useState } from "react";


interface SliderProps{
    maxWidth?:number,
    fillColor?:string,
    onChange?:any,
    value?:number,
    height?:number
}

function Slider({maxWidth , fillColor ,onChange ,  value , height=5}:SliderProps) {
    const [rangeVal , setRangeVal] = useState(value);

    const barFillRef = useRef<HTMLSpanElement>(null)!;
    const rangeRef = useRef<HTMLInputElement>(null)!;
    
    useLayoutEffect(() =>{
        setRangeVal(value)
    }, [value])

    useLayoutEffect(() =>{    
        const maxWidth = rangeRef.current!.clientWidth;
        
        if(typeof rangeVal !== 'undefined'){
            const newVal = mapRange(rangeVal! , 0 , 100 , 0 , maxWidth?maxWidth:100);
            barFillRef.current!.style.width = `${newVal}px`;
        }
    },[barFillRef, rangeRef, rangeVal])


    



    

    const onRangeChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const newVal = e.currentTarget.value 
        if(typeof(onChange) === 'function') 
            onChange(e , newVal);
        setRangeVal(+newVal);
    }

  return (
            <div className={styles.slider_container}
            style={{width:maxWidth?`${maxWidth}px`:"100%", height:height?height:100}}
            >   
            <span className={styles.bar}>
                    <span ref={barFillRef} style={{backgroundColor:fillColor}} className={styles.fill}></span>
                </span>
                <input  className={styles.slider_range} 
                        type={"range"} 
                        min={0}
                        max={100}
                        step={1}
                        onInput={onRangeChange}
                        ref={rangeRef}     
                />

            </div>
  )
}

export default Slider

