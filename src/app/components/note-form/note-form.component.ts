import { Component, inject, OnInit } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-note-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './note-form.component.html',
  styleUrl: './note-form.component.scss',
})
export class NoteFormComponent implements OnInit {
  private notesService = inject(NotesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute)
  private fb = inject(FormBuilder);

  noteForm: FormGroup;
  noteId: string | null = null;
  showConfirmDelete: boolean = false;
  isEditingNote: boolean = false;
  isArchived: boolean = false;
  lastEditedAt: Date | undefined;
  constructor() {
    this.noteForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      tags: [''], // Tags can be optional
    });
  }

  ngOnInit(): void {
    const noteId = this.route.snapshot.paramMap.get('id');
    if (noteId) {
      this.noteId = noteId;
      this.isEditingNote = true;
      this.notesService.getNoteById(noteId).subscribe(note => {
        if (note) {
          this.noteForm.patchValue({
             title: note.title,
              content: note.content,
              tags: note.tags ? note.tags.join(', ') : '',
          });
          this.lastEditedAt = note.editedAt;
          this.isArchived = note.isArchived;
        } else {
          this.router.navigate(['/create']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.noteForm.valid) {
      const { title, content, tags } = this.noteForm.value;
      const tagsArray = tags ? tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag !== '') : [];

      if (this.isEditingNote && this.noteId) {
        this.notesService.updateNote(this.noteId, { title, content, tags: tagsArray });
      } else {
        this.notesService.createNote(title, content, tagsArray);
      }
      this.router.navigate(['/notes']); // Navigate back to the dashboard after operation
    } else {
      // Mark all fields as touched to display validation messages
      this.noteForm.markAllAsTouched();
    }
  }

  archiveNote(): void {
    if (this.noteId) {
      this.notesService.toggleArchive(this.noteId, true);
    }
  }

  unArchiveNote(): void {
    if (this.noteId) {
      this.notesService.toggleArchive(this.noteId, false);
    }
  }

  // Method to handle delete action
  confirmDelete(): void {
    this.showConfirmDelete = true;
  }

  // Method to perform delete
  onDelete(): void {
    if (this.noteId) {
      this.notesService.deleteNote(this.noteId);
      this.router.navigate(['/notes']);
      this.showConfirmDelete = false; // Close the dialog
    }
  }

  // Method to cancel delete
  cancelDelete(): void {
    this.showConfirmDelete = false;
  }

  // Navigate back to dashboard
  backToDashboard(): void {
    this.router.navigate(['/notes']);
  }

  
}
