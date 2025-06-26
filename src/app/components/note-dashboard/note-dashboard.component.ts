import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { Note } from '../../interfaces/note';
import { NoteCardComponent } from '../note-card/note-card.component';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';



@Component({
  selector: 'app-note-dashboard',
  imports: [NoteCardComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './note-dashboard.component.html',
  styleUrl: './note-dashboard.component.scss',
})
export class NoteDashboardComponent implements OnInit, OnDestroy {
  private notesService = inject(NotesService);
   searchControl = new FormControl('');
   private searchSubscription!: Subscription;
  notes: Note[] = [];

  
  ngOnInit(): void {
    this.notesService.fetchNotes().subscribe((notes) => (this.notes = notes));

    // Subscribe to search input changes with debounce for performance
    this.searchSubscription = this.searchControl.valueChanges.pipe(
      debounceTime(300), // Wait for 300ms after the last keystroke
      distinctUntilChanged() // Only emit if the value has changed
    ).subscribe(searchTerm => {
      this.notesService.setSearchTerm(searchTerm || ''); // Update the service's search term
    });

  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
