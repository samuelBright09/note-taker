import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Note } from '../interfaces/note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
private http = inject(HttpClient);
private notesSubject = new BehaviorSubject<Note[]>([]);
notes$ = this.notesSubject.asObservable();

  constructor() { }


  

}
