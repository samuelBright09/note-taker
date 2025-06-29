import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { NotesService } from '../../services/notes.service';



@Component({
  selector: 'app-bottom-navigation',
  imports: [RouterLink],
  templateUrl: './bottom-navigation.component.html',
  styleUrl: './bottom-navigation.component.scss'
})
export class BottomNavigationComponent implements OnInit,OnDestroy {
isSearchActive: boolean = false;
  currentRoute: string = '';
  private destroy$ = new Subject<void>();
private notesService = inject(NotesService)
  private router = inject(Router)

  goHome(): void {
  this.notesService.setActiveTagFilter(null);
  this.notesService.setSearchTerm('');
  this.notesService.setShowArchived(false);
  this.router.navigate(['notes']);
}

  ngOnInit(): void {
    // Listen to route changes to manage active states
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        // Reset search active state when navigating to other routes
        if (!event.url.includes('search')) {
          this.isSearchActive = false;
        }
      });

    // Set initial route
    this.currentRoute = this.router.url;
  }




  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
