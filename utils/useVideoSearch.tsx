import  React, {useState,  useEffect} from 'react'
import useLayoutEffect from "./IsOrmorphicLayoutEffect";
import costumAxios from "./axios";
import {VideoPrevData} from "../types/page";

const  useVideoSearch = (s?:string , p:number) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false);
  const [videos, setVideos] = useState<VideoPrevData[]>([])
  const [hasMore, setHasMore] = useState(false);

    const controller = new AbortController();
    useLayoutEffect(()=>{
      setVideos([])
    }, [s])

    useLayoutEffect(()=>{
      setLoading(true)
      setError(false);
           let params:{p:number,s?:string};

          if(s && s.length > 0){
            params = {p,s}
          }else {
            params = {p}
          }
          costumAxios.get(`/watch`, {
            params,
            signal: controller.signal
         })
          .then(res => {
            const data:[VideoPrevData] = res.data;
            if(typeof data !== 'undefined')
            setVideos(vs => {return [...new Set([...vs , ...data])]})
              setHasMore(data.length > 0);
              setLoading(false);
          })
          .catch(e =>{
              setError(true);
          })
          return () => controller.abort()
    }, [s, p])

   return {videos , loading, error , hasMore}
  }
  
export default useVideoSearch