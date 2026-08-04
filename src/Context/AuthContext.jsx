import { createContext, useState } from "react";


export let AuthContext = createContext();

export function AuthContextProvider({ children }) {
    const [userToken, setUserToken] = useState(()=>{return localStorage.getItem('token')})
    return (
        <AuthContext.Provider value={{userToken ,setUserToken}}>
            {children}

        </AuthContext.Provider>
    )
}