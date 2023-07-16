/* eslint-disable no-unreachable */
import { RegisterDTO } from '@/dto'
import { User } from '@/models'
import { InternalServerError, UnprocessableEntityError, logger } from '@/utils'

class UserRepository {
  getUsers = async () => {
    try {
      return true
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

  updateProfilePicture = async (fileName: string, userId: string) => {
    try {
      const user = await this.findById(userId)
      if (!user) {
        throw new UnprocessableEntityError('User Not Found')
      }
      user.userPic = fileName
      return await user.save()
    } catch (err: any) {
      logger.error('ERR = Update Profile Picture user ', err.message)
      throw new InternalServerError(err.message)
    }
  }
}

export default UserRepository
