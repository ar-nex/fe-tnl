import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from '../services/session-storage.service';
import { ConstantsService } from '../services/constants.service';
import { HttpService } from '../services/http.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { catchError } from 'rxjs';
import { NgxChartsModule, BarVerticalComponent } from '@swimlane/ngx-charts';
import { ClientCountDto } from '../dto/dashboard/ClientCount';
import { DashLayoutComponent } from '../dash-layout/dash-layout.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [DashLayoutComponent,
    NgxChartsModule,
    NgxSkeletonLoaderModule]
})
export class DashboardComponent implements OnInit {
  multiLinkingData!: any[];
  multiActiveDate!: any[]; // Define your chart data here
  clientsCountdtos: ClientCountDto[] = []
  colorScheme: any = {
    domain: ['#449e02', '#ff5733']
  };
  initialDataReceived = false;
  constructor(private sessionStorage: SessionStorageService,
    private httpService: HttpService,
    private toastr: ToastrService,
    private constants: ConstantsService) { }

  ngOnInit() {
    // this.toastr.success('Hello world!', 'Toastr fun!');
    this.getClientStatusCount();
  }


  getClientStatusCount() {
    this.httpService.get("dashboard")
      .pipe(
        catchError(error => {
          console.log(error);
          this.initialDataReceived = true;
          throw error;
        })
      )
      .subscribe(
        (res: any) => {
          this.clientsCountdtos = res;
          this.multiLinkingData = [
            {
              name: this.clientsCountdtos[1].title,
              series: [
                { name: 'Linked', value: this.clientsCountdtos[1].panAadhaarLinkedClients },
                { name: 'Not Linked', value: this.clientsCountdtos[1].noOfClients - this.clientsCountdtos[1].panAadhaarLinkedClients },
              ]
            },
            {
              name: this.clientsCountdtos[2].title,
              series: [
                { name: 'Linked', value: this.clientsCountdtos[2].panAadhaarLinkedClients },
                { name: 'Not Linked', value: this.clientsCountdtos[2].noOfClients - this.clientsCountdtos[2].panAadhaarLinkedClients },
              ]
            },
            {
              name: this.clientsCountdtos[3].title,
              series: [
                { name: 'Linked', value: this.clientsCountdtos[3].panAadhaarLinkedClients },
                { name: 'Not Linked', value: this.clientsCountdtos[3].noOfClients - this.clientsCountdtos[3].panAadhaarLinkedClients },
              ]
            }
          ];

          this.multiActiveDate = [
            {
              name: this.clientsCountdtos[1].title,
              series: [
                { name: 'Active', value: this.clientsCountdtos[1].activeClients },
                { name: 'Inactive', value: this.clientsCountdtos[1].noOfClients - this.clientsCountdtos[1].activeClients },
              ]
            },
            {
              name: this.clientsCountdtos[2].title,
              series: [
                { name: 'Active', value: this.clientsCountdtos[2].activeClients },
                { name: 'Inactive', value: this.clientsCountdtos[2].noOfClients - this.clientsCountdtos[2].activeClients },
              ]
            },
            {
              name: this.clientsCountdtos[3].title,
              series: [
                { name: 'Active', value: this.clientsCountdtos[3].activeClients },
                { name: 'Inactive', value: this.clientsCountdtos[3].noOfClients - this.clientsCountdtos[3].activeClients },
              ]
            }
          ];
          this.initialDataReceived = true;
        }
      )
      .add(
        () => {
          this.initialDataReceived = true;
        }
      )
  }

}
