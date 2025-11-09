import { BlogRequestDTO, BlogResponseDTO, BlogListResponseDTO } from "../../dto/blog.dto"

export interface IBlogService{
    createBlog(blogData: BlogRequestDTO): Promise<BlogResponseDTO>
    getBlogById(blogId:string):Promise<BlogResponseDTO>
    getBlogs(): Promise<BlogListResponseDTO>
    getBlogsByUserId(userId: string): Promise<BlogListResponseDTO>;
    updateBlog(blogId:string, blogData:BlogRequestDTO):Promise<BlogResponseDTO>
    deleteBlog(blogId:string):Promise<{success:boolean; message: string}>
}