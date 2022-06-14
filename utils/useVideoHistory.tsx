import  React, {useState,  useEffect} from 'react'
import useLayoutEffect from "./IsOrmorphicLayoutEffect";
import costumAxios from "./axios";
import {VideoPrevData} from "../types/page";


interface HistoryType extends VideoPrevData{
  seen:string
}
const  useVideoHistory = (p:number) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false);
  const [videos, setVideos] = useState<HistoryType[]>([])
  const [hasMore, setHasMore] = useState(false);
   
    const controller = new AbortController();
    useLayoutEffect(()=>{
      setVideos([])
    }, [])

    useLayoutEffect(()=>{
      setLoading(true)
      setError(false);
           let params:{p:number}={p};
           costumAxios.get(`/video/myhistory`, {
            params,
            signal: controller.signal
         })
          .then(res => {
            let data:HistoryType[] = res.data;
            data = data.filter((v) => Boolean(v))
            if(typeof data !== 'undefined'){
                data.sort((a,b)=> {
                  return new Date(b.seen).getTime() - new Date(a.seen).getTime()
                })

                 setVideos(vs => {return [...new Set([...vs , ...data])].sort((a,b)=> {
                    return new Date(b.seen).getTime() - new Date(a.seen).getTime()
                   })
                })



                 setHasMore(data.length > 0);
                 setLoading(false);

            }
          })
          .catch(e =>{
              setError(true);
          })
          return () => controller.abort()
    }, [p])

   return {videos , loading, error , hasMore}
  }
  
export default useVideoHistory