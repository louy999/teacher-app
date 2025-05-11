import {Router, Request, Response} from 'express'
import StudentsTeacherModel from '../../models/studentsTeachers.model'
const studentsTeacherModel = new StudentsTeacherModel()

const routes = Router()
//create
routes.post('/', async (req: Request, res: Response, next) => {
	try {
		const {teacher_id, ...studentData} = req.body
		const student = await studentsTeacherModel.create(studentData, teacher_id)
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
		const student = await studentsTeacherModel.getAll()
		res.json({
			status: 'success',
			data: student,
			message: 'users retrieved successfully',
		})
	} catch (err: any) {
		next(err.message)
	}
})
//get specific
routes.get('/:id', async (req: Request, res: Response, next) => {
	try {
		const student = await studentsTeacherModel.getOne(
			req.params.id as unknown as string
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
//get specific by student id
routes.get('/student/:student', async (req: Request, res: Response, next) => {
	try {
		const student = await studentsTeacherModel.getByStudentId(
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
//get specific by teacher
routes.get('/teacher/:teacher', async (req: Request, res: Response, next) => {
	try {
		const student = await studentsTeacherModel.getByTeacherId(
			req.params.teacher as unknown as string
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
		const student = await studentsTeacherModel.update(req.body)
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
		const student = await studentsTeacherModel.delete(
			req.params.id as unknown as string
		)
		res.json({
			status: 'success',
			data: student,
			message: 'student deleted successfully',
		})
	} catch (err) {
		next(err)
	}
})

export default routes
