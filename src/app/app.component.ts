import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router,  RouterOutlet } from '@angular/router';
import { BottomNavigationComponent } from './components/bottom-navigation/bottom-navigation.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BottomNavigationComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
showFab: boolean = true;

private router = inject(Router)
private route = inject(ActivatedRoute)

constructor() {
 this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(() => {
        let route = this.route
        while (route.firstChild) {
          route = route.firstChild;
        }
        
        route.data.subscribe((data: { [x: string]: boolean; }) => {
          this.showFab = data['showFab'] !== false;
        });
      });
}

 onCreateNote(): void {
    this.router.navigate(['create']);
  }


shouldHideFab(): boolean {
  return !this.showFab;
}
}
