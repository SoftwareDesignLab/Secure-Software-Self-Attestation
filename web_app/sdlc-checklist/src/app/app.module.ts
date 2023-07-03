import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChecklistItemComponent } from './control/control.component';
import { RollableComponent } from './rollable/rollable.component';
import { CatalogProcessingComponent } from './catalog-processing/catalog-processing.component';
import { GroupComponent } from './group/group.component';
import { CatalogInfoComponent } from './catalog-info/catalog-info.component';
import { ErrorService } from './error.service';

@NgModule({
  declarations: [
    AppComponent,
    ChecklistItemComponent,
    RollableComponent,
    CatalogProcessingComponent,
    GroupComponent,
    CatalogInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ErrorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
