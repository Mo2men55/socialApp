import axios from "axios"
import { useEffect, useState } from "react"


export default function Home() {
  const [error, seterror] = useState(null)
  const [isError, setisError] = useState(false)
  const [isLoading, setisLoading] = useState(true)
  const [posts, setposts] = useState([])


  function getPosts() {
    axios.get('https://route-posts.routemisr.com/posts', {
      params: {},
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((response) => {
        setposts(response.data.data.posts);
      })
      .catch((err) => {
        setisError(true);
        console.log(err.response.dara.message);

        seterror('ERORR no posts to display');
      }).finally(() => {
        setisLoading(false);
      }
      )

  }

useEffect(()=>{
getPosts()
},[])
  
  return (
    <div>
      <h2>Home</h2>
    </div>
  )
}
