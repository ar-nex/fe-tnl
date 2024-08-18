import { Component, Input, OnChanges } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { catchError } from 'rxjs';
import { clientDetailRead } from '../../dto/client/ClientListDto';
import { FullNameService } from '../../services/full-name.service';
import { DatePipe } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-detail-modal',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './detail-modal.component.html',
  styleUrl: './detail-modal.component.css'
})
export class DetailModalComponent implements OnChanges {
  @Input() clientId!: number
  dto!: clientDetailRead
  datePipe: DatePipe;
  /**
   *
   */
  constructor(private httpService: HttpService,
    private fullName: FullNameService) {
    this.datePipe = new DatePipe('en-US')
  }
  ngOnChanges(): void {
    this.getClientDetails();
  }

  getClientDetails(): void {
    if (this.clientId > 0) {
      this.httpService.get(`clients/${this.clientId}`)
        .pipe(
          catchError(error => {
            console.log(error);
            throw error;
          })
        )
        .subscribe((res: any) => {
          this.dto = res;
          console.log(this.dto);
        })
        .add()
    }

  }

  async copyContent(itm: string) {
    try {
      switch (itm) {
        case 'email':
          await navigator.clipboard.writeText(this.dto.email);
          break;
        case 'password':
          await navigator.clipboard.writeText(this.dto.password);
          break;
        case 'pan':
          await navigator.clipboard.writeText(this.dto.pan);
          break;
        case 'it-password':
          await navigator.clipboard.writeText(this.dto.passwordIt);
          break;
        case 'gst-username':
          await navigator.clipboard.writeText(this.dto.gstUserName);
          break;
        case 'gst-password':
          await navigator.clipboard.writeText(this.dto.gstPassword);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }

  getFullName(dto: clientDetailRead): string {
    return this.fullName.getFullName(dto.fname, dto.mname, dto.lname);
  }
  exportModalToPdf() {
    const pdf = new jsPDF();
    const dto = this.dto;

    // Add header
    pdf.setFontSize(18);
    pdf.text('Client Details', 15, 15);

    // Add table
    pdf.setFontSize(12);
    let tableData = [
      ['Name', this.getFullName(dto)],
      ['Father Name', dto.father],
      ['Profession', dto.business],
      ['DoB', this.datePipe.transform(dto.dob, 'dd-MM-YYYY')],
      ['Gender', dto.gender],
      ['Mobile', dto.mob1],
      ['Email', dto.email],
      ['Email Password', dto.password],
      ['PAN', dto.pan],
      ['Aadhaar', dto.aadhaar],
      
    ];
    if(dto.clType == 0 || dto.clType == 2){
      tableData.push(['GST', '']);
      tableData.push(['GST No.', dto.gstNumber]);
      tableData.push(['Registratio Date', this.datePipe.transform(dto.gstRegisDate, 'dd-MM-YYYY')]);
      tableData.push(['User Name', dto.gstUserName]);
      tableData.push(['GST Password', dto.gstPassword]);
      tableData.push(['GST Type', dto.gstType]);
      tableData.push(['GST Auditable', dto.gstAuditNoAudit]);
      tableData.push(['GST File No.', dto.gstFileNo]);
    }
    if(dto.clType == 1 || dto.clType == 2){
      tableData.push(['IT', '']);
      tableData.push(['IT Password', dto.passwordIt]);
      tableData.push(['IT Auditable', dto.auditNoAuditIT]);
      tableData.push(['IT File No.', dto.fileNoIt]);
    }
    const addr = [
      ['Address', ''],
      ['Address Line 1', dto.addr1],
      ['Address Line 2', dto.addr2],
      ['Post Office', dto.po],
      ['PIN', dto.pin],
      ['PS', dto.ps],
      ['District', dto.dist+', '+dto.state]
    ]
    tableData = [...tableData, ...addr];
    autoTable(pdf, {
      head: [['Property', 'Value']],
      body: tableData,
      theme: 'grid',
      startY: 25,
      didParseCell: function (data) {
        if (data.cell.raw === 'Address' || data.cell.raw === 'GST' || data.cell.raw === 'IT') {
          data.cell.colSpan = 2;
          data.cell.styles.halign = 'center';
          data.cell.styles.fillColor = [173, 216, 230];
        }
      },
    });

    // Save the PDF
    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'client_'+dto.pan+'.pdf';
    a.click();
  }


}

