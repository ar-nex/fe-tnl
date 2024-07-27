import { CanActivateFn, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { SessionStorageService } from './services/session-storage.service';
import { ConstantsService } from './services/constants.service';
import { Router } from '@angular/router';


export const authGuard: CanActivateFn = (route, state): UrlTree | boolean => {
  const sessionStorageService = inject(SessionStorageService);
  const constants = inject(ConstantsService);
  const router = inject(Router);

  if(sessionStorageService.get(constants.SS_TOKEN_KEY) === null){
    return router.parseUrl('/');
  }else{
    return true;
  }
};
