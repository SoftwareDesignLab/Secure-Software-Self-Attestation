import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChecklistItemComponent } from './control/control.component';
import { RollableComponent } from './rollable/rollable.component';
import { CatalogProcessingComponent } from './catalog-processing/catalog-processing.component';
import { GroupComponent } from './group/group.component';
import { CatalogInfoComponent } from './catalog-info/catalog-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { AttestationComponent } from './attestation/attestation.component';
import { FormsModule} from '@angular/forms'
import {MatGridListModule} from '@angular/material/grid-list';


@NgModule({
  declarations: [
    AppComponent,
    ChecklistItemComponent,
    RollableComponent,
    CatalogProcessingComponent,
    GroupComponent,
    CatalogInfoComponent,
    AttestationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
    MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
