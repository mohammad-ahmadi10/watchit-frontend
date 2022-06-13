import  {useRouter} from "next/router";
import Videoplayer from "../../components/Videoplayer";
import styles from "../../styles/videoPage.module.scss";
import clientAxios from "../../utils/axios";
import axios from 'axios';
import useLayoutEffect from "../../utils/IsOrmorphicLayoutEffect";
import Link from "next/link";
import {useRef , useState, useCallback  } from "react";
import { useDispatch } from 'react-redux';
import { setNextVideo } from '../../src/features/VideoSlice';
import Image from 'next/image';
import {BiCheckShield } from "react-icons/bi";
import {BsBookmarkStar , BsBookmarkStarFill} from "react-icons/bs";
import {FcCancel} from "react-icons/fc";
import {AiOutlineHeart, AiOutlineShareAlt , AiTwotoneHeart , AiOutlineCopy} from "react-icons/ai";
import {RiEdit2Line} from "react-icons/ri";
import {MdOutlineClass} from "react-icons/md";
import {VscWorkspaceTrusted} from "react-icons/vsc";
import { GetServerSideProps } from 'next'
import VideoSkeleton from "../../components/Skeleton/VideoSkeleton";
import VideoplayerSkeleton from "../../components/Skeleton/VideoplayerSkeleton";

import {  Avatar, notification , Input,  Popconfirm, message, Checkbox, Comment, Form, Button, List , Popover} from 'antd';
import "antd/dist/antd.dark.css"
import moment from 'moment';
import CostumComment from "../../components/comment/CostumComment";
import {modifyUplodedDate , modifyAmountOfView, regularTime} from "../../utils/functions";


import { motion } from "framer-motion"
import UseAnimations from "react-useanimations";
import bookmark from 'react-useanimations/lib/bookmark'
import copy from 'react-useanimations/lib/copy'
import share from 'react-useanimations/lib/share'
import {MdOutlineClear} from "react-icons/md"

import UseVideoSearch from "../../utils/useVideoSearch";
import costumAxios from "../../utils/axios";
import userPNG from "../../public/user.png";
const { TextArea } = Input;

import {
  EmailShareButton,
  FacebookShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton
} from "react-share";

import {
  EmailIcon,
  FacebookIcon,

  InstapaperIcon,
  LineIcon,
  LinkedinIcon,
  LivejournalIcon,
  MailruIcon,
  OKIcon,
  PinterestIcon,
  PocketIcon,
  RedditIcon,
  TelegramIcon,
  TumblrIcon,
  TwitterIcon,
  ViberIcon,
  VKIcon,
  WeiboIcon,
  WhatsappIcon,
  WorkplaceIcon
} from "react-share";
















