import {Router, Request, Response} from 'express'
import NotificationsModal from '../../models/notifications.modal'

const notificationsModal = new NotificationsModal()

const routes = Router()
//create
routes.post('/', async (req: Request, res: Response, next) => {
	try {
		const notification = await notificationsModal.create(req.body)
		res.json({
			status: 'success',
			data: {...notification},
			message: 'notification created successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get all
routes.get('/', async (req: Request, res: Response, next) => {
	try {
		const notification = await notificationsModal.getAll()
		res.json({
			status: 'success',
			data: notification,
			message: 'users retrieved successfully',
		})
	} catch (err: any) {
		next(err.message)
	}
})
//get specific
routes.get('/:id', async (req: Request, res: Response, next) => {
	try {
		const notification = await notificationsModal.getOne(
			req.params.id as unknown as string
		)
		res.json({
			status: 'success',
			data: notification,
			message: 'notification retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//get specific by lesson
routes.get('/teacher/:teacherId', async (req: Request, res: Response, next) => {
	try {
		const notification = await notificationsModal.getByTeacherId(
			req.params.teacherId as unknown as string
		)
		res.json({
			status: 'success',
			data: notification,
			message: 'notification retrieved successfully',
		})
	} catch (err) {
		next(err)
	}
})
//update
routes.patch('/', async (req: Request, res: Response, next) => {
	try {
		const notification = await notificationsModal.update(req.body)
		res.json({
			status: 'success',
			data: notification,
			message: 'notification updated successfully',
		})
	} catch (err) {
		next(err)
	}
})
//delete
routes.delete('/:id', async (req: Request, res: Response, next) => {
	try {
		const notification = await notificationsModal.delete(
			req.params.id as unknown as string
		)
		res.json({
			status: 'success',
			data: notification,
			message: 'notification deleted successfully',
		})
	} catch (err) {
		next(err)
	}
})

export default routes
