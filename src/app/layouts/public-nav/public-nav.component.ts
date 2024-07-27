import { Component, Renderer2, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConstantsService } from '../../services/constants.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './public-nav.component.html',
  styleUrl: './public-nav.component.css'
})
export class PublicNavComponent {
  isBgWhite = false;
  isShadow = false;
  isTopPositionZero = true;
  brand = this.constants.companyName;
  constructor(private renderer: Renderer2, private el: ElementRef, private constants: ConstantsService) {}
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) : void {
    const scrollTop = window.scrollY;
    const windowWidth = window.innerWidth;
    if (windowWidth < 992) {
      if(scrollTop > 45){
        this.isBgWhite = true;
        this.isShadow = true;
      }else{
        this.isBgWhite = false;
        this.isShadow = false;
      }
    }else{
      if(scrollTop > 45){
        this.isBgWhite = true;
        this.isShadow = true;
        this.isTopPositionZero = false;
      }else{
        this.isBgWhite = false;
        this.isShadow = false;
        this.isTopPositionZero = true;
      }
    }
  }

}
