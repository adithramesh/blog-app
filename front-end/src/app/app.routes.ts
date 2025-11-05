import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';
import { BlogFormComponent } from './components/blog-form/blog-form.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
     { path: "signup", component:AuthComponent},
     { path: "login", component:AuthComponent},
     { path: 'blogs', component: BlogListComponent, canActivate: [authGuard] },
     { path: 'blogs/create', component: BlogFormComponent, canActivate: [authGuard] },
     { path: 'blogs/:id', component: BlogDetailComponent, canActivate: [authGuard] },
     { path: 'blogs/:id/edit', component: BlogFormComponent, canActivate: [authGuard] },
     { path: '', redirectTo: '/login', pathMatch: 'full' }
    
];
