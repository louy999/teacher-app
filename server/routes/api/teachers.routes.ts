import {Router, Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import config from '../../config'
import TeachersModel from '../../models/teachers.model'
const teacherModel = new TeachersModel()

const routes = Router()
//create
routes.post('/', async (req: Request, res: Response, next) => {
	try {
		const teacher = await teacherModel.create(req.body)
		res.json({
			status: 'success',
			data: {...teacher},
			message: 'teacher created successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get all
routes.get('/', async (req: Request, res: Response, next) => {
	try {
		const teacher = await teacherModel.getAll()
		res.json({
			status: 'success',
			data: teacher,
			message: 'users retrieved successfully',
		})
	} catch (err: any) {
		next(err.message)
	}
})
//get specific
routes.get('/:id', async (req: Request, res: Response, next) => {
	try {
		const teacher = await teacherModel.getOne(req.params.id as unknown as string)
		const token = jwt.sign({teacher}, config.tokenSecret as unknown as string)

		res.json({
			status: 'success',
			data: {...teacher, token},
			message: 'teacher retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//update
routes.patch('/', async (req: Request, res: Response, next) => {
	try {
		const teacher = await teacherModel.update(req.body)
		res.json({
			status: 'success',
			data: teacher,
			message: 'teacher updated successfully',
		})
	} catch (err) {
		next(err)
	}
})
//delete
routes.delete('/:id', async (req: Request, res: Response, next) => {
	try {
		const teacher = await teacherModel.delete(req.params.id as unknown as string)
		res.json({
			status: 'success',
			data: teacher,
			message: 'teacher deleted successfully',
		})
	} catch (err) {
		next(err)
	}
})
//login
// routes.post('/auth', async (req: Request, res: Response, next) => {
// 	try {
// 		const {phone, password} = req.body
// 		const teacher = await teacherModel.auth(phone, password)
// 		const token = jwt.sign({teacher}, config.tokenSecret as unknown as string)
// 		res.json({
// 			status: 'success',
// 			data: {...teacher, token},
// 			message: 'teacher auth successfully',
// 		})
// 	} catch (err) {
// 		next(err)
// 	}
// })

export default routes
