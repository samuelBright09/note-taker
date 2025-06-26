import { Component, Input } from '@angular/core';
import { Note } from '../../interfaces/note';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-note-card',
  imports: [DatePipe, RouterLink],
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.scss'
})
export class NoteCardComponent {
@Input() note!: Note
}
