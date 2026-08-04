
import { Navigate } from 'react-router-dom'


export default function ProtectAuth(props) {
    
    if(localStorage.getItem('token')){
        return <Navigate to='/home'/>
    }else{
        return props.children 
    }

}
