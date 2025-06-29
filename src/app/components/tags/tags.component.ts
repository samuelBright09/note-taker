import { Component, inject } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tags',
  imports: [CommonModule],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss'
})
export class TagsComponent {
private notesService = inject(NotesService)
private router = inject(Router)
 uniqueTags$!: Observable<string[]>;




  ngOnInit(): void {
    this.uniqueTags$ = this.notesService.getAllUniqueTags();
  }

filterByTag(tag: string): void {
    this.notesService.setActiveTagFilter(tag); // Set the tag filter in the service
    this.notesService.setSearchTerm(''); // Clear search term when filtering by tag
    this.notesService.setShowArchived(true); // Show archived notes when filtering by tag
    this.router.navigate(['notes']); // Navigate to dashboard
  }
  clearTagFilter(): void {
    this.notesService.setActiveTagFilter(null); // Clear the tag filter
    this.notesService.setShowArchived(false); // Hide archived notes in general view
    this.router.navigate(['notes']); // Navigate to dashboard
  }
}
