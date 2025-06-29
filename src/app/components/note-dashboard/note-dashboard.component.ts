import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { Note } from '../../interfaces/note';
import { NoteCardComponent } from '../note-card/note-card.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  Subscription,
} from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note-dashboard',
  imports: [NoteCardComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './note-dashboard.component.html',
  styleUrl: './note-dashboard.component.scss',
})
export class NoteDashboardComponent implements OnInit, OnDestroy {
  private notesService = inject(NotesService);
  private router = inject(Router);
  searchControl = new FormControl('');
  private searchSubscription!: Subscription;
  notes: Note[] = [];
  allFilteredNotes: Note[] = []; // Notes without local search filter

  filteredNotes$!: Observable<Note[]>;
  pageTitle$!: Observable<string>;
  showBackButton$!: Observable<boolean>;
  isSearchActive = false;

  ngOnInit(): void {
    this.filteredNotes$ = this.notesService.fetchNotes();
    this.notesService.fetchNotes().subscribe((notes) => (this.notes = notes));

    // Create dynamic page title based on active tag filter
    this.pageTitle$ = this.notesService.activeTagFilter$.pipe(
      map((tagFilter) =>
        tagFilter ? `Notes Tagged: ${tagFilter}` : 'All Notes'
      )
    );
    this.showBackButton$ = this.notesService.activeTagFilter$.pipe(
      map((tagFilter) => !!tagFilter)
    );

    // Subscribe to search input changes with debounce for performance
    this.searchSubscription = this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Wait for 300ms after the last keystroke
        distinctUntilChanged() // Only emit if the value has changed
      )
      .subscribe((searchTerm) => {
        this.notesService.setSearchTerm(searchTerm || ''); // Update the service's search term
      });
  }


    goBack(): void {
    this.notesService.setActiveTagFilter(null);
    this.notesService.setShowArchived(false);
    // Stay on the same route, just clear the filters
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }


 navigateToTags(): void {
    this.router.navigate(['tags']);
  }

}
