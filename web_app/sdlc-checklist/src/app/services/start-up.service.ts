import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StartUpService {

  constructor(private router: Router) {}

  initialize(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.router.navigate(['/contact-info']);
      resolve(null);
    });
  }

  
}

export function startUpFactory(StartUpService: StartUpService) {
  return () => StartUpService.initialize();
}
