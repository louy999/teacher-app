import {Router, Request, Response} from 'express'
import CommentsModel from '../../models/comments.model'
const commentsModel = new CommentsModel()

const routes = Router()
//create
routes.post('/', async (req: Request, res: Response, next) => {
	try {
		const comment = await commentsModel.create(req.body)
		res.json({
			status: 'success',
			data: {...comment},
			message: 'comment created successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get all
routes.get('/', async (req: Request, res: Response, next) => {
	try {
		const comment = await commentsModel.getAll()
		res.json({
			status: 'success',
			data: comment,
			message: 'users retrieved successfully',
		})
	} catch (err: any) {
		next(err.message)
	}
})
//get specific
routes.get('/:id', async (req: Request, res: Response, next) => {
	try {
		const comment = await commentsModel.getOne(req.params.id as unknown as string)
		res.json({
			status: 'success',
			data: comment,
			message: 'comment retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by student
routes.get('/student/:student', async (req: Request, res: Response, next) => {
	try {
		const comment = await commentsModel.getByStudentId(
			req.params.student as unknown as string
		)
		res.json({
			status: 'success',
			data: comment,
			message: 'comment retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by lesson
routes.get('/lesson/:lesson', async (req: Request, res: Response, next) => {
	try {
		const comment = await commentsModel.getByLessonId(
			req.params.lesson as unknown as string
		)
		res.json({
			status: 'success',
			data: comment,
			message: 'comment retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
routes.get(
	'/lesson/:lesson/student/:student',
	async (req: Request, res: Response, next) => {
		try {
			const comment = await commentsModel.getByLessonIdAndStudent(
				req.params.lesson as unknown as string,
				req.params.student as unknown as string
			)
			res.json({
				status: 'success',
				data: comment,
				message: 'comment retrieved successfully',
			})
		} catch (err) {
			next(err)
		}
	}
)
//update
routes.patch('/', async (req: Request, res: Response, next) => {
	try {
		const comment = await commentsModel.update(req.body)
		res.json({
			status: 'success',
			data: comment,
			message: 'comment updated successfully',
		})
	} catch (err) {
		next(err)
	}
})
//delete
routes.delete('/:id', async (req: Request, res: Response, next) => {
	try {
		const comment = await commentsModel.delete(req.params.id as unknown as string)
		res.json({
			status: 'success',
			data: comment,
			message: 'comment deleted successfully',
		})
	} catch (err) {
		next(err)
	}
})

export default routes
