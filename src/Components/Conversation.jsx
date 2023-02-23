import React, { useEffect, useRef, useState } from 'react'
import * as portalActions from '../Redux/Slices/PortalSlice'
import { bindActionCreators } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { addMessage } from '../Redux/Slices/PortalSlice'

function Conversation() {

const { chat,message,messageList,conversationLoading,timeline } = useSelector(state => state.portal)
const {userDetails} = useSelector(state =>state.user)
const { _id } = userDetails
const dispatch = useDispatch()

const {setMessage,sendMessage,getChatMessages,setTimeline,addMessage} = bindActionCreators(portalActions,dispatch)


useEffect(()=>{
 if(Object.keys(chat).length > 0) getChatMessages({user : _id,friend : chat._id})
},[chat])

const scroll = useRef()

useEffect(()=>{
  scroll.current?.scrollIntoView()
},[messageList])

let socket = useRef() 
// let newMessage = useRef(null)

// const newMessage = (data) =>{
//   console.log(data);
//   addMessage(data)
// }

// useEffect(() => {
//   if(newMessage ) addMessage(newMessage.current)
// },[newMessage])

// const [newMessage,setNewMessage] = useState(null)

// useEffect(() =>{
//   socket.current = io("http://localhost:3002")
//   socket.current.on("getMessage",(data,addMessage) => {
    // console.log(data);
    // setNewMessage(data)
    // console.log(newMessage);
    // console.log("setnew");
    // newMessage(data)
    // addMessage(data)
    // console.log(data);
    // newMessage.current = data
    // console.log(newMessage.current);
//    }) 
  
 
// },[])

// useEffect(() =>{
//   socket.current.emit("addUser",_id)
//   socket.current.on("usersList",(usersList)=>{
//     console.log(usersList);
    
//    })
  
 
// },[])


const sendMessageDetails = () =>{
  let correctMessage = message.trim()
  
if(correctMessage.length > 0) {
//   socket.current.emit("sendMessage",{
//     senderId : _id,
//     receiverId : chat._id,
//     message : correctMessage
//   })

  let value={
    members : [_id,chat._id],
    sender : _id,
    message:correctMessage
}

  sendMessage(value)
  setMessage("")
}
}
   let date = useRef()
   let month = useRef()
   let year = useRef() 
   let chatDate = useRef()
   let send = ">>"
useEffect(() =>{
   date.current = 0
   console.log(date.current);
},[])

  return (
    <div>
  { Object.keys(chat).length > 0 ?
    <div className='conv-main-div'>
       <div className="d-flex align-items-center conv-title-div">
        <div className="d-flex align-items-center ps-2">
            <img src={chat.profilePicture.length > 0 ? `/assets/${chat.profilePicture}` : "/assets/chatnew.jpg"} alt="" className='chatlist-img'/>
            <span className='ps-2 text-white'>{chat._id === _id ? `${chat.name} (You)` : chat.name}</span>
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
              messageList.map((e) => {
                // let timestamp = new Date(e.createdAt)
                // let mdate = timestamp.getDate()
                // let mmonth = timestamp.getMonth() + 1
                // let myear = timestamp.getFullYear()

                // date.current = mdate

                // console.log(timestamp);
                // console.log(mdate,mmonth,myear);
                // console.log(date.current);
                
                // // 3-1-2023

                // if(mdate === date.current){
                //   if(mmonth === month.current){
                //     if(myear === year.current){
                //         if(timeline)setTimeline(false)
                //     }else{
                //   setTimeline(true)
                //   date.current = mdate
                //   month.current = mmonth
                //   year.current = myear
                //     }
                //   }else{
                //   setTimeline(true)
                //   date.current = mdate
                //   month.current = mmonth
                //   year.current = myear
                //   }

                // }else{ console.log("elsee");
                //   setTimeline(true)
                //   date.current = mdate
                //   month.current = mmonth
                //   year.current = myear
                // }

                // if(timeline){
                //   let today = new Date()
                //   let tdate = today.getDate()
                //   if(tdate === mdate) chatDate = "Today"
                //   if(tdate - mdate === 1) chatDate = "Yesterday"
                //   if(tdate - mdate > 1) chatDate = `${mdate}-${mmonth}-${myear}`
                // }


                return (  
              //     timeline ?
              //     <>
              //     <div className="d-flex justify-content-center">
              //       <div className="chat-date">{chatDate}</div>
              //     </div>
              //     <div ref={scroll} className="pb-2">
              //   <div className={`px-2 pt-1 ${e.sender === _id ? `self` : `conv`}`}>
              //     <p className='mb-0'>{e.message}</p>
              //   <span className='con-time text-muted pb-1'>45 mins ago</span>
              //   </div>
              // </div>
              //     </>
              //     :
                <div ref={scroll} className="pb-2">
                <div className={`px-2 pt-1 ${e.sender === _id ? `self` : `conv`}`}>
                  <p className='mb-0'>{e.message}</p>
                <span className='con-time text-muted pb-1'>45 mins ago</span>
                </div>
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
             
             
          <div className="d-flex align-items-center m-2">
            <textarea onChange={(e) =>setMessage(e.target.value)} value={message} className='text-area me-2' placeholder='Message'/>
            <div onClick={sendMessageDetails} className="send-btn" >{send}</div>
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