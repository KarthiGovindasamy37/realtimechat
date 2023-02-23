import React from 'react'
import { Link, NavLink } from 'react-router-dom'

function Topbar() {
  return (
      <div className="topbar d-flex justify-content-evenly align-items-center">
        <NavLink to='/portal/chat' className={({isActive}) => isActive ? `top-link text-white` : `top-link text-dark`}>Chats</NavLink>
        <NavLink to='/portal' className={({isActive}) => isActive ? `top-link text-white` : `top-link text-dark`} end >Conversation</NavLink>
        <NavLink to='/portal/online' className={({isActive}) => isActive ? `top-link text-white` : `top-link text-dark`}>Online</NavLink>
      </div>
    
  )
}

export default Topbar