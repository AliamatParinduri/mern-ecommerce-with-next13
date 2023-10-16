import * as yup from 'yup'

export const LoginSchema = yup.object().shape({
  username: yup
    .string()
    .min(3)
    .max(20)
    .matches(
      /^[a-zA-Z 0-9]{3,75}$/,
      'username can contain uppercase, lowercase and numbers'
    )
    .required('This is Required, Please Enter your Username'),
  password: yup
    .string()
    .min(8)
    .max(20)
    .required('This is Required, Please Enter your Password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\.$%\^&\*])(?=.{8,})/,
      'The password must contain uppercase, lowercase, numbers and special characters'
    ),
})

export const RegisterSchema = yup.object().shape({
  fullName: yup
    .string()
    .required('This is Required, Please Enter your Full Name')
    .min(3)
    .max(75)
    .matches(/^[a-zA-Z ]{3,75}$/, 'Please enter alphabets only'),
  username: yup
    .string()
    .min(3)
    .max(20)
    .matches(
      /^[a-zA-Z 0-9]{3,75}$/,
      'username can contain uppercase, lowercase and numbers'
    )
    .required('This is Required, Please Enter your Username'),
  email: yup
    .string()
    .email('This shows when you input an invalid email address')
    .required('This is Required, Please Enter your Email'),
  noHP: yup
    .string()
    .matches(
      /^[0-9]{11,13}$/,
      'No Handphone must be greater than or equal to 11 and less than or equal to 13'
    )
    .required('This is Required, Please Enter your Phone Number'),
  password: yup
    .string()
    .min(8)
    .max(20)
    .required('This is Required, Please Enter your Password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\.$%\^&\*])(?=.{8,})/,
      'The password must contain uppercase, lowercase, numbers and special characters'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), ''], 'Password mismatch')
    .required('This is Required, Please Enter your Confirm Password'),
})

export const RegisterUserByAdminSchema = yup.object().shape({
  fullName: yup
    .string()
    .required('This is Required, Please Enter your Full Name')
    .min(3)
    .max(75)
    .matches(/^[a-zA-Z ]{3,75}$/, 'Please enter alphabets only'),
  username: yup
    .string()
    .min(3)
    .max(20)
    .matches(
      /^[a-zA-Z 0-9]{3,75}$/,
      'username can contain uppercase, lowercase and numbers'
    )
    .required('This is Required, Please Enter your Username'),
  email: yup
    .string()
    .email('This shows when you input an invalid email address')
    .required('This is Required, Please Enter your Email'),
  noHP: yup
    .string()
    .matches(
      /^[0-9]{11,13}$/,
      'No Handphone must be greater than or equal to 11 and less than or equal to 13'
    )
    .required('This is Required, Please Enter your Phone Number'),
})

export const ForgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('This shows when you input an invalid email address')
    .required('This is Required, Please Enter your Email'),
})

export const NewPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required('This is Required, Please Enter your Password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\.$%\^&\*])(?=.{8,})/,
      'The password must contain uppercase, lowercase, numbers and special characters'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), ''], 'Password mismatch')
    .required('This is Required, Please Enter your Confirm Password'),
})
