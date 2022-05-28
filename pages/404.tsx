import styles from "../styles/fourOfour.module.scss";
import arrowDown from 'react-useanimations/lib/arrowDown'
import UseAnimations from 'react-useanimations';
import {BsFileEarmarkImageFill} from "react-icons/bs"
import Link from 'next/link'


export default function Custom404() {
    return <div className={styles.Costum404}>
                <div className={styles.message}>
                  <span><BsFileEarmarkImageFill size={100}/></span>
                  <h1>404 - Video Not Found</h1>
                </div>
                  <div className={styles.back}>
                       <UseAnimations animation={arrowDown} 
                                      strokeColor={"white"} 
                                      fillColor={"white"} 
                                      size={100}
                        />
                       <Link href={"/"}>
                      <a href={"#"}>  
                                      <span>Go Home</span>
                      </a>
                    </Link>
                  </div>
           </div>
}