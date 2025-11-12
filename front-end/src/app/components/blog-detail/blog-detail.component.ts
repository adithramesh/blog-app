import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BlogService } from '../../services/blog/blog.service';
import { AuthService } from '../../services/auth/auth.service';
import { BlogResponseDTO } from '../../models/blog.model';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss'
})
export class BlogDetailComponent implements OnInit {
  blog: BlogResponseDTO | null = null;
  isLoading = true;
  isOwner = false;

  private _blogService = inject(BlogService);
  private _authService = inject(AuthService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _toastr = inject(ToastrService);
  private _subscription = new Subscription();

  ngOnInit() {
    const blogId = this._route.snapshot.paramMap.get('id');
    if (blogId) {
      this.loadBlog(blogId);
    }
  }

  loadBlog(id: string) {
    const sub = this._blogService.getBlogById(id).subscribe({
      next: (blog) => {
        this.blog = blog;
        this.checkOwnership();
        this.isLoading = false;
      },
      error: () => {
        this._toastr.error('Failed to load blog');
        this._router.navigate(['/blogs']);
        this.isLoading = false;
      }
    });
    this._subscription.add(sub)
  }

  checkOwnership() {
    const user = this._authService.getCurrentUser();
    if (user && this.blog) {
      this.isOwner = user.id === this.blog.author.id;
    }
  }

  editBlog() {
    if (this.blog?.id) {
      this._router.navigate(['/blogs', this.blog.id, 'edit']);
    }
  }


  deleteBlog(){
    if (this.blog?.id) {

      this._blogService.deleteBlog(this.blog.id).subscribe({     
        next:(res)=>{
          this._router.navigate(['/blogs']);
        },
        error:(err)=>{
          console.error('Delete failed:', err);
          this._router.navigate(['/blogs']);
        }
      })
      
    }
  }

  getImageUrl(): string {
    return this.blog?.imageUrl 
      ? `https://res.cloudinary.com/${environment.CLOUDINARY_CLOUD_NAME}/image/upload/${this.blog.imageUrl}`
      : 'https://via.placeholder.com/800x400?text=No+Image';
  }

  goBack() {
    this._router.navigate(['/blogs']);
  }


  ngOnDestroy(){
      this._subscription.unsubscribe()
  }
}