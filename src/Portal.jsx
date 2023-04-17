import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import ChatList from './Components/ChatList'
import Conversation from './Components/Conversation'
import Navbar from './Components/Navbar'
import Online from './Components/Online'
import Topbar from './Components/Topbar'
import { setLoggedin } from './Redux/Slices/UserSlice'
import { io } from 'socket.io-client'
import { env } from './Config'
import * as actionCreators from './Redux/Slices/PortalSlice'
import { bindActionCreators } from 'redux'

function Portal() {

const { isLoggedin,userDetails } = useSelector(state => state.user)
const dispatch = useDispatch()

const { addMessage,setOnlineList,setMessageStatus } = bindActionCreators(actionCreators,dispatch)

let { _id } = userDetails

useEffect(() => {
  if(isLoggedin) dispatch(setLoggedin())
},[isLoggedin])

const socket = useRef(null)

useEffect(()=>{
 socket.current = io(env.socket)
 socket.current.emit("addUser",_id)
},[])

useEffect(()=>{
  socket.current.on("getMessage", data => {console.log("getmessage");
    
    addMessage(data)
   
   }) 

   socket.current.on("usersList",usersList =>{console.log(usersList);
    setOnlineList({usersList,_id})
  })

  // return () =>{
  //  socket.current.off("usersList")
  //  socket.current.off("getMessage")
  // }
},[])

useEffect(() =>{
  socket.current.on("updateMessageStatus", (data) =>{console.log("update",data);
  
  setMessageStatus(data)
  
})

// return () =>{
//   socket.current.off("updateMessageStatus")
// }
},[])
  return (
    <div>
        <Navbar/>
        <div className="sm-view">
        <Topbar/>
        <Outlet/>
        </div>
        <div className="lg-view">
        <div className="d-flex">
            <div className="col-md-4 col-lg-3 col1">
            <ChatList/>
            </div>
            <div className="col-md-5 col-lg-6 col1 conversation-div">
                <Conversation/> 
            </div>
            <div className="col-3 col1">
              <Online/>
            </div>
        </div>
        </div>
    </div>
  )
}

export default Portal