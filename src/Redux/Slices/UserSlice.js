import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { env } from "../../Config";

const initialState = window.localStorage.getItem("loginDetails") ? 
{
    userDetails: JSON.parse(window.localStorage.getItem("loginDetails")),
    userName:"",
    nameErrorStatus:false,
    signupLoading:false,
    signupStatus:false,
    loginLoading:false,
    isLoggedin:false,
    forgotLoading:false,
    tempLoading:false,
    tempStatus:false,
    resetLoading:false,
    resetStatus:false,
    isLoggedout:false
}
:
{
userDetails : {
   name : "",
   email : "",
   id : ""
},
userName:"",
nameErrorStatus:false,
signupLoading:false,
signupStatus:false,
loginLoading:false,
isLoggedin:false,
forgotLoading:false,
tempLoading:false,
tempStatus:false,
resetLoading:false,
resetStatus:false,
isLoggedout:false

}

export const signup = createAsyncThunk("user/signup",async(value,{rejectWithValue}) =>{
try {console.log(value);
    let user = await axios.post(`${env.api}/register`,value)

    if (user.status === 200){
        toast.success(user.data.message,{toastId:Math.random()})
        return user.status
    }
} catch (error) {
    toast.error(error.response.data.message,{toastId:Math.random()})
    return rejectWithValue(error.response.status)
}
})

export const login = createAsyncThunk("user/login", async (values,{rejectWithValue}) => {
    try{
      let user = await axios.post(`${env.api}/login`,values)
      window.localStorage.setItem("token",user.data.token)
      let {name,email,_id,profilePicture} = user.data.user
      let loginDetails = {
          name,
          email,
          _id,
          profilePicture 
      }
      window.localStorage.setItem("loginDetails",JSON.stringify(loginDetails))
      return user.data.user
      }catch(error){
          toast.error(error.response.data.message,{toastId:Math.random()})
          return rejectWithValue(error.response.status)
      }
      
  })

  export const forgot = createAsyncThunk("user/forgot",async(value,{rejectWithValue}) =>{
    try {
        let user=await axios.post(`${env.api}/forgot`,value)
        
        if(user.status===200){
          toast.success(user.data.message,{toastId:Math.random()})
          return user.data
        }
      } catch (error) {
        toast.error(error.response.data.message,{toastId:Math.random()})
        return rejectWithValue(error.response.status)
      }
    })

    export const temporary = createAsyncThunk("user/temporary",async(values,{rejectWithValue}) =>{
    try {
        
        values.password = values.password.trim();

        let user = await axios.post(`${env.api}/temporarypass`, values);
       if (user.status === 200) {
          toast.info(user.data.message, { toastId: Math.random() });
          return user.data
        }
      } catch (error) {
        toast.error(error.response.data.message, { toastId: Math.random() });
        return rejectWithValue(error.response.status)
      }
})

export const resetPassword = createAsyncThunk("user/resetPassword",async(values,{rejectWithValue}) =>{
    try {
        delete values.confirm
        let password=await axios.post(`${env.api}/resetpass`,values)

        if(password.status===200){
            toast.success(password.data.message,{toastId:Math.random()})
            return password.data
        }
    } catch (error) {
        toast.error(error.response.data.message,{toastId:Math.random()})
        return rejectWithValue(error.response.status)
    }
})



const userSlice = createSlice({
    name : "user",
    initialState,
    reducers:{
    setSignupStatus : (state) =>{
        state.signupStatus = false
    },
    setTempStatus : (state) =>{
      state.tempStatus = false
    },
    setUserName : (state,{payload}) =>{
      state.userName = payload
    },
    setNameError : (state,{payload}) =>{
      state.nameErrorStatus = payload
    },
    logout : (state) =>{
      window.localStorage.clear()
      state.isLoggedout = true
      state.userDetails.user = ""
      state.userDetails.email = ""
      state.userDetails.id = ""
    },
    setLoggedin : (state) => {
      state.isLoggedin = false
    }
    },
    extraReducers: (builder) =>{
     builder.addCase(signup.pending,(state) =>{
        state.signupLoading = true
     })
     builder.addCase(signup.fulfilled,(state) =>{
        state.signupLoading = false
        state.signupStatus = true
        state.userName =""
     })
     builder.addCase(signup.rejected,(state) =>{
        state.signupLoading = false
     })
     builder.addCase(login.pending,(state) =>{
        state.loginLoading = true
     })
     builder.addCase(login.fulfilled,(state,action) =>{
        state.isLoggedin = true
        state.userDetails = action.payload
        state.loginLoading = false
        state.isLoggedout = false            
     })
     builder.addCase(login.rejected,(state,action) =>{
        state.loginLoading = false
     })
     builder.addCase(forgot.pending,(state) =>{
        state.forgotLoading = true
     })
    builder.addCase(forgot.fulfilled,(state) =>{
       state.forgotLoading = false
     })
    builder.addCase(forgot.rejected,(state) =>{
      state.forgotLoading = false
     })
    builder.addCase(temporary.pending,(state) =>{
      state.tempLoading = true
     })
    builder.addCase(temporary.fulfilled,(state) =>{
      state.tempLoading = false
      state.tempStatus = true
     })
    builder.addCase(temporary.rejected,(state) =>{
      state.tempLoading = false
     })
    builder.addCase(resetPassword.pending,(state) =>{
      state.resetLoading = true
     })
    builder.addCase(resetPassword.fulfilled,(state) =>{
      state.resetLoading = false
      state.resetStatus = true
     })
    builder.addCase(resetPassword.rejected,(state) =>{
      state.resetLoading = false
     })
    }
})

export const {setSignupStatus,setTempStatus,setUserName,setNameError,logout,
  setLoggedin} = userSlice.actions
export default userSlice.reducer
