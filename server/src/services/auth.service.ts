import { UnprocessableEntityError } from '@/utils'
import { UserRepository } from '@/repository'
import { LoginDTO, RegisterDTO } from '@/dto'
import { comparePassword, generatePassword } from '@/utils/hashing'

class AuthService {
  userRepository = new UserRepository()

  verifyAccount = async (userId: string) => {
    const userExists = await this.userRepository.findById(userId)

    if (!userExists) {
      throw new UnprocessableEntityError('User not found')
    }

    userExists.isActive = true
    return await userExists.save()
  }

  forgotPassword = async (email: string) => {
    const userExists = await this.userRepository.findOne({ email })

    if (!userExists) {
      throw new UnprocessableEntityError('User not found')
    }

    return userExists
  }

  register = async (payload: RegisterDTO) => {
    const emailExists = await this.userRepository.findOne({ email: payload.email })
    const userExists = await this.userRepository.findOne({ username: payload.username })
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
      throw new UnprocessableEntityError('Incorrect email or password')
    }

    if (!userExists.isActive) {
      throw new UnprocessableEntityError(`Login failed, Account doesn't active`)
    }

    return userExists
  }
}

export default AuthService
