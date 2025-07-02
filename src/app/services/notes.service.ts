import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Note } from '../interfaces/note';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private static readonly LocalStorageKey = 'note_taker';
  private showArchivedSubject = new BehaviorSubject<boolean>(false);
  showArchived$ = this.showArchivedSubject.asObservable();
  private activeTagFilterSubject = new BehaviorSubject<string | null>(null);

  private notes: Note[] = [];
  private archivedNotes: Note[] = [];
  private archivedNotesSubject = new BehaviorSubject<Note[]>(
    this.archivedNotes
  );
  public activeTagFilter$ = this.activeTagFilterSubject.asObservable();
  private notesSubject = new BehaviorSubject<Note[]>(this.notes);
  public notes$ = this.notesSubject.asObservable();
  private searchTermSubject = new BehaviorSubject<string>('');
  public searchTerm$ = this.searchTermSubject.asObservable();

  constructor() {
    this.loadNotesFromLocalStorage();
  }

  // --- Local Storage Management ---
  private loadNotesFromLocalStorage(): void {
    const notesJson = localStorage.getItem(NotesService.LocalStorageKey);
    if (notesJson) {
      try {
        const storedNotes: Note[] = JSON.parse(notesJson);
        // Convert date strings back to Date objects
        this.notes = storedNotes.map((note) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          editedAt: note.editedAt ? new Date(note.editedAt) : undefined,
        }));
      } catch (e) {
        console.error('Error parsing notes from localStorage:', e);
        this.notes = []; // Fallback to empty if parsing fails
      }
    } else {
      // If no notes in localStorage, initialize with dummy data
      this.notes = [
        {
          id: '1',
          title: 'First Meeting Notes',
          content: 'Discussed project deadlines and team assignments.',
          tags: ['work', 'project', 'meeting'],
          isArchived: false,
          createdAt: new Date(2023, 0, 1),
          editedAt: new Date(2023, 0, 5),
        },
        {
          id: '2',
          title: 'Grocery List',
          content: 'Milk, Eggs, Bread, Apples, Coffee.',
          tags: ['personal', 'shopping'],
          isArchived: false,
          createdAt: new Date(2023, 1, 15),
          editedAt: new Date(2023, 1, 15),
        },
        {
          id: '3',
          title: 'Archived Idea: New Feature',
          content: 'Brainstormed ideas for a new search feature in the app.',
          tags: ['idea', 'development'],
          isArchived: true,
          createdAt: new Date(2023, 2, 10),
          editedAt: new Date(2023, 2, 12),
        },
        {
          id: '4',
          title: 'Workout Plan',
          content: 'Leg day: Squats, Lunges, Deadlifts.',
          tags: ['health', 'fitness'],
          isArchived: false,
          createdAt: new Date(2023, 3, 1),
          editedAt: new Date(2023, 3, 1),
        },
        {
          id: '5',
          title: 'Book Recommendations',
          content:
            'Read "Dune" by Frank Herbert and "Project Hail Mary" by Andy Weir.',
          tags: ['reading', 'hobby'],
          isArchived: false,
          createdAt: new Date(2023, 4, 20),
          editedAt: new Date(2023, 4, 20),
        },
      ];
    }
    this.notesSubject.next([...this.notes]);
  }

  private saveNotesToLocalStorage(): void {
    localStorage.setItem(
      NotesService.LocalStorageKey,
      JSON.stringify(this.notes)
    );
  }

  createNote(title: string, content: string, tags: string[]): void {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      isArchived: false,
      createdAt: new Date(),
      editedAt: new Date(),
      tags: tags.map((tag) => tag.toLowerCase()), // Store tags in lowercase
    };
    this.notes.unshift(newNote);
    this.notesSubject.next([...this.notes]);
    this.saveNotesToLocalStorage();
  }

  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }

  setActiveTagFilter(tag: string | null): void {
    this.activeTagFilterSubject.next(tag);
  }

  getAllUniqueTags(): Observable<string[]> {
    return this.notes$.pipe(
      map((notes) => {
        const allTags = new Set<string>();
        notes.forEach((note) => {
          note.tags.forEach((tag) => allTags.add(tag.toLowerCase())); // Store tags in lowercase
        });
        return Array.from(allTags).sort(); // Convert to array and sort alphabetically
      })
    );
  }

  getSearchTerm(): Observable<string> {
    return this.searchTermSubject.asObservable();
  }

  getShowArchived(): boolean {
    return this.showArchivedSubject.value;
  }

  fetchNotes(): Observable<Note[]> {
    return combineLatest([
      this.notes$,
      this.searchTerm$,
      this.activeTagFilter$,
      this.showArchived$,
    ]).pipe(
      map(([notes, searchTerm, activeTagFilter, showArchived]) => {
        let filteredNotes = notes; // First, filter by active
        if (showArchived) {
          filteredNotes = notes;
        } else {
          filteredNotes = filteredNotes.filter((note) => !note.isArchived);
        }

        if (searchTerm) {
          const lowerCaseSearchTerm = searchTerm.toLowerCase();
          filteredNotes = filteredNotes.filter(
            (note) =>
              note.title.toLowerCase().includes(lowerCaseSearchTerm) ||
              note.content.toLowerCase().includes(lowerCaseSearchTerm) ||
              note.tags.some((tag) =>
                tag.toLowerCase().includes(lowerCaseSearchTerm)
              )
          );
        }

        if (activeTagFilter) {
          const lowerCaseTagFilter = activeTagFilter.toLowerCase();
          filteredNotes = filteredNotes.filter((note) =>
            note.tags.some((tag) => tag.toLowerCase() === lowerCaseTagFilter)
          );
        }

        // Sort notes by createdAt in descending order (newest first)
        return filteredNotes.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
      })
    );
  }

  getArchivedNotes(): Observable<Note[]> {
    return combineLatest([
      this.notes$,
      this.searchTerm$,
      this.activeTagFilter$,
    ]).pipe(
      map(([notes, searchTerm, activeTagFilter]) => {
        let filteredNotes = notes.filter((note) => note.isArchived); // First, filter by archived

        if (searchTerm) {
          const lowerCaseSearchTerm = searchTerm.toLowerCase();
          filteredNotes = filteredNotes.filter(
            (note) =>
              note.title.toLowerCase().includes(lowerCaseSearchTerm) ||
              note.content.toLowerCase().includes(lowerCaseSearchTerm) ||
              note.tags.some((tag) =>
                tag.toLowerCase().includes(lowerCaseSearchTerm)
              )
          );
        }

        if (activeTagFilter) {
          const lowerCaseTagFilter = activeTagFilter.toLowerCase();
          filteredNotes = filteredNotes.filter((note) =>
            note.tags.some((tag) => tag.toLowerCase() === lowerCaseTagFilter)
          );
        }

        // Sort notes by createdAt in descending order (newest first)
        return filteredNotes.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
      })
    );
  }

  addToArchive(id: string): void {
   this.toggleArchive(id, true);
  }

  getNoteById(id: string): Observable<Note | undefined> {
    return this.notes$.pipe(
      map((notes) => notes.find((note) => note.id === id))
    );
  }

  updateNote(id: string, updatedFields: Partial<Note>): void {
    const index = this.notes.findIndex((note) => note.id === id);
    if (index > -1) {
      this.notes[index] = {
        ...this.notes[index],
        ...updatedFields,
        editedAt: new Date(),
      };
      this.notesSubject.next([...this.notes]);
      this.saveNotesToLocalStorage();
    }
  }

  deleteNote(id: string): void {
    this.notes = this.notes.filter((note) => note.id !== id);
    this.notesSubject.next([...this.notes]);
    this.saveNotesToLocalStorage();
  }

  toggleArchive(id: string, isArchived: boolean): void {
    const index = this.notes.findIndex((note) => note.id === id);
    if (index > -1) {
      this.notes[index] = { ...this.notes[index], isArchived };
      this.notesSubject.next([...this.notes]);
      this.saveNotesToLocalStorage();
    }
  }

  setShowArchived(showArchived: boolean): void {
    this.showArchivedSubject.next(showArchived);
  }
}
