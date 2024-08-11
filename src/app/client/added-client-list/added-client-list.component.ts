import { Component, Input } from '@angular/core';
import { clientDto } from '../../dto/client/ClientDTO';
import { FullNameService } from '../../services/full-name.service';

@Component({
  selector: 'app-added-client-list',
  standalone: true,
  imports: [],
  templateUrl: './added-client-list.component.html',
  styleUrl: './added-client-list.component.css'
})
export class AddedClientListComponent {
  @Input() dataSource : clientDto[] = [];
  /**
   *
   */
  constructor(private fullNameService: FullNameService) {  }

  getFullName(dto: clientDto):string{
    return this.fullNameService.getFullName(dto.fname, dto.mname, dto.lname);
  }
  getClientType(dto: clientDto):string{
    let cltype = "";
    if(dto.clType == 0) {
      cltype = "GST";
    }else if(dto.clType == 1){
      cltype = "IT";
    }else if(dto.clType == 2){
      cltype = "GST &amp IT";
    }
    return cltype;
  }
}
