import LessonsTypes from '../types/lessons.types'
import pool from '../database/index'

class LessonsModel {
    /**
     * Create a new lesson
     * @param u Lesson data
     * @returns The created lesson object
     */
    async create(u: LessonsTypes): Promise<LessonsTypes> {
        try {
            const connect = await pool.connect()
            const sql =
                'INSERT INTO lessons (title, chapter_id, video_url, is_active, is_paid, price) VALUES($1, $2, $3, $4, $5, $6) returning *'
            const result = await connect.query(sql, [
                u.title,
                u.chapter_id,
                u.video_url,
                u.is_active,
                u.is_paid,
                u.price,
            ])
            connect.release()
            return result.rows[0]
        } catch (error) {
            throw new Error(`Error creating lesson: ${error}`)
        }
    }

    /**
     * Get all active lessons
     * @returns Array of active lessons
     */
    async getAll(): Promise<LessonsTypes[]> {
        try {
            const connect = await pool.connect()
            // Added filter to fetch only active lessons
            const sql = 'SELECT * from lessons WHERE is_active = true'
            const result = await connect.query(sql)
            connect.release()
            return result.rows
        } catch (err) {
            throw new Error(`Error fetching all lessons: ${err}`)
        }
    }

    /**
     * Get a specific lesson by ID
     * @param id Lesson UUID/ID
     * @returns The lesson object if found and active
     */
    async getOne(id: string): Promise<LessonsTypes> {
        try {
            const connect = await pool.connect()
            // Ensure the lesson is active even when requested by ID
            const sql = 'SELECT * from lessons WHERE id=($1) AND is_active = true'
            const result = await connect.query(sql, [id])
            connect.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Error fetching lesson by ID: ${err}`)
        }
    }
    //paid lessons with chapterId only
    async getPaidAndChapter(chapter_id:string): Promise<LessonsTypes[]> {
        try {
            const connect = await pool.connect()
            // Ensure the lesson is active even when requested by ID
            const sql = 'SELECT * from lessons WHERE is_paid = true AND is_active = true AND chapter_id = $1'
            const result = await connect.query(sql, [chapter_id])
            connect.release()
            return result.rows
        } catch (err) {
            throw new Error(`Error fetching lesson by ID: ${err}`)
        }
    }

    /**
     * Search lessons by title
     * @param title Lesson title
     * @returns Array of matching active lessons
     */
    async getByTitle(title: string): Promise<LessonsTypes[]> {
        try {
            const connect = await pool.connect()
            const sql = 'SELECT * from lessons WHERE title=($1) AND is_active = true'
            const result = await connect.query(sql, [title])
            connect.release()
            return result.rows
        } catch (err) {
            throw new Error(`Error fetching lessons by title: ${err}`)
        }
    }

    /**
     * Get all lessons belonging to a specific chapter
     * @param chapterId Chapter ID
     * @returns Array of active lessons in that chapter
     */
    async getByChapterId(chapterId: string): Promise<LessonsTypes[]> {
        try {
            const connect = await pool.connect()
            const sql = 'SELECT * from lessons WHERE chapter_id=($1) AND is_active = true'
            const result = await connect.query(sql, [chapterId])
            connect.release()
            return result.rows
        } catch (err) {
            throw new Error(`Error fetching lessons by chapter ID: ${err}`)
        }
    }

    /**
     * Update lesson details
     * @param u Updated lesson data
     * @returns The updated lesson object
     */
    async update(u: LessonsTypes): Promise<LessonsTypes> {
        try {
            const connect = await pool.connect()
            const sql =
                'UPDATE lessons SET title=($1), chapter_id=($2), video_url=($3), is_active=($4), is_paid=($5), price=($6) WHERE id=($7) returning *'
            const result = await connect.query(sql, [
                u.title,
                u.chapter_id,
                u.video_url,
                u.is_active,
                u.is_paid,
                u.price,
                u.id,
            ])
            connect.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Error updating lesson: ${err}`)
        }
    }

    /**
     * Delete a lesson record
     * @param id Lesson ID to delete
     * @returns The deleted lesson data
     */
    async delete(id: string): Promise<LessonsTypes> {
        try {
            const connect = await pool.connect()
            const sql = 'DELETE from lessons WHERE id=($1) returning *'
            const result = await connect.query(sql, [id])
            connect.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Error deleting lesson: ${err}`)
        }
    }
}

export default LessonsModel;