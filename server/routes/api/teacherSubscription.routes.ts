import {Router, Request, Response} from 'express'
import TeacherSubscriptionsModal from '../../models/teacherSubscription.modal'
const teacherSubscriptionsModal = new TeacherSubscriptionsModal()

const routes = Router()
//create
routes.post('/', async (req: Request, res: Response, next) => {
	try {
		const teacherSub = await teacherSubscriptionsModal.create(req.body)
		res.json({
			status: 'success',
			data: {...teacherSub},
			message: 'teacherSub created successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get all
routes.get('/', async (req: Request, res: Response, next) => {
	try {
		const teacherSub = await teacherSubscriptionsModal.getAll()
		res.json({
			status: 'success',
			data: teacherSub,
			message: 'users retrieved successfully',
		})
	} catch (err: any) {
		next(err.message)
	}
})
//get specific
routes.get('/:id', async (req: Request, res: Response, next) => {
	try {
		const teacherSub = await teacherSubscriptionsModal.getOne(
			req.params.id as unknown as string
		)
		res.json({
			status: 'success',
			data: teacherSub,
			message: 'teacherSub retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by student
routes.get('/plan/:plan', async (req: Request, res: Response, next) => {
	try {
		const teacherSub = await teacherSubscriptionsModal.getByPlan(
			req.params.plan as unknown as string
		)
		res.json({
			status: 'success',
			data: teacherSub,
			message: 'teacherSub retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by lesson
routes.get('/teacher/:teacher', async (req: Request, res: Response, next) => {
	try {
		const teacherSub = await teacherSubscriptionsModal.getByTeacher_id(
			req.params.teacher as unknown as string
		)
		res.json({
			status: 'success',
			data: teacherSub,
			message: 'teacherSub retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})

//update
routes.patch('/', async (req: Request, res: Response, next) => {
	try {
		const teacherSub = await teacherSubscriptionsModal.update(req.body)
		res.json({
			status: 'success',
			data: teacherSub,
			message: 'teacherSub updated successfully',
		})
	} catch (err) {
		next(err)
	}
})
//delete
routes.delete('/:id', async (req: Request, res: Response, next) => {
	try {
		const teacherSub = await teacherSubscriptionsModal.delete(
			req.params.id as unknown as string
		)
		res.json({
			status: 'success',
			data: teacherSub,
			message: 'teacherSub deleted successfully',
		})
	} catch (err) {
		next(err)
	}
})

export default routes
