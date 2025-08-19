import {Router, Request, Response} from 'express'
import UsersModel from '../../models/users.model'
import TeachersModel from '../../models/teachers.model'
import StudentsModel from '../../models/students.model'
import AssistantsModel from '../../models/assistants.model'
import LessonsModel from '../../models/lesson.model'
import SubscribeModel from '../../models/subscribe.model'
import TransTeacherModal from '../../models/transTeacher.model'
import ChapterModel from '../../models/chapter.modal'
import ViewsModel from '../../models/views.model'
import ParentsModel from '../../models/parents.model'
const usersModel = new UsersModel()
const teachersModel = new TeachersModel()
const studentsModel = new StudentsModel()
const assistantsModel = new AssistantsModel()
const lessonsModel = new LessonsModel()
const subscribeModel = new SubscribeModel()
const transTeacherModal = new TransTeacherModal()
const chapterModel = new ChapterModel()
const viewsModel = new ViewsModel()
const parentsModel = new ParentsModel()

const routes = Router()
//add mutable users
routes.post('/addUser', async (req: Request, res: Response, next) => {
	try {
		const {full_name, password, phone, role, subject, grade_levels} = req.body

		const newUser = await usersModel.create({full_name, password, phone, role})
		if (role === 'teachers') {
			const newTeacher = await teachersModel.create({
				id: newUser.id,
				subject,
				grade_levels,
			})
			res.json({
				status: 'success',
				data: {
					user: newUser,
					teacher: newTeacher,
				},
				message: 'user and teacher successfully',
			})
		} else if (role === 'students') {
			const {stage, teacher_id} = req.body
			const newStudent = await studentsModel.create(
				{id: newUser.id, stage},
				teacher_id
			)

			res.json({
				status: 'success',
				data: {
					user: newUser,
					student: newStudent,
				},
				message: 'user and student created successfully',
			})
		} else if (role === 'assistants') {
			const {access, teacher_id} = req.body

			const newAssist = await assistantsModel.create({
				id: newUser.id,
				access,
				teacher_id,
			})

			res.json({
				status: 'success',
				data: {
					user: newUser,
					student: newAssist,
				},
				message: 'user and assistant created successfully',
			})
		} else if (role === 'parents') {
			const parent = await parentsModel.create({id: newUser.id})
			res.json({
				status: 'success',
				data: {
					user: newUser,
					student: parent,
				},
				message: 'user and assistant created successfully',
			})
		}
	} catch (err) {
		next(err)
	}
})

//subscription users
routes.get(
	'/lesson/:lesson/teacher/:teacher/student/:student',
	async (req: Request, res: Response, next) => {
		try {
			const {student, teacher, lesson} = req.params
			const getTeacher = await teachersModel.getOne(teacher)

			if (getTeacher.paid) {
				const trans = await transTeacherModal.getByTeacherIdAndStudentId(
					teacher,
					student
				)
				const expireTeacher = getTeacher?.expire_date
					? new Date(getTeacher.expire_date)
					: new Date()

				const transDate = trans?.date ? new Date(trans.date) : new Date()
				if (transDate <= expireTeacher) {
					const getLesson = await lessonsModel.getOne(lesson)

					if (getLesson.is_paid) {
						const getStudentSubscribe =
							await subscribeModel.getByLessonIdAndStudentId(lesson, student)

						if (getStudentSubscribe) {
							const expireDate = new Date(getStudentSubscribe.expire)
							const now = new Date()

							if (now <= expireDate) {
								res.json({
									status: true,
									data: getLesson,
									message: 'subscription active',
								})
							} else {
								res.json({
									status: false,
									data: 'false',
									message: 'subscription expired',
								})
							}
						} else {
							res.json({
								status: false,
								data: 'false',
								message: 'subscription expired',
							})
						}
					} else {
						res.json({
							status: 'success',
							data: getLesson,
							message: 'lesson is free',
						})
					}
				} else {
					res.json({
						status: false,
						data: 'false',
						message: 'subscription expired',
					})
				}
			} else {
				const getLesson = await lessonsModel.getOne(lesson)

				if (getLesson.is_paid) {
					const getStudentSubscribe = await subscribeModel.getByLessonIdAndStudentId(
						lesson,
						student
					)

					if (getStudentSubscribe) {
						const expireDate = new Date(getStudentSubscribe.expire)
						const now = new Date()

						if (now <= expireDate) {
							res.json({
								status: true,
								data: getLesson,
								message: 'subscription active',
							})
						} else {
							res.json({
								status: false,
								data: 'false',
								message: 'subscription expired',
							})
						}
					} else {
						res.json({
							status: false,
							data: 'false',
							message: 'subscription expired',
						})
					}
				} else {
					res.json({
						status: 'success',
						data: getLesson,
						message: 'lesson is free',
					})
				}
			}
		} catch (error) {
			next(error)
		}
	}
)

routes.get(
	'/chapterLesson/teacher/:teacherId/stage/:stage/student/:student',
	async (req: Request, res: Response, next) => {
		try {
			const {teacherId, stage, student} = req.params

			const chapters = await chapterModel.getByTeacherIdAndStage(teacherId, stage)

			const chaptersWithLessonsAndViews = await Promise.all(
				chapters.map(async (chapter: any) => {
					const lessons = await lessonsModel.getByChapterId(chapter.id)

					const lessonsWithViews = await Promise.all(
						lessons.map(async (lesson: any) => {
							const views = await viewsModel.getByLessonIdAndStudentId(
								lesson.id,
								student
							)

							return {
								...lesson,
								views,
							}
						})
					)

					return {
						...chapter,
						lessons: lessonsWithViews,
					}
				})
			)

			res.json({
				chapters: chaptersWithLessonsAndViews,
			})
		} catch (err) {
			next(err)
		}
	}
)

export default routes
