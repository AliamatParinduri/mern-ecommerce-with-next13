import { UnprocessableEntityError } from '@/utils'
import { UserRepository } from '@/repository'
import { LoginDTO, RegisterDTO } from '@/dto'
import { comparePassword, generatePassword } from '@/utils/hashing'

class AuthService {
  userRepository = new UserRepository()

  verifyAccount = async (userId: string) => {
    const userExists = await this.userRepository.findById(userId)

    userExists.isActive = true
    return await userExists.save()
  }

  forgotPassword = async (email: string, from: string) => {
    const userExists = await this.userRepository.findOne({ email, isActive: true, isAdmin: from === 'admin' ? 1 : 0 })

    if (!userExists) {
      throw new UnprocessableEntityError('Email not found')
    }

    return userExists
  }

  register = async (payload: RegisterDTO) => {
    const userExists = await this.userRepository.findOne({ username: payload.username.toLowerCase() })
    const emailExists = await this.userRepository.findOne({ email: payload.email.toLowerCase() })
    if (emailExists || userExists) {
      throw new UnprocessableEntityError(`${emailExists ? 'Email' : 'Username'} already exists`)
    }

    payload.password = await generatePassword(payload.password)
    return await this.userRepository.createUser(payload)
  }

  login = async (payload: LoginDTO) => {
    const userExists = await this.userRepository.findOne({ username: payload.username })
    if (!userExists) {
      throw new UnprocessableEntityError('Incorrect username or password')
    }

    const compared = await comparePassword(payload.password, userExists.password)
    if (!compared) {
      throw new UnprocessableEntityError('Incorrect username or password')
    }

    if (!userExists.isActive) {
      throw new UnprocessableEntityError(`Login failed, Account doesn't active`)
    }

    return userExists
  }

  createNewPassword = async (userId: string, password: string) => {
    const user = await this.userRepository.findById(userId)
    const newPassword = await generatePassword(password)

    return await this.userRepository.createNewPassword(user, newPassword)
  }
}

export default AuthService
