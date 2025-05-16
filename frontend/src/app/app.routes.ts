import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { OverviewComponent } from './overview/overview.component';
import { authGuard } from './auth.guard';
import { DetailComponent } from './detail/detail.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent},
    { path: 'signup', component: SignupComponent},
    { path: 'home', component: OverviewComponent, canActivate: [authGuard]},
    { path: 'boat/:id', component: DetailComponent, canActivate: [authGuard]}
];
