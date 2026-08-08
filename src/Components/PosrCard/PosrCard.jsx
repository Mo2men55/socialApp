// import React from 'react'
import CommentCard from './../CommentCard/CommentCard';

export default function PosrCard({post}) {

  //  post.topComment=null | obj
  return <>
 {/* Example Post */}
<div className="bg-white p-4 rounded shadow w-1/2 mx-auto mb-5 mt-3">
  <header className="flex items-center space-x-3 mb-3">
    <img src={post.user.photo} className='h-10 w-10 rounded-full' alt={post.user.name} />
    <div>
      <p className="font-semibold">{post.user.name}</p>
      <p className="text-xs text-gray-500">{post.createdAt}</p>
    </div>
  </header>
{post.body &&   <p className="mb-3"> {post.body}</p>}
{post.image &&   <img src={post.image} alt={post.pody} className="rounded max-h-96 w-full object-cover mb-3" />}
  <div className="flex justify-between text-gray-600 text-sm font-semibold">
    <button className="flex items-center space-x-1 hover:text-blue-600">
      <i className="fas fa-thumbs-up" /><span>{post.likesCount  <= 0 ? '' : post.likesCount } Like</span>
    </button>
    <button className="flex items-center space-x-1 hover:text-blue-600">
      <i className="fas fa-comment" /><span>Comment</span>
    </button>
    <button className="flex items-center space-x-1 hover:text-blue-600">
      <i className="fas fa-share" /><span>{post.sharesCount <=0 ? '' : post.sharesCount } Share</span>
    </button>
  </div>


{post.topComment && <CommentCard comment={post.topComment} />}
</div>


  
  </>
}
