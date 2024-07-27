import { Component} from '@angular/core';
import { PublicNavComponent } from "../layouts/public-nav/public-nav.component";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [PublicNavComponent]
})
export class HomeComponent {
  
  
}
