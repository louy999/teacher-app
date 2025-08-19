import {Router, Request, Response} from 'express'
import AnswersTypesModel from '../../models/answers.model'
const answersModel = new AnswersTypesModel()

const routes = Router()
//create
routes.post('/', async (req: Request, res: Response, next) => {
	try {
		const answer = await answersModel.create(req.body)
		res.json({
			status: 'success',
			data: {...answer},
			message: 'answer created successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get all
routes.get('/', async (req: Request, res: Response, next) => {
	try {
		const answer = await answersModel.getAll()
		res.json({
			status: 'success',
			data: answer,
			message: 'users retrieved successfully',
		})
	} catch (err: any) {
		next(err.message)
	}
})
//get specific
routes.get('/:id', async (req: Request, res: Response, next) => {
	try {
		const answer = await answersModel.getOne(req.params.id as unknown as string)
		res.json({
			status: 'success',
			data: answer,
			message: 'answer retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by student
routes.get('/student/:student', async (req: Request, res: Response, next) => {
	try {
		const answer = await answersModel.getByStudentId(
			req.params.student as unknown as string
		)
		res.json({
			status: 'success',
			data: answer,
			message: 'answer retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by student and question
routes.get(
	'/student/:student/qa/:qa',
	async (req: Request, res: Response, next) => {
		try {
			const answer = await answersModel.getByStudentIdAndQuestionId(
				req.params.student as unknown as string,
				req.params.qa as unknown as string
			)
			res.json({
				status: 'success',
				data: answer,
				message: 'answer retrieved successfully',
			})
		} catch (err) {
			next(err)
		}
	}
)
routes.get(
	'/student/:student/exam/:exam',
	async (req: Request, res: Response, next) => {
		try {
			const answer = await answersModel.getByStudentIdAndExamId(
				req.params.student as unknown as string,
				req.params.exam as unknown as string
			)
			res.json({
				status: 'success',
				data: answer,
				message: 'answer retrieved successfully 6',
			})
		} catch (err) {
			next(err)
		}
	}
)
//update
routes.patch('/', async (req: Request, res: Response, next) => {
	try {
		const answer = await answersModel.update(req.body)
		res.json({
			status: 'success',
			data: answer,
			message: 'answer updated successfully',
		})
	} catch (err) {
		next(err)
	}
})
//delete
routes.delete('/:id', async (req: Request, res: Response, next) => {
	try {
		const answer = await answersModel.delete(req.params.id as unknown as string)
		res.json({
			status: 'success',
			data: answer,
			message: 'answer deleted successfully',
		})
	} catch (err) {
		next(err)
	}
})

export default routes
