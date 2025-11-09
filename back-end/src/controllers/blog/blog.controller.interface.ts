import {Request, Response} from "express"
import { BlogListResponseDTO, BlogRequestDTO, BlogResponseDTO } from "../../dto/blog.dto";
type EmptyParams = Record<string, never>;

export interface IBlogController {
    addBlog(
        req: Request<EmptyParams, object, BlogRequestDTO>,
        res: Response<BlogResponseDTO>
      ): Promise<void>
    getBlogs(req: Request, res: Response<BlogListResponseDTO>): Promise<void>
    getBlogsByUserId(req: Request, res: Response<BlogListResponseDTO>): Promise<void>
    getBlogById(req:Request, res:Response<BlogResponseDTO>):Promise<void>
    updateBlog(req:Request<EmptyParams, object, BlogRequestDTO>, res:Response<BlogResponseDTO>):Promise<void>
    deleteBlog(req: Request, res: Response): Promise<void>
}   