export interface RoleDetails {
  id: string;
  full_name: string;
  phone: string;
  role: "students";
}

export interface StudentDetails {
  stage: string;
  profile_pic: string;
}

export interface LessonView {
  lesson_id: string;
  progress: number;
  date: string;
}

export interface PaidLesson {
  lesson_id: string;
  price: number;
  date: string;
  expire: string;
}

export interface ExamResult {
  examId: string;
  examName: string;
  lessonId: string;
  score: number;
  completedAt: string;
}
