import {Router, Request, Response} from 'express'
import TeachersAssistModel from '../../models/teachersAssist.model'
const teachersAssistModel = new TeachersAssistModel()

const routes = Router()
//create
routes.post('/', async (req: Request, res: Response, next) => {
	try {
		const assistData = req.body
		const assist = await teachersAssistModel.create(assistData)
		res.json({
			status: 'success',
			data: {...assist},
			message: 'Student created successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get all
routes.get('/', async (req: Request, res: Response, next) => {
	try {
		const assist = await teachersAssistModel.getAll()
		res.json({
			status: 'success',
			data: assist,
			message: 'users retrieved successfully',
		})
	} catch (err: any) {
		next(err.message)
	}
})
//get specific
routes.get('/:id', async (req: Request, res: Response, next) => {
	try {
		const assist = await teachersAssistModel.getOne(
			req.params.id as unknown as string
		)
		res.json({
			status: 'success',
			data: assist,
			message: 'assist retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by assist id
routes.get('/assist/:assist', async (req: Request, res: Response, next) => {
	try {
		const assist = await teachersAssistModel.getByAssistId(
			req.params.assist as unknown as string
		)
		res.json({
			status: 'success',
			data: assist,
			message: 'assist retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by teacher
routes.get('/teacher/:teacher', async (req: Request, res: Response, next) => {
	try {
		const assist = await teachersAssistModel.getByTeacherId(
			req.params.teacher as unknown as string
		)
		res.json({
			status: 'success',
			data: assist,
			message: 'assist retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
routes.get(
	'/teacher/:teacher/assist/:assist',
	async (req: Request, res: Response, next) => {
		try {
			const assist = await teachersAssistModel.getByTeacherIdAssistId(
				req.params.teacher as unknown as string,
				req.params.assist as unknown as string
			)
			res.json({
				status: 'success',
				data: assist,
				message: 'assist retrieved successfully',
			})
		} catch (err) {
			next(err)
		}
	}
)
//update
routes.patch('/', async (req: Request, res: Response, next) => {
	try {
		const assist = await teachersAssistModel.update(req.body)
		res.json({
			status: 'success',
			data: assist,
			message: 'assist updated successfully',
		})
	} catch (err) {
		next(err)
	}
})
//delete
routes.delete('/:id', async (req: Request, res: Response, next) => {
	try {
		const assist = await teachersAssistModel.delete(
			req.params.id as unknown as string
		)
		res.json({
			status: 'success',
			data: assist,
			message: 'assist deleted successfully',
		})
	} catch (err) {
		next(err)
	}
})

export default routes
