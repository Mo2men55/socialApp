import * as zod from "zod"


export  let schemaLogin = zod.object({
  email: zod.string().nonempty('Email is Required ').email('Invalid Email'),
  password: zod.string().nonempty('Password is Required').regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character"),

})