import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/user.js'
import { validateUser } from '../validations/validation.js'

export class UserController {
  static async createUser (req, res) {
    const checkSecret = req.body.secret === process.env.TURBO_SECRET
    if (!checkSecret) return res.status(401).json({ message: 'You have to provide the correct secret code' })
    const checkEmail = req.body.email
    const isRegistered = await UserModel.findUser({ email: checkEmail })
    if (isRegistered) {
      return res.status(400).json({ message: 'Email already registered' })
    }
    const result = validateUser(req.body)
    if (!result.success) {
      return res.status(400).json({ message: JSON.parse(result.error.message) })
    }

    const { email, name, password } = result.data

    try {
      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = await UserModel.createUser({ email, name, password: hashedPassword })
      res.status(201).json(newUser)
    } catch (error) {
      console.error('Error during user registration:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async logIn (req, res) {
    const { email, password } = req.body
    const isUser = await UserModel.findUser({ email })
    if (isUser) {
      try {
        const passwordMatch = await bcrypt.compare(password, isUser.password)

        if (passwordMatch) {
          const token = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: '1h'
          })
          res.cookie('SSTK', token, {
            httpOnly: true
          })
          return res.json({ message: 'Login successful' })
        }

        return res.status(401).json({ message: 'Invalid password' })
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
      }
    }
    return res.status(401).json({ message: 'User not found' })
  }

  static async logOut (req, res) {
    res.clearCookie('SSTK')
    res.json({ message: 'Logout successful' })
  }
}
