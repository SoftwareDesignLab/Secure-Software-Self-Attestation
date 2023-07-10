import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChecklistItemComponent } from './control/control.component';
import { RollableComponent } from './rollable/rollable.component';
import { CatalogProcessingComponent } from './catalog-processing/catalog-processing.component';
import { GroupComponent } from './group/group.component';
import { CatalogInfoComponent } from './catalog-info/catalog-info.component';
import { notifyService } from './notify.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { AttestationComponent } from './attestation/attestation.component';
import { FormsModule } from '@angular/forms'
import { MatGridListModule } from '@angular/material/grid-list';
import { attestationComment } from './attestationForm';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { AttestationPageComponent } from './attestation-page/attestation-page.component';
import { ContactService } from './contact.service';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AttestationDataService } from './attestation-data.service';


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
    notifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
