import { Routes } from '@angular/router';
import { NoteDashboardComponent } from './components/note-dashboard/note-dashboard.component';
import { NoteFormComponent } from './components/note-form/note-form.component';
import { ArchivedComponent } from './components/archived/archived.component';
import { TagsComponent } from './components/tags/tags.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ColorThemeComponent } from './components/color-theme/color-theme.component';
import { SettingsParentComponent } from './components/settings-parent/settings-parent.component';

export const routes: Routes = [
  { path: 'notes', component: NoteDashboardComponent, data: { showFab: true } },
  { path: 'create', component: NoteFormComponent, data: { showFab: false } },
  { path: 'notes/:id', component: NoteFormComponent, data: { showFab: false } },
  { path: 'edit/:id', component: NoteFormComponent, data: { showFab: false } },
  { path: 'archived', component: ArchivedComponent, data: { showFab: true } },
  { path: 'tags', component: TagsComponent, data: { showFab: true } },
  {
    path: 'settings',
    component: SettingsParentComponent,
    children: [
      {
        path: '',
        component: SettingsComponent,
        data: { showFab: false },
      },
      {
        path: 'color-theme',
        component: ColorThemeComponent,
        data: { showFab: false },
      },
    ],
    data: { showFab: false },
  },

  { path: '', redirectTo: '/notes', pathMatch: 'full' },
];
