import { NextPage } from 'next'
import { ComponentType, ReactElement, ReactNode } from 'react'

export type Page<P = {}> = NextPage<P> & {
  // You can disable whichever you don't need
  getLayout?: (page: ReactElement) => ReactNode
  layout?: ComponentType
}


// types
export interface VideoPrevData{
  id:string,
  title:string,
  date:string,
  duration:number,
  view:number,
  userID:Number,
  username:string,
  description:string,
  resolutions:string[],
  
}


export interface UserData {
  id:string,
  username:string,
  email:string,
  avatar:string,
}