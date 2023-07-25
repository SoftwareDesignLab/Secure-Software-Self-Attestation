/**
 * Copyright 2023 Rochester Institute of Technology (RIT). Developed with
 * government support under contract 70RSAT19CB0000020 awarded by the United
 * States Department of Homeland Security.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChecklistItemComponent } from './control/control.component';
import { RollableComponent } from './rollable/rollable.component';
import { CatalogProcessingComponent } from './catalog-processing/catalog-processing.component';
import { GroupComponent } from './group/group.component';
import { CatalogInfoComponent } from './catalog-info/catalog-info.component';
import { notifyService } from './services/notify.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { AttestationComponent } from './attestation/attestation.component';
import { FormsModule } from '@angular/forms'
import { MatGridListModule } from '@angular/material/grid-list';
import { attestationComment } from './services/attestationForm';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { AttestationPageComponent } from './attestation-page/attestation-page.component';
import { ContactService } from './services/contact.service';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AttestationDataService } from './services/attestation-data.service';
import { StartUpService, startUpFactory } from './services/start-up.service';
import { AssessmentPlanService } from './services/assessment-plan.service';

@NgModule({
  declarations: [
    AppComponent,
    ChecklistItemComponent,
    RollableComponent,
    CatalogProcessingComponent,
    GroupComponent,
    CatalogInfoComponent,
    AttestationComponent,
    ContactInfoComponent,
    AttestationPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
    MatGridListModule,
    SimpleNotificationsModule.forRoot({
      position: ['bottom', 'right']
    })
  ],
  providers: [
    attestationComment,
    ContactService,
    AttestationDataService,
    notifyService,
    StartUpService,
    AssessmentPlanService,
    {
      provide: APP_INITIALIZER,
      useFactory: startUpFactory,
      deps: [StartUpService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
