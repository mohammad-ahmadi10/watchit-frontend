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
/* Slider used in volume and video range */
function CostumSlider({maxWidth , fillColor ,onChange ,  value , height=5}:SliderProps) {
   
    const [rangeVal , setRangeVal] = useState(value);
    const rangeRef = useRef<HTMLInputElement>(null)!;
    
    /* sets rangValalue when a new Value is given */
    useLayoutEffect(() =>{
        setRangeVal(value)
    }, [value]) 

    /* callbak Function envolked when the slider Range is changed */
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

