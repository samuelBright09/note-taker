import { Component, inject, OnInit } from '@angular/core';
import { NotesService } from '../../services/notes.service';
import { Note } from '../../interfaces/note';
import { NoteCardComponent } from "../note-card/note-card.component";


@Component({
  selector: 'app-archived',
  imports: [NoteCardComponent],
  templateUrl: './archived.component.html',
  styleUrl: './archived.component.scss'
})
export class ArchivedComponent implements OnInit {
private notesService  = inject(NotesService)
archivedNotes: Note[] = []


ngOnInit(): void {
  this.notesService.getArchivedNotes().subscribe((notes) => (this.archivedNotes = notes));
}

}
