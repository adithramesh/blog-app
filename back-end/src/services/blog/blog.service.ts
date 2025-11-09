import { inject, injectable } from "inversify";
import { TYPES } from "../../types/types";
import mongoose from "mongoose";
import { BlogListResponseDTO, BlogRequestDTO, BlogResponseDTO } from "../../dto/blog.dto";
import { IBlogService } from "./blog.service.interface";
import { IBlogRepository } from "../../repositories/blog/blog.repository.interface";
import { IBlog } from "../../models/blog.model";
import { IUser } from "../../models/user.model";


@injectable()
export class BlogService implements IBlogService {
    constructor(
        @inject(TYPES.IBlogRepository) private _blogRepository:IBlogRepository,
       
    ){}
    async createBlog(blogData: BlogRequestDTO): Promise<BlogResponseDTO> {
        const { title, imageUrl, content, authorId } = blogData;
        try {
        const createdBlog = await this._blogRepository.createBlog({
            title,
            imageUrl,
            content,
            author: new mongoose.Types.ObjectId(authorId)
          });
    
        return mapBlogToDto(createdBlog);

       } catch (error) {
        console.error("Error creating blog:", error);
        throw error;
       }
    }

    async getBlogs(): Promise<BlogListResponseDTO> {
      try {
        
        const blogs = await this._blogRepository.findBlogs()
        const totalBlogs = await this._blogRepository.countBlogs()
        const blogList:BlogResponseDTO[]=blogs.map(mapBlogToDto)
        return {
          blogs: blogList,
          total: totalBlogs,
        };
      } catch (error) {
        console.error("Error in getblogs blog:", error);
        throw error;
      }
    }

    async getBlogById(blogId:string):Promise<BlogResponseDTO>{
    try {
      const blog= await this._blogRepository.findBlogById(blogId)
      if (!blog) {
      throw new Error(`Blog with ID ${blogId} not found`);
      }
      return mapBlogToDto(blog);
    } catch (error) {
      console.error('Error in getblogById blog:', error);
      throw error;
    }
  }

  async getBlogsByUserId(userId: string): Promise<BlogListResponseDTO> {
  try {
    const blogs = await this._blogRepository.findBlogsByUserId(userId);
    const totalBlogs = blogs.length;
    const blogList: BlogResponseDTO[] = blogs.map(mapBlogToDto);
    return {
      blogs: blogList,
      total: totalBlogs,
    };
  } catch (error) {
    console.error("Error in getBlogsByUserId:", error);
    throw error;
  }
}

  async  updateBlog(blogId:string, blogData:BlogRequestDTO):Promise<BlogResponseDTO>{
      try {
        const blog = await this._blogRepository.findBlogById(blogId)
        if(!blog){
          throw new Error('blog not found to update'); 
        }

        const updateModelData: mongoose.UpdateQuery<IBlog> = {
                title: blogData.title,
                content: blogData.content,
                imageUrl: blogData.imageUrl,
                // Do not update author here unless explicitly allowed
            };

        await this._blogRepository.updateBlog(blogId, updateModelData);

        const updatedBlog = await this._blogRepository.findBlogById(blogId)
         if(!updatedBlog){
          throw new Error('Failed to retrieve updated blog');
        }
         return mapBlogToDto(updatedBlog);

      } catch (error) {
        console.error("Error in update blog blog:", error);
        throw error;
      }
    }

     async deleteBlog(blogId:string):Promise<{success:boolean; message: string}>{
      try {
        const response =await this._blogRepository.delete(blogId)
        if(response){
          return {success:true,message:"Deleted blog successfully"}
        }else{
          return {success:false,message:"Delete blog unsuccessful "}
        }
      } catch (error) {
        console.error("Error in deleting blog:", error);
        throw error;
      }
    }

}

function mapBlogToDto(blog: IBlog): BlogResponseDTO {
    const author = blog.author as unknown as IUser; 

    return {
        id: (blog._id as mongoose.Types.ObjectId).toString(),
        title: blog.title,
        content: blog.content,
        imageUrl: blog.imageUrl,
        author: {
            id: (author?._id as mongoose.Types.ObjectId)?.toString() || '',
            username: author?.username || 'Unknown Author',
        },
        createdAt: blog.createdAt ? blog.createdAt.toISOString() : '',
        updatedAt: blog.updatedAt ? blog.updatedAt.toISOString() : '',
    };

   
}
