import { Button, Dropdown, Label, Modal, TextArea, useOverlayState } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function DropDownComment({ postId, comment }) {
    const commentId = comment?._id
    const query = useQueryClient()
    const editModalState = useOverlayState()
    const [content, setContent] = useState(comment?.content || '')

    function resetEditForm() {
        setContent(comment?.content || '')
    }

    function openEditModal() {
        resetEditForm()
        editModalState.open()
    }

    function deleteComment() {
        return axios.delete(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
    }

    function updateComment() {
        if (!content.trim()) {
            return Promise.reject(new Error('Empty comment'))
        }

        const formData = new FormData()
        formData.append('content', content.trim())

        return axios.put(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
    }

    const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
        mutationFn: deleteComment,
        onSuccess: () => {
            toast.success('Comment Deleted Successfully')
            query.invalidateQueries({ queryKey: ['getComments', postId] })
        }
    })

    const { mutate: updateMutation, isPending: isUpdating } = useMutation({
        mutationFn: updateComment,
        onSuccess: () => {
            toast.success('Comment Updated Successfully')
            query.invalidateQueries({ queryKey: ['getComments', postId] })
            editModalState.close()
        },
        onError: () => {
            toast.error('Cannot update comment')
        }
    })

    return <>
        <Dropdown>
            <Button aria-label="Menu" variant="secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                </svg>
            </Button>
            <Dropdown.Popover>
                <Dropdown.Menu onAction={(key) => {
                    if (key === 'edit-comment') openEditModal()
                    if (key === 'delete-comment') deleteMutation()
                }}>
                    <Dropdown.Item id="edit-comment" textValue="Edit comment">
                        <Label>Edit Comment</Label>
                    </Dropdown.Item>
                    <Dropdown.Item id="delete-comment" textValue="Delete comment" variant="danger">
                        <Label>{isDeleting ? 'Deleting...' : 'Delete Comment'}</Label>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>

        <Modal state={editModalState}>
            <span className="hidden" aria-hidden="true" />
            <Modal.Backdrop>
                <Modal.Container>
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header>
                            <Modal.Heading>Edit Comment</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            <TextArea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                aria-label="Edit comment"
                                className="h-32 w-full"
                                placeholder="Edit your comment..."
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button isDisabled={isUpdating} onClick={() => updateMutation()} className="w-full">
                                {isUpdating ? 'Loading...' : 'Update Comment'}
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    </>
}
