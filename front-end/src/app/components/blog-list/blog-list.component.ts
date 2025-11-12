import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BlogCardComponent } from '../blog-card/blog-card.component';
import { BlogService } from '../../services/blog/blog.service';
import { AuthService } from '../../services/auth/auth.service';
import { BlogResponseDTO } from '../../models/blog.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent, BlogCardComponent],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss'
})
export class BlogListComponent implements OnInit {
  blogs: BlogResponseDTO[] = [];
  isLoading = true;
  filterType: 'all' | 'my' = 'all';

  private _blogService = inject(BlogService);
  private _authService = inject(AuthService);
  private _route = inject(ActivatedRoute);
  private _toastr = inject(ToastrService);
  private _subscription = new Subscription()

  ngOnInit() {
    const sub = this._route.queryParams.subscribe(params => {
      this.filterType = params['filter'] === 'my' ? 'my' : 'all';
      this.loadBlogs();
    });

    this._subscription.add(sub)
  }

  loadBlogs() {
    this.isLoading = true;
    
    if (this.filterType === 'my') {
      const user = this._authService.getCurrentUser();
      if (user) {
        const sub = this._blogService.getBlogsByUserId(user.id).subscribe({
          next: (res) => {
            this.blogs = res.blogs;
            this.isLoading = false;
          },
          error: () => {
            this._toastr.error('Failed to load your blogs');
            this.isLoading = false;
          }
        });
        this._subscription.add(sub)
      }
    } else {
      const sub = this._blogService.getAllBlogs().subscribe({
        next: (res) => {
          this.blogs = res.blogs;
          this.isLoading = false;
        },
        error: () => {
          this._toastr.error('Failed to load blogs');
          this.isLoading = false;
        }
      });
      this._subscription.add(sub)
    }
  }


  ngOnDestroy(){
    this._subscription.unsubscribe()
  }
}