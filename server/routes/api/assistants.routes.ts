import {Router, Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import config from '../../config'
import AssistantsModel from '../../models/assistants.model'
const assistantsModel = new AssistantsModel()

const routes = Router()
//create
routes.post('/', async (req: Request, res: Response, next) => {
	try {
		const assistant = await assistantsModel.create(req.body)
		res.json({
			status: 'success',
			data: {...assistant},
			message: 'assistant created successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get all
routes.get('/', async (req: Request, res: Response, next) => {
	try {
		const assistant = await assistantsModel.getAll()
		res.json({
			status: 'success',
			data: assistant,
			message: 'users retrieved successfully',
		})
	} catch (err: any) {
		next(err.message)
	}
})
//get specific
routes.get('/:id', async (req: Request, res: Response, next) => {
	try {
		const assistant = await assistantsModel.getOne(
			req.params.id as unknown as string
		)
		res.json({
			status: 'success',
			data: assistant,
			message: 'assistant retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by phone
routes.get('/phone/:phone', async (req: Request, res: Response, next) => {
	try {
		const assistant = await assistantsModel.getByPhone(
			req.params.phone as unknown as string
		)
		res.json({
			status: 'success',
			data: assistant,
			message: 'assistant retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by teacher id
routes.get('/teacher/:teacher', async (req: Request, res: Response, next) => {
	try {
		const assistant = await assistantsModel.getByTeacherId(
			req.params.teacher as unknown as string
		)
		res.json({
			status: 'success',
			data: assistant,
			message: 'assistant retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
routes.get('/name/:name', async (req: Request, res: Response, next) => {
	try {
		const assistant = await assistantsModel.getByName(
			req.params.name as unknown as string
		)
		res.json({
			status: 'success',
			data: assistant,
			message: 'assistant retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//update
routes.patch('/', async (req: Request, res: Response, next) => {
	try {
		const assistant = await assistantsModel.update(req.body)
		res.json({
			status: 'success',
			data: assistant,
			message: 'assistant updated successfully',
		})
	} catch (err) {
		next(err)
	}
})
//delete
routes.delete('/:id', async (req: Request, res: Response, next) => {
	try {
		const assistant = await assistantsModel.delete(
			req.params.id as unknown as string
		)
		res.json({
			status: 'success',
			data: assistant,
			message: 'assistant deleted successfully',
		})
	} catch (err) {
		next(err)
	}
})
//login
routes.post('/auth', async (req: Request, res: Response, next) => {
	try {
		const {phone, password} = req.body
		const assistant = await assistantsModel.auth(phone, password)
		const token = jwt.sign({assistant}, config.tokenSecret as unknown as string)
		res.json({
			status: 'success',
			data: {...assistant, token},
			message: 'assistant auth successfully',
		})
	} catch (err) {
		next(err)
	}
})

export default routes
