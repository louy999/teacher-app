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
import CommentsModel from '../../models/comments.model'
import StudentsTeacherModel from '../../models/studentsTeachers.model'
import ReplayModel from '../../models/replay.model'
import TeacherSubscriptionsModal from '../../models/teacherSubscription.modal'
import ParentsStudentsModel from '../../models/ParentsStudents.model'
import TeachersAssistModel from '../../models/teachersAssist.model'
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
const commentsModel = new CommentsModel()
const studentsTeacherModel = new StudentsTeacherModel()
const replayModel = new ReplayModel()
const teacherSubscriptionsModal = new TeacherSubscriptionsModal()
const parentsStudentsModel = new ParentsStudentsModel()
const teachersAssistModel = new TeachersAssistModel()

const routes = Router()
//add mutable users
routes.post('/addUser', async (req: Request, res: Response, next) => {
	try {
		const {
			full_name,
			password,
			phone,
			role,
			subject,
			grade_levels,
			teacherId,
			price,
			expire_date,
			plan,
		} = req.body

		const newUser = await usersModel.create({full_name, password, phone, role})

		if (role === 'teachers') {
			const newTeacher = await teachersModel.create({
				id: newUser.id,
				subject,
				grade_levels,
			})
			const teacherSub = await teacherSubscriptionsModal.create({
				teacher_id: newUser.id,
				expire_date,
				plan,
				price,
			})

			res.json({
				status: 'success',
				data: {
					user: newUser,
					teacher: newTeacher,
					teacherSub,
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
			const assist = await teachersAssistModel.create({
				teacher_id,
				assistant_id: newAssist.id,
			})

			res.json({
				status: 'success',
				data: {
					user: newUser,
					student: newAssist,
					assist,
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

// subscription users
routes.get(
	'/subscribeTeacher/teacher/:teacher/student/:student',
	async (req: Request, res: Response, next) => {
		try {
			const {student, teacher} = req.params
			const teacherSub = await teacherSubscriptionsModal.getByTeacher_id(
				teacher as unknown as string
			)

			if (teacherSub.active) {
				const trans = await transTeacherModal.getByTeacherIdAndStudentId(
					teacher as unknown as string,
					student as unknown as string
				)
				res.json({
					status: 'success',
					data: {trans, teacherSub},
					paid: true,
					message: 'trans retrieved successfully',
				})
			} else {
				res.json({
					status: 'success',
					data: [],
					paid: false,
					message: 'trans retrieved successfully',
				})
			}
		} catch (error) {
			next(error)
		}
	}
)

// get chapters with lessons and views for a student under a teacher and stage
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
// get comments with user info for a lesson
routes.get(
	'/getComments/lesson/:lesson',
	async (req: Request, res: Response, next) => {
		const {lesson} = req.params

		try {
			const comments = await commentsModel.getByLessonId(lesson as string)

			const commentsWithUser = await Promise.all(
				comments.map(async (comment: any) => {
					const user = await usersModel.getOne(comment.user_id)

					let extraData = null
					if (user.role === 'teachers') {
						extraData = await teachersModel.getOne(user.id as string)
					} else if (user.role === 'parents') {
						extraData = await parentsModel.getOne(user.id as string)
					} else if (user.role === 'students') {
						extraData = await studentsModel.getOne(user.id as string)
					} else if (user.role === 'assistants') {
						extraData = await assistantsModel.getOne(user.id as string)
					}

					return {
						...comment,
						user,
						extraData,
					}
				})
			)

			res.json({
				status: 'success',
				data: commentsWithUser,
				message: 'comments with users fetched successfully',
			})
		} catch (err) {
			next(err)
		}
	}
)
// get transactions for a teacher with student info
routes.get(
	`/trans/teacher/:teacherId`,
	async (req: Request, res: Response, next) => {
		const {teacherId} = req.params
		try {
			const trans = await transTeacherModal.getByTeacher_id(teacherId as string)

			const TransWithStudents = await Promise.all(
				trans.map(async (trans) => {
					const user = await usersModel.getOne(trans.student_id as string)
					const extraData = await studentsModel.getOne(user.id as string)
					return {...trans, user, extraData}
				})
			)
			res.json({
				status: 'success',
				data: TransWithStudents,
				message: 'trans fetched successfully',
			})
		} catch (err) {
			next(err)
		}
	}
)
// lesson subscription for teacher's students
routes.get(
	`/subscribeLesson/teacher/:teacherId/`,
	async (req: Request, res: Response, next) => {
		const {teacherId} = req.params
		try {
			// Fetch all subscriptions for the teacher
			const subscribes = await subscribeModel.getByTeacherId(
				teacherId as unknown as string
			)

			// Fetch student and lesson data for each subscription
			const lessonStudentName = await Promise.all(
				subscribes.map(async (sub) => {
					const student = await usersModel.getOne(sub.student_id as string)
					const lesson = await lessonsModel.getOne(sub.lesson_id as string)

					// Merge student and lesson data inside each subscription object
					return {
						...sub,
						student,
						lesson,
					}
				})
			)

			res.json({
				status: 'success',
				data: lessonStudentName,
				message: 'sub fetched successfully',
			})
		} catch (err) {
			next(err)
		}
	}
)
// teacher transactions along with their subscriptions
routes.get(
	`/transTeacher/teacher/:teacherId/`,
	async (req: Request, res: Response, next) => {
		const {teacherId} = req.params
		try {
			// Fetch all transactions for the teacher
			const trans = await transTeacherModal.getByTeacher_id(teacherId as string)

			// Fetch teacher subscriptions
			const teacherSub = await teacherSubscriptionsModal.getByTeacher_id(
				teacherId as string
			)

			// Attach student info to each transaction
			const transWithStudents = await Promise.all(
				trans.map(async (t) => {
					const student = await usersModel.getOne(t.student_id as string)
					return {
						...t,
						student,
					}
				})
			)

			// Return both in one object
			res.json({
				status: 'success',
				data: {
					trans: transWithStudents,
					teacherSub,
				},
				message: 'Transactions and subscriptions fetched successfully',
			})
		} catch (err) {
			next(err)
		}
	}
)
// get replays for a comment with user info
routes.get(
	`/replay/comment/:commentId`,
	async (req: Request, res: Response, next) => {
		const {commentId} = req.params
		try {
			const replays = await replayModel.getByCommentId(commentId as string)

			const replaysWithUsers = await Promise.all(
				replays.map(async (replay) => {
					const user = await usersModel.getOne(replay.user_id as string)
					if (user.role === 'teachers') {
						const extraData = await teachersModel.getOne(user.id as string)
						return {...replay, user, extraData}
					} else if (user.role === 'assistants') {
						const extraData = await assistantsModel.getOne(user.id as string)
						return {...replay, user, extraData}
					}
				})
			)

			res.json({
				status: 'success',
				data: replaysWithUsers,
				message: 'Replays fetched successfully',
			})
		} catch (err) {
			next(err)
		}
	}
)
// get all users under a teacher by access type (assistants, students, parents)
routes.get(
	`/getAllUserTeacher/:teacherId/:access`,
	async (req: Request, res: Response, next) => {
		const {teacherId, access} = req.params
		let users: any[] = []

		try {
			if (access === 'assistants') {
				users = await teachersAssistModel.getByTeacherId(teacherId)
			} else if (access === 'students') {
				users = await studentsTeacherModel.getByTeacherId(teacherId)
			} else if (access === 'parents') {
				users = await parentsStudentsModel.getByTeacherId(teacherId)
			}

			// Add extra user data
			const usersWithExtra = await Promise.all(
				users.map(async (u: any) => {
					const extraDataUser = await usersModel.getOne(
						access === 'assistants'
							? u.assistant_id
							: access === 'students'
							? u.student_id
							: u.parent_id
					)
					const extraDataAccess =
						access === 'assistants'
							? await assistantsModel.getOne(u.assistant_id)
							: access === 'students'
							? await studentsModel.getOne(u.student_id)
							: await parentsModel.getOne(u.parent_id)

					return {...u, extraDataUser, extraDataAccess} // merge single user with their extra data
				})
			)

			res.json({
				status: 'success',
				data: usersWithExtra,
				message: 'Users fetched successfully',
			})
		} catch (err) {
			next(err)
		}
	}
)

export default routes