const  Video = ({videoId}) => {
  const router = useRouter();

  const [theaterMode , setTheaterMode] = useState(false);
  const [isbooked , setIsbooked] = useState(false);
  const [avatar , setOwnerAvatar] = useState("");
  const [userAvatar , setUserAvatar] = useState("");
  const [user , setUser] = useState()
  const [iconSize , setIconSize] = useState(40);
  const [metadata , setMetadata] = useState(null)
  const [isLike , setIsLike] = useState(false);
  const [likes , setLikes] = useState(0);
  const [isUserPresent , setIsUserPresent] = useState(false);
  const [shareURL , setShareURL] = useState(`${process.env.NEXT_PUBLIC_FRONTEND}${router.asPath}`)
  const [playlists , setPlaylists] = useState([]);
  const [shouldPlaylistsShown , setShouldPlaylistShown] = useState(false);
  const [newPlaylist , setNewPlaylist] = useState("");
  const [isPlaylistRemoved ,  setIsPlaylistRemoved] = useState(false);
  const [isNewPlaylistCreated , setIsNewPlaylistCreated] = useState(false);
  const [isPlaylistHoverd , setIsPlaylistHoverd] = useState(false);
  const [checkedPlaylist, setCheckedPlaylist] = useState([])
  const [editComment , setEditComment] = useState({id:0 , content:""})
  const [isEditCommentShown , setIsEditCommentShown] = useState(false);
  const [editCommentVal , setEditCommentVal] = useState("");

  const openNotification = (content) => {
    notification.open({
      message: content,
      style: {
        width: 300,
      },
    });
  }

 
  // comment
  const [comments, setComments] = useState([]);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentValue, setCommentValue] = useState('');
  
  
  /* render icon from react-icons */
  const displayIcon = (ICON, color, size) =>  { 
    return  <ICON size={size ? size : iconSize} style={{pointerEvents:"none", color:color}}/>
  }
 
  /* saves the state of the new playlist Input  */
  const onNewPlaylistChange = (e) =>{
    const i = e.target;
    setNewPlaylist(i.value)
  }

 /* the  event will be triggered when the user pressed the enter*/
 const onNewPlaylistEnter = async (e) =>{
  await addNewPlaylist();
} 

 /* 
   the event will be triggered when the user clicked on create
  */
   const onNewPlaylistClick = async (e) =>{
    await addNewPlaylist();
 }

 const playlistRemovConfirm = async (e) => {
  const t = e.target;
  const playlistName = t.getAttribute("playlist")
  const {data} = await costumAxios.post("/video/rmPlaylist", {playlistName})
  if(data.success){
    message.success(`playlist ${playlistName} is removed`);
  setIsPlaylistRemoved(true)
  }else{
    message.success(`playlist ${playlistName} doesnt exists!`);
  setIsPlaylistRemoved(false)
  }
  setShouldPlaylistShown(false);
};


