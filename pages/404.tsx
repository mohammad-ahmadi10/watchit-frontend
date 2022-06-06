import styles from "../styles/fourOfour.module.scss";
import arrowDown from 'react-useanimations/lib/arrowDown'
import UseAnimations from 'react-useanimations';
import {BsFileEarmarkImageFill} from "react-icons/bs"
import Link from 'next/link'
import notFound from "../public/not_found.png";
import Image from 'next/image'

export default function Custom404() {
    return <div className={styles.Costum404}>
                <div className={styles.message}>
                  <span> 
                    <Image src={notFound} alt={"not-found"} width={500} height={400}
                     />
                  </span>
                  
                </div>
                  <h1>page Not Found</h1>
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