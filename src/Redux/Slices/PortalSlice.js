import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { toast } from "react-toastify"
import { env } from "../../Config"

const initialState = {
    chatUserName:"",
    chatNameErrorStatus:false,
    searchListLoading:true,
    searchList:[],
    chatListLoading:false,
    chatList:[],
    dropdown:false,
    chat:window.localStorage.getItem("chat") ? JSON.parse(window.localStorage.getItem("chat")) : {},
    preventDropdown:false,
    message : "",
    conversationLoading:false,
    messageList:[],
    socketOnlineMembers:[],
    onlineList:[],
    messageStatusUpdate:false,
    sendSocketMessage:false,
    sendSocketMessageDetails:{},
    newMessageStatus:false,
    newMessageDetails:{},
    localStorageCheck:false,
   
}

export const searchFriends = createAsyncThunk("portal/searchFriends",async(value,{rejectWithValue}) =>{
    try {
        let friendsList = await axios.get(`${env.api}/searchFriends/${value}`)
        return friendsList.data
    } catch (error) {
        toast.error(error.response.data.message,{toastId:Math.random()})
        return rejectWithValue(error.response.status)
    }
})

export const sendMessage = createAsyncThunk("portal/sendMessage",async(value,{rejectWithValue}) =>{
    try {
        let message = await axios.post(`${env.api}/addMessage`,value)

        return message.data
    } catch (error) {
        toast.error(error.response.data.message,{toastId:Math.random()})
        return rejectWithValue(error.response.status)
    }
})

export const getChatList = createAsyncThunk("portal/getChatList",async(value,{rejectWithValue}) => {
    try {
        let chatList = await axios.get(`${env.api}/chatList/${value}`)

    return chatList.data
    } catch (error) {
        toast.error(error.response.data.message,{toastId:Math.random()})
        return rejectWithValue(error.response.status)
    }
})

export const getChatMessages = createAsyncThunk("portal/getChatMessages",async(values,{rejectWithValue}) => {
    try {
        let chat = await axios.get(`${env.api}/getMessages?user=${values.user}&friend=${values.friend}`)
        return chat.data
    } catch (error) {
        toast.error(error.response.data.message,{toastId:Math.random()})
        return rejectWithValue(error.response.status)
    }
})

export const orderChatlist = createAsyncThunk("portal/orderChatlist",async(value) => {
    try {
         await axios.put(`${env.api}/orderChatlist`,value)
    } catch (error) {
        
    }
})

export const changeMessageStatus = createAsyncThunk("portal/changeMessageStatus",async(value) =>{
    try {console.log("Changeeeee");
         await axios.put(`${env.api}/clearNotification`,value)
    } catch (error) {
        
    }
})

export const createOfflineTime = createAsyncThunk("portal/createOfflineTime",async(value) =>{
    try {
        await axios.put(`${env.api}/createOfflineTime`,value)
    } catch (error) {
        
    }
})

export const getChatMember = createAsyncThunk("portal/getChatMember",async(senderId) =>{
    try {
        let member = await axios.get(`${env.api}/chatMember/${senderId}`)
        return member.data
    } catch (error) {
        toast.error(error.response.data.message,{toastId:Math.random()})
    }
})

