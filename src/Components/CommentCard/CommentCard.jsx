// import React from 'react'

export default function CommentCard({comment}) {
  return <>

  <div className='border border-gray-400 p-3 mt-2'>
      <header className="flex items-center space-x-3 mb-3">
    <img src={comment?.commentCreator.photo} className='h-10 w-10 rounded-full' alt={comment?.commentCreator.name}/>
    <div>
      <p className="font-semibold">{comment?.commentCreator.name}</p>
      <p className="text-xs text-gray-500">{comment?.createdAt}</p>
    </div>
  </header>
<p className="mb-3"> {comment?.content}</p>
  </div>
  
  
  
  </>
}
