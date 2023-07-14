/* eslint-disable prefer-regex-literals */
import Joi from 'joi'
import { Document } from 'mongoose'

export interface LoginDTO extends Document {
  username: string
  password: string
}

export interface RegisterDTO extends LoginDTO {
  fullName: string
  email: string
}

export const LoginValidate = {
  username: Joi.string().min(3).max(20).alphanum().required(),
  password: Joi.string().min(8).max(20).required()
}

export const LoginSchema = Joi.object(LoginValidate)

export const RegisterSchema = Joi.object({
  fullName: Joi.string().pattern(new RegExp('^[a-zA-Z ]{3,75}$')).required(),
  ...LoginValidate,
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required()
})
