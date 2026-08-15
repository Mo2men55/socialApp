
import  axios  from 'axios';
import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../Context/AuthContext';
import Spinner from '../Spinner/Spinner';


export default function Profile() {
  let { userData } = useContext(AuthContext)

  function getProfilePosts() {
    return axios.get(`https://route-posts.routemisr.com/users/${userData._id}/posts`, {
      headers: {
        Authorization: ` Bearer ${localStorage.getItem('token')}`
      }
    })
  }

  const { data, isLoading, error ,isError } = useQuery({
    queryKey: ['getProfilePost'],
    queryFn: getProfilePosts
  })

  console.log(data?.data.data.posts);

    if (isLoading) {
      return <Spinner />
    }
  
    if (isError) {
      return <div className='h-screen flex justify-center items-center'>
        <h2>{error}</h2>
      </div>
    }



  return <>
    <div className="relative w-1/2 mx-auto mt-5 bg-white shadow-xl rounded-lg overflow-hidden animate-fade-in">
      {/* Cover Image Section */}
      <div className="h-40 bg-cover bg-center cover-gradient-fallback" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ")' }}>
        {/* You can replace the URL with your desired cover image */}
      </div>
      {/* Profile Picture and Details Section */}
      <div className="relative px-6 -mt-20">
        {/* Profile Picture */}
        <img className="w-32 h-32 rounded-full border-4 border-white mx-auto shadow-md object-cover" src={userData?.photo} alt="Profile Picture" />
        {/* You can replace the URL with your desired profile picture */}
        {/* User Info */}
        <div className="text-center mt-4">
          <h2 className="text-2xl font-semibold text-gray-800">{userData?.name}</h2>
          <p className="text-gray-600"> dateOfBirth : {userData?.dateOfBirth}</p>
          <p className="text-sm text-gray-500 mt-2">Passionate about creating intuitive and beautiful web experiences.</p>
        </div>
        {/* Optional: Social Links or Stats */}
        <div className="flex justify-center mt-6 space-x-4 border-t pt-6 border-gray-100">
          <div className="text-center">
            <p className="font-bold text-lg text-gray-800">1.2K</p>
            <p className="text-gray-500 text-sm">Followers</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-gray-800">{userData?.followingCount}</p>
            <p className="text-gray-500 text-sm">Following</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-gray-800">50</p>
            <p className="text-gray-500 text-sm">Projects</p>
          </div>
        </div>
        {/* Call to Action Button (Optional) */}
        <div className="mt-8 mb-4">
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">
            Connect
          </button>
        </div>
      </div>
    </div>


    <div className='mt-4'>
      {data?.data.data.posts.map((post) => { return <PosrCard post={post} /> })}

    </div>


  </>
}
