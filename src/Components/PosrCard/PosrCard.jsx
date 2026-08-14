// import React from 'react'
import { Link } from 'react-router-dom';
import CommentCard from './../CommentCard/CommentCard';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export default function PosrCard({ post, Home = true }) {

  function GetPosts() {
    return axios.get(`https://route-posts.routemisr.com/posts/${post.id}/comments?page=1&limit=10`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  }
  const { data } = useQuery({
    queryKey: ['getComments', post.id],
    queryFn: GetPosts,
    select: (data) => {
      return data?.data.data.comments
    }
  })
  console.log(data);

  //  post.topComment=null | obj
  return <>
    {/* Example Post */}
    <div className="bg-white p-4 rounded shadow w-1/2 mx-auto mb-5 mt-3">
      <Link to={`/postDetailes/${post.id}`}>
        <header className="flex items-center space-x-3 mb-3">
          <img src={post.user.photo} className='h-10 w-10 rounded-full' alt={post.user.name} />
          <div>
            <p className="font-semibold">{post.user.name}</p>
            <p className="text-xs text-gray-500">{post.createdAt}</p>
          </div>
        </header>
      </Link>
      {post.body && <p className="mb-3"> {post.body}</p>}
      {post.image && <img src={post.image} alt={post.pody} className="rounded max-h-96 w-full object-cover mb-3" />}
      <div className="flex justify-between text-gray-600 text-sm font-semibold">
        <button className="flex items-center space-x-1 hover:text-blue-600">
          <i className="fas fa-thumbs-up" /><span>{post.likesCount <= 0 ? '' : post.likesCount} Like</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-blue-600">
          <i className="fas fa-comment" /><span>Comment</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-blue-600">
          <i className="fas fa-share" /><span>{post.sharesCount <= 0 ? '' : post.sharesCount} Share</span>
        </button>
      </div>

      {Home === false && data.map((comment) => <CommentCard key={comment._id} comment={comment} />)}

      {Home && post.topComment && <CommentCard comment={post.topComment} />}
    </div>



  </>
}
