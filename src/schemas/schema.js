import * as zod from "zod"


export  let schema = zod.object({
  name: zod.string().nonempty('Name is Required ').min(3, 'Min Letters is 3').max(20, 'Min Letters is 20'),
  username: zod.string().nonempty('UserName is Required '),
  email: zod.string().nonempty('Email is Required ').email('Invalid Email'),
  password: zod.string().nonempty('Password is Required').regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character"),
  rePassword: zod.string().nonempty('RePassword is Required'),
  dateOfBirth: zod.coerce.date("Date is Required").refine((dataValue) => {
    let current = new Date().getFullYear();
    let age = current - dataValue.getFullYear();
    if (age > 20) {
      return true
    } else {
      return false
    }
  }, 'You Must be order than 20'),
  gender: zod.string().nonempty('Gender is Required'),

}).refine((obj) => {
  if (obj.password === obj.rePassword) {
    return true
  } else {
    return false
  }

}, { path: ['rePassword'], message: 'Re Password do not match with password' })