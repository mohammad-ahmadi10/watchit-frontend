import styles from "../styles/Slider.module.scss";
import mapRange from "../utils/ReMap";
import useLayoutEffect from "../utils/IsOrmorphicLayoutEffect";
import { useRef, useState } from "react";
import { Slider } from 'antd';
import "antd/dist/antd.dark.css"


interface SliderProps{
    maxWidth?:number,
    fillColor?:string,
    onChange?:any,
    value?:number,
    height?:number
}

function CostumSlider({maxWidth , fillColor ,onChange ,  value , height=5}:SliderProps) {
    const [rangeVal , setRangeVal] = useState(value);

  /*   const barFillRef = useRef<HTMLSpanElement>(null)!; */
    const rangeRef = useRef<HTMLInputElement>(null)!;
    
    useLayoutEffect(() =>{
        setRangeVal(value)
    }, [value])

    useLayoutEffect(() =>{    
        const maxWidth = rangeRef.current!.clientWidth;
        
        /* if(typeof rangeVal !== 'undefined'){
            const newVal = mapRange(rangeVal! , 0 , 100 , 0 , maxWidth?maxWidth:100);
            barFillRef.current!.style.width = `${newVal}px`;
        } 
        */
    },[ rangeRef, rangeVal])


    



    

    const onRangeChange = (e:number) =>{
        const newVal = e

        if(typeof(onChange) === 'function') 
            onChange(newVal);
        setRangeVal(+newVal); 
    }

  return (
            <div className={styles.slider_container}
            style={{width:maxWidth?`${maxWidth}px`:"100%", height:height?height:100}}
            >   
            <Slider  className={styles.slider_range}
                     defaultValue={value} 
                     trackStyle={{background:fillColor ? fillColor : "blue"}} 
                     handleStyle={{opacity:0}}
                     value={rangeVal}
                     onChange={onRangeChange}
                     ref={rangeRef} 
                     tooltipVisible={false}
                 
               />
            </div>
  )
}

export default CostumSlider

