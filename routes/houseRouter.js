import { Router } from 'express'
import { HouseController } from '../controllers/houses.js'
import { verifyToken } from '../validations/verifyToken.js'
import multer from 'multer'
export const houseRouter = Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })

houseRouter.get('/', HouseController.getAllHouses)
houseRouter.post('/', verifyToken,
  upload.fields([{ name: 'mainImage', maxCount: 1 },
    { name: 'gallery', maxCount: 15 }]), HouseController.addHouse
)
houseRouter.get('/:id', HouseController.getHouseById)
houseRouter.patch('/:id', verifyToken, HouseController.editHouse)
houseRouter.delete('/:id', verifyToken, HouseController.deleteHouse)
