import { Router } from 'express'
import { HouseController } from '../controllers/houses.js'
import multer from 'multer'
export const houseRouter = Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })

houseRouter.get('/', HouseController.getAllHouses)
houseRouter.get('/:id', HouseController.getHouseById)
houseRouter.post('/',
  upload.fields([{ name: 'mainImage', maxCount: 1 },
    { name: 'gallery', maxCount: 15 }]), HouseController.addHouse
)
houseRouter.patch('/:id', HouseController.editHouse)
houseRouter.delete('/:id', HouseController.deleteHouse)
