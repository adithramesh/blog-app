import mongoose, { NullExpression } from "mongoose";
import Blog,{ IBlog } from "../../models/blog.model";
import { BaseRepository } from "../base-repository";
import { IBlogRepository } from "./blog.repository.interface";
;

export class BlogRepository extends BaseRepository<IBlog> implements IBlogRepository {
    constructor(){
        super(Blog)
    }
    async createBlog(blogData: Partial<IBlog>): Promise<IBlog> {
        const blog = await this.create(blogData)
        return  (await Blog.findById(blog._id).populate('author').lean()) as unknown as IBlog 
    }

    async findBlogById(id: string): Promise<IBlog | null> {
        return (await Blog.findById(id).populate('author').lean()) as IBlog | null;
    }

    async findBlogsByUserId(userId: string): Promise<IBlog[]> {
        return (await Blog.find({ author: userId }).populate('author').sort({ createdAt: -1 }).lean()) as unknown as IBlog[];
    }

    async updateBlog(id: string, updateData: mongoose.UpdateQuery<IBlog>): Promise<IBlog | null> {
        return await this.update(id,updateData);
    }
    
    async findBlogs(): Promise<IBlog[]> {
        return (await Blog.find().populate('author').sort().lean()) as unknown as IBlog[];
    }

    async countBlogs(): Promise<number> {
        return await this.count() 
    }

    // async deleteBlog(id: string): Promise<boolean> {
        
    // }
}