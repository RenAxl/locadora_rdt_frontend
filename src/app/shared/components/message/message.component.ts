import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent {
  @Input() error: string = '';
  @Input() control: any;
  @Input() text: string = '';

  Error(): boolean {
    return this.control.hasError(this.error) && this.control.dirty;
  }
}
