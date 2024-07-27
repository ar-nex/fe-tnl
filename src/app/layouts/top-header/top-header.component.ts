import { Component, Input } from '@angular/core';
import { BodyClassToggleService } from '../../services/body-class-toggle.service';
import { ConstantsService } from '../../services/constants.service';

@Component({
  selector: 'app-top-header',
  standalone: true,
  imports: [],
  templateUrl: './top-header.component.html',
  styleUrl: './top-header.component.css'
})
export class TopHeaderComponent {
  brand = this.constants.companyName;
  @Input() userName = "";
  constructor(
    private bodyClassToggleService: BodyClassToggleService,
    private constants: ConstantsService
  ) {}
  toggleClass(): void {
    this.bodyClassToggleService.toggleBodyClass('toggle-sidebar');
  }
}