const portalSlice = createSlice({
    name : "portal",
    initialState,
    reducers : {
     setChatUserName : (state,{payload}) =>{
        state.chatUserName = payload
     },
     setChatNameError : (state,{payload}) =>{
        state.chatNameErrorStatus = payload
     },
     setMessage : (state,{payload}) =>{
        state.message = payload
     },
     setDropdown : (state,{payload}) =>{
        state.dropdown = payload
     },
     clearInput : (state) =>{
        state.chatUserName = ""
        state.searchList = []
        state.chatNameErrorStatus = false
     },
     setPreventDropdown : (state,{payload}) =>{
        state.preventDropdown = payload
     },
     setChat : (state,{payload}) =>{
        state.chat = payload
        
        // window.localStorage.setItem("chat",JSON.stringify(payload))
     },
     addMessage : (state,{payload}) => {
        
        if(payload.sender === state.chat._id){ console.log("action if");
        if(state.messageList.findLastIndex(e => e._id === payload._id) === -1){
        state.messageList.push(payload)
        let index = state.chatList.findIndex(e => e._id === payload.sender)
        state.chatList[index].updatedAt = payload.timestamp
        state.newMessageStatus = true
        state.newMessageDetails = payload
        }
        }else{console.log("action else");
            state.newMessageStatus = true
            state.newMessageDetails = payload
        }
      
        
     },
     addSelfMessage : (state,{payload}) =>{
        state.messageList.push(payload)
        let index = state.chatList.findIndex(e => e._id === payload.receiverId)
        state.chatList[index].updatedAt = payload.createdAt
     },
     setChatlistOrder : (state,{payload}) =>{console.log(payload);
        let index = state.chatList.findIndex(e=>e._id === payload._id)
        if(index !== -1 ){
             state.chatList.splice(index,1)
             state.chatList.unshift(payload)
        }else{
            state.chatList.unshift(payload)
            if(state.socketOnlineMembers.some(e => e.userId === payload._id)) state.onlineList.unshift(payload)
        }
     },
     setOnlineList : (state,{payload}) => {
        state.socketOnlineMembers = payload.usersList
        let onlineMembers = []
        state.chatList.forEach(e => {
        if(payload.usersList.some(ele => e._id == ele.userId)) onlineMembers.push(e)
        })
        let onlineList = onlineMembers.filter(e => e._id !== payload._id)
        state.onlineList = onlineList
     },
     clearChatNoti : (state,{payload}) => {
        let index = state.chatList.findIndex(e=>e._id === payload)
        console.log(index);
        if(index !== -1) state.chatList[index].newMessage = false
        console.log(state.chatList[index].newMessage);
     },
     setMessageStatus : (state,{payload}) => {
        // console.log(state.messageList[0].message);
        if(state.chat._id === payload.friendId){
            payload.newMessageList.forEach(e =>{
                
               let index = state.messageList.findLastIndex(ele =>ele._id === e)
               state.messageList[index].status = "Seen"
            })
        }
     },
     setMessageStatusUpdate : (state) =>{
        state.messageStatusUpdate = false
     },
     setSocketMessage : (state) =>{
        state.sendSocketMessage = false
     },
     setChatlistNewMessage : (state,{payload}) =>{
        console.log("payload",payload);
        let index = state.chatList.findIndex(e => e._id === payload.sender)
        if(state.chatList[index].updatedAt !== payload.timestamp){
        state.chatList[index].newMessage = state.chatList[index].newMessage ? state.chatList[index].newMessage + 1 : 1 
        state.chatList[index].updatedAt = payload.timestamp
        let chatUser = state.chatList.splice(index,1)
        console.log("chatuser",chatUser[0]._id);
        state.chatList.unshift(chatUser[0])
        }
     },
     setNewMessageStatus : (state) =>{
       state.newMessageStatus = false
     },
    },
    extraReducers : (builder) =>{
        builder.addCase(searchFriends.pending,(state) =>{
            state.searchListLoading = true
        })
        builder.addCase(searchFriends.fulfilled,(state,{payload}) =>{
            state.searchList = payload
            state.searchListLoading = false
        })
        builder.addCase(sendMessage.fulfilled,(state,{payload}) => {
           if(!state.messageList.some(e => e._id === payload._id)){console.log("comess payload");
           let index = state.messageList.findLastIndex(e => e.tempId === payload.tempId)
           state.messageList.splice(index,1,payload)
           state.sendSocketMessageDetails._id = payload._id
           state.sendSocketMessageDetails.message = payload.message
           state.sendSocketMessageDetails.createdAt = payload.createdAt
           state.sendSocketMessageDetails.time = payload.timestamp
           state.sendSocketMessage = true
           }
           
        })
        builder.addCase(getChatList.pending,(state) =>{
            state.chatListLoading = true
            state.localStorageCheck = false
        })
        builder.addCase(getChatList.fulfilled,(state,{payload}) => {
            state.chatList = payload
            state.chatListLoading = false;
            state.localStorageCheck = true
        })
        builder.addCase(getChatList.rejected,(state) => {
            state.chatListLoading = false;
        })
        builder.addCase(getChatMessages.pending,(state) =>{
            state.conversationLoading = true
        })
        builder.addCase(getChatMessages.fulfilled,(state,{payload}) =>{
            state.messageList = payload
            state.conversationLoading = false
            state.messageStatusUpdate = true
        })
        builder.addCase(getChatMember.fulfilled,(state,{payload}) =>{
           if(state.chatList.findIndex(e => e._id === payload._id) === -1){
            state.chatList.unshift(payload)
            if(state.socketOnlineMembers.some(e => e.userId === payload._id)) state.onlineList.unshift(payload)
           }
        })


    }
})

export const {setChatUserName,setChatNameError,setMessage,
    setDropdown,clearInput,setPreventDropdown,setChat,addMessage,
    setChatlistOrder,setOnlineList,clearChatNoti,
    setMessageStatusUpdate,setMessageStatus,setSocketMessage,
    addSelfMessage,setChatlistNewMessage,setNewMessageStatus} = portalSlice.actions

export default portalSlice.reducer