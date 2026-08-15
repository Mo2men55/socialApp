import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { schema } from "../../schemas/schema";
import { AuthContext } from "../../Context/AuthContext";


export default function Register() {
  let {setUserToken}=useContext(AuthContext)
  let navigate = useNavigate();
  const [isLoadig, setisLoadig] = useState(false)
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      rePassword: '',
      dateOfBirth: '',
      gender: ''
    },
    mode: 'onBlur',
    resolver: zodResolver(schema)
  })

  function submitForm(data) {
    setisLoadig(true);
    axios.post('https://route-posts.routemisr.com/users/signup', data)
      .then((response) => {

        if (response.data.message == 'account created') {
          Swal.fire({
            title: 'Account created',
            icon: "success",
            draggable: true
          });
          setUserToken(response.data.data.token)
          localStorage.setItem('token', response.data.data.token);
          navigate('/');
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
        <h2 className="text-blue-400 text-2xl font-bold text-center my-3 ">Register Now</h2>
        <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-4">
          <div>
            <Input {...register('name')} aria-label="Name" className="w-full" placeholder="Enter your name" />
            {formState.errors.name && formState.touchedFields.name ? <p className=" bg-gray-100 text-center  text-red-600 py-2 rounded-xl ">{formState.errors.name?.message} </p> : null}
          </div>
          <div>
            <Input {...register('username')} aria-label="Name" className="w-full" placeholder="Enter your User name" />
            {formState.errors.username && formState.touchedFields.username ? <p className=" bg-gray-100 text-center  text-red-600 py-2 rounded-xl ">{formState.errors.username?.message} </p> : null}
          </div>
          <div>
            <Input {...register('email')} aria-label="Email" className="w-full" placeholder="Enter your email" />
            {formState.errors.email && formState.touchedFields.email ? <p className=" bg-gray-100 text-center  text-red-600 py-2 rounded-xl ">{formState.errors?.email.message} </p> : null}
          </div>
          <div>
            <Input {...register('password')} type="password" aria-label="Password" className="w-full" placeholder="Enter your password" />
            {formState.errors.password && formState.touchedFields.password ? <p className=" bg-gray-100 text-center  text-red-600 py-2 rounded-xl ">{formState.errors.password?.message}</p> : null}
          </div>
          <div>
            <Input {...register('rePassword')} type="password" aria-label="rePassword" className="w-full" placeholder="Enter your repassword" />
            {formState.errors.rePassword && formState.touchedFields.rePassword ? <p className=" bg-gray-100 text-center  text-red-600 py-2 rounded-xl ">{formState.errors.rePassword?.message} </p> : null}
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <Input {...register('dateOfBirth')} type="date" aria-label="dateOfBirth" className="w-full" placeholder="Enter your Date of Birth" />
              {formState.errors.dateOfBirth && formState.touchedFields.dateOfBirth ? <p className=" bg-gray-100 text-center  text-red-600 py-2 rounded-xl ">{formState.errors.dateOfBirth?.message} </p> : null}
            </div>
            <div className="w-1/2">

              <div className=" w-full">
                <select {...register('gender')} defaultValue={'Choose a Gender'} className="block rounded-xl w-full px-3 py-1.5 bg-neutral-secondary-medium border  border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:Gender">
                  <option value="" disabled className="text-gray-500">
                    Gender
                  </option>
                  <option className="" value="male">Male</option>
                  <option value="female">Female</option>


                </select>
                {formState.errors.gender && formState.touchedFields.gender ? <p className=" bg-gray-100 text-center  text-red-600 py-2 rounded-xl ">{formState.errors.gender?.message} </p> : null}


              </div>
            </div>

          </div>
          <Button type="submit" isDisabled={isLoadig} className='my-5 w-full'>{isLoadig ? 'Loading...' : 'Submit'}</Button>


        </form>

      </div>

    </div>
  )
}
