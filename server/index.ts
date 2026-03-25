//import tools from node
import express, {Request, Response, Application} from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import path from 'path'
import {Server} from 'socket.io'
import http from 'http'
//import files
import config from './config'
import errorHandelMiddleware from './middleware/error.handel.middleware'
import routes from './routes'
import { uploadImg, uploadFile } from './upload/cloudinaryConfig'; 


const app: Application = express()
const port = config.port || 3000

app.use(morgan('common'))
app.use(express.json())
app.use(cookieParser())

app.use(
	cors({
		credentials: true,
		optionsSuccessStatus: 200,
		methods: '*',
		origin: ['http://localhost:3000', 'http://192.168.1.5:3000'],
	})
)

app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}))
app.use('/api', routes)

app.get('/healthz', (_req: Request, res: Response) => {
	res.send({status: 'ok✌️'})
})

app.post('/upload/images', uploadImg.array('images', 5), (req: Request, res: Response): void => {
    try {
        const files = req.files as Express.Multer.File[];
        
        if (!files || files.length === 0) {
            res.status(400).send({ message: 'No images uploaded' });
            return; 
        }

        const imageUrls = files.map(file => file.path);

        res.status(200).send({
            message: 'Images uploaded successfully',
            urls: imageUrls 
        });
    } catch (error) {
        res.status(500).send({ message: 'Upload failed', error });
    }
});
app.post('/upload/file', uploadFile.single('file'), (req: Request, res: Response): void => {
    const fileUrl = req.file?.path;
    res.send({ url: fileUrl });
});

app.use('/upload', express.static('uploads'))



const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: ['http://localhost:3000'],
		methods: ['GET', 'POST'],
		credentials: true,
	},
})
io.on('connection', (socket) => {
	console.log('🔌 Connected socket id:', socket.id)
	socket.on('add_comment', () => {
		io.emit('all_com')
	})
	socket.on('add_student', () => {
		io.emit('all_student')
	})
	socket.on('add_parent', () => {
		io.emit('all_parent')
	})
	socket.on('add_assist', () => {
		io.emit('all_assist')
	})
	socket.on('add_replay', () => {
		io.emit('all_replay')
	})
	socket.on('update_teacher', () => {
		io.emit('all_teacher')
	})
	socket.on('disconnect', () => {
		console.log('🔌 Disconnected socket id:', socket.id)
	})
})

app.use((req, res, next) => {
	const error: any = new Error(`Not Found - ${req.originalUrl}`)
	error.status = 404
	next(error)
})
app.use(errorHandelMiddleware)
server.listen(port, () => {
	console.log(`server is start with port :${port}`)
})
