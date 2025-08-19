import {Router} from 'express'
import teacherRoutes from './api/teachers.routes'
import studentRoutes from './api/students.routes'
import studentsTeacherRoutes from './api/studentsTeacher.routes'
import parentsRoutes from './api/parents.routes'
import parentsStudentsRoutes from './api/parentsStudents.routes'
import assistantsRoutes from './api/assistants.routes'
import chapterRoutes from './api/chapter.routes'
import lessonsRoutes from './api/lessons.routes'
import filesRoutes from './api/files.routes'
import examsRoutes from './api/exams.routes'
import questionsRoutes from './api/questions.routes'
import answersRoutes from './api/answers.routes'
import commentsRoutes from './api/comments.routes'
import ReplyRoutes from './api/replay.routes'
import ViewsRoutes from './api/views.routes'
import SubscribeRoutes from './api/subscribe.routes'
import usersRoutes from './api/users.routes'
import transTeacher from './api/transTeacher.routes'
import MultipleRoutes from './api/multiple.routes'

const routes = Router()
routes.use('/users', usersRoutes)
routes.use('/teachers', teacherRoutes)
routes.use('/students', studentRoutes)
routes.use('/st', studentsTeacherRoutes)
routes.use('/parents', parentsRoutes)
routes.use('/ps', parentsStudentsRoutes)
routes.use('/assistants', assistantsRoutes)
routes.use('/chapters', chapterRoutes)
routes.use('/lessons', lessonsRoutes)
routes.use('/files', filesRoutes)
routes.use('/exams', examsRoutes)
routes.use('/qa', questionsRoutes)
routes.use('/answers', answersRoutes)
routes.use('/comments', commentsRoutes)
routes.use('/replay', ReplyRoutes)
routes.use('/views', ViewsRoutes)
routes.use('/subscribe', SubscribeRoutes)
routes.use('/trans', transTeacher)
routes.use('/m', MultipleRoutes)

export default routes
