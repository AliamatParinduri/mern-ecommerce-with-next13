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
    .required('This is rendered if you try to submit an empty email field'),
  password: yup
    .string()
    .min(8)
    .max(20)
    .required('This is rendered if you try to submit an empty email field')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      'The password must contain uppercase, lowercase, numbers and special characters'
    ),
})

export const RegisterSchema = yup.object().shape({
  fullName: yup
    .string()
    .required('This is rendered if you try to submit an empty email field')
    .min(3)
    .max(75)
    .matches(
      /^[a-zA-Z ]{3,75}$/,
      'Full Name must be at least 3 characters long'
    ),
  username: yup
    .string()
    .min(3)
    .max(20)
    .matches(
      /^[a-zA-Z 0-9]{3,75}$/,
      'username can contain uppercase, lowercase and numbers'
    )
    .required('This is rendered if you try to submit an empty email field'),
  email: yup
    .string()
    .email('This shows when you input an invalid email addres')
    .required('This is rendered if you try to submit an empty email field'),
  noHP: yup
    .string()
    .matches(
      /^[0-9]{11,13}$/,
      'No Handphone must be greater than or equal to 11 and less than or equal to 13'
    )
    .required('This is rendered if you try to submit an empty email field'),
  password: yup
    .string()
    .min(8)
    .max(20)
    .required('This is rendered if you try to submit an empty email field')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      'The password must contain uppercase, lowercase, numbers and special characters'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), ''], 'Password mismatch')
    .required('This is rendered if you try to submit an empty email field'),
})

export const ForgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('This shows when you input an invalid email addres')
    .required('This is rendered if you try to submit an empty email field'),
})

export const NewPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required('This is rendered if you try to submit an empty email field')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      'The password must contain uppercase, lowercase, numbers and special characters'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), ''], 'Password mismatch')
    .required('This is rendered if you try to submit an empty email field'),
})
