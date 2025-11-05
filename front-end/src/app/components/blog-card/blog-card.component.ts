import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BlogResponseDTO } from '../../models/blog.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.scss'
})
export class BlogCardComponent {
  @Input() blog!: BlogResponseDTO;
  
  private _router = inject(Router);

  getShortContent(): string {
    return this.blog.content.length > 150 
      ? this.blog.content.substring(0, 150) + '...' 
      : this.blog.content;
  }

  viewDetails() {
    this._router.navigate(['/blogs', this.blog.id]);
  }

  getImageUrl(): string {
    return this.blog.imageUrl 
      ? `https://res.cloudinary.com/${environment.CLOUDINARY_CLOUD_NAME}/image/upload/${this.blog.imageUrl}`
      : 'https://via.placeholder.com/400x200?text=No+Image';
  }
}