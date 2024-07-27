import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class BodyClassToggleService {
  constructor(private sanitizer: DomSanitizer) {}

  toggleBodyClass(className: string): void {
    const body = document.body;
    if (body.classList.contains(className)) {
      body.classList.remove(className);
    } else {
      body.classList.add(className);
    }
  }
}
