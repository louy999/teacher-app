import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import config from '../config'
import Error from '../interface/error.interface'

const handleUnauthorizedError = (next: NextFunction) => {
	const error: Error = new Error('Login Error, Please login again')
	error.status = 401
	next(error)
}

const validateTokenMiddleware = (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	try {
		const authHeader = req.get('Authorization')

		if (!authHeader) {
			return handleUnauthorizedError(next)
		}

		const decoded = jwt.verify(
			authHeader,
			config.tokenSecret as string
		) as jwt.JwtPayload

		const userIdFromToken = decoded.id
		const userIdFromParams = req.params.id

		if (userIdFromToken != userIdFromParams) {
			const error: Error = new Error('Unauthorized: ID mismatch')
			error.status = 403 // Forbidden
			error.message = 'You do not have permission to access this resource'
			return next(error)
		}

		next()
	} catch (err) {
		handleUnauthorizedError(next)
	}
}

export default validateTokenMiddleware
