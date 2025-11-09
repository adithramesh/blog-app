import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types/types";
import { HttpStatus } from "../../utils/http-status.enum";
import { BlogRequestDTO, BlogResponseDTO, BlogListResponseDTO } from "../../dto/blog.dto";
import { IBlogController } from "./blog.controller.interface";
import { IBlogService } from "../../services/blog/blog.service.interface";
import { uploadToCloudinary } from "../../utils/cloudinary.uploader";




type EmptyParams = Record<string, never>;

@injectable()
export class BlogController implements IBlogController {
  constructor(
    @inject(TYPES.IBlogService) private _blogService: IBlogService,
  ) {} 
  async addBlog(
    req: Request<EmptyParams, object, BlogRequestDTO>,
    res: Response<BlogResponseDTO>
  ): Promise<void> {
    try {
      const blogData = req.body;
      if (req.file) {
        const uploadResult:any = await uploadToCloudinary(req.file.buffer, 'blog');
        blogData.imageUrl = uploadResult.public_id;
      }
      const response = await this._blogService.createBlog(blogData);
      res.status(HttpStatus.CREATED).json(response);
    } catch (error) {
        console.log("error occured", error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  async getBlogs(req: Request, res: Response<BlogListResponseDTO>): Promise<void> {
    try {     
      const response = await this._blogService.getBlogs();
      res.status(HttpStatus.SUCCESS).json(response);
    } catch (error) {
      console.log("error occured in getBlogs", error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

 
  async getBlogById(req:Request, res:Response<BlogResponseDTO>):Promise<void>{
    try {
      const blogId= req.params.id as string
      const response = await this._blogService.getBlogById(blogId)
      res.status(HttpStatus.SUCCESS).json(response);
    } catch (error) {
      console.error('Error occurred in getblogById:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getBlogsByUserId(req: Request, res: Response<BlogListResponseDTO>): Promise<void> {
  try {
    const userId = req.params.userId;
    const response = await this._blogService.getBlogsByUserId(userId);
    res.status(HttpStatus.SUCCESS).json(response);
  } catch (error) {
    console.error('Error occurred in getBlogsByUserId', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

    async updateBlog(req:Request<EmptyParams, object, BlogRequestDTO>, res:Response<BlogResponseDTO>):Promise<void>{
     try {
      const blogId = req.params.id
      const blogData: BlogRequestDTO = req.body as BlogRequestDTO;
      console.log("blogData", blogData);
      
       if (req.file) {
        const uploadResult:any = await uploadToCloudinary(req.file.buffer, 'blog');
        blogData.imageUrl = uploadResult.public_id;
      }
      const response = await this._blogService.updateBlog(blogId, blogData)
      res.status(HttpStatus.SUCCESS).json(response);
    } catch (error) {
      console.log("error occured in update blog", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteBlog(req: Request, res: Response): Promise<void> {
    try {
      const blogId = req.params.id   
      const response = await this._blogService.deleteBlog(blogId)
      res.status(HttpStatus.SUCCESS).json(response)
    } catch (error) {
      console.log("error occured in update blog", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

}