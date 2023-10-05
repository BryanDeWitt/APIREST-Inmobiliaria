import { HouseModel } from '../models/house.js'
import { House } from '../schemas/mongooseSchemas.js'
import { validatePartialHouse, validateHouse } from '../validations/validation.js'

import { v2 as cloudinary } from 'cloudinary'

export class HouseController {
  static async getAllHouses (req, res) {
    const houses = await House.find()
    res.json(houses)
  }

  static async getHouseById (req, res) {
    const { id } = req.params
    const house = await HouseModel.getHouseById({ id })
    if (!house) {
      res.status(404).json({ message: 'House not found' })
    }
    res.json(house)
  }

  static async editHouse (req, res) {
    const { id } = req.params
    const house = await HouseModel.getHouseById({ id })
    if (!house) return res.status(404).json({ message: 'House not found' })
    const result = validatePartialHouse(req.body)
    if (!result.success) return res.status(400).json({ message: JSON.parse(result.error.message) })
    try {
      const resultData = result.data
      const updatedHouse = await HouseModel.patchHouse({ id, resultData })
      res.status(200).json(updatedHouse)
    } catch (error) {
      console.log(error)
    }
  }

  static async addHouse (req, res) {
    const result = validateHouse(req.body)
    if (!result.success) return res.status(400).json({ message: JSON.parse(result.error.message) })
    if (!req.files || !req.files.mainImage || !req.files.gallery) {
      return res.status(400).json({ error: 'No file(s) uploaded' })
    }

    const resultData = result.data

    try {
      const b64 = Buffer.from(req.files.mainImage[0].buffer).toString('base64')
      const mainImage = await cloudinary.uploader.upload(`data:${req.files.mainImage[0].mimetype};base64,${b64}`, {
        folder: 'inmobiliaria',
        width: 1200,
        height: 800,
        crop: 'fill'
      })
      const mainImageUrl = mainImage.secure_url
      const gallery = []
      for (const file of req.files.gallery) {
        const b64 = Buffer.from(file.buffer).toString('base64')
        const image = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${b64}`, {
          folder: 'inmobiliaria',
          width: 1200,
          height: 800,
          crop: 'fill'
        })
        gallery.push(image.secure_url)
      }

      const newHouse = await HouseModel.createHouse({ resultData, mainImageUrl, gallery })
      res.status(201).json(newHouse)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async deleteHouse (req, res) {
    const { id } = req.params
    const house = await HouseModel.getHouseById({ id })
    if (!house) return res.status(404).json({ message: 'House not found' })
    const images = house.images
    images.mainImage && await cloudinary
      .api.delete_resources([`inmobiliaria/${images.mainImage.split('/').pop().split('.')[0]}`],
        {
          type: 'upload',
          resource_type: 'image'
        })
    for (const image of images.gallery) {
      await cloudinary.api.delete_resources([`inmobiliaria/${image.split('/').pop().split('.')[0]}`],
        {
          type: 'upload',
          resource_type: 'image'
        })
    }

    try {
      const house = await HouseModel.deleteHouse({ id })
      if (!house) return res.status(404).json({ message: 'House not found' })
      res.status(204).end()
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
