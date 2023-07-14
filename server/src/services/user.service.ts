import { UserDTO } from '@/dto'
import { UserRepository } from '@/repository'

class UserService {
  userRepository = new UserRepository()

  getUsers = async (search: string, user: UserDTO) => {
    const result = await this.userRepository.getUsers()

    // if (result.length < 1) {
    //   throw new NotFoundError('Users Not Found')
    // }
    return result
  }
}

export default UserService
