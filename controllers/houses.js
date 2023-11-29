import { HouseModel } from '../models/house.js'
import { House } from '../schemas/mongooseSchemas.js'
import { validatePartialHouse, validateHouse } from '../validations/validation.js'

import { v2 as cloudinary } from 'cloudinary'

export class HouseController {
  static async getAllHouses (req, res) {
    try {
      const houses = await House.find()
      if (!houses || houses.length === 0) {
        return res.status(404).json({ message: 'No houses found' })
      }
      return res.json(houses)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async getHouseById (req, res) {
    try {
      const { id } = req.params
      const house = await HouseModel.getHouseById({ id })
      if (!house) {
        return res.status(404).json({ message: 'House not found' })
      }
      return res.json(house)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async addHouse (req, res) {
    try {
      const price = parseInt(req.body.price)
      const bathroom = parseInt(req.body.bathroom)
      const bedroom = parseInt(req.body.bedroom)
      const kitchen = parseInt(req.body.kitchen)
      const garage = req.body.garage === 'on'
      const garden = req.body.garden === 'on'
      const data = { ...req.body, price, bathroom, bedroom, kitchen, garage, garden }
      const result = await validateHouse(data)
      if (!result.success) {
        return res.status(400).json({ message: JSON.parse(result.error.message) })
      }
      if (!req.files || !req.files.mainImage || !req.files.gallery) {
        return res.status(400).json({ error: 'No file(s) uploaded' })
      }
      const resultData = result.data
      const b64MainImage = Buffer.from(req.files.mainImage[0].buffer).toString('base64')
      const mainImage = await cloudinary.uploader.upload(`data:${req.files.mainImage[0].mimetype};base64,${b64MainImage}`, {
        folder: 'inmobiliaria',
        width: 1200,
        height: 800,
        crop: 'fill'
      })
      const mainImageUrl = mainImage.secure_url
      const gallery = []
      for (const file of req.files.gallery) {
        const b64GalleryImage = Buffer.from(file.buffer).toString('base64')
        const galleryImage = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${b64GalleryImage}`, {
          folder: 'inmobiliaria',
          width: 1200,
          height: 800,
          crop: 'fill'
        })
        gallery.push(galleryImage.secure_url)
      }
      const newHouse = await HouseModel.createHouse({ resultData, mainImageUrl, gallery })
      res.status(201).json(newHouse)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async editHouse (req, res) {
    const { id } = req.params
    try {
      const house = await HouseModel.getHouseById({ id })
      if (!house) {
        return res.status(404).json({ message: 'House not found' })
      }
      const result = validatePartialHouse(req.body)
      if (!result.success) {
        return res.status(400).json({ message: JSON.parse(result.error.message) })
      }
      const resultData = result.data
      const updatedHouse = await HouseModel.patchHouse({ id, resultData })
      if (!updatedHouse) {
        return res.status(404).json({ message: 'House not found' })
      }
      return res.status(200).json(updatedHouse)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async deleteHouse (req, res) {
    const { id } = req.params
    try {
      const house = await HouseModel.getHouseById({ id })
      if (!house) {
        return res.status(404).json({ message: 'House not found' })
      }
      const images = house.images
      if (images.mainImage) {
        await cloudinary.api.delete_resources([`inmobiliaria/${images.mainImage.split('/').pop().split('.')[0]}`], {
          type: 'upload',
          resource_type: 'image'
        })
      }
      await Promise.all(
        images.gallery.map(async (image) => {
          await cloudinary.api.delete_resources([`inmobiliaria/${image.split('/').pop().split('.')[0]}`], {
            type: 'upload',
            resource_type: 'image'
          })
        })
      )
      const deletedHouse = await HouseModel.deleteHouse({ id })
      if (!deletedHouse) {
        return res.status(404).json({ message: 'House not found' })
      }
      return res.status(204).end()
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
