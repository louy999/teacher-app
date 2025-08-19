import {Router, Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import config from '../../config'
import ParentsModel from '../../models/parents.model'
const parentsModel = new ParentsModel()

const routes = Router()
//create
routes.post('/', async (req: Request, res: Response, next) => {
	try {
		const parent = await parentsModel.create(req.body)
		res.json({
			status: 'success',
			data: {...parent},
			message: 'parent created successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get all
routes.get('/', async (req: Request, res: Response, next) => {
	try {
		const parent = await parentsModel.getAll()
		res.json({
			status: 'success',
			data: parent,
			message: 'users retrieved successfully',
		})
	} catch (err: any) {
		next(err.message)
	}
})
//get specific
routes.get('/:id', async (req: Request, res: Response, next) => {
	try {
		const parent = await parentsModel.getOne(req.params.id as unknown as string)
		const token = jwt.sign({parent}, config.tokenSecret as unknown as string)

		res.json({
			status: 'success',
			data: {...parent, token},
			message: 'parent retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//update
routes.patch('/', async (req: Request, res: Response, next) => {
	try {
		const parent = await parentsModel.update(req.body)
		res.json({
			status: 'success',
			data: parent,
			message: 'parent updated successfully',
		})
	} catch (err) {
		next(err)
	}
})
//delete
routes.delete('/:id', async (req: Request, res: Response, next) => {
	try {
		const parent = await parentsModel.delete(req.params.id as unknown as string)
		res.json({
			status: 'success',
			data: parent,
			message: 'parent deleted successfully',
		})
	} catch (err) {
		next(err)
	}
})
// //login
// routes.post('/auth', async (req: Request, res: Response, next) => {
// 	try {
// 		const {phone, password} = req.body
// 		const parent = await parentsModel.auth(phone, password)
// 		const token = jwt.sign({parent}, config.tokenSecret as unknown as string)
// 		res.json({
// 			status: 'success',
// 			data: {...parent, token},
// 			message: 'parent auth successfully',
// 		})
// 	} catch (err) {
// 		next(err)
// 	}
// })

export default routes
