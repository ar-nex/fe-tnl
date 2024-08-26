import { Component, OnInit } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { DashLayoutComponent } from '../../dash-layout/dash-layout.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FullNameService } from '../../services/full-name.service';
import { ClientBase, clientDetailedWrite, GstDtoRead, ItDtoRead, ItGstDtoRead } from '../../dto/client/ClientListDto';
import { HttpService } from '../../services/http.service';
import { catchError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DetailModalComponent } from '../detail-modal/detail-modal.component';
import { ExcelService } from '../../services/excel.service';
import { EditModalComponent } from "../edit-modal/edit-modal.component";

@Component({
  selector: 'app-list-client',
  standalone: true,
  imports: [AgGridModule, DashLayoutComponent, RouterLink, DetailModalComponent, EditModalComponent],
  templateUrl: './list-client.component.html',
  styleUrl: './list-client.component.css'
})
export class ListClientComponent implements OnInit {
  clientType!: string
  gstClients: GstDtoRead[] = [];
  itClients: ItDtoRead[] = [];
  itGstClients: ItGstDtoRead[] = [];
  allClients: ClientBase[] = [];
  gettingData = false;
  gridOptions!: GridOptions;
  clientIdForModal! : number;
  clientIdForEdit! : number
  private gridApi: any;

  constructor(private activatedRoute: ActivatedRoute,
    private httpService: HttpService,
    private toster: ToastrService,
    private excelService: ExcelService,
    private fullNameService: FullNameService) { }

