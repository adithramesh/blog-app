import mongoose from "mongoose"
import { IBlog } from "../../models/blog.model"
import { IBaseRepository } from "../base-repository.interface"

export interface IBlogRepository extends IBaseRepository<IBlog> {
    createBlog(blogData: Partial<IBlog>): Promise<IBlog>
    findBlogById(id: string): Promise<IBlog | null>
    updateBlog(id: string, updateData: mongoose.UpdateQuery<IBlog>): Promise<IBlog | null>
    findBlogs(): Promise<IBlog[]>
    findBlogsByUserId(userId: string): Promise<IBlog[]>;
    countBlogs(): Promise<number>
    // deleteBlog(id: string):Promise<boolean>
}