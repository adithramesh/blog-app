import { Router } from 'express'
import { inject, injectable } from 'inversify'
import { TYPES } from '../types/types'
import { IBlogController } from '../controllers/blog/blog.controller.interface'
import { upload } from '../config/multer.config'



@injectable()
export class BlogRoutes{
    private _router:Router
    constructor(
        @inject(TYPES.IBlogController) private _blogController:IBlogController
    ){
        this._router=Router()
        this.initializeRoutes()
    }

    private initializeRoutes(){
        this._router.post('/create',upload.single('image'),this._blogController.addBlog.bind(this._blogController))
        this._router.get('/all',this._blogController.getBlogs.bind(this._blogController))
        this._router.get('/:id',this._blogController.getBlogById.bind(this._blogController))
        this._router.get('/user/:userId', this._blogController.getBlogsByUserId.bind(this._blogController));
        this._router.patch('/:id/update',upload.single('image'),this._blogController.updateBlog.bind(this._blogController))
        this._router.delete('/:id/delete', this._blogController.deleteBlog.bind(this._blogController))
    }

    public getRouter(){
        return this._router
    }


}