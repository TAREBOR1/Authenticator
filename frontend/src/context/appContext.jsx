import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const appContext= createContext();


export const AppContextProvider=({children})=>{
    const backendUrl= import.meta.env.VITE_backend_url
    const [isLoggedIn,setIsLoggedIn]=useState(false)
    const [userData,setUserData]=useState(false)
    const getAuthStatus= async()=>{
        try {
            const response = await axios.get(`${backendUrl}/api/auth/isAuth`,{
                withCredentials: true,
            })
            const Data=response.data;
            Data.success?setIsLoggedIn(Data.success):toast.error(Data.message); 
            getUserData();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
            toast.error(errorMessage);
        }
    }
    const getUserData = async()=>{
        try {
            const response = await axios.get(`${backendUrl}/api/user/getUser`,{
                withCredentials: true,
            })
            const Data=response.data;
            Data.success?setUserData(Data.userData):toast.error(Data.message);
        } catch (error) {
                const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
                  toast.error(errorMessage);
        }
     }
     useEffect(()=>{
        getAuthStatus()
     },[])
    const value={
          backendUrl,
          isLoggedIn,
         setIsLoggedIn,
          userData,
          setUserData,
          getUserData,

    }
    return(
        <appContext.Provider value={value}>
            {children}
        </appContext.Provider>
    )
}
