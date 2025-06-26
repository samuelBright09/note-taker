import { Routes } from '@angular/router';
import { NoteDashboardComponent } from './components/note-dashboard/note-dashboard.component';
import { NoteFormComponent } from './components/note-form/note-form.component';
import { ArchivedComponent } from './components/archived/archived.component';


export const routes: Routes = [
  { path: 'notes', component: NoteDashboardComponent },
  { path: 'create', component: NoteFormComponent },
  { path: 'notes/:id', component: NoteFormComponent },
  { path: 'edit/:id', component: NoteFormComponent },
  { path: 'archived', component: ArchivedComponent },
  { path: '', redirectTo: '/notes', pathMatch: 'full' },
];
