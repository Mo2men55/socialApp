import { Button, Dropdown, Label, Modal, TextArea, useOverlayState } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

export default function DropDown({ post }) {
    const postId = post?.id || post?._id
    let navigate = useNavigate()
    const query = useQueryClient();
    const image = useRef(null)
    const editModalState = useOverlayState()
    const [body, setBody] = useState(post?.body || '')
    const [selectedImage, setSelectedImage] = useState(null)
    const [uploadedImg, setUploadedImg] = useState(post?.image || null)

    function resetEditForm() {
        setBody(post?.body || '')
        setSelectedImage(null)
        setUploadedImg(post?.image || null)
        if (image.current) {
            image.current.value = ''
        }
    }

    function openEditModal() {
        resetEditForm()
        editModalState.open()
    }

    function DeletePost() {
        return axios.delete(`https://route-posts.routemisr.com/posts/${postId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
    }

    function editPost() {
        if (!body.trim() && !selectedImage && !uploadedImg) {
            return Promise.reject(new Error('Empty post'))
        }

        const formData = new FormData()
        if (body.trim()) {
            formData.append('body', body.trim())
        }
        if (selectedImage) {
            formData.append('image', selectedImage)
        }

        return axios.put(`https://route-posts.routemisr.com/posts/${postId}`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
    }

    const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
        mutationFn: DeletePost,
        onSuccess: () => {
            toast.success('Post deleted successfully');
            query.invalidateQueries({ queryKey: ['getPosts'] });
            query.invalidateQueries({ queryKey: ['getProfilePost'] })
            query.removeQueries({ queryKey: ['getPost', postId] })
            navigate('/home');
        },
        onError: (err) => {
            toast.error('Error deleting post');
            console.log('Error deleting post', err?.response?.data || err.message);
        }
    })

    const { mutate: editMutation, isPending: isEditing } = useMutation({
        mutationFn: editPost,
        onSuccess: () => {
            toast.success('Post updated successfully');
            query.invalidateQueries({ queryKey: ['getPosts'] });
            query.invalidateQueries({ queryKey: ['getProfilePost'] })
            query.invalidateQueries({ queryKey: ['getPost', postId] })
            editModalState.close()
        },
        onError: (err) => {
            toast.error('Cannot update post');
            console.log('Error updating post', err?.response?.data || err.message);
        }
    })

    function handleImagePreview(e) {
        const file = e.target.files?.[0]
        if (!file) return
        setSelectedImage(file)
        setUploadedImg(URL.createObjectURL(file))
    }

    function handleCloseImg() {
        setUploadedImg(null)
        setSelectedImage(null)
        if (image.current) {
            image.current.value = ''
        }
    }

    return <>
        <Dropdown>
            <Button aria-label="Menu" variant="secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                </svg>
            </Button>
            <Dropdown.Popover>
                <Dropdown.Menu onAction={(key) => {
                    if (key === 'edit-post') openEditModal()
                    if (key === 'delete-post') deleteMutation()
                }}>
                    <Dropdown.Item id="edit-post" textValue="Edit post">
                        <Label>Edit Post</Label>
                    </Dropdown.Item>
                    <Dropdown.Item id="delete-post" textValue="Delete post" variant="danger">
                        <Label>{isDeleting ? 'Deleting...' : 'Delete Post'}</Label>
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
                            <Modal.Heading>Edit Post</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            <div className='flex gap-4 items-end'>
                                <TextArea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    aria-label="Edit post"
                                    className="h-32 w-96"
                                    placeholder="What is on your mind ....?"
                                />

                                <label htmlFor={`edit-img-${postId}`}>
                                    <input
                                        ref={image}
                                        onChange={handleImagePreview}
                                        type="file"
                                        id={`edit-img-${postId}`}
                                        accept="image/*"
                                        hidden
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                </label>
                            </div>
                            {uploadedImg && <div className='relative'>
                                <img src={uploadedImg} alt="" />
                                <svg onClick={handleCloseImg} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 absolute top-0 right-0 cursor-pointer">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </div>}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button isDisabled={isEditing} onClick={() => editMutation()} className="w-full">
                                {isEditing ? 'Loading...' : 'Update Post'}
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    </>
}