  ngOnInit(): void {
    this.getList();
  }
  getList(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const qstring = params['type'];
      this.clientType = qstring;
      let endpoint = '';

      switch (this.clientType) {
        case 'gst':
          endpoint = 'clients/gst';
          break;
        case 'it':
          endpoint = 'clients/it';
          break;
        case 'gst-it':
          endpoint = 'clients/gst-it';
          break;
        case 'all':
          endpoint = 'clients/all';
          break;
        default:
          return;
      }

      this.gettingData = true;
      this.httpService.get(endpoint)
        .pipe(
          catchError(error => {
            this.toster.error("Sorry! Failed to get data");
            this.gettingData = false;
            throw error;
          })
        )
        .subscribe(
          (res: any) => {
            if (this.clientType === 'gst') {
              this.gstClients = res;
              this.itClients = [];
              this.itGstClients = [];
              this.allClients = [];
            } else if (this.clientType === 'it') {
              this.itClients = res;
              this.gstClients = [];
              this.itGstClients = [];
              this.allClients = [];
            } else if (this.clientType === 'gst-it') {
              this.itGstClients = res;
              this.itClients = [];
              this.gstClients = [];
              this.allClients = [];
            } else if (this.clientType == 'all') {
              this.allClients = res;
              this.gstClients = [];
              this.itClients = [];
              this.itGstClients = [];
            }
            this.gettingData = false;
          }
        )
        .add(() => { this.gettingData = false; });
    });
  }

  colomnDefsIT: ColDef[] = [
    {
      valueGetter: params => params.node ? params.node.rowIndex! + 1 : 0,
      headerName: 'Sl No.', sortable: false, filter: false, width: 60, pinned: 'left'
    },
    {
      valueGetter: params => this.fullName(params.data.fname, params.data.mname, params.data.lname),
      headerName: 'Name', sortable: true, filter: true, pinned: 'left'
    },
    { field: 'father', headerName: 'Father', sortable: false, filter: true },
    { field: 'fileNoIt', headerName: 'File No.', sortable: true, filter: true },
    { field: 'mob1', headerName: 'Mobile', sortable: false, filter: true },
    { field: 'email', headerName: 'Email', sortable: false, filter: true },
    { field: 'password', headerName: 'Email Password', sortable: false, filter: true },
    {
      field: 'email',
      headerName: 'Mail Link',
      width: 100,
      cellRenderer: (params: { value: any; }) => {
        const email = params.value;
        const mailLink = this.getEmailVendor(email);
        return `<a href="${mailLink}" target="_blank">Go</a>`;
      }
    },
    { field: 'pan', headerName: 'PAN', sortable: false, filter: true },
    { field: 'passwordIt', headerName: 'IT password', sortable: false, filter: true },
    {
      field: 'id',
      headerName: 'Details',
      width: 100,
      cellRenderer: (params: { value: any; }) => {
        const button = document.createElement('button');
        button.textContent = 'Details';
        button.className = 'btn btn-sm btn-primary';
        button.dataset['bsToggle'] = 'modal';
        button.dataset['bsTarget'] = '#exampleModal';
        button.addEventListener('click', () => {
          this.openModal(params.value);
        });
        return button;
      }
    },
    {
      field: 'id',
      headerName: 'Edit',
      width: 100,
      cellRenderer: (params: { value: any; }) => {
        const button = document.createElement('button');
        button.textContent = 'Edit';
        button.className = 'btn btn-sm btn-warning';
        button.dataset['bsToggle'] = 'modal';
        button.dataset['bsTarget'] = '#editModal';
        button.addEventListener('click', () => {
          this.openEditModal(params.value);
        });
        return button;
      }
    },
    {
      field: 'isActive',
      headerName: 'Active',
      sortable: true,
      filter: true,
      width: 100,
      valueFormatter: params => params.value ? 'Active' : 'Deactivated'
    },
  ]


  colomnDefsGST: ColDef[] = [
    {
      valueGetter: params => params.node ? params.node.rowIndex! + 1 : 0,
      headerName: 'Sl No.', sortable: false, filter: false, width: 60, pinned: 'left'
    },
    {
      valueGetter: params => this.fullName(params.data.fname, params.data.mname, params.data.lname),
      headerName: 'Name', sortable: true, filter: true, pinned: 'left'
    },
    { field: 'father', headerName: 'Father', sortable: false, filter: true },
    { field: 'gstFileNo', headerName: 'File No.', sortable: true, filter: true },
    { field: 'mob1', headerName: 'Mobile', sortable: false, filter: true },
    { field: 'email', headerName: 'Email', sortable: false, filter: true },
    { field: 'password', headerName: 'Email Password', sortable: false, filter: true },
    {
      field: 'email',
      headerName: 'Mail Link',
      width: 100,
      cellRenderer: (params: { value: any; }) => {
        const email = params.value;
        const mailLink = this.getEmailVendor(email);
        return `<a href="${mailLink}" target="_blank">Go</a>`;
      }
    },
    { field: 'gstUserName', headerName: 'GST Username', sortable: false, filter: true },
    { field: 'gstPassword', headerName: 'GST password', sortable: false, filter: true },
    { field: 'gstNumber', headerName: 'GST No.', sortable: false, filter: true },
    {
      field: 'id',
      headerName: 'Details',
      width: 100,
      cellRenderer: (params: { value: any; }) => {
        const button = document.createElement('button');
        button.textContent = 'Details';
        button.className = 'btn btn-sm btn-primary';
        button.dataset['bsToggle'] = 'modal';
        button.dataset['bsTarget'] = '#exampleModal';
        button.addEventListener('click', () => {
          this.openModal(params.value);
        });
        return button;
      }
    },
    {
      field: 'id',
      headerName: 'Edit',
      width: 100,
      cellRenderer: (params: { value: any; }) => {
        const button = document.createElement('button');
        button.textContent = 'Edit';
        button.className = 'btn btn-sm btn-warning';
        button.dataset['bsToggle'] = 'modal';
        button.dataset['bsTarget'] = '#editModal';
        button.addEventListener('click', () => {
          this.openEditModal(params.value);
        });
        return button;
      }
    },
    {
      field: 'isActive',
      headerName: 'Active',
      sortable: true,
      filter: true,
      width: 100,
      valueFormatter: params => params.value ? 'Active' : 'Deactivated'
    },
  ]

  colomnDefsITGST: ColDef[] = [
    {
      valueGetter: params => params.node ? params.node.rowIndex! + 1 : 0,
      headerName: 'Sl No.', sortable: false, filter: false, width: 60, pinned: 'left'
    },
    {
      valueGetter: params => this.fullName(params.data.fname, params.data.mname, params.data.lname),
      headerName: 'Name', sortable: true, filter: true, pinned: 'left'
    },
    { field: 'father', headerName: 'Father', sortable: false, filter: true },
    { field: 'fileNoIt', headerName: 'IT File No.', sortable: true, filter: true },
    { field: 'mob1', headerName: 'Mobile', sortable: false, filter: true },
    { field: 'email', headerName: 'Email', sortable: false, filter: true },
    { field: 'password', headerName: 'Email Password', sortable: false, filter: true },
    {
      field: 'email',
      headerName: 'Mail Link',
      width: 100,
      cellRenderer: (params: { value: any; }) => {
        const email = params.value;
        const mailLink = this.getEmailVendor(email);
        return `<a href="${mailLink}" target="_blank">Go</a>`;
      }
    },
    { field: 'gstUserName', headerName: 'GST Username', sortable: false, filter: true },
    { field: 'gstPassword', headerName: 'GST password', sortable: false, filter: true },
    { field: 'gstNumber', headerName: 'GST No.', sortable: false, filter: true },
    { field: 'gstFileNo', headerName: 'GST File No.', sortable: true, filter: true },
    { field: 'pan', headerName: 'PAN', sortable: false, filter: true },
    { field: 'passwordIt', headerName: 'IT password', sortable: false, filter: true },
    {
      field: 'id',
      headerName: 'Details',
      width: 100,
      cellRenderer: (params: { value: any; }) => {
        const button = document.createElement('button');
        button.textContent = 'Details';
        button.className = 'btn btn-sm btn-primary';
        button.dataset['bsToggle'] = 'modal';
        button.dataset['bsTarget'] = '#exampleModal';
        button.addEventListener('click', () => {
          this.openModal(params.value);
        });
        return button;
      }
    },
    {
      field: 'id',
      headerName: 'Edit',
      width: 100,
      cellRenderer: (params: { value: any; }) => {
        const button = document.createElement('button');
        button.textContent = 'Edit';
        button.className = 'btn btn-sm btn-warning';
        button.dataset['bsToggle'] = 'modal';
        button.dataset['bsTarget'] = '#editModal';
        button.addEventListener('click', () => {
          this.openEditModal(params.value);
        });
        return button;
      }
    },
    {
      field: 'isActive',
      headerName: 'Active',
      sortable: true,
      filter: true,
      width: 100,
      valueFormatter: params => params.value ? 'Active' : 'Deactivated'
    },
  ]

  colomnDefsALL: ColDef[] = [
    {
      valueGetter: params => params.node ? params.node.rowIndex! + 1 : 0,
      headerName: 'Sl No.', sortable: false, filter: false, width: 60, pinned: 'left'
    },
    {
      valueGetter: params => this.fullName(params.data.fname, params.data.mname, params.data.lname),
      headerName: 'Name', sortable: true, filter: true, pinned: 'left'
    },
    {
      field: 'clType',
      headerName: 'Type',
      sortable: false,
      filter: true,
      width: 100,
      valueFormatter: params => {
        switch (params.value) {
          case 0:
            return 'GST';
          case 1:
            return 'IT';
          case 2:
            return 'GST-IT';
          default:
            return '';
        }
      }
    },
    { field: 'father', headerName: 'Father', sortable: false, filter: true },
    { field: 'mob1', headerName: 'Mobile', sortable: false, filter: true },
    { field: 'email', headerName: 'Email', sortable: false, filter: true },
    { field: 'password', headerName: 'Email Password', sortable: false, filter: true },
    {
      field: 'email',
      headerName: 'Mail Link',
      width: 100,
      cellRenderer: (params: { value: any; }) => {
        const email = params.value;
        const mailLink = this.getEmailVendor(email);
        return `<a href="${mailLink}" target="_blank">Go</a>`;
      }
    },
    { field: 'pan', headerName: 'PAN', sortable: false, filter: true },
    { field: 'aadhaar', headerName: 'Aadhaar', sortable: false, filter: true },
    {
      field: 'id',
      headerName: 'Details',
      width: 100,
      cellRenderer: (params: { value: any; }) => {
        const button = document.createElement('button');
        button.textContent = 'Details';
        button.className = 'btn btn-sm btn-primary';
        button.dataset['bsToggle'] = 'modal';
        button.dataset['bsTarget'] = '#exampleModal';
        button.addEventListener('click', () => {
          this.openModal(params.value);
        });
        return button;
      }
    },
    {
      field: 'id',
      headerName: 'Edit',
      width: 100,
      cellRenderer: (params: { value: any; }) => {
        const button = document.createElement('button');
        button.textContent = 'Edit';
        button.className = 'btn btn-sm btn-warning';
        button.dataset['bsToggle'] = 'modal';
        button.dataset['bsTarget'] = '#editModal';
        button.addEventListener('click', () => {
          this.openEditModal(params.value);
        });
        return button;
      }
    },
    {
      field: 'isActive',
      headerName: 'Active',
      sortable: true,
      filter: true,
      width: 100,
      editable: true,
      valueFormatter: params => params.value ? 'Active' : 'Deactivated'
    },
  ]

  fullName(fname: string, mname: string | null, lname: string | null): string {
    return this.fullNameService.getFullName(fname, mname, lname);
  }

  openModal(id: number) {
    // Open the modal with the client details
    console.log(id);
    this.clientIdForModal = id;
  }

  openEditModal(id: number) {
    // Open the modal with the client details
    console.log(id);
    this.clientIdForEdit = id;
  }

  async onCellClicked(event: any) {
    const rowIndex = event.node.rowIndex;
    const colField = event.colDef.field;
    const cellValue = event.value; // Directly get the cell value from the event

    const skipColsHeadings = ['Details', 'Edit'];

  //  console.log(`Row Index: ${rowIndex}, Column Field: ${colField}, Cell Value: ${cellValue}`);
    let colHeading = event.column.getColDef().headerName;

    if (!skipColsHeadings.includes(colHeading)) {
      try {
        await navigator.clipboard.writeText(cellValue);
        console.log('Cell value copied to clipboard');
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  //  console.log(`Column Heading is : ${colHeading}`);
  }

  onCellValueChanged(event: any) {
    const updatedData = {
      id: event.data.id,
      active: event.newValue
    };
    console.log(updatedData);
  }

  getEmailVendor(email: string):string{
    if (!email) {
      return ''; // or some default value
    }
    const mailMap = new Map();
    mailMap.set("@gmail", "https://mail.google.com");
    mailMap.set("@yahoo", "https://login.yahoo.com");
    mailMap.set("@hotmail", "https://login.microsoftonline.com/");
    mailMap.set("@outlook", "https://login.microsoftonline.com/");
    mailMap.set("@live", "https://login.microsoftonline.com/");
    mailMap.set("@rediffmail", "https://mail.rediff.com");
    mailMap.set("@mail", "https://www.mail.com");
    let external_site = "";
    for (let [key, value] of mailMap) {
        if (email.indexOf(key) > -1) {
            external_site = value;
        }
    }
    return external_site;
  }

  onGridReady(params:any) {
    this.gridApi = params.api;
  }

  exportToCsv() {
    const params = {
      skipHeader: false,
      skipFooter: true,
      skipGroups: true,
      fileName: this.clientType + "_" + "export.csv",
    };
    this.gridApi.exportDataAsCsv(params);
  }

  exportToExcel(): void {
    this.excelService.exportAsExcelFile(this.itClients, 'sample');
  }

  onUpdatedDto(dto: clientDetailedWrite) {
    console.log('Received updated DTO:', dto);
    
    if(this.clientType === 'gst'){
      const dtoIndex = this.gstClients.findIndex(itm => itm.id == this.clientIdForEdit)
      if(dtoIndex !== -1){
        const prevDto = this.gstClients[dtoIndex];
        if(prevDto.clType == dto.clType){
          this.gstClients[dtoIndex] = { ...this.gstClients[dtoIndex], ...dto };
        }else{
          this.gstClients = this.gstClients.splice(dtoIndex, 1);
        }
        this.itClients = [...this.itClients];
      }

    }else if(this.clientType === 'it'){
      const dtoIndex = this.itClients.findIndex(itm => itm.id == this.clientIdForEdit)
      if(dtoIndex !== -1){
        const prevDto = this.itClients[dtoIndex];
        if(prevDto.clType == dto.clType){
          this.itClients[dtoIndex] = { ...this.itClients[dtoIndex], ...dto };
        }else{
          this.itClients = this.itClients.splice(dtoIndex, 1);
        }
        this.itClients = [...this.itClients];
      }
    }else if (this.clientType === 'gst-it'){
      const dtoIndex = this.itGstClients.findIndex(itm => itm.id == this.clientIdForEdit)
        if (dtoIndex !== -1) {
          this.itGstClients[dtoIndex] = { ...this.itGstClients[dtoIndex], ...dto };
        }
        this.itGstClients = [...this.itGstClients];

    }else if (this.clientType == 'all') {
      const dtoIndex = this.allClients.findIndex(itm => itm.id == this.clientIdForEdit)
        if (dtoIndex !== -1) {
          this.allClients[dtoIndex] = { ...this.allClients[dtoIndex], ...dto };
        }
        this.allClients = [...this.allClients];
    }
  }

}
