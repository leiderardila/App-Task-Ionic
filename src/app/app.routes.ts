import { inject } from '@angular/core';
import { Router, type Routes } from '@angular/router';
import { FeatureFlagService } from './core/services/feature-flag.service';

/** Bloquea /categories cuando el feature flag de Remote Config está apagado. */
const categoriesEnabled = () =>
  inject(FeatureFlagService).isEnabled('categories') || inject(Router).createUrlTree(['/home']);

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage) },
  { path: 'tasks', loadComponent: () => import('./pages/tasks/tasks.page').then((m) => m.TasksPage) },
  {
    path: 'categories',
    canActivate: [categoriesEnabled],
    loadComponent: () => import('./pages/categories/categories.page').then((m) => m.CategoriesPage),
  },
];
