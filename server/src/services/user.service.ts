import { UserDTO } from '@/dto'
import { UserRepository } from '@/repository'
import { NotFoundError } from '@/utils'

class UserService {
  userRepository = new UserRepository()

  getUsers = async (page: number, limit: number) => {
    const result = await this.userRepository.getUsers(page, limit)

    if (!result) {
      throw new NotFoundError('Users Not Found')
    }
    return result
  }

  getUserById = async (id: string) => {
    const result = await this.userRepository.findById(id)

    if (!result) {
      throw new NotFoundError('Users Not Found')
    }
    return result
  }

  updateUser = async (id: string, payload: UserDTO) => {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new NotFoundError('Users Not Found')
    }

    const result = await this.userRepository.updateUser(user, payload)

    return result
  }

  updateProfilePicture = async (fileName: string, userId: string) => {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundError('User Not Found')
    }

    const result = await this.userRepository.updateProfilePicture(user, fileName)

    return result
  }

  deleteUser = async (id: string) => {
    const result = await this.userRepository.deleteUser(id)

    console.log(result)

    if (!result) {
      throw new NotFoundError('Users Not Found')
    }
    return result
  }
}

export default UserService
