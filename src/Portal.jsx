import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import ChatList from './Components/ChatList'
import Conversation from './Components/Conversation'
import Navbar from './Components/Navbar'
import Online from './Components/Online'
import Topbar from './Components/Topbar'
import { setLoggedin } from './Redux/Slices/UserSlice'

function Portal() {

const { isLoggedin } = useSelector(state => state.user)
const dispatch = useDispatch()

useEffect(() => {
  if(isLoggedin) dispatch(setLoggedin())
},[isLoggedin])

  return (
    <div>
        <Navbar/>
        <div className="sm-view">
        <Topbar/>
        <Outlet/>
        </div>
        <div className="lg-view">
        <div className="d-flex">
            <div className="col-3 col1">
            <ChatList/>
            </div>
            <div className="col-6 col1 conversation-div">
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