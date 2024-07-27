import { Component, OnInit } from '@angular/core';
import { TopHeaderComponent } from "../layouts/top-header/top-header.component";
import { LeftAsideComponent } from "../layouts/left-aside/left-aside.component";
import { PageFooterComponent } from "../layouts/page-footer/page-footer.component";
import { SessionStorageService } from '../services/session-storage.service';
import { ConstantsService } from '../services/constants.service';
import { HttpService } from '../services/http.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    imports: [TopHeaderComponent, LeftAsideComponent, PageFooterComponent]
})
export class DashboardComponent implements OnInit {
    username: string = "";

    constructor(private sessionStorage: SessionStorageService, 
        private httpService : HttpService,
        private constants: ConstantsService) { }

    ngOnInit() {
        this.initUserName();
    }

    initUserName(){
        let uname = this.sessionStorage.get(this.constants.SS_USER_NAME);
        this.username =  uname != null ? uname : "";
    }

    getClientStatusCount(){
        this.httpService.get("dashboard")
            .pipe()
            .subscribe()
            .add()
    }

}
