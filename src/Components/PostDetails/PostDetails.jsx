import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { useParams } from 'react-router-dom'
import PosrCard from './../PosrCard/PosrCard';
import Spinner from '../Spinner/Spinner';

export default function PostDetails() {
    let {id} = useParams()

    
    function getPostDetailes() {
       return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
    }
     const { data, isError, error, isLoading } = useQuery({
    queryKey: ['getPost',id],
    queryFn: getPostDetailes,
    select:(data)=>{
        return data?.data?.data.post
    }
    
  })
  console.log(data);

  if (isLoading) {
      return <Spinner/>
    }
  
    if (isError) {
      return <div className='h-screen flex justify-center items-center'>
        <h2>{error.message}</h2>
      </div>
    }
    return (
        <>
        <PosrCard Home={false} post={data}/>
        </>
    )
}
