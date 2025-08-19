import {Router, Request, Response} from 'express'
import ReplayModel from '../../models/replay.model'
const replayModel = new ReplayModel()

const routes = Router()
//create
routes.post('/', async (req: Request, res: Response, next) => {
	try {
		const replay = await replayModel.create(req.body)
		res.json({
			status: 'success',
			data: {...replay},
			message: 'replay created successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get all
routes.get('/', async (req: Request, res: Response, next) => {
	try {
		const replay = await replayModel.getAll()
		res.json({
			status: 'success',
			data: replay,
			message: 'users retrieved successfully',
		})
	} catch (err: any) {
		next(err.message)
	}
})
//get specific
routes.get('/:id', async (req: Request, res: Response, next) => {
	try {
		const replay = await replayModel.getOne(req.params.id as unknown as string)
		res.json({
			status: 'success',
			data: replay,
			message: 'replay retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by lesson
routes.get('/lesson/:lesson', async (req: Request, res: Response, next) => {
	try {
		const replay = await replayModel.getByLessonId(
			req.params.lesson as unknown as string
		)
		res.json({
			status: 'success',
			data: replay,
			message: 'replay retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by comment
routes.get('/comment/:comment', async (req: Request, res: Response, next) => {
	try {
		const replay = await replayModel.getByCommentId(
			req.params.comment as unknown as string
		)
		res.json({
			status: 'success',
			data: replay,
			message: 'replay retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//update
routes.patch('/', async (req: Request, res: Response, next) => {
	try {
		const replay = await replayModel.update(req.body)
		res.json({
			status: 'success',
			data: replay,
			message: 'replay updated successfully',
		})
	} catch (err) {
		next(err)
	}
})
//delete
routes.delete('/:id', async (req: Request, res: Response, next) => {
	try {
		const replay = await replayModel.delete(req.params.id as unknown as string)
		res.json({
			status: 'success',
			data: replay,
			message: 'replay deleted successfully',
		})
	} catch (err) {
		next(err)
	}
})

export default routes
