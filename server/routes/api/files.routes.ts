import {Router, Request, Response} from 'express'
import FilesModel from '../../models/files.model'

const filesModel = new FilesModel()

const routes = Router()
//create
routes.post('/', async (req: Request, res: Response, next) => {
	try {
		const file = await filesModel.create(req.body)
		res.json({
			status: 'success',
			data: {...file},
			message: 'file created successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get all
routes.get('/', async (req: Request, res: Response, next) => {
	try {
		const file = await filesModel.getAll()
		res.json({
			status: 'success',
			data: file,
			message: 'users retrieved successfully',
		})
	} catch (err: any) {
		next(err.message)
	}
})
//get specific
routes.get('/:id', async (req: Request, res: Response, next) => {
	try {
		const file = await filesModel.getOne(req.params.id as unknown as string)
		res.json({
			status: 'success',
			data: file,
			message: 'file retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by lesson
routes.get('/lesson/:lesson', async (req: Request, res: Response, next) => {
	try {
		const file = await filesModel.getByLessonId(
			req.params.lesson as unknown as string
		)
		res.json({
			status: 'success',
			data: file,
			message: 'file retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//update
routes.patch('/', async (req: Request, res: Response, next) => {
	try {
		const file = await filesModel.update(req.body)
		res.json({
			status: 'success',
			data: file,
			message: 'file updated successfully',
		})
	} catch (err) {
		next(err)
	}
})
//delete
routes.delete('/:id', async (req: Request, res: Response, next) => {
	try {
		const file = await filesModel.delete(req.params.id as unknown as string)
		res.json({
			status: 'success',
			data: file,
			message: 'file deleted successfully',
		})
	} catch (err) {
		next(err)
	}
})

export default routes
