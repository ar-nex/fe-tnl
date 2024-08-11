import { Component } from '@angular/core';
import { PageFooterComponent } from '../layouts/page-footer/page-footer.component';
import { LeftAsideComponent } from '../layouts/left-aside/left-aside.component';
import { TopHeaderComponent } from '../layouts/top-header/top-header.component';

@Component({
  selector: 'app-dash-layout',
  standalone: true,
  imports: [TopHeaderComponent,
    LeftAsideComponent,
    PageFooterComponent,],
  templateUrl: './dash-layout.component.html',
  styleUrl: './dash-layout.component.css'
})
export class DashLayoutComponent {

}
