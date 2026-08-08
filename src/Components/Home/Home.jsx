
import axios from "axios"
import { useEffect, useState } from "react"
import Spinner from "../Spinner/Spinner"
import PosrCard from "../PosrCard/PosrCard"
import { useQuery } from "@tanstack/react-query"



export default function Home() {
  // const [error, seterror] = useState(null)
  // const [isError, setisError] = useState(false)
  // const [isLoading, setisLoading] = useState(true)
  // const [posts, setposts] = useState([])


  // function getPosts() {
  //   axios.get('https://route-posts.routemisr.com/posts', {
  //     params: {},
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('token')}`
  //     }
  //   })
  //     .then((response) => {
  //       setposts(response.data.data.posts);
  //     })
  //     .catch((err) => {
  //       setisError(true);
  //       console.log(err.response.dara.message);

  //       seterror('ERORR no posts to display');
  //     }).finally(() => {
  //       setisLoading(false);
  //     }
  //     )

  // }

  function getAllPosts() {
    return axios.get('https://route-posts.routemisr.com/posts', {
      params: {},
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

  }
  const { data, isError, error, isLoading } = useQuery({
    queryKey: 'getPosts',
    queryFn: getAllPosts,
    select:(data)=>{
      return data?.data.data.posts
    }
  })
  console.log(data)
  // useEffect(() => {
  //   getPosts()
  // }, [])

  if (isLoading) {
    return <Spinner />
  }

  if (isError) {
    return <div className='h-screen flex justify-center items-center'>
      <h2>{error}</h2>
    </div>
  }
  return <>

    {data?.map((post) => { return <PosrCard key={post._id} post={post} /> })}

  </>
}
