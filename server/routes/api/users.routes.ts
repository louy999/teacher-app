import {Router, Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import config from '../../config'
import UsersModel from '../../models/users.model'
import validateTokenMiddleware from '../../middleware/authentication.middleware'
import TeachersModel from '../../models/teachers.model'
import StudentsModel from '../../models/students.model'
import AssistantsModel from '../../models/assistants.model'
const teachersModel = new TeachersModel()
const studentsModel = new StudentsModel()
const assistantsModel = new AssistantsModel()

const usersModel = new UsersModel()

const routes = Router()
//create
routes.post('/', async (req: Request, res: Response, next) => {
	try {
		const user = await usersModel.create(req.body)
		res.json({
			status: 'success',
			data: {...user},
			message: 'user created successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get all
routes.get('/', async (req: Request, res: Response, next) => {
	try {
		const user = await usersModel.getAll()
		res.json({
			status: 'success',
			data: user,
			message: 'users retrieved successfully',
		})
	} catch (err: any) {
		next(err.message)
	}
})
//get specific
routes.get(
	'/:id',
	validateTokenMiddleware,
	async (req: Request, res: Response, next) => {
		try {
			const user = await usersModel.getOne(req.params.id as unknown as string)
			res.json({
				status: 'success',
				data: user,
				message: 'user retrieved successfully',
			})
		} catch (err) {
			next(err)
		}
	}
)
//get specific by name
routes.get('/name/:name', async (req: Request, res: Response, next) => {
	try {
		const user = await usersModel.getOneFromName(
			req.params.name as unknown as string
		)
		res.json({
			status: 'success',
			data: user,
			message: 'user retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//update
routes.patch('/', async (req: Request, res: Response, next) => {
	try {
		const user = await usersModel.update(req.body)
		res.json({
			status: 'success',
			data: user,
			message: 'user updated successfully',
		})
	} catch (err) {
		next(err)
	}
})
//delete
routes.delete('/:id', async (req: Request, res: Response, next) => {
	try {
		const user = await usersModel.delete(req.params.id as unknown as string)
		res.json({
			status: 'success',
			data: user,
			message: 'user deleted successfully',
		})
	} catch (err) {
		next(err)
	}
})
//login
routes.post('/auth', async (req: Request, res: Response, next) => {
	try {
		const {phone, password} = req.body

		const user = await usersModel.auth(phone, password)

		let roleData = null

		if (user?.role === 'teachers') {
			roleData = await teachersModel.getOne(user.id as unknown as string)
		} else if (user?.role === 'students') {
			roleData = await studentsModel.getOne(user.id as unknown as string)
		} else if (user?.role === 'assistants') {
			roleData = await assistantsModel.getOne(user.id as unknown as string)
		}

		const tokenUser = jwt.sign({user}, config.tokenSecret as string)
		const tokenData = jwt.sign({roleData}, config.tokenSecret as string)

		res.json({
			status: 'success',
			data: {tokenUser, tokenData},
			message: 'user auth successfully',
		})
	} catch (err) {
		next(err)
	}
})

export default routes