/* 
 display all playlists if user has one or many
*/
const displayPlaylists = () =>{
  return playlists !== null && playlists.length > 0 &&  playlists.map((p , i) =>
    {
        return  <div className={`${styles.playlistItem}`}   key={p.id ? p.id : i }> 
                        <Checkbox  defaultChecked={ checkedPlaylist.includes && checkedPlaylist.includes(p.playlist)} onChange={onPlaylistItemChange} name={p.playlist}>{p.playlist}</Checkbox>

                       <Popconfirm
                          title="Are you sure to delete this playlist?"
                          onConfirm={playlistRemovConfirm}
                          okText={<span playlist={p.playlist} >Yes</span>}
                          cancelText="No"
                        >
                           <div >{displayIcon(MdOutlineClear, "rgba(256, 0, 0 ,0.4)" ,  20)}</div> 
                        </Popconfirm>  
                </div>
    })
}

  /* content of playlist  */
  const saveContent = (
    <div className={styles.playlistContainer}>
          {playlists !== null &&  displayPlaylists()}
          <div className={styles.newPlaylist}> <Input placeholder={"new Playlist..."} value={newPlaylist} onChange={onNewPlaylistChange}  onPressEnter={onNewPlaylistEnter} allowClear /><Button onClick={onNewPlaylistClick} type="primary">Create</Button> </div>
    </div>
  );
  
  //let editValue = editComment !== null ? editComment.body : "";
  const onEditChange = (e) =>{
   /*  const t = e.target;
    editValue = t.value */
  }

  const editCommentAction = async ()=>{
    try{
      const {data} = await costumAxios.put(`/video/comment/edit`, {id:editComment.id,commentBody:editValue})
      if(data.success){
        const modifiedComments = comments.map(c =>{
          if(c.commentid.toString() === editComment.id.toString())
             c.content = <div>{editValue}</div>
          return c
        })
        setComments(modifiedComments)
        openNotification(<div className={styles.center}>{displayIcon(VscWorkspaceTrusted, "green")} <span style={{marginLeft:10}}>Comment is successfully edited</span></div>)
      }else{
        openNotification(<div className={styles.center}>{displayIcon(RiEdit2Line, "red")} <span style={{marginLeft:10}}>Comment couldn't be edited</span></div>)
      }
    }catch(e){
    }
    setIsEditCommentShown(false);
  }

  const onEditCommentEnter = async (e) =>{
    editCommentAction();
  }
  const onEditCommitSubmit = async (e) =>{
   editCommentAction();
 }



  

const CommentRemoveConfirm = async (e) => {
  const t = e.target ;
  const id = t.getAttribute("commentid")

  try{
    const {data} = await costumAxios.put("video/uncomment", {commentID:id})
    if(data.success){
      setComments(comments => {
        return comments.filter(c => {
        if(c.commentid !== id)
        return c
        })
      })

      openNotification(<div className={styles.center}>{displayIcon(VscWorkspaceTrusted, "green")} <span style={{marginLeft:10}}>Comment is successfully Deleted</span></div>)
      
    }else {
      openNotification(<div className={styles.center}>{displayIcon(FcCancel, "red")} <span style={{marginLeft:10}}>Comment couldn't be deleted</span></div>)
    }

    

  }catch(e){
     console.log(e)
  }

  
};

const editCommentContent = (
  <div className={styles.editCommentContainer}>
       <TextArea onPressEnter={onEditCommentEnter} onChange={onEditChange} defaultValue={editComment !== null ? editComment.body : ""}/>
        <Button onClick={onEditCommitSubmit}  type="primary">Edit</Button>
  </div>
);



const onEditPopupClick = (e) =>{
  const t = e.target;
     const commentid = t.getAttribute("commentid");
     const content = t.getAttribute("commentbody");
     setEditComment({id:commentid, body:content})
     setIsEditCommentShown(pr =>!pr)
}


const CommentList = ({ comments }) => (  
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
    itemLayout="horizontal"
    renderItem={props => 
      <div className={styles.listComment} >
                  <Comment  {...props}/> 
                  <div  className={styles.commentEditContainer} commentbody={props.content.props.children} commentid={props.commentid}>
                                      
                                          <Button onClick={onEditPopupClick} type="text" style={{height:"100%"}} commentbody={props.content.props.children} commentid={props.commentid} >
                                                {displayIcon(RiEdit2Line, "white" ,  20)}
                                         </Button>
                          <Popconfirm
                            title="Are you sure to delete this Comment?"
                            onConfirm={CommentRemoveConfirm}
                            okText={<span commentid={props.commentid} >Yes</span>}
                            cancelText="No"
                          >

                             <div style={{cursor:"pointer"}}  >{displayIcon(MdOutlineClear, "rgba(256, 0, 0 ,0.4)" ,  20)}</div> 
                          </Popconfirm> 
                             

                  </div> 
      </div>
    }
  />
);
 

  useLayoutEffect(()=>{
    (
      async () =>{
        const {data} = await costumAxios.get(`/video/comments/${videoId}`)
        let modifiedComments = [];
        if(data.length > 0){
          modifiedComments = await Promise.all(data.map(async (c) =>{
            const commentid = c.id;
            const author = c.username;
            const likes = c.like;
            const datetime = modifyUplodedDate(new Date(c.date));
            const userID = c.userID;
            const content = c.body;
            const res = await costumAxios.get(`/auth/avatar`, {responseType: 'blob', params:{userID}});
            let blob = new Blob([ res.data ], {type: 'image/jpeg'}) 
            const avatar = URL.createObjectURL(blob);
            
            return {
              actions: [<div className={styles.commentActions}>
                {displayIcon(AiTwotoneHeart, "white", 15)}
                <span key="comment-basic-reply-to">Reply to</span>
                </div> 
                  ],
                  author,
                  avatar,
                  content: <div>{content}</div>,
                  datetime,
                  commentid,
                  likes,
              }
          }));
          setComments(modifiedComments)
        }
      }
    )();
  }, [])

  const handleSubmitComment = async () => {
    if (!commentValue) return;
    
    try{
      setCommentSubmitting(true);
      const res = await costumAxios.put("/video/comment" , {id:videoId, commentBody:commentValue})
      const comment = res.data.comment;
      setCommentSubmitting(false);

      const date = modifyUplodedDate(new Date(comment.date))

      
      setComments([
        ...comments,
        {
          actions: [<div className={styles.commentActions}>
                      {displayIcon(AiTwotoneHeart, "white", 15)}
                      <span key="comment-basic-reply-to">Reply to</span>
                   </div> 
          ],
          author: user.username,
          avatar: userAvatar,
          content: <div>{commentValue}</div>,
          datetime: date,
          commentid:comment._id,
          likes:comment.likes.length,
        },
      ]);
      setCommentValue('');

    }
    catch(e){
       console.log(e)
    }
  };
  const handleCommentChange = (e) => {
    const t = e.target;
    setCommentValue(t.value);
  };
  // end comment 


  const standardRef = useRef(null);
  const otherVideosContainerRef = useRef(null);
  
  const dispatch = useDispatch();
  
  const [query , setQuery] = useState(metadata !== null ? metadata.title.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '') : "");
  const [pageNr, setPageNr] = useState(0);
  const observer = useRef(null);

  
  const {videos, hasMore, loading, error } = UseVideoSearch(query, pageNr)
  


  
  const onUnlikeClick = async (e) =>{
    try{
      const {data} = await costumAxios.put("video/unlike", {id:metadata.id})
      if(data.success){
        setLikes(like => like-1);
        setIsLike(false)
      }else{
        setIsLike(true)
      }
    }catch(e){
      setIsLike(true)
    }
  }

  const onLikeClick = async (e) =>{
    try{
      const {data} = await costumAxios.put("video/like", {id:metadata.id})
      if(data.success){
        setLikes(like => like+1);
        setIsLike(true)
      }else{
        setIsLike(false)
      }
    }catch(e){
      setIsLike(false)

    }
  }
  
  
  /* copies the shareURL into the clipboard */
  const copyTextToClipboard = async (text) => {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  
 
  

  
  
  const onCopyClick =  async(e) =>{
    copyTextToClipboard(shareURL)
    openNotification(<div className={styles.center}>{displayIcon(VscWorkspaceTrusted, "green")} <span style={{marginLeft:10}}>Copied URL</span></div>)
  }
  
  
  const unloggedUserContent = (
    <div>
      <p>Login in order to take this action!</p>
      <Link href={"/login"}><a href={"#"}>Login</a></Link>
    </div>
  );
  
  
  const onSavePopover = async (e) =>{
    if(playlists.length <= 0 || isNewPlaylistCreated || isPlaylistRemoved){
      const {data} = await costumAxios.get("/video/allPlaylist");
      
      setPlaylists(data.success ? data.playlists : [])
    }
    
    setShouldPlaylistShown(v =>!v);
  }
  


  /* 
    adds or removes video from playlist => condition whether is chekced or unchecked
  */
const onPlaylistItemChange = async (e) =>{
   const t = e.target;
   const playlistName = t.name;
   const id = metadata !== null &&  metadata.id;
   if(t.checked){
    const {data} = await costumAxios.post("/video/addtoplaylist", {playlistName , id})
    if(data.success){
      message.success(`Video is added to the playlist ${playlistName}`);

      setCheckedPlaylist(list =>   {
        list.push(playlistName)
        return list
      })
    }
    else message.success(`Video already exisits in the playlist ${playlistName}`);
   }

  else {
    const {data} = await costumAxios.post("/video/rmfromplaylist", {playlistName , id})
    if(data.success){
      message.success(`Video is removed from the playlist ${playlistName}`);
      const filteredList = checkedPlaylist.filter(v => (v !== playlistName))
      setCheckedPlaylist(filteredList)
    }  
    else   message.success(`Video is already removed from the playlist ${playlistName}`);
  }
}



  /* 
    creates new playlist with the given name
  */
  const addNewPlaylist = async () =>{
    if(newPlaylist.length > 0 ){
      const {data} = await costumAxios.post("video/newPlaylist", {playlistName:newPlaylist})
      if(data.success){
        setIsNewPlaylistCreated(true)
        openNotification(<div>{`Playlist ${newPlaylist} is created`}</div>)
      }else{
        openNotification(<div>{`Playlist ${newPlaylist} is already created`}</div>)
        setIsNewPlaylistCreated(false)
        
      }
    }
    setShouldPlaylistShown(false);
    setNewPlaylist("")
  }


 

 


  const playlistRemovContent = (
    <div className={styles.playlistRemoveContainer}>
          <p>Are you sure ?</p>
    </div>
  );
  
 
  /* 
     render icon from react-share
  */
const displayShareIcon = (Node , ICON, name) =>  { 
       return  <div>
                   <Node children={<span><ICON  size={iconSize} round={true} title={metadata !== null && metadata.title} /></span>} url={shareURL}/>
                   <span>{name}</span>
               </div>
}

/* content of the share popup-window */
  const shareContent = (
      <div className={styles.shareContent}>
                  <div onClick={onCopyClick}>  
                    <UseAnimations animation={copy} size={iconSize}  strokeColor={"white"} fillColor={"white"}/>
                    <span>Copy</span>
                  </div>
               {displayShareIcon(FacebookShareButton, FacebookIcon , "Facebook" )}
               {displayShareIcon(TelegramShareButton, TelegramIcon , "Telegram" )}
               {displayShareIcon(TwitterShareButton, TwitterIcon , "Twitter" )}
               {displayShareIcon(ViberShareButton, ViberIcon , "Viber" )}
               {displayShareIcon(WhatsappShareButton, WhatsappIcon , "Whatsapp" )}
               {displayShareIcon(EmailShareButton, EmailIcon , "Email" )}
               {displayShareIcon(LineShareButton, LineIcon , "Line" )}
               {displayShareIcon(RedditShareButton, RedditIcon , "Reddit" )}
       </div>
  );

  
  const getOwnerAvatar = async ( ) =>{
    if(metadata !== null){
      const userID = metadata.userID;
      if(userID){
        const res = await costumAxios.get(`/auth/avatar`, {responseType: 'blob', params:{userID}});
        let blob = new Blob([ res.data ], {type: 'image/jpeg'}) 
        const objectURL = URL.createObjectURL(blob);
        setOwnerAvatar(objectURL)
      }
    }
  }
  const getUserAvatar = async ( ) =>{
    const val = localStorage.getItem("user");
    if(val !== null && val.length > 0){
      const {user} = JSON.parse(val).payload
      setUser(user);
      if(user.id && user.id.length > 0){
        const res = await costumAxios.get(`/auth/avatar`, {responseType: 'blob', params:{userID:user.id}});
        let blob = new Blob([ res.data ], {type: 'image/jpeg'}) 
        const objectURL = URL.createObjectURL(blob);
        setUserAvatar(objectURL)
      }
    }
  }

  useLayoutEffect(() =>{
    (
      async()=>{
        getUserAvatar();
      }
    )();
  }, [])


  useLayoutEffect(() =>{
    (
      async()=>{
        getOwnerAvatar();
      }
    )();
  }, [metadata])

  useLayoutEffect(() =>{
     const token = localStorage.getItem("ACTKEN");
     const user = localStorage.getItem("user");
     if(token && user){
      if(token.length > 0 && user.length > 0)
      setIsUserPresent(true)
     }
  }, [])
  

  useLayoutEffect(() =>{
    (
      async() =>{
        if(videoId){
          const token = localStorage.getItem("ACTKEN");
          const res = await clientAxios.get(`watch/metadata/${videoId}`, {'Content-Type':'application/json', 'Authorization':`Bearer ${token}`} );
          setMetadata(res.data);
          if(typeof res.data.checkedPlaylist !== "undefined")
          setCheckedPlaylist(res.data.checkedPlaylist)

          setQuery(res.data.title.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, ''))
          setIsLike(res.data.isLiked)
          setLikes(res.data.like)
        }
      }
    )();
  }, [])


  const lastVideosElementRef = useCallback(node => {
    if(loading) return;
    if(observer && observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries =>{
            if(entries[0].isIntersecting){
              if(node !== null){
                if(hasMore)
                setPageNr(n => n+1)
              }
            }
          })
    if(node) observer.current.observe(node)
  }, [loading, hasMore]);
  
  
  const onTheaterClick = (value) =>{
    setTheaterMode(value)
  }

  const setVideoPlayer = (metadata, videoId) =>{
    return <>
                <Videoplayer duration={metadata.duration}  
                             videoPath={videoId} 
                             title={metadata.title}
                             resolutions={metadata.resolutions}
                             onTheatreRequest={onTheaterClick}
                />   
    </>
  }



  const onBookmarkClicked = (_) =>{ 
  }

    const myLoader=({src})=>{
      return `${process.env.NEXT_PUBLIC_REMOTE}/watch/thumb/${src}`;
    }
    
    /* 
     displays every video thumb which is got back from API
     @file: Video 
            is an object von type Video 
    */
    const displayImage = (file) =>{
      let date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(+file.date)
      const [minute, second] = regularTime(file.duration);
       return <Link href={`${file.id}`} key={file.id}  id={file.id} className={styles.otherVideoContainer}>
                <a href="#" className={styles.thumbContainer}>
                  <div className={styles.img_wrapper}>
                     <Image  priority={true} loader={myLoader}
                          src={`${file.id}`} alt={file.id} layout="fill" objectFit={"cover"}  
                      />
                      <div className={styles.duration_container}>
                       <span>{minute}</span>
                       :
                       <span>{second}</span>
                    </div>
                  </div>
   
                    
                  <motion.div 
                    whileHover={{ scale: 1.3 }}
                    className={styles.bookmarkContainer}
                  >
                       <UseAnimations animation={bookmark}  strokeColor={"white"} fillColor={"white"} onClick={onBookmarkClicked}/>
                  </motion.div>
                
                 <div className={styles.videoInfoContainer}>
                   <span>{file.title}</span>
                   <div className={styles.usernameContainer}>
                     <span>{file.username}</span>
                     <BiCheckShield size={18} style={{color:"green"}}/>
                   </div>
                   <div className={styles.view_dateContainer}>
                        <span>{modifyAmountOfView(+file.view )}</span>
                        <span>{modifyUplodedDate(new Date(file.date))} </span>
                   </div>
                  </div>
                </a>
              </Link>
    }    
    
    useLayoutEffect(()=>{
       if(videos.length > 0 ){
         const filterdVideos = videos.filter(v => v.id !== videoId)
         if(filterdVideos.length > 0){
          dispatch(setNextVideo({
            id:filterdVideos[0].id,
            title:filterdVideos[0].title,
            duration:filterdVideos[0].duration
          }))
         }else{
          dispatch(setNextVideo({
            id:0,
            title:"",
            duration:0
          }))
         }
       
       }
    }, [videos])




    const onEditContainerClick = (e) =>{
          const t = e.target;
          if(t.className.includes && t.className.includes("editContainer"))
            setIsEditCommentShown(false);
    }

  return (
    <div className={styles.video_container}>     
      
      {Object.keys(metadata !== null ?  metadata : {}).length === 0 ?
        <>
        <p>this video is probably deleted </p> 
         <Link href={`/`}> 
          <button>Go to Home Page</button>
         </Link>
        </>
         :
         <>
         
         <div className={`${theaterMode ? styles.videoplayer__theater_wrapper : styles.videoplayer_wrapper }`}>
              <div ref={standardRef} className={`${theaterMode ? styles.standard_wrapper_theater_mode : styles.standard_wrapper}`}>
                <div className={styles.innerVideoWrapper}>
                 {!loading ? setVideoPlayer(metadata, videoId) : <VideoplayerSkeleton/>}
                </div>

              </div>      
              <div ref={otherVideosContainerRef} className={`${theaterMode ? styles.other_videos_container_theater_mode : styles.other_videos_container}`}>
                  
                  {
                    !loading ? 
                  
                  <div className={styles.wrapper}>
                  {
                    videos &&  videos.map((d) => {
                      if(d.id !== videoId)  
                      return displayImage(d);
                    }) 
                  }               
                  </div>
                    : 

                    <div className={styles.skeletonContainer}>
                <div className={styles.skeletonWrapper}>
                {
                Array.from(Array(8), (_, i) => <VideoSkeleton key={i}/>)
                }
                </div>
              </div>

            }
                  

              </div>
              <div className={styles.video_info}>
                <div className={styles.upper_info}>
                     <span>{metadata.title}</span>
                          <div className={styles.description}>
                               <p>{metadata.description}</p>
                          </div>
                          <div className={styles.like_wrapper}>
                            <div>
                             <p>{metadata.view}{metadata.view === 0 ? " view" : " views"}</p>
                            </div>
                            <div>
                            <span>
                                { isLike ?
                                  <div onClick={onUnlikeClick}>
                                    {displayIcon(AiTwotoneHeart, "red")}
                                  </div>
                                :

                                isUserPresent ? 
                                  <motion.div 
                                       whileHover={{ scale: 1.1 }}
                                       whileTap={{ scale: 0.9 }}
                                       onClick={onLikeClick}
                                   >
                                   {displayIcon(AiOutlineHeart)}
                                   </motion.div>
                                :
                                   <Popover content={unloggedUserContent} title="like" trigger="click">
                                    <div><Button type="text" >{displayIcon(AiOutlineHeart)}</Button></div>
                                   </Popover>
                                }

                                 <span>{likes > 0 ? likes : "like"}</span>
                            </span>
                            <span>
                                  <Popover content={shareContent} title="share" trigger="click">
                                      <div>
                                      <Button type="text" style={{height:"100%"}} >
                                            <div className={styles.shareButton}>
                                               <UseAnimations animation={share} size={iconSize +5}  strokeColor={"white"} fillColor={"white"}/>
                                              <span>share</span>
                                            </div>
                                      </Button>
                                      </div>
                                      
                                    </Popover>


                            </span>


                            <span>
                              
                                {
                                isUserPresent ? 
                                <Popover content={saveContent} title="Playlist" trigger="click" onClick={onSavePopover} visible={shouldPlaylistsShown}>
                                      <div>
                                          <Button type="text" style={{height:"100%"}} >
                                              <motion.div 
                                                 whileHover={{ scale: 0.9 }}
                                                 whileTap={{ scale: 1 }}
                                              >
                                                {displayIcon(MdOutlineClass)}
                                              </motion.div>
                                         </Button>
                                      </div>
                                    </Popover>
                                :
                                    <Popover content={unloggedUserContent} title="Save" trigger="click">
                                         <div><Button type="text" >{displayIcon(MdOutlineClass)}</Button></div>
                                    </Popover>
                                }
                              <span>save</span>
                            </span>
                            </div>
                          </div>
                </div>
                   <div className={styles.avatar_container}>
                      <Avatar className={styles.avatar}  size={"large"} style={{width:"60px", height:"60px"}} 
                               src={ <Image  priority={true} src={avatar.length > 0 ? avatar : userPNG} layout="fill" />}>
                      </Avatar> 
                      <div>
                         <div
                         >{metadata.username}</div>
                         <BiCheckShield size={22} style={{color:"green"}}/>

                      </div>
                   </div>



                   <div className={styles.commentContainer}>
                     <CostumComment avatar={userAvatar} alt={typeof user !== "undefined" ? user.username : " "}
                                    onChange={handleCommentChange}
                                    handleSubmit={handleSubmitComment}
                                    submitting={commentSubmitting}
                                    value={commentValue}
                     />
                     {comments.length > 0 && <CommentList comments={comments} />}
                   </div>


                   
               </div>            
               {isEditCommentShown && <div onClick={onEditContainerClick} className={styles.editContainer}>{editCommentContent}</div>}
         </div>
            
         </>
    }
  </div>
  )
}
        

export const getServerSideProps = async (ctx) =>{
  const {videoId} = ctx.query;
  return{props:{videoId:videoId}}
}


export default Video;