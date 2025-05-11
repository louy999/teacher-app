import {Router, Request, Response} from 'express'
import SubscribeModel from '../../models/subscribe.model'
const subscribeModel = new SubscribeModel()

const routes = Router()
//create
routes.post('/', async (req: Request, res: Response, next) => {
	try {
		const subscribe = await subscribeModel.create(req.body)
		res.json({
			status: 'success',
			data: {...subscribe},
			message: 'subscribe created successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get all
routes.get('/', async (req: Request, res: Response, next) => {
	try {
		const subscribe = await subscribeModel.getAll()
		res.json({
			status: 'success',
			data: subscribe,
			message: 'users retrieved successfully',
		})
	} catch (err: any) {
		next(err.message)
	}
})
//get specific
routes.get('/:id', async (req: Request, res: Response, next) => {
	try {
		const subscribe = await subscribeModel.getOne(
			req.params.id as unknown as string
		)
		res.json({
			status: 'success',
			data: subscribe,
			message: 'subscribe retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by student
routes.get('/student/:student', async (req: Request, res: Response, next) => {
	try {
		const subscribe = await subscribeModel.getByStudentId(
			req.params.student as unknown as string
		)
		res.json({
			status: 'success',
			data: subscribe,
			message: 'subscribe retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by lesson
routes.get('/lesson/:lesson', async (req: Request, res: Response, next) => {
	try {
		const subscribe = await subscribeModel.getByLessonId(
			req.params.lesson as unknown as string
		)
		res.json({
			status: 'success',
			data: subscribe,
			message: 'subscribe retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by lesson and student
routes.get(
	'/lesson/:lesson/student/:student',
	async (req: Request, res: Response, next) => {
		try {
			const subscribe = await subscribeModel.getByLessonIdAndStudentId(
				req.params.lesson as unknown as string,
				req.params.student as unknown as string
			)
			res.json({
				status: 'success',
				data: subscribe,
				message: 'subscribe retrieved successfully',
			})
		} catch (err) {
			next(err)
		}
	}
)
//update
routes.patch('/', async (req: Request, res: Response, next) => {
	try {
		const subscribe = await subscribeModel.update(req.body)
		res.json({
			status: 'success',
			data: subscribe,
			message: 'subscribe updated successfully',
		})
	} catch (err) {
		next(err)
	}
})
//delete
routes.delete('/:id', async (req: Request, res: Response, next) => {
	try {
		const subscribe = await subscribeModel.delete(
			req.params.id as unknown as string
		)
		res.json({
			status: 'success',
			data: subscribe,
			message: 'subscribe deleted successfully',
		})
	} catch (err) {
		next(err)
	}
})

export default routes
