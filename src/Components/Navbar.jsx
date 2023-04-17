import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../Redux/Slices/UserSlice'
import { io } from 'socket.io-client'
import { env } from '../Config'

function Navbar() {

const { isLoggedout,userDetails } = useSelector(state => state.user)
const dispatch = useDispatch()

let navigate = useNavigate()

const { _id } = userDetails

useEffect(()=>{
if(isLoggedout) navigate("/")
},[isLoggedout])

const socket = useRef(null)

useEffect(() =>{
socket.current = io(env.socket)
},[])

const logoutHandler = () =>{
socket.current.emit("removeUser",_id)
  dispatch(logout())
}

  return (
    <div className='navbar d-flex justify-content-between'>
     <h3 className='ps-2 navbar-chatbot'>LustigeZeit</h3>
     <div className="pe-2 text-center">
      <div className="d-flex justify-content-center">
       <div className="nav-icon">
        <img src={`${userDetails.profilePicture.length > 0 ? `/assets/${userDetails.profilePicture}` : `/assets/chatnew.jpg`}`} onClick={()=>logoutHandler()} className='navbar-img' />
        <div className="logout-div">Logout</div>
        </div>
        </div>
        <h6 className=' text-dark navbar-text p-0 m-0'>{userDetails.name}</h6>
        </div>
    </div>
  )
}

export default Navbar