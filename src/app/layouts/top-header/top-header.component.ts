import { Component, Input, OnInit } from '@angular/core';
import { BodyClassToggleService } from '../../services/body-class-toggle.service';
import { ConstantsService } from '../../services/constants.service';
import { SessionStorageService } from '../../services/session-storage.service';

@Component({
  selector: 'app-top-header',
  standalone: true,
  imports: [],
  templateUrl: './top-header.component.html',
  styleUrl: './top-header.component.css'
})
export class TopHeaderComponent implements OnInit {
  brand = this.constants.companyName;
  userName = "";
  constructor(
    private bodyClassToggleService: BodyClassToggleService,
    private constants: ConstantsService,
    private sessionStorage: SessionStorageService
  ) { }

  ngOnInit() {
    this.initUserName();
  }


  toggleClass(): void {
    this.bodyClassToggleService.toggleBodyClass('toggle-sidebar');
  }
  initUserName() {
    let uname = this.sessionStorage.get(this.constants.SS_USER_NAME);
    this.userName = uname != null ? uname : "";
  }
}
