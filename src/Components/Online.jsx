import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setChat } from '../Redux/Slices/PortalSlice'

function Online() {

const { onlineList } = useSelector(state => state.portal)
const dispatch = useDispatch()

let navigate = useNavigate()

const chatToConv = (e) =>{
  dispatch(setChat(e))
  if(window.innerWidth < 769){
    navigate("/portal")
  }
}


  return (
    <div>
        <div className='ps-2 mt-4 '>See who's online</div>
        <div className="onlinelist-div pt-4">
          {
            onlineList.length > 0 ? onlineList.map((e) => {
              return(
                <div onClick={()=>chatToConv(e)} className=" d-flex align-items-center py-1 ps-2 online-div">
            <div className="online-img-div">
            <img src={e.profilePicture ? `/assets/${e.profilePicture}` : "/assets/chatnew.jpg"} alt="" className='chatlist-img'/>
            <div className="online-mark"></div>
            </div>
            <span className='ps-2'>{e.name}</span>
            
          </div>
              )
            })
            :
            <div className="online-empty ps-2">None of your friends are online</div>
          }
      </div>
    </div>
  )
}

export default Online