import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../Redux/Slices/UserSlice'

function Navbar() {

const { isLoggedout,userDetails } = useSelector(state => state.user)
const dispatch = useDispatch()

let navigate = useNavigate()

useEffect(()=>{
if(isLoggedout) navigate("/")
},[isLoggedout])

  return (
    <div className='navbar d-flex justify-content-between'>
     <h3 className='ps-2 navbar-chatbot'>LustigeZeit</h3>
     <div className="pe-2 text-center">
      <div className="d-flex justify-content-center">
       <div className="nav-icon">
        <img src={`${userDetails.profilePicture.length > 0 ? `/assets/${userDetails.profilePicture}` : `/assets/chatnew.jpg`}`} onClick={()=>dispatch(logout())} className='navbar-img' />
        <div className="logout-div">Logout</div>
        </div>
        </div>
        <h6 className=' text-dark navbar-text p-0 m-0'>{userDetails.name}</h6>
        </div>
    </div>
  )
}

export default Navbar