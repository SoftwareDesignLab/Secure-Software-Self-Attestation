import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttestationComponent } from './attestation/attestation.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { AttestationPageComponent } from './attestation-page/attestation-page.component';

const routes: Routes = [
  {path: 'contact-info', component: ContactInfoComponent},
  {path: 'attestation-form', component: AttestationPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
