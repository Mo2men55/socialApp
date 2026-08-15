// import React from 'react'
import { Link } from 'react-router-dom';
import CommentCard from './../CommentCard/CommentCard';

import axios from 'axios';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import CreateCommentCard from './../../CreateCommentCard/CreateCommentCard';
import { useState } from 'react';


export default function PosrCard({ post, Home = true }) {
  const query = useQueryClient()
  const postId = post.id || post._id
  const [isLiked, setIsLiked] = useState(Boolean(post.liked || post.isLiked))
  const [likesCount, setLikesCount] = useState(post.likesCount || 0)

  function GetPosts() {
    return axios.get(`https://route-posts.routemisr.com/posts/${postId}/comments?page=1&limit=10`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  }
  const { data } = useQuery({
    queryKey: ['getComments', postId],
    queryFn: GetPosts,
    select: (data) => {
      return data?.data.data.comments
    },
    enabled: !Home
  })

  function likePost() {
    return axios.put(`https://route-posts.routemisr.com/posts/${postId}/like`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  }

  const { mutate: likeMutation, isPending: likePending } = useMutation({
    mutationFn: likePost,
    onSuccess: (response) => {
      const liked = response?.data?.data?.liked
      const count = response?.data?.data?.likesCount
      setIsLiked(Boolean(liked))
      if (typeof count === 'number') {
        setLikesCount(count)
      }
      query.invalidateQueries({ queryKey: ['getPosts'] })
      query.invalidateQueries({ queryKey: ['getProfilePost'] })
      query.invalidateQueries({ queryKey: ['getPost', postId] })
    },
    onError: (err) => {
      console.log('error in like', err?.response?.data || err.message)
    }
  })

  //  post.topComment=null | obj
  return <>
    {/* Example Post */}
    <div className="bg-white p-4 rounded shadow w-1/2 mx-auto mb-5 mt-3">
      <Link to={`/postDetailes/${postId}`}>
        <header className="flex items-center space-x-3 mb-3">
          <img src={post.user.photo} className='h-10 w-10 rounded-full' alt={post.user.name} />
          <div>
            <p className="font-semibold">{post.user.name}</p>
            <p className="text-xs text-gray-500">{post.createdAt}</p>
          </div>
        </header>
      </Link>
      {post.body && <p className="mb-3"> {post.body}</p>}
      {post.image && <img src={post.image} alt={post.body} className="rounded  w-full object-cover mb-3" />}
      <div className="flex justify-between text-gray-600 text-sm font-semibold">
        <button
          type="button"
          disabled={likePending}
          className={`flex items-center space-x-1 transition-colors ${isLiked ? 'text-blue-600' : 'hover:text-blue-600'}`}
          onClick={() => likeMutation()}
        >
          <i className={`fas fa-thumbs-up ${isLiked ? 'text-blue-600' : ''}`} />
          <span>{likesCount > 0 ? likesCount : ''} Like</span>
        </button>
        <button type="button" className="flex items-center space-x-1 hover:text-blue-600">
          <i className="fas fa-comment" /><span>Comment</span>
        </button>
        <button type="button" className="flex items-center space-x-1 hover:text-blue-600">
          <i className="fas fa-share" /><span>{post.sharesCount <= 0 ? '' : post.sharesCount} Share</span>
        </button>

      </div>
      <CreateCommentCard postId={postId} queryKey={!Home ? ['getPostComments'] : ['getPost']} />

      {Home === false && data && data.map((comment) => <CommentCard key={comment._id} comment={comment} />)}

      {Home && post.topComment && <CommentCard comment={post.topComment} />}
    </div>



  </>
}
