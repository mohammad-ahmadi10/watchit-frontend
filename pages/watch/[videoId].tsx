import {useRouter} from "next/router";
import { NextPageContext } from "next";
import Videoplayer from "../../components/Videoplayer";
import styles from "../../styles/videoPage.module.scss";
import clientAxios from "../../utils/axios";



interface videoProps{
  data:{
    id:string,
    title:string,
    folder:string,
    duration:{minute:number , second:number},
    timestamp:number,
    views:number,
    comments:[string],
    likes:number
  }
}


const  Video = (props:videoProps) => {
    const router = useRouter();
    const videoId = router.query.videoId;
    const metadata = props.data;
    /* 
      <video controls poster={`http://192.168.188.52:8200/watch/image/${videoId}`}>
                  <source src={`http://192.168.188.52:8200/watch/${videoId}`} />
              </video>
    */
  
  return (
    <div className={styles.video_container}>     
      
              {/* <ReactPlayer 
                controls={true}
                url={`http://192.168.188.52:8200/watch/${videoId}`}
              /> */}

      <Videoplayer duration={metadata.duration}  videoPath={videoId}/>
  </div>
  )
}
        

Video.getInitialProps = async (ctx:NextPageContext) =>{
  const {videoId} = ctx.query;

  const res = await clientAxios.get(`/${videoId}`);
  const result = res.data;
  return{data:result}
}


export default Video;