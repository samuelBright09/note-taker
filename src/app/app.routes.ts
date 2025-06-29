import { Routes } from '@angular/router';
import { NoteDashboardComponent } from './components/note-dashboard/note-dashboard.component';
import { NoteFormComponent } from './components/note-form/note-form.component';
import { ArchivedComponent } from './components/archived/archived.component';
import { TagsComponent } from './components/tags/tags.component';


export const routes: Routes = [
  { path: 'notes', component: NoteDashboardComponent, data: { showFab: true }},
  { path: 'create', component: NoteFormComponent, data: { showFab: false } },
  { path: 'notes/:id', component: NoteFormComponent, data: { showFab: false } },
  { path: 'edit/:id', component: NoteFormComponent, data: { showFab: false } },
  { path: 'archived', component: ArchivedComponent, data: { showFab: true } },
  { path: 'tags', component: TagsComponent, data: { showFab: true } },
  { path: '', redirectTo: '/notes', pathMatch: 'full' },
];
