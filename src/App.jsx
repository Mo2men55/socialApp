
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from './Components/Layout/Layout'
import Login from './Auth/Login/Login'
import Register from './Auth/Register/Register'
import Profile from './Components/Profile/Profile'
import Home from './Components/Home/Home'
import Notfound from './Components/Notfound/Notfound'
import { AuthContextProvider } from './context/AuthContext'
import ProtectAuth from './ProtectAuth/ProtectAuth'
import ProtectRouter from './ProtectRouter/ProtectRouter'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PostDetails from './Components/PostDetails/PostDetails'
import { ToastContainer } from 'react-toastify';

const queryClient = new QueryClient()
function App() {
  let route = createBrowserRouter([
    {
      path: '', element: <Layout />, children: [
        { index: 'true', element: <ProtectAuth><Login /></ProtectAuth> },
        { path: 'register', element: <ProtectAuth><Register /></ProtectAuth> },
        { path: 'profile', element: <ProtectRouter ><Profile /></ProtectRouter> },
        { path: 'home', element: <ProtectRouter><Home /></ProtectRouter> },
        { path: 'postDetailes/:id', element: <ProtectRouter><PostDetails /></ProtectRouter> },

        { path: '*', element: <Notfound /> },


      ]
    },
  ])

  return (
    <>
      <QueryClientProvider client={queryClient}>

        <AuthContextProvider>
          <RouterProvider router={route} />
        <ToastContainer />
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  )
}

export default App
