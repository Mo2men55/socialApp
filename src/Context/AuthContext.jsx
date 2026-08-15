import { useEffect, createContext, useState } from "react";
import  axios  from 'axios';

export let AuthContext = createContext();

export function AuthContextProvider({ children }) {
    const [userToken, setUserToken] = useState(null)
    const [userData, setuserData] = useState(null)
    async function getUserData() {
        try {
            let { data } = await axios.get('https://route-posts.routemisr.com/users/profile-data', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setuserData(data.data.user)
        } catch (err) {
            if (err?.response?.status === 401) {
                localStorage.removeItem('token')
                setUserToken(null)
                setuserData(null)
            }
        }
    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setUserToken(localStorage.getItem('token'))
            getUserData()
        }
    }, [])

    return (
        <AuthContext.Provider value={{ userToken, setUserToken, userData, setuserData, getUserData }}>
            {children}
        </AuthContext.Provider>
    )
}