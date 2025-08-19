import {Router, Request, Response} from 'express'
import ParentsStudentsModel from '../../models/ParentsStudents.model'
const parentsStudentsModel = new ParentsStudentsModel()

const routes = Router()
//create
routes.post('/', async (req: Request, res: Response, next) => {
	try {
		const parentStudent = await parentsStudentsModel.create(req.body)
		res.json({
			status: 'success',
			data: {...parentStudent},
			message: 'parentStudent created successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get all
routes.get('/', async (req: Request, res: Response, next) => {
	try {
		const parentStudent = await parentsStudentsModel.getAll()
		res.json({
			status: 'success',
			data: parentStudent,
			message: 'users retrieved successfully',
		})
	} catch (err: any) {
		next(err.message)
	}
})
//get specific
routes.get('/:id', async (req: Request, res: Response, next) => {
	try {
		const parentStudent = await parentsStudentsModel.getOne(
			req.params.id as unknown as string
		)
		res.json({
			status: 'success',
			data: parentStudent,
			message: 'parentStudent retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by parentStudent id
routes.get('/student/:student', async (req: Request, res: Response, next) => {
	try {
		const parentStudent = await parentsStudentsModel.getByStudentId(
			req.params.student as unknown as string
		)
		res.json({
			status: 'success',
			data: parentStudent,
			message: 'parentStudent retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by parent
routes.get('/parent/:parent', async (req: Request, res: Response, next) => {
	try {
		const parentStudent = await parentsStudentsModel.getByParentId(
			req.params.parent as unknown as string
		)
		res.json({
			status: 'success',
			data: parentStudent,
			message: 'parentStudent retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by teacher id
routes.get('/teacher/:teacher', async (req: Request, res: Response, next) => {
	try {
		const parentStudent = await parentsStudentsModel.getByTeacherId(
			req.params.teacher as unknown as string
		)
		res.json({
			status: 'success',
			data: parentStudent,
			message: 'parentStudent retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
routes.get(
	'/parent/:parent/teacher/:teacher',
	async (req: Request, res: Response, next) => {
		try {
			const parentStudent = await parentsStudentsModel.getByParentIdTeacherId(
				req.params.parent as unknown as string,
				req.params.teacher as unknown as string
			)
			res.json({
				status: 'success',
				data: parentStudent,
				message: 'parentStudent retrieved successfully',
			})
		} catch (err) {
			next(err)
		}
	}
)
routes.get(
	'/parent/:parent/teacher/:teacher/student/:student',
	async (req: Request, res: Response, next) => {
		try {
			const parentStudent =
				await parentsStudentsModel.getByParentIdTeacherIdStudentId(
					req.params.parent as unknown as string,
					req.params.teacher as unknown as string,
					req.params.student as unknown as string
				)
			res.json({
				status: 'success',
				data: parentStudent,
				message: 'parentStudent retrieved successfully',
			})
		} catch (err) {
			next(err)
		}
	}
)
//update
routes.patch('/', async (req: Request, res: Response, next) => {
	try {
		const parentStudent = await parentsStudentsModel.update(req.body)
		res.json({
			status: 'success',
			data: parentStudent,
			message: 'parentStudent updated successfully',
		})
	} catch (err) {
		next(err)
	}
})
//delete
routes.delete('/:id', async (req: Request, res: Response, next) => {
	try {
		const parentStudent = await parentsStudentsModel.delete(
			req.params.id as unknown as string
		)
		res.json({
			status: 'success',
			data: parentStudent,
			message: 'parentStudent deleted successfully',
		})
	} catch (err) {
		next(err)
	}
})

export default routes
