import {Router, Request, Response} from 'express'
import LessonsModel from '../../models/lesson.model'
const lessonsModel = new LessonsModel()

const routes = Router()
//create
routes.post('/', async (req: Request, res: Response, next) => {
	try {
		const lesson = await lessonsModel.create(req.body)
		res.json({
			status: 'success',
			data: {...lesson},
			message: 'lesson created successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get all
routes.get('/', async (req: Request, res: Response, next) => {
	try {
		const lesson = await lessonsModel.getAll()
		res.json({
			status: 'success',
			data: lesson,
			message: 'users retrieved successfully',
		})
	} catch (err: any) {
		next(err.message)
	}
})
//get specific
routes.get('/:id', async (req: Request, res: Response, next) => {
	try {
		const lesson = await lessonsModel.getOne(req.params.id as unknown as string)
		res.json({
			status: 'success',
			data: lesson,
			message: 'lesson retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by title
routes.get('/title/:title', async (req: Request, res: Response, next) => {
	try {
		const lesson = await lessonsModel.getByTitle(
			req.params.title as unknown as string
		)
		res.json({
			status: 'success',
			data: lesson,
			message: 'lesson retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
routes.get('/chapter/:chapter', async (req: Request, res: Response, next) => {
	try {
		const lesson = await lessonsModel.getByChapterId(
			req.params.chapter as unknown as string
		)
		res.json({
			status: 'success',
			data: lesson,
			message: 'lesson retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//update
routes.patch('/', async (req: Request, res: Response, next) => {
	try {
		const lesson = await lessonsModel.update(req.body)
		res.json({
			status: 'success',
			data: lesson,
			message: 'lesson updated successfully',
		})
	} catch (err) {
		next(err)
	}
})
//delete
routes.delete('/:id', async (req: Request, res: Response, next) => {
	try {
		const lesson = await lessonsModel.delete(req.params.id as unknown as string)
		res.json({
			status: 'success',
			data: lesson,
			message: 'lesson deleted successfully',
		})
	} catch (err) {
		next(err)
	}
})

export default routes
