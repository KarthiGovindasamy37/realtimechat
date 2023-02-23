import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./Slices/UserSlice";
import PortalSlice from "./Slices/PortalSlice";


const store = configureStore({
    reducer :{
        user : UserSlice,
        portal : PortalSlice
    }
})

export default store