import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './pages/contact.component';

@NgModule({
  declarations: [ContactComponent],
  imports: [CommonModule, ContactRoutingModule],
})
export class ContactModule {}
