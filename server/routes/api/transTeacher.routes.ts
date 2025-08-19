import {Router, Request, Response} from 'express'
import TransTeacherModal from '../../models/transTeacher.model'
const transTeacherModal = new TransTeacherModal()

const routes = Router()
//create
routes.post('/', async (req: Request, res: Response, next) => {
	try {
		const trans = await transTeacherModal.create(req.body)
		res.json({
			status: 'success',
			data: {...trans},
			message: 'trans created successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get all
routes.get('/', async (req: Request, res: Response, next) => {
	try {
		const trans = await transTeacherModal.getAll()
		res.json({
			status: 'success',
			data: trans,
			message: 'users retrieved successfully',
		})
	} catch (err: any) {
		next(err.message)
	}
})
//get specific
routes.get('/:id', async (req: Request, res: Response, next) => {
	try {
		const trans = await transTeacherModal.getOne(
			req.params.id as unknown as string
		)
		res.json({
			status: 'success',
			data: trans,
			message: 'trans retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by student
routes.get('/student/:student', async (req: Request, res: Response, next) => {
	try {
		const trans = await transTeacherModal.getByStudentId(
			req.params.student as unknown as string
		)
		res.json({
			status: 'success',
			data: trans,
			message: 'trans retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by lesson
routes.get('/teacher/:teacher', async (req: Request, res: Response, next) => {
	try {
		const trans = await transTeacherModal.getByTeacher_id(
			req.params.teacher as unknown as string
		)
		res.json({
			status: 'success',
			data: trans,
			message: 'trans retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by teacher and student
routes.get(
	'/teacher/:teacher/student/:student',
	async (req: Request, res: Response, next) => {
		try {
			const trans = await transTeacherModal.getByTeacherIdAndStudentId(
				req.params.teacher as unknown as string,
				req.params.student as unknown as string
			)
			res.json({
				status: 'success',
				data: trans,
				message: 'trans retrieved successfully',
			})
		} catch (err) {
			next(err)
		}
	}
)
//update
routes.patch('/', async (req: Request, res: Response, next) => {
	try {
		const trans = await transTeacherModal.update(req.body)
		res.json({
			status: 'success',
			data: trans,
			message: 'trans updated successfully',
		})
	} catch (err) {
		next(err)
	}
})
//delete
routes.delete('/:id', async (req: Request, res: Response, next) => {
	try {
		const trans = await transTeacherModal.delete(
			req.params.id as unknown as string
		)
		res.json({
			status: 'success',
			data: trans,
			message: 'trans deleted successfully',
		})
	} catch (err) {
		next(err)
	}
})

export default routes
