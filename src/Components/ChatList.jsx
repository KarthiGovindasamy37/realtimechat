import React, { useEffect,useRef } from 'react'
import * as portalActions from '../Redux/Slices/PortalSlice'
import { bindActionCreators } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { io } from "socket.io-client"
import { env } from '../Config'

function ChatList() {
 
  const { chatUserName,chatNameErrorStatus,searchList,dropdown,preventDropdown,
  searchListLoading,chatList,chatListLoading,messageList,chat,messageStatusUpdate,
  localStorageCheck} = useSelector(state => state.portal)
  const {_id} = useSelector(state =>state.user.userDetails)
  const dispatch = useDispatch()

  const {setChatUserName,setChatNameError,searchFriends,setDropdown,
  clearInput,setChat,setPreventDropdown,getChatList,clearChatNoti,
  changeMessageStatus,setMessageStatusUpdate} = bindActionCreators(portalActions,dispatch)

  let socket = useRef(null)
  useEffect(() =>{
  socket.current = io(env.socket)
  },[])
    
  useEffect(()=>{
    if(chatUserName.length > 0) searchFriends(chatUserName)
  },[chatUserName])

  useEffect(()=>{
   getChatList(_id)
  },[])
  
  useEffect(() =>{
if(localStorageCheck && Object.keys(chat).length > 0) clearChatNoti(chat._id)
  },[localStorageCheck])
 

  const validateUserName = (value) =>{
    if(value.length === 0) setChatUserName(value)
    if(value.length > 0){
       let code = value.charCodeAt(value.length - 1)
        if(code === 32){
            let regexp = new RegExp(/^[\w]( ?[\w] ?)*$/)
    
            if(regexp.test(value)){
              setChatUserName(value)
              if(chatNameErrorStatus) setChatNameError(false)
            }
            
        }else{
            let regexp = new RegExp(/^[\w]( ?[\w] ?)*$/)
            if(regexp.test(value)){
              setChatUserName(value)
              if(chatNameErrorStatus) setChatNameError(false)
            }else{
              if(! chatNameErrorStatus) setChatNameError(true)
            }
        }  
    }
  }

const dropdownClose = () =>{
  if(! preventDropdown) {
    setDropdown(false)
    setChatNameError(false)
  }
}

let navigate = useNavigate()

useEffect(()=>{
  if(messageStatusUpdate){
  setMessageStatusUpdate()
if(messageList.length > 0){

  let sender = messageList.filter(e => e.sender !== _id && e.status === "Delivered") 
  console.log(sender);
  
  if(sender.length > 0){
    let newMessageList = []
    sender.forEach(e => newMessageList.push(e._id))
    changeMessageStatus(newMessageList)
    
      console.log(newMessageList);

   socket.current.emit("changeStatus",{
    newMessageList,
    friend : chat._id,
    userId : _id

  })
}
} 
}
},[messageStatusUpdate])

const setUserOnChat = (e) =>{
  
  setChat(e)
  setDropdown(false)
  setChatUserName("")
  if(window.innerWidth < 769){
    navigate("/portal")
  }  
  let index = chatList.findIndex(ele=>ele._id === e._id)
  if(index > -1){
    if(chatList[index].newMessage)  clearChatNoti(e._id)
  }
}

 
const chatToConv = (e) =>{

  setChat(e)
  if(window.innerWidth < 769){
    navigate("/portal")
  }
  if(e.newMessage){    
   
   clearChatNoti(e._id)
   
    
  }
}


const setWidth = () =>{
  if(window.innerWidth > 768 && window.innerWidth < 778 ) navigate("/portal")
} 

useEffect(() => {
  window.addEventListener("resize",setWidth)

  return () =>{
    window.removeEventListener("resize",setWidth)
  }
},[])

let timestamp = useRef(0)
let chatDate = useRef(0)
let chatMonth = useRef(0)
let chatYear = useRef(0)
let chatHour = useRef(0)
let chatMinute = useRef(0)
let year = useRef(0)
let timeline = useRef(0)
let today = useRef(0)
let tDate = useRef(0)
let tMonth = useRef(0)
let tYear = useRef(0)

const createTimeline = (time) =>{
  timestamp.current = new Date(time)
   chatDate.current = timestamp.current.getDate()
   chatMonth.current = timestamp.current.getMonth() + 1
   chatYear.current = timestamp.current.getFullYear()
   
   today.current = new Date()
   tDate.current = today.current.getDate()
   tMonth.current = today.current.getMonth() + 1
   tYear.current = today.current.getFullYear()

if(chatDate.current === tDate.current && chatMonth.current === tMonth.current && chatYear.current === tYear.current){
  chatHour.current = timestamp.current.getHours()
  chatMinute.current = timestamp.current.getMinutes()
  
  timeline.current = `${chatHour.current > 12 ? `${chatHour.current - 12}`: `${chatHour.current}`}:${chatMinute.current < 10 ? `0${chatMinute.current}`:`${chatMinute.current}`} ${chatHour.current < 12 ? `am` : `pm`}`
}else if(tDate.current - chatDate.current === 1 && chatMonth.current === tMonth.current && chatYear.current === tYear.current){
  timeline.current = "Yesterday"
}else{
  year.current = String(chatYear.current).substring(2)
  timeline.current = `${chatDate.current < 10 ? `0${chatDate.current}`:`${chatDate.current}`}/${chatMonth.current < 10 ? `0${chatMonth.current}`:`${chatMonth.current}`}/${year.current}`
}
}


  return (
    <div className='pt-3'>
      <div className={`ps-3 chatlist-input-div ${chatNameErrorStatus ? `pb-2`: ``}`}>
        <input type="text" placeholder='Search friends'  className='chatlist-input'
        onChange={(e)=>validateUserName(e.target.value)}
        value={chatUserName}
        onFocus={()=>setDropdown(true)}
        onBlur={dropdownClose}/>
        {
          chatUserName.length > 0 ? 
          <div onClick={()=>clearInput()} className="x-mark">X</div>
          :null
        }
        </div>
        {
          chatNameErrorStatus ?
          <div className='ps-3 chat-error'>Name should contain only characters and numbers</div>
          : null
        }
        {
          dropdown ? searchList.length > 0 ?
          <div className="chatlist-div pt-2">
        <div onMouseOver={()=>setPreventDropdown(true)} onMouseOut={()=>setPreventDropdown(false)} >
          {
            searchList.map((e)=>{
       return <div onClick={()=>{setUserOnChat(e)}} className="chatlist d-flex align-items-center py-1 ps-3 ">
            <img src={e.profilePicture.length > 0 ?`/assets/${e.profilePicture}`:"/assets/chatnew.jpg"} alt="" className='chatlist-img'/>
            <span className='ps-2 chat-name'>{e._id === _id ? `${e.name} (You)`:e.name}</span>
            
          </div>
            })
          }
        </div>
        </div>
        :
       !searchListLoading && chatUserName.length > 0 ?
        <div className="ps-3 pt-2">Sorry no user name matches your search</div>        
        :
        <div className="chatlist-div pt-2">
          {
            chatList.length > 0 ?            
            chatList.map((e)=>{
              createTimeline(e.updatedAt)
              return (
              <div onClick={()=>chatToConv(e)} className="chatlist d-flex align-items-center py-1 ps-3">
              <img src={e.profilePicture.length > 0 ?`/assets/${e.profilePicture}`:"/assets/chatnew.jpg"} alt="" className='chatlist-img'/>
              <span className='ps-2 chat-name'>{e._id === _id ? `${e.name} (You)`:e.name}</span>
              {
                e.newMessage ? e.newMessage > 9? 
              <>
              <div className='new-message text-center'>9+</div>
              <div className="chatlist-timeline-new">{timeline.current}</div>
              </>
              : 
              <>
              <div className='new-message text-center'>{e.newMessage}</div>
              <div className="chatlist-timeline-new">{timeline.current}</div>
              </>
              :e.updatedAt ?
              <div className="chatlist-timeline">{timeline.current}</div>
              :null
            }
            </div>
              )
            })
            : <div className="no-chatlist ps-3 pt-3">Make your first chat by searching your friend name</div>
          }
          
          </div>
        :      
        <div className="chatlist-div pt-2">
         {
          chatListLoading ?
          <div className="spinner-div d-flex justify-content-center pt-5">
              <div className='d-flex align-items-center'>
              <div className="spinner-grow spinner-grow-sm text-info" role="status"></div>
              <div className='ps-1'>Loading...</div>
              </div>
            </div>
            :
            chatList.length > 0 ?
            chatList.map((e)=>{
              createTimeline(e.updatedAt)
              return (
                
              <div onClick={()=>chatToConv(e)} className="chatlist d-flex align-items-center py-1 ps-3">
              <img src={e.profilePicture.length > 0 ?`/assets/${e.profilePicture}`:"/assets/chatnew.jpg"} alt="" className='chatlist-img'/>
              <span className='ps-2 chat-name'>{e._id === _id ? `${e.name} (You)` : e.name}</span>
              {
                e.newMessage ? e.newMessage > 9? 
                <>
                <div className='new-message text-center'>9+</div>
                <div className="chatlist-timeline-new">{timeline.current}</div>
                </>
                : 
                <>
                <div className='new-message text-center'>{e.newMessage}</div>
                <div className="chatlist-timeline-new">{timeline.current}</div>
                </>
                : e.updatedAt ?
                <div className="chatlist-timeline">{timeline.current}</div>
                :null
            }
           
            </div>
            
              )
            })
            
            : <div className="no-chatlist ps-3 pt-3">Make your first chat by searching your friend name</div>
          }
          
        </div>
}
    </div>
        
  )
}

export default ChatList