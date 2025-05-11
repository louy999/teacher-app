import {Router, Request, Response} from 'express'
import ChapterModel from '../../models/chapter.modal'
const chapterModel = new ChapterModel()

const routes = Router()
//create
routes.post('/', async (req: Request, res: Response, next) => {
	try {
		const chapter = await chapterModel.create(req.body)
		res.json({
			status: 'success',
			data: {...chapter},
			message: 'chapter created successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get all
routes.get('/', async (req: Request, res: Response, next) => {
	try {
		const chapter = await chapterModel.getAll()
		res.json({
			status: 'success',
			data: chapter,
			message: 'users retrieved successfully',
		})
	} catch (err: any) {
		next(err.message)
	}
})
//get specific
routes.get('/:id', async (req: Request, res: Response, next) => {
	try {
		const chapter = await chapterModel.getOne(req.params.id as unknown as string)
		res.json({
			status: 'success',
			data: chapter,
			message: 'chapter retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by name
routes.get('/name/:name', async (req: Request, res: Response, next) => {
	try {
		const chapter = await chapterModel.getByName(
			req.params.name as unknown as string
		)
		res.json({
			status: 'success',
			data: chapter,
			message: 'chapter retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by stage
routes.get('/stage/:stage', async (req: Request, res: Response, next) => {
	try {
		const chapter = await chapterModel.getByStage(
			req.params.stage as unknown as string
		)
		res.json({
			status: 'success',
			data: chapter,
			message: 'chapter retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by teacher id
routes.get('/teacher/:teacher', async (req: Request, res: Response, next) => {
	try {
		const chapter = await chapterModel.getByTeacherId(
			req.params.teacher as unknown as string
		)
		res.json({
			status: 'success',
			data: chapter,
			message: 'chapter retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//update
routes.patch('/', async (req: Request, res: Response, next) => {
	try {
		const chapter = await chapterModel.update(req.body)
		res.json({
			status: 'success',
			data: chapter,
			message: 'chapter updated successfully',
		})
	} catch (err) {
		next(err)
	}
})
//delete
routes.delete('/:id', async (req: Request, res: Response, next) => {
	try {
		const chapter = await chapterModel.delete(req.params.id as unknown as string)
		res.json({
			status: 'success',
			data: chapter,
			message: 'chapter deleted successfully',
		})
	} catch (err) {
		next(err)
	}
})

export default routes
