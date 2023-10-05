import { User } from '../schemas/mongooseSchemas.js'

export class UserModel {
  static async findUser ({ email }) {
    const user = await User.findOne({ email })
    return user
  }

  static async createUser ({ email, name, password }) {
    const user = new User({ email, name, password })
    return await user.save()
  }
}
