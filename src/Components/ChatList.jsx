import React, { useEffect,useRef } from 'react'
import * as portalActions from '../Redux/Slices/PortalSlice'
import { bindActionCreators } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function ChatList() {
 
  const { chatUserName,chatNameErrorStatus,searchList,dropdown,preventDropdown,
  searchListLoading,chatList,chatListLoading} = useSelector(state => state.portal)
  const {_id} = useSelector(state =>state.user.userDetails)
  const dispatch = useDispatch()

  const {setChatUserName,setChatNameError,searchFriends,setDropdown,
  clearInput,setChat,setPreventDropdown,getChatList} = bindActionCreators(portalActions,dispatch)
    
  useEffect(()=>{
    if(chatUserName.length > 0) searchFriends(chatUserName)
  },[chatUserName])

  useEffect(()=>{
   getChatList(_id)
  },[])
 

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
const setUserOnChat = (e) =>{
  setChat(e)
  setDropdown(false)
  setChatUserName("")
  if(window.innerWidth < 769){
    navigate("/portal")
  }  
}
 
const chatToConv = (e) =>{
  setChat(e)
  if(window.innerWidth < 769){
    navigate("/portal")
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
            <span className='ps-2'>{e._id === _id ? `${e.name} (You)`:e.name}</span>
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
              return (
              <div onClick={()=>chatToConv(e)} className="chatlist d-flex align-items-center py-1 ps-3">
              <img src={e.profilePicture.length > 0 ?`/assets/${e.profilePicture}`:"/assets/chatnew.jpg"} alt="" className='chatlist-img'/>
              <span className='ps-2'>{e._id === _id ? `${e.name} (You)`:e.name}</span>
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
              return (
              <div onClick={()=>chatToConv(e)} className="chatlist d-flex align-items-center py-1 ps-3">
              <img src={e.profilePicture.length > 0 ?`/assets/${e.profilePicture}`:"/assets/chatnew.jpg"} alt="" className='chatlist-img'/>
              <span className='ps-2'>{e._id === _id ? `${e.name} (You)` : e.name}</span>
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