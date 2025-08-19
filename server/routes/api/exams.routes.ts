import {Router, Request, Response} from 'express'
import ExamsModel from '../../models/exams.model'

const examsModel = new ExamsModel()

const routes = Router()
//create
routes.post('/', async (req: Request, res: Response, next) => {
	try {
		const exam = await examsModel.create(req.body)
		res.json({
			status: 'success',
			data: {...exam},
			message: 'exam created successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get all
routes.get('/', async (req: Request, res: Response, next) => {
	try {
		const exam = await examsModel.getAll()
		res.json({
			status: 'success',
			data: exam,
			message: 'users retrieved successfully',
		})
	} catch (err: any) {
		next(err.message)
	}
})
//get specific
routes.get('/:id', async (req: Request, res: Response, next) => {
	try {
		const exam = await examsModel.getOne(req.params.id as unknown as string)
		res.json({
			status: 'success',
			data: exam,
			message: 'exam retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by lesson
routes.get('/lesson/:lesson', async (req: Request, res: Response, next) => {
	try {
		const exam = await examsModel.getByLessonId(
			req.params.lesson as unknown as string
		)
		res.json({
			status: 'success',
			data: exam,
			message: 'exam retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})

//update
routes.patch('/', async (req: Request, res: Response, next) => {
	try {
		const exam = await examsModel.update(req.body)
		res.json({
			status: 'success',
			data: exam,
			message: 'exam updated successfully',
		})
	} catch (err) {
		next(err)
	}
})
//delete
routes.delete('/:id', async (req: Request, res: Response, next) => {
	try {
		const exam = await examsModel.delete(req.params.id as unknown as string)
		res.json({
			status: 'success',
			data: exam,
			message: 'exam deleted successfully',
		})
	} catch (err) {
		next(err)
	}
})

export default routes
