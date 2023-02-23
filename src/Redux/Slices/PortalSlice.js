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
    chat:{},
    preventDropdown:false,
    message : "",
    conversationLoading:false,
    messageList:[],
    timeline:false,
    onlineList:[{
        _id:"63e3660e0fa326123759b576",
        name:"karthi",
        profilePicture:"chatktm.jpg"
    }]
}

export const searchFriends = createAsyncThunk("portal/searchFriends",async(value,{rejectWithValue}) =>{
    try {console.log(value);
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


const portalSlice = createSlice({
    name : "portal",
    initialState,
    reducers : {
     setChatUserName : (state,{payload})    =>{
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
        let index = state.chatList.findIndex(e=>e._id === payload._id)
        if(index !== -1 ){
             state.chatList.splice(index,1)
             state.chatList.unshift(payload)
        }else{
            state.chatList.unshift(payload)
        }
        // window.localStorage.setItem("chat",JSON.stringify(payload))
     },
     setTimeline : (state,{payload}) => {
        state.timeline = payload
     },
     addMessage : (state,{payload}) => {
        state.messageList.push(payload)
     }
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
            // state.messageList.push(payload)
        })
        builder.addCase(getChatList.pending,(state) =>{
            state.chatListLoading = true
        })
        builder.addCase(getChatList.fulfilled,(state,{payload}) => {
            state.chatList = payload
            state.chatListLoading = false;
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
        })


    }
})

export const {setChatUserName,setChatNameError,setMessage,
    setDropdown,clearInput,setPreventDropdown,setChat,setTimeline,
    addMessage} = portalSlice.actions

export default portalSlice.reducer