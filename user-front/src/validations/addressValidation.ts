import * as yup from 'yup'

export const AddressSchema = yup.object().shape({
  kecamatan: yup
    .string()
    .required('This is Required, Please Enter your Username'),
  kabkot: yup.string().required('This is Required, Please Enter your Password'),
  provinsi: yup
    .string()
    .required('This is Required, Please Enter your Password'),
  fullAddress: yup
    .string()
    .required('This is Required, Please Enter your Password'),
})
