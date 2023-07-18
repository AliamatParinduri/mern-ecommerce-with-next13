/* eslint-disable no-unreachable */
import fs from 'fs'
import path from 'path'

import { RegisterDTO, UserDTO } from '@/dto'
import { User } from '@/models'
import { InternalServerError, logger } from '@/utils'
import { DefaultPicture } from '@config/index'

class UserRepository {
  getUsers = async (page: number, limit: number) => {
    try {
      const users = await User.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()

      const count = await User.count()

      return {
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      }
    } catch (err: any) {
      logger.error('ERR = get users ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  createUser = async (payload: RegisterDTO) => {
    try {
      return await User.create({
        fullName: payload.fullName,
        username: payload.username,
        email: payload.email,
        noHP: payload.noHP,
        password: payload.password
      })
    } catch (err: any) {
      logger.error('ERR = Registration new user ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  findOne = async (attr: object) => {
    try {
      return await User.findOne(attr)
    } catch (err: any) {
      logger.error('ERR = Find one product ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  findById = async (userId: string) => {
    try {
      return await User.findById(userId)
    } catch (err: any) {
      logger.error('ERR = Find user by id ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  updateUser = async (user: UserDTO, payload: UserDTO) => {
    try {
      user.fullName = payload.fullName
      user.username = payload.username
      user.noHP = payload.noHP

      return await user.save()
    } catch (err: any) {
      logger.error('ERR = update user data ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  updateProfilePicture = async (user: UserDTO, fileName: string) => {
    try {
      const pathImage = path.resolve(__dirname, '..', 'public', 'assets', 'users', user.userPic)
      if (fs.existsSync(pathImage) && user.userPic !== DefaultPicture) {
        fs.unlinkSync(pathImage)
      }

      user.userPic = fileName
      return await user.save()
    } catch (err: any) {
      logger.error('ERR = Update Profile Picture user ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  deleteUser = async (userId: string) => {
    try {
      return await User.findByIdAndRemove(userId)
    } catch (err: any) {
      logger.error('ERR = Delete user data ', err.message)
      throw new InternalServerError(err.message)
    }
  }
}

export default UserRepository
