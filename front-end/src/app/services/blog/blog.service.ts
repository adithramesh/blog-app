import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BlogRequestDTO, BlogResponseDTO, BlogListResponseDTO } from '../../models/blog.model';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.BACK_END_API_URL}/blogs`;

  getAllBlogs(): Observable<BlogListResponseDTO> {
    return this.http.get<BlogListResponseDTO>(`${this.apiUrl}/all`);
  }

  getBlogById(id: string): Observable<BlogResponseDTO> {
    return this.http.get<BlogResponseDTO>(`${this.apiUrl}/${id}`);
  }

  getBlogsByUserId(userId: string): Observable<BlogListResponseDTO> {
    return this.http.get<BlogListResponseDTO>(`${this.apiUrl}/user/${userId}`);
  }

  createBlog(formData: FormData): Observable<BlogResponseDTO> {
    return this.http.post<BlogResponseDTO>(`${this.apiUrl}/create`, formData);
  }

  updateBlog(id: string, formData: FormData): Observable<BlogResponseDTO> {
    return this.http.patch<BlogResponseDTO>(`${this.apiUrl}/${id}/update`, formData);
  }

  deleteBlog(id: string):Observable<{success:boolean, message:string}>{
    return this.http.delete<{success:boolean, message:string}>(`${this.apiUrl}/${id}/delete`)
  }
}