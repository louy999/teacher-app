import {Router, Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import config from '../../config'
import UsersModel from '../../models/users.model'
import validateTokenMiddleware from '../../middleware/authentication.middleware'
import TeachersModel from '../../models/teachers.model'
import StudentsModel from '../../models/students.model'
import AssistantsModel from '../../models/assistants.model'
import ParentsModel from '../../models/parents.model'
import StudentsTeacherModel from '../../models/studentsTeachers.model'
import ParentsStudentsModel from '../../models/ParentsStudents.model'
import TeachersAssistModel from '../../models/teachersAssist.model'
const teachersModel = new TeachersModel()
const studentsModel = new StudentsModel()
const assistantsModel = new AssistantsModel()
const parentsModel = new ParentsModel()
const usersModel = new UsersModel()
const studentsTeacherModel = new StudentsTeacherModel()
const parentsStudentsModel = new ParentsStudentsModel()
const teachersAssistModel = new TeachersAssistModel()

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
			const user = await usersModel.getOne(
				req.params.id as unknown as unknown as string
			)
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
			req.params.name as unknown as unknown as string
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
		const user = await usersModel.delete(
			req.params.id as unknown as unknown as string
		)
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
		const {phone, password, teacher_id} = req.body

		const user = await usersModel.auth(phone, password)

		if (!user) {
			return next('Invalid phone or password')
		}

		let roleData = null

		if (user.role === 'teachers') {
			if (teacher_id === user.id) {
				roleData = await teachersModel.getOne(
					user.id as unknown as unknown as string
				)
			} else {
				throw new Error('this number not subscribe with teacher')
			}
		} else if (user.role === 'students') {
			const student = await studentsTeacherModel.getByTeacherIdStudentId(
				teacher_id as unknown as string,
				user.id as unknown as string
			)

			if (student.length) {
				roleData = await studentsModel.getOne(user.id as unknown as string)
			} else {
				throw new Error('this number not subscribe with teacher')
			}
		} else if (user.role === 'assistants') {
			const assistant = await teachersAssistModel.getByTeacherIdAssistId(
				teacher_id as unknown as string,
				user.id as unknown as string
			)

			if (assistant) {
				roleData = await assistantsModel.getOne(user.id as unknown as string)
			} else {
				throw new Error('this number not subscribe with teacher')
			}
		} else if (user.role === 'parents') {
			const parentStudent = await parentsStudentsModel.getByParentIdTeacherId(
				user.id as unknown as string,
				teacher_id as unknown as string
			)
			if (parentStudent.length) {
				roleData = await parentsModel.getOne(user.id as unknown as string)
			} else {
				throw new Error('this number not subscribe with teacher')
			}
		}

		const tokenUser = jwt.sign({user}, config.tokenSecret as unknown as string)
		const tokenData = jwt.sign(
			{roleData},
			config.tokenSecret as unknown as string
		)

		res.json({
			status: 'success',
			data: {tokenUser, tokenData, role: user.role},
			message: 'user deleted successfully',
		})
	} catch (err) {
		next(err)
	}
})

export default routes
