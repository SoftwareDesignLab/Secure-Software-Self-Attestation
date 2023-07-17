import { Injectable } from '@angular/core';
import { uuid } from 'uuidv4';
import { BehaviorSubject } from 'rxjs';

class AssessmentPlan {
  private assessment_plan = {
    "uuid": uuid(),
    "metadata": {
      "title": "Assessment Plan",
      "last-modified": new Date().toISOString(),
      "version": "1.0.0",
      "oscal-version": "1.0.4",
      "published": new Date().toISOString(),
      "parties": [
        {
          "uuid": "",
          "type": "organization",
          "name": "<company name>",
          "addresses": [
            {
              "addr-lines": [
                  ""
              ],
              "city": "",
              "state": "",
              "postal-code": "",
              "country": ""
            }
          ],
          "props": [
            {
              "name": "website",
              "value": "<website>",
              "class": "Producer Info"
            }
          ],
          "remarks": "Software Producer Information"
        },
        {
          "uuid": "",
          "type": "",
          "name": "",
          "email-addresses": [""],
          "telephone-numbers": [""],
          "addresses": [
            {
              "addr-lines": [
                  ""
              ],
              "city": "",
              "state": "",
              "postal-code": "",
              "country": ""
            }
          ],
          "props": [
            {
              "name": "title",
              "value": "<title>",
              "class": "Contact Info"
            }
          ],
          "remarks": "Primary Contact"
        }
      ]
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class SaveAttestationService {
  private assessmentPlan = new BehaviorSubject<AssessmentPlan>(new AssessmentPlan());
  currentData = this.assessmentPlan.asObservable();
  
  constructor() {
  // the current time's isoformat
    
  }
}
    