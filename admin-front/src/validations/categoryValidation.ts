import * as yup from 'yup'

export const CategorySchema = yup.object().shape({
  category: yup
    .string()
    .min(3)
    .max(20)
    .required('This is Required, Please Enter your Category'),
  subCategory: yup
    .string()
    .matches(
      /^[a-zA-Z, 0-9]{3,20}$/,
      'only allow alpha numeric, space or comma(,)'
    )
    .required('This is Required, Please Enter your Sub Category'),
})
