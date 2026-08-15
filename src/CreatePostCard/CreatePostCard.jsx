import { Avatar, Input, TextArea } from '@heroui/react'
import {  useContext, useRef, useState } from 'react'
import { Button, Modal } from "@heroui/react";
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { AuthContext } from '../Context/AuthContext';


export default function CreatePostCard() {
  const {userData} = useContext(AuthContext)

  const query = useQueryClient()

  let image = useRef(null)

  let body = useRef(null)

  function prepareData() {
    let formData = new FormData()
    if (body.current.value) {
      formData.append('body', body.current.value)
    }
    if (image.current.files[0]) {
      formData.append('image', image.current.files[0])

    }
  
    
    return formData


  }
 
  
  function createPostFunc() {
    return axios.post(`https://route-posts.routemisr.com/posts`, prepareData(), {
      headers: {
        Authorization: ` Bearer ${localStorage.getItem('token')}`

      }
    })
  }

  const { data, isPending, mutate } = useMutation({
    mutationFn: createPostFunc,
    onSuccess: () => {
      if (body.current) {
        body.current.value = null
      }

      if (image.current) {
        image.current.value = null
        
      }
      setuploadedImg(null)


      toast.success("post created successfully")
      setTimeout(() => {
        query.invalidateQueries({ queryKey: ['getPost'], refetchType: 'all' })

      }, 1000);



    },
    onError: () => {
      toast.error("Cannot  create Post")
    }
  })


  console.log(data);

  const [uploadedImg, setuploadedImg] = useState(null)
  function hanleImagePreview(e) {
    let imgSrc = URL.createObjectURL(e.target.files[0])
    setuploadedImg(imgSrc)

  }

  function handleCloseImg() {
    setuploadedImg(null)
    image.current.value = null
  }
  return (
    <div className='bg-gray-200 p-4 rounded shadow w-1/2 mx-auto mb-5 mt-3'>
      <div className='flex gap-4 p-3 items-center'>
        <Avatar>
          <Avatar.Image alt={userData?.name} src={userData?.photo} />
        </Avatar>

        <Modal>
          <Button className='w-full' variant="secondary"> <TextArea readOnly fullWidth placeholder="What is on your mind ?" variant="primary" />
          </Button>
          <Modal.Backdrop>
            <Modal.Container>
              <Modal.Dialog className="">
                <Modal.CloseTrigger />
                <Modal.Header>

                  <Modal.Heading>Create Post</Modal.Heading>
                </Modal.Header>
                <Modal.Body>
                  <div className='flex gap-4 items-end'>
                    <TextArea
                      ref={body}
                      aria-label="Quick project update"
                      className="h-32 w-96"
                      placeholder="What is on your mind ....?"
                    />

                    <label htmlFor='img'>

                      <Input ref={image} onChange={hanleImagePreview} type="file" id='img' hidden />

                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>

                    </label>



                  </div>
                  {uploadedImg && <div className='relative'>
                    <img src={uploadedImg} alt="" />
                    <svg onClick={handleCloseImg} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 absolute top-0 right-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>


                  </div>}
                </Modal.Body>
                <Modal.Footer>
                  <Button isDisabled={isPending} onClick={mutate} className="w-full" slot="close">

                    {isPending ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 6-6m0 0 6 6m-6-6v12a6 6 0 0 1-12 0v-3" />
                    </svg> : ' Create Post'}

                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>

      </div>



    </div>
  )
}
