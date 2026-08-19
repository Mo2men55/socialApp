import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

export default function CreateReplyCard({ postId, commentId }) {
  const query = useQueryClient()
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      content: ''
    }
  })

  function createReplyFunc(formData) {
    return axios.post(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  }

  const { isPending, mutate } = useMutation({
    mutationFn: createReplyFunc,
    onSuccess: () => {
      reset()
      toast.success('Reply created successfully')
      query.invalidateQueries({ queryKey: ['getReplies', postId, commentId] })
      query.invalidateQueries({ queryKey: ['getComments', postId] })
    },
    onError: () => {
      toast.error('Cannot create reply')
    }
  })

  function handleCreateReply(data) {
    if (!data.content?.trim()) return

    const formData = new FormData()
    formData.append('content', data.content.trim())
    mutate(formData)
  }

  return (
    <form onSubmit={handleSubmit(handleCreateReply)} className="mt-2 ps-8">
      <div className="flex items-center gap-2">
        <input
          {...register('content')}
          type="text"
          className="w-full h-9 px-3 text-sm text-gray-700 border border-blue-500 rounded focus:outline-none shadow-sm"
          placeholder="Write a reply..."
        />
        <button
          disabled={isPending}
          type="submit"
          className="h-9 px-3 text-sm bg-blue-500 rounded text-white hover:bg-blue-400 disabled:opacity-60"
        >
          {isPending ? '...' : 'Reply'}
        </button>
      </div>
    </form>
  )
}
