import {Router, Request, Response} from 'express'
import QuestionsModel from '../../models/questions.model'
const questionsModel = new QuestionsModel()

const routes = Router()
//create
routes.post('/', async (req: Request, res: Response, next) => {
	try {
		const question = await questionsModel.create(req.body)
		res.json({
			status: 'success',
			data: {...question},
			message: 'question created successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get all
routes.get('/', async (req: Request, res: Response, next) => {
	try {
		const question = await questionsModel.getAll()
		res.json({
			status: 'success',
			data: question,
			message: 'users retrieved successfully',
		})
	} catch (err: any) {
		next(err.message)
	}
})
//get specific
routes.get('/:id', async (req: Request, res: Response, next) => {
	try {
		const question = await questionsModel.getOne(
			req.params.id as unknown as string
		)
		res.json({
			status: 'success',
			data: question,
			message: 'question retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by exam
routes.get('/exam/:exam', async (req: Request, res: Response, next) => {
	try {
		const question = await questionsModel.getByExamId(
			req.params.exam as unknown as string
		)
		res.json({
			status: 'success',
			data: question,
			message: 'question retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//update
routes.patch('/', async (req: Request, res: Response, next) => {
	try {
		const question = await questionsModel.update(req.body)
		res.json({
			status: 'success',
			data: question,
			message: 'question updated successfully',
		})
	} catch (err) {
		next(err)
	}
})
//delete
routes.delete('/:id', async (req: Request, res: Response, next) => {
	try {
		const question = await questionsModel.delete(
			req.params.id as unknown as string
		)
		res.json({
			status: 'success',
			data: question,
			message: 'question deleted successfully',
		})
	} catch (err) {
		next(err)
	}
})

export default routes
