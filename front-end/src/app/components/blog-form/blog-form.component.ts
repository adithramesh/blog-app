import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BlogService } from '../../services/blog/blog.service';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './blog-form.component.html',
  styleUrl: './blog-form.component.scss'
})
export class BlogFormComponent implements OnInit {
  mode: 'create' | 'edit' = 'create';
  blogId: string | null = null;
  
  form = {
    title: '',
    content: '',
    image: null as File | null
  };
  
  imagePreview: string | null = null;
  isSubmitting = false;

  private _blogService = inject(BlogService);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _toastr = inject(ToastrService);
  private _subscription = new Subscription();

  ngOnInit() {
    this.blogId = this._route.snapshot.paramMap.get('id');
    
    if (this.blogId) {
      this.mode = 'edit';
      this.loadBlogForEdit();
    }
  }

  loadBlogForEdit() {
    if (!this.blogId) return;
    
    const sub = this._blogService.getBlogById(this.blogId).subscribe({
      next: (blog) => {
        this.form.title = blog.title;
        this.form.content = blog.content;
        if (blog.imageUrl) {
          this.imagePreview = `https://res.cloudinary.com/${environment.CLOUDINARY_CLOUD_NAME}/image/upload/${blog.imageUrl}`;
        }
      },
      error: () => this._toastr.error('Failed to load blog')
    });
    this._subscription.add(sub)
  }

  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.form.image = input.files[0];
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.form.image);
    }
  }

  onSubmit() {
    if (!this.form.title || !this.form.content) {
      this._toastr.warning('Please fill in all required fields');
      return;
    }

    const user = this._authService.getCurrentUser();
    if (!user) {
      this._toastr.error('User not authenticated');
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    formData.append('title', this.form.title);
    formData.append('content', this.form.content);
    formData.append('authorId', user.id);
    
    if (this.form.image) {
      formData.append('image', this.form.image);
    }

    if (this.mode === 'create') {
      const sub = this._blogService.createBlog(formData).subscribe({
        next: () => {
          this._toastr.success('Blog created successfully!');
          this._router.navigate(['/blogs']);
        },
        error: () => {
          this._toastr.error('Failed to create blog');
          this.isSubmitting = false;
        }
      });
      this._subscription.add(sub)
    } else if (this.blogId) {
      const sub = this._blogService.updateBlog(this.blogId, formData).subscribe({
        next: () => {
          this._toastr.success('Blog updated successfully!');
          this._router.navigate(['/blogs', this.blogId]);
        },
        error: () => {
          this._toastr.error('Failed to update blog');
          this.isSubmitting = false;
        }
      });
      this._subscription.add(sub)
    }
  }

  cancel() {
    this._router.navigate(['/blogs']);
  }


  ngOnDestroy(){
    this._subscription.unsubscribe()
  }
}