
import { Navigate } from 'react-router-dom'

export default function ProtectRouter(props) {
    
    if(localStorage.getItem('token')){
       
        
        return props.children
    }else{
        
        
        return <Navigate to='/'/>
    }

}
