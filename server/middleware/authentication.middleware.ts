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

		if (authHeader) {
			const decode = jwt.verify(
				authHeader,
				config.tokenSecret as unknown as string
			)
			if (decode) {
				next()
			} else {
				// Failed to authenticate user.
				handleUnauthorizedError(next)
			}
		} else {
			// No Token Provided.
			handleUnauthorizedError(next)
		}
	} catch (err) {
		handleUnauthorizedError(next)
	}
}

export default validateTokenMiddleware
