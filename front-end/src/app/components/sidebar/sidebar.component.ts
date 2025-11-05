import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private _router = inject(Router);

  navigateToCreate() {
    this._router.navigate(['/blogs/create']);
  }

  navigateToMyBlogs() {
    this._router.navigate(['/blogs'], { queryParams: { filter: 'my' } });
  }

  navigateToAllBlogs() {
    this._router.navigate(['/blogs']);
  }
}