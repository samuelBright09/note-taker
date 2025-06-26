import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Note } from '../interfaces/note';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private notes: Note[] = [];
  private archivedNotes: Note[] = [];
  private archivedNotesSubject = new BehaviorSubject<Note[]>(this.archivedNotes);
  private archivedNotes$ = this.archivedNotesSubject.asObservable();
  private notesSubject = new BehaviorSubject<Note[]>(this.notes);
  public notes$ = this.notesSubject.asObservable();
   private searchTermSubject = new BehaviorSubject<string>('');

  constructor() {
     this.notes = [
      { id: '1', title: 'First Meeting Notes', content: 'Discussed project deadlines and team assignments.', tags: ['work', 'project', 'meeting'], isArchived: false, createdAt: new Date(2023, 0, 1), editedAt: new Date(2023, 0, 5) },
      { id: '2', title: 'Grocery List', content: 'Milk, Eggs, Bread, Apples, Coffee.', tags: ['personal', 'shopping'], isArchived: false, createdAt: new Date(2023, 1, 15), editedAt: new Date(2023, 1, 15) },
      { id: '3', title: 'Archived Idea: New Feature', content: 'Brainstormed ideas for a new search feature in the app.', tags: ['idea', 'development'], isArchived: true, createdAt: new Date(2023, 2, 10), editedAt: new Date(2023, 2, 12) },
      { id: '4', title: 'Workout Plan', content: 'Leg day: Squats, Lunges, Deadlifts.', tags: ['health', 'fitness'], isArchived: false, createdAt: new Date(2023, 3, 1), editedAt: new Date(2023, 3, 1) },
      { id: '5', title: 'Book Recommendations', content: 'Read "Dune" by Frank Herbert and "Project Hail Mary" by Andy Weir.', tags: ['reading', 'hobby'], isArchived: false, createdAt: new Date(2023, 4, 20), editedAt: new Date(2023, 4, 20) }
    ];
    this.notesSubject.next([...this.notes]);
  }

  createNote(title: string, content: string, tags: string[]): void {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      isArchived: false,
      createdAt: new Date(),
       editedAt: new Date(),
      tags,
    };
    this.notes.unshift(newNote);
    this.notesSubject.next([...this.notes])
  }

  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }

    getSearchTerm(): Observable<string> {
    return this.searchTermSubject.asObservable();
  }

  fetchNotes(): Observable<Note[]> {
   return combineLatest([
      this.notesSubject.asObservable(),
      this.searchTermSubject.asObservable()
    ]).pipe(
      map(([notes, searchTerm]) => {
        let filteredNotes = notes.filter(note => !note.isArchived); // First, filter by active

        if (searchTerm) {
          const lowerCaseSearchTerm = searchTerm.toLowerCase();
          filteredNotes = filteredNotes.filter(note =>
            note.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            note.content.toLowerCase().includes(lowerCaseSearchTerm) ||
            note.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm))
          );
        }
        // Sort notes by createdAt in descending order (newest first)
        return filteredNotes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      })
    );
  }

  

    getArchivedNotes(): Observable<Note[]> {
    return combineLatest([
      this.notesSubject.asObservable(),
      this.searchTermSubject.asObservable()
    ]).pipe(
      map(([notes, searchTerm]) => {
        let filteredNotes = notes.filter(note => note.isArchived); // First, filter by archived

        if (searchTerm) {
          const lowerCaseSearchTerm = searchTerm.toLowerCase();
          filteredNotes = filteredNotes.filter(note =>
            note.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            note.content.toLowerCase().includes(lowerCaseSearchTerm) ||
            note.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm))
          );
        }
        // Sort notes by createdAt in descending order (newest first)
        return filteredNotes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      })
    );
  }

  addToArchive(id: string): void {
    const note = this.notes.find(note => note.id === id);
    if (note) {
      note.isArchived = true;
      this.archivedNotesSubject.next([...this.archivedNotes]);
    }
  }

  getNoteById(id: string):Observable<Note | undefined> {
    return this.notes$.pipe(
      map(notes => notes.find(note => note.id === id))
    );
  }

   updateNote(id: string, updatedFields: Partial<Note>): void {
    const index = this.notes.findIndex(note => note.id === id);
    if (index > -1) {
      this.notes[index] = { ...this.notes[index], ...updatedFields, editedAt: new Date() };
      this.notesSubject.next([...this.notes]); // Emit the updated notes array
    }
  }

    deleteNote(id: string): void {
    this.notes = this.notes.filter(note => note.id !== id);
    this.notesSubject.next([...this.notes]); // Emit the updated notes array
  }

   toggleArchive(id: string, isArchived: boolean): void {
    const index = this.notes.findIndex(note => note.id === id);
    if (index > -1) {
      this.notes[index] = { ...this.notes[index], isArchived };
      this.notesSubject.next([...this.notes]); // Emit the updated notes array
    }
  }






}
