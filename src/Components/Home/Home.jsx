
import axios from "axios"
import Spinner from "../Spinner/Spinner"
import PosrCard from "../PosrCard/PosrCard"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Navigate } from "react-router-dom"
import CreatePostCard from "../../CreatePostCard/CreatePostCard"



export default function Home() {
 
  const [Home] = useState(true)
  function getAllPosts() {
    return axios.get('https://route-posts.routemisr.com/posts', {
      params: {
        sort: '-createdAt',
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

  }
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['getPosts'],
    queryFn: getAllPosts,
    select:(data)=>{
      return data?.data.data.posts
    }
  })

  if (isLoading) {
    return <Spinner />
  }

  if (isError) {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token')
      return <Navigate to="/" replace />
    }

    return <div className='h-screen flex justify-center items-center'>
      <h2>{error?.message || 'Something went wrong'}</h2>
    </div>
  }
  return <>
  <CreatePostCard/>
    {data?.map((post) => { return <PosrCard key={post._id} Home={Home} post={post} /> })}

  </>
}
