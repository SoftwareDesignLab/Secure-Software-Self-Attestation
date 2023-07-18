import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AssessmentPlan } from '../models/assessmentPlan';

@Injectable({
  providedIn: 'root'
})
export class AssessmentPlanService {
  private assessmentPlan = new BehaviorSubject<AssessmentPlan>(new AssessmentPlan());
  currentData = this.assessmentPlan.asObservable();
  
  constructor() {
  // the current time's isoformat
    
  }
}
    