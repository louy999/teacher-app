import {Router, Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import config from '../../config'
import StudentsModel from '../../models/students.model'
const studentsModel = new StudentsModel()

const routes = Router()
//create
routes.post('/:teacher_id', async (req: Request, res: Response, next) => {
	try {
		const student = await studentsModel.create(req.body, req.params.teacher_id)
		res.json({
			status: 'success',
			data: {...student},
			message: 'Student created successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get all
routes.get('/', async (req: Request, res: Response, next) => {
	try {
		const student = await studentsModel.getAll()
		res.json({
			status: 'success',
			data: student,
			message: 'users retrieved successfully',
		})
	} catch (err: any) {
		next(err)
	}
})
//get specific
routes.get('/:id', async (req: Request, res: Response, next) => {
	try {
		const student = await studentsModel.getOne(req.params.id as unknown as string)
		res.json({
			status: 'success',
			data: student,
			message: 'student retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by phone
routes.get('/phone/:phone', async (req: Request, res: Response, next) => {
	try {
		const student = await studentsModel.getByPhone(
			req.params.phone as unknown as string
		)
		res.json({
			status: 'success',
			data: student,
			message: 'student retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by name
routes.get('/name/:name', async (req: Request, res: Response, next) => {
	try {
		const student = await studentsModel.getByName(
			req.params.name as unknown as string
		)
		res.json({
			status: 'success',
			data: student,
			message: 'student retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by stage
routes.get('/stage/:stage', async (req: Request, res: Response, next) => {
	try {
		const student = await studentsModel.getByStage(
			req.params.stage as unknown as string
		)
		res.json({
			status: 'success',
			data: student,
			message: 'student retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by student
routes.get('/student/:student', async (req: Request, res: Response, next) => {
	try {
		const student = await studentsModel.getByTeacher(
			req.params.student as unknown as string
		)
		res.json({
			status: 'success',
			data: student,
			message: 'student retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//update
routes.patch('/', async (req: Request, res: Response, next) => {
	try {
		const student = await studentsModel.update(req.body)
		res.json({
			status: 'success',
			data: student,
			message: 'student updated successfully',
		})
	} catch (err) {
		next(err)
	}
})
//delete
routes.delete('/:id', async (req: Request, res: Response, next) => {
	try {
		const student = await studentsModel.delete(req.params.id as unknown as string)
		res.json({
			status: 'success',
			data: student,
			message: 'student deleted successfully',
		})
	} catch (err) {
		next(err)
	}
})
//login
routes.post('/auth', async (req: Request, res: Response, next) => {
	try {
		const {phone, password} = req.body
		const student = await studentsModel.auth(phone, password)
		const token = jwt.sign({student}, config.tokenSecret as unknown as string)
		res.json({
			status: 'success',
			data: {...student, token},
			message: 'student auth successfully',
		})
	} catch (err) {
		next(err)
	}
})

export default routes
