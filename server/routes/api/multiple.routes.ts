import {Router, Request, Response,NextFunction} from 'express'
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
import FilesModel from '../../models/files.model'
import ExamsModel from '../../models/exams.model'
import AnswersModel from '../../models/answers.model'
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
const filesModel = new FilesModel()
const examsModel = new ExamsModel()
const answersModel = new AnswersModel()

const routes = Router()
// Define an interface for the route parameters for better type safety
interface ProfileParams {
    studentId: string;
    teacherId: string;
}
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
			active,
		} = req.body

		const newUser = await usersModel.create({full_name, password, phone, role})

		if (role === 'teachers') {
			const newTeacher = await teachersModel.create({
				id: newUser.id,
				subject,
				grade_levels,
				active,
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
			const teacherSub = await teacherSubscriptionsModal.getByTeacherId(
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

			const teacherSub = await teacherSubscriptionsModal.getByTeacherId(teacherId)

			if (teacherSub && teacherSub.active) {
				const isExpired = teacherSub.expire_date < new Date()

				// ❌ لو منتهي
				if (isExpired) {
					throw new Error('Teacher subscription expired')
				}

				// ❌ لازم الطالب يكون دافع
				const trans = await transTeacherModal.getByTeacherIdAndStudentId(
					teacherId,
					student
				)

				if (!trans) {
					throw new Error('Student is not subscribed')
				}
			}

			const chapters = await chapterModel.getByTeacherIdAndStage(teacherId, stage)

			const chaptersWithLessons = await Promise.all(
				chapters.map(async (chapter: any) => {
					const lessons = await lessonsModel.getByChapterId(chapter.id)

					const lessonsWithData = await Promise.all(
						lessons.map(async (lesson: any) => {
							const [subscribe, views] = await Promise.all([
								subscribeModel.getByLessonIdAndStudentId(lesson.id, student),
								viewsModel.getByLessonIdAndStudentId(lesson.id, student),
							])

							return {
								...lesson,
								subscribe,
								views,
							}
						})
					)

					return {
						...chapter,
						lessons: lessonsWithData,
					}
				})
			)

			res.json({chapters: chaptersWithLessons})
		} catch (err) {
			next(err)
		}
	}
)
//get all lesson and about lesson (files-subscription)
routes.get(
	'/allLesson/lesson/:lessonId/student/:studentId/teacher/:teacherId',
	async (req: Request, res: Response, next) => {
		try {
			const {lessonId, studentId, teacherId} = req.params

			const teacherSub = await teacherSubscriptionsModal.getByTeacherId(teacherId)
			if (
				!teacherSub ||
				!teacherSub.active ||
				teacherSub.expire_date < new Date()
			) {
				throw new Error('Teacher subscription expired or inactive')
			}

			const trans = await transTeacherModal.getByTeacherIdAndStudentId(
				teacherId,
				studentId
			)
			if (!trans) {
				throw new Error('Student is not subscribed to this teacher')
			}

			const lesson = await lessonsModel.getOne(lessonId)
			const file = await filesModel.getByLessonId(lessonId)
			const exams = await examsModel.getByLessonId(lessonId)
			const views = await viewsModel.getByLessonIdAndStudentId(lessonId, studentId)

			let subscribe = null
			if (lesson.is_paid) {
				subscribe = await subscribeModel.getByLessonIdAndStudentId(
					lessonId,
					studentId
				)
			}

			const examsWithAnswers = await Promise.all(
				exams.map(async (exam: any) => {
					const studentAnswer = await answersModel.getByStudentIdAndExamId(
						studentId,
						exam.id
					)

					return {
						...exam,
						studentAnswer: studentAnswer || null,
					}
				})
			)

			res.json({
				status: 'success',
				data: {
					...lesson,
					file,
					subscribe,
					views,
					exams: examsWithAnswers,
				},
				message: 'Lesson fetched successfully',
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
			const comments = await commentsModel.getByLessonId(lesson)

			const commentsWithDetails = await Promise.all(
				comments.map(async (comment: any) => {
					const [user, replies] = await Promise.all([
						usersModel.getOne(comment.user_id),
						replayModel.getByCommentId(comment.id),
					])

					let extraData = null
					if (user) {
						const roleModelMap: any = {
							teachers: teachersModel,
							parents: parentsModel,
							students: studentsModel,
							assistants: assistantsModel,
						}
						const model = roleModelMap[user.role]
						if (model) extraData = await model.getOne(user.id)
					}

					const repliesWithUser = await Promise.all(
						(replies || []).map(async (reply: any) => {
							const replyUser = await usersModel.getOne(reply.user_id)
							let replyExtraData = null

							if (replyUser) {
								const roleModelMap: any = {
									teachers: teachersModel,
									parents: parentsModel,
									students: studentsModel,
									assistants: assistantsModel,
								}
								const model = roleModelMap[replyUser.role]
								if (model) replyExtraData = await model.getOne(replyUser.id)
							}

							return {
								...reply,
								user: replyUser,
								extraData: replyExtraData,
							}
						})
					)

					return {
						...comment,
						user,
						extraData,
						replies: repliesWithUser,
					}
				})
			)

			res.json({
				status: 'success',
				data: commentsWithDetails,
				message: 'Nested comments and replies fetched successfully',
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
			const teacherSub = await teacherSubscriptionsModal.getByTeacherId(
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
// get all chapters and lessons by stage
routes.get(
	`/chaptersLessons/:teacherId/stage/:stage`,
	async (req: Request, res: Response, next) => {
		const {teacherId, stage} = req.params
		try {
		const chapter = await chapterModel.getByTeacherIdAndStage(
				teacherId as unknown as string,
				stage as unknown as string
			)
				const allLessons = await Promise.all(
				chapter.map(async (c: any) => {
		const lesson = await lessonsModel.getPaidAndChapter(c.id as string)
					return {...c, lesson} // merge chapter with its lessons
				}
				)
			)
			res.json({
				status: 'success',
				data: allLessons,
				message: 'Users fetched successfully',
			})
		} catch (err) {
			next(err)
		}
	}
)
//profile page for student to show all his teachers (with subscription status) and assistants and parents
routes.get(
    '/profile/student/:studentId/teacher/:teacherId',
    async (req: Request<ProfileParams>, res: Response, next: NextFunction): Promise<void> => {
        const { studentId, teacherId } = req.params;

        try {
            // 1. Verify student-teacher relationship
            const studentTeacher = await studentsTeacherModel.getByTeacherIdStudentId(
                teacherId,
                studentId
            );

            if (!studentTeacher) {
                res.status(403).json({ 
                    status: 'error', 
                    message: 'Student is not associated with this teacher' 
                });
                return;
            }

            // 2. Fetch basic data in parallel to optimize performance
            const [student, studentExtra, view, studentAnswers, subscribe] = await Promise.all([
                usersModel.getOne(studentId),
                studentsModel.getOne(studentId),
                viewsModel.getByStudentId(studentId),
                answersModel.getByStudentId(studentId),
                subscribeModel.getByStudentIdAndTeacherId(studentId, teacherId)
            ]);

            // 3. Map lessons with view progress
            const allLessonsInView = await Promise.all(
                view.map(async (v: any) => {
                    const lesson = await lessonsModel.getOne(v.lesson_id);
                    return { ...v, lesson };
                })
            );

            // 4. Group answers inside their respective exams
            const examsMap = new Map();

            for (const answer of studentAnswers) {
                if (!examsMap.has(answer.exams_id)) {
                    const examInfo = await examsModel.getOne(answer.exams_id);
                    examsMap.set(answer.exams_id, {
                        ...examInfo,
                        answers: [] // Array to store student attempts for this exam
                    });
                }
                examsMap.get(answer.exams_id).answers.push(answer);
            }
            
            const examsWithAnswers = Array.from(examsMap.values());

            // 5. Map lessons with subscription details
            const allLessonInSubscribe = await Promise.all(
                subscribe.map(async (s: any) => {
                    const lesson = await lessonsModel.getOne(s.lesson_id);
                    return { ...s, lesson };
                })
            );

            // 6. Check teacher subscription status and validity
            const teacherSub = await teacherSubscriptionsModal.getByTeacherId(teacherId);
            
            let subStatus: any = teacherSub;
            let trans = null;

            if (teacherSub && teacherSub.active) {
                const isExpired = new Date(teacherSub.expire_date) < new Date();
                if (isExpired) {
                    subStatus = 'expired';
                }

                trans = await transTeacherModal.getByTeacherIdAndStudentId(teacherId, studentId);
                if (!trans) {
                    subStatus = 'no_transaction';
                }
            } else {
                subStatus = 'inactive';
            }

            // 7. Send final structured response
            res.json({
                status: 'success',
                data: {
                    student,
                    studentExtra,
                    allLessonsInView,
                    allLessonInSubscribe,
                    examsWithAnswers,
                    sub: subStatus,
                    trans
                },
                message: 'Profile data fetched successfully',
            });

        } catch (err) {
            // Pass any unexpected errors to the global error handler
            next(err);
        }
    }
);

export default routes
