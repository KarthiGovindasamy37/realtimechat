import React, { useEffect, useRef, useState } from 'react'
import * as portalActions from '../Redux/Slices/PortalSlice'
import { bindActionCreators } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons'
import { env } from '../Config'
 
function Conversation() {

const { chat,message,messageList,conversationLoading,chatList,
        sendSocketMessageDetails,newMessageDetails,onlineList  } = useSelector(state => state.portal)
const {userDetails} = useSelector(state =>state.user)
const { _id } = userDetails
const dispatch = useDispatch()

const {setMessage,sendMessage,getChatMessages,setChatlistOrder,
      setChatlistNewMessage,getChatMember,addSelfMessage} = bindActionCreators(portalActions,dispatch)


useEffect(()=>{
 if(Object.keys(chat).length > 0) getChatMessages({user : _id,friend : chat._id})
},[chat])

const scroll = useRef(null)

useEffect(()=>{
  scroll.current?.scrollIntoView()
},[messageList])

let socket = useRef(null) 

useEffect(() =>{
  socket.current = io(env.socket) 
 
},[])

useEffect(() =>{console.log("it wokzzz1");
  if(Object.keys(newMessageDetails).length > 0){console.log("it wokzzz2");
  
    if(newMessageDetails.sender === chat._id) {console.log("it wokzzz if");
    
      let newMessageList = [newMessageDetails._id]
      console.log("instant update")
      console.log(chat);
      socket.current.emit("changeStatus",{
        newMessageList,
        friend : chat._id,
        userId : _id
      })
     }else{ console.log("it wokzzz else");
     console.log(newMessageDetails.sender);
      let index = chatList.findIndex(e => e._id === newMessageDetails.sender)
      console.log(index);
      if(index > -1){
        setChatlistNewMessage({index,timestamp:newMessageDetails.timestamp})
      }else{
        getChatMember(newMessageDetails.sender)
      }
     }
  }
},[newMessageDetails])



useEffect(() =>{
if(Object.keys(sendSocketMessageDetails).length > 0){console.log("sendSockettt");
  
  socket.current.emit("sendMessage",{
    senderId : _id,
    receiverId : chat._id,
    _id : sendSocketMessageDetails._id,
    message : sendSocketMessageDetails.message,
    createdAt: sendSocketMessageDetails.createdAt,
    timestamp:sendSocketMessageDetails.time
  })
}
},[sendSocketMessageDetails])


const sendMessageDetails = () =>{
  let correctMessage = message.trim()
  
if(correctMessage.length > 0) {

  let tempId = Math.random()
  let value={
    tempId,
    messageDetails :{
    members : [_id,chat._id],
    sender : _id,
    message:correctMessage
    }
}
if(chatList.findIndex(e => e._id === chat._id) !== 0){
  setChatlistOrder(chat)
}
  addSelfMessage({
    sender : _id,
    message:correctMessage,
    createdAt:String(new Date()),
    status : "Sent",
    tempId, 
    receiverId : chat._id
  })
  if(chat._id === _id){
    value.messageDetails.status = "Seen"
    sendMessage(value)
  }else{
    sendMessage(value)
  }
  setMessage("")
 
}
 }
   let date = useRef(0)
   let month = useRef(0)
   let year = useRef(0) 
   let timestamp = useRef(0)
   let mdate = useRef(0)
   let mmonth = useRef(0)
   let myear = useRef(0)
   let chatDate = useRef("")
   let timeline = useRef(true)
   let hour = useRef(0)
   let minute = useRef(0)
   let time = useRef("")
   let today = useRef("")
   let tdate = useRef(0)
   let tmonth = useRef(0)
   let tyear = useRef(0)
   let monthName = useRef("")
   let send = useRef(">>") 

   const createDay = (day) =>{
    switch (day) {
      case 0:
       return "Sunday"
       case 1:
        return "Monday"
        case 2:
          return "Tuesday"
          case 3:
            return "Wednesday"
            case 4:
              return "Thursday"
              case 5:
                return "Friday"
                case 6:
                  return "Saturday"
    }
   }

   const createMonth = (month) => {
    switch(month){
      case 0:
        return "January"
         case 1:
          return "February"
           case 2:
            return "March"
             case 3:
              return "April"
               case 4:
                return "May"
                 case 5:
                  return "June"
                   case 6:
                    return "July"
                     case 7:
                      return "August"
                       case 8:
                        return "September"
                         case 9:
                          return "October"
                            case 10:
                             return "November"
                               case 11:
                                return "December"

    }
   }

   const createTimeline = (e,index) =>{
    timestamp.current = new Date(e)
    mdate.current = timestamp.current.getDate()
    mmonth.current = timestamp.current.getMonth() + 1
    myear.current = timestamp.current.getFullYear()
    hour.current = timestamp.current.getHours()
    minute.current = timestamp.current.getMinutes()
     
    time.current = `${hour.current > 12 ? `${hour.current - 12}` : `${hour.current}`}:${minute.current < 10 ? `0${minute.current}` : `${minute.current}`} ${hour.current < 12 ? `am` : `pm`}`

   if(index === 0){
    timeline.current = true
    date.current = mdate.current
    month.current = mmonth.current
    year.current = myear.current
   }else{
    if(mdate.current === date.current){
      if(mmonth.current === month.current){
        if(myear.current === year.current){
            if(timeline.current) timeline.current = false
        }else{
      timeline.current = true
      date.current = mdate.current
      month.current = mmonth.current
      year.current = myear.current
        }
      }else{
      timeline.current = true
      date.current = mdate.current
      month.current = mmonth.current
      year.current = myear.current
      }
 
    }else{
      timeline.current = true
      date.current = mdate.current
      month.current = mmonth.current
      year.current = myear.current
    }
   }

   

   if(timeline.current){
     today.current = new Date()
     tdate.current = today.current.getDate()
     tmonth.current = today.current.getMonth() + 1
     tyear.current = today.current.getFullYear()


     if(tdate.current === mdate.current && tmonth.current === mmonth.current && tyear.current === myear.current){
        chatDate.current = "Today"
     }else if(tdate.current - mdate.current === 1 && tmonth.current === mmonth.current && tyear.current === myear.current) {
       chatDate.current = "Yesterday"
     }else if(tdate.current - mdate.current > 1 && tdate.current - mdate.current < 7 && tmonth.current === mmonth.current && tyear.current === myear.current) {
      chatDate.current = createDay(timestamp.current.getDay())
     }
     else{
        monthName.current = createMonth(timestamp.current.getMonth())
        chatDate.current = `${mdate.current} ${monthName.current} ${myear.current}`
     }
   }
   }


  return (
    <div>
  { Object.keys(chat).length > 0 ?
    <div className='conv-main-div'>
       <div className="d-flex align-items-center conv-title-div">
        <div className="d-flex align-items-center ps-2">
            <img src={chat.profilePicture.length > 0 ? `/assets/${chat.profilePicture}` : "/assets/chatnew.jpg"} alt="" className='chatlist-img'/>
            <div className="">
            <span className='ps-2 text-white'>{chat._id === _id ? `${chat.name} (You)` : chat.name}</span>
            <div className='online-noti ps-2 mt-0'>{chat._id === _id ? `Online`: onlineList.some(e => e._id === chat._id) ? `Online` : `Offline`}</div>
            </div>
          </div>
        </div>

          {
            conversationLoading ?
            <div className="conv-div pt-2 mt-1">
             <div className="d-flex justify-content-center pt-5">
             <div class="spinner-border text-info" role="status">
               <span class="visually-hidden">Loading...</span>
             </div>
             </div>
            </div>
            :
            messageList.length > 0 ?
            <div className="conv-div pt-2 mt-1 px-2 d-flex flex-column">
              {
              messageList.map((e,index) => {
            
                   createTimeline(e.createdAt,index)      

                return (  
                  timeline.current ?
                  <>
                  <div className="d-flex justify-content-center pb-2">
                    <div className="chat-date px-1">{chatDate.current}</div>
                  </div>
                  <div ref={scroll} className="pb-2">
                    {
                  e.sender === _id ?
                  <div className="px-2 pt-1 self">
                  <p className='mb-0'>{e.message}</p>
                  <div className="con-time text-muted pb-1">
                  <div className="status">
                    <span className='pe-1'>{time.current}</span>
                   <span>
                   {
                    e.status === "Seen"?
                    <FontAwesomeIcon className="check-seen " icon={faCheckDouble} size='xs'/>
                    : e.status === "Delivered" ?
                    <FontAwesomeIcon icon={faCheckDouble}  size='xs'/>
                    : e.status === "Sent" ?
                    <FontAwesomeIcon icon={faCheck} size='xs'/>
                    :null
                  
                   }
                   </span>
                  </div>
                  {/* <div className="">{time.current}</div> */}
                  </div>
                </div>
                :
                <div className="px-2 pt-1 conv">
                  <p className='mb-0'>{e.message}</p>
                <span className='con-time text-muted pb-1'>{time.current}</span>
                </div>  
              }
              </div>
                  </>
                  :
                <div ref={scroll} className="pb-2">
                {
                  e.sender === _id ?
                  <div className="px-2 pt-1 self">
                  <p className='mb-0'>{e.message}</p>
                  <div className="con-time text-muted pb-1">
                  <div className="status">
                    <span className='pe-1'>{time.current}</span>
                   <span>
                   {
                    e.status === "Seen"?
                    <FontAwesomeIcon className="check-seen " icon={faCheckDouble} size='xs'/>
                    : e.status === "Delivered" ?
                    <FontAwesomeIcon icon={faCheckDouble}  size='xs'/>
                    : e.status === "Sent" ?
                    <FontAwesomeIcon icon={faCheck} size='xs'/>
                    :null
                  
                   }
                   </span>
                  </div>
                  {/* <div className="">{time.current}</div> */}
                  </div>
                </div>
                :
                <div className="px-2 pt-1 conv">
                  <p className='mb-0'>{e.message}</p>
                <span className='con-time text-muted pb-1'>{time.current}</span>
                </div>
                }
              </div>
                )
              })
              }
            </div>
            :
            <div className="conv-div pt-2 mt-1 no-chat-messages">
              <p className='text-center '>No messages yet..!</p>
            </div>
            
          }
             
             
          <div className="d-flex align-items-center mx-2 mt-2">
            <textarea onChange={(e) =>setMessage(e.target.value)} value={message} className='text-area me-2 ps-1' placeholder='Message'/>
            <div onClick={sendMessageDetails} className="send-btn" >{send.current}</div>
          </div>
    </div>
    :
    <div className="no-chat text-center pt-3 text-muted">
      Start a conversation
    </div>
  }
  </div>
  )
}

export default Conversation