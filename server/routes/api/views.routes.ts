import {Router, Request, Response} from 'express'
import ViewsModel from '../../models/views.model'
const viewsModel = new ViewsModel()

const routes = Router()
//create
routes.post('/', async (req: Request, res: Response, next) => {
	try {
		const view = await viewsModel.create(req.body)
		res.json({
			status: 'success',
			data: {...view},
			message: 'view created successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get all
routes.get('/', async (req: Request, res: Response, next) => {
	try {
		const view = await viewsModel.getAll()
		res.json({
			status: 'success',
			data: view,
			message: 'users retrieved successfully',
		})
	} catch (err: any) {
		next(err.message)
	}
})
//get specific
routes.get('/:id', async (req: Request, res: Response, next) => {
	try {
		const view = await viewsModel.getOne(req.params.id as unknown as string)
		res.json({
			status: 'success',
			data: view,
			message: 'view retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by lesson id and student id
routes.get(
	'/lesson/:lesson/student/:student',
	async (req: Request, res: Response, next) => {
		try {
			const view = await viewsModel.getByLessonIdAndStudentId(
				req.params.lesson as unknown as string,
				req.params.student as unknown as string
			)
			res.json({
				status: 'success',
				data: view,
				message: 'view retrieved successfully',
			})
		} catch (err) {
			next(err)
		}
	}
)
//update
routes.patch('/', async (req: Request, res: Response, next) => {
	try {
		const view = await viewsModel.update(req.body)
		res.json({
			status: 'success',
			data: view,
			message: 'view updated successfully',
		})
	} catch (err) {
		next(err)
	}
})
//delete
routes.delete('/:id', async (req: Request, res: Response, next) => {
	try {
		const view = await viewsModel.delete(req.params.id as unknown as string)
		res.json({
			status: 'success',
			data: view,
			message: 'view deleted successfully',
		})
	} catch (err) {
		next(err)
	}
})

export default routes
