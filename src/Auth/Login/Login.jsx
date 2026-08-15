import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { schemaLogin } from "../../schemas/scemaLogin";
import { AuthContext } from "../../Context/AuthContext";


export default function Register() {
  let { setUserToken } = useContext(AuthContext)
  let navigate = useNavigate();
  const [isLoadig, setisLoadig] = useState(false)
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(schemaLogin)
  })

  function submitForm(data) {
    setisLoadig(true);
    axios.post('https://route-posts.routemisr.com/users/signin', data)
      .then((response) => {
        console.log(response);


        if (response.data.message == 'signed in successfully') {
          Swal.fire({
            title: 'signed in successfully',
            icon: "success",
            draggable: true
          });
          setUserToken(response.data.data.token)
          localStorage.setItem('token', response.data.data.token);
          navigate('/profile');
        }
      }
      ).catch((err) => {

        const errorMessage = err.response?.data?.message
          || err.response?.data?.error
          || err.response?.data?.massage


        console.log(errorMessage);

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: errorMessage,
        });
      }).finally(() => {
        setisLoadig(false)
      })

  }

  return (
    <div className='bg-gray-300 min-h-screen p-3 mt-5'>
      <div className="w-1/2 bg-white rounded-md mx-auto p-5">
        <h2 className="text-blue-400 text-2xl font-bold text-center my-3 ">Login Now</h2>
        <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-4">
          <div>
            <Input {...register('email')} aria-label="Email" className="w-full" placeholder="Enter your email" />
            {formState.errors.email && formState.touchedFields.email ? <p className=" bg-gray-100 text-center  text-red-600 py-2 rounded-xl ">{formState.errors?.email.message} </p> : null}
          </div>
          <div>
            <Input {...register('password')} type="password" aria-label="Password" className="w-full" placeholder="Enter your password" />
            {formState.errors.password && formState.touchedFields.password ? <p className=" bg-gray-100 text-center  text-red-600 py-2 rounded-xl ">{formState.errors.password?.message}</p> : null}
          </div>


          <Button type="submit" isDisabled={isLoadig} className='my-5 w-full'>{isLoadig ? 'Loading...' : 'Submit'}</Button>


        </form>

      </div>

    </div>
  )
}

