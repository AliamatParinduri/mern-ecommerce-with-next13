import * as yup from 'yup'

export const OrderSchema = yup.object().shape({
  order: yup.object().required('This is Required, Please Enter your Category'),
  paymentOrder: yup
    .string()
    .required('This is Required, Please Enter your Sub Category'),
})
