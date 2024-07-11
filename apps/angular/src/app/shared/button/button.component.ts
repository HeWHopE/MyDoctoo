import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

enum ButtonTypes {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class AppButtonComponent {
  @Input() type: ButtonTypes = ButtonTypes.PRIMARY;
  @Input() disabled: boolean = false;
  @Output() buttonClicked = new EventEmitter<Event>();

  ButtonTypes = ButtonTypes;

  handleClick(event: Event) {
    this.buttonClicked.emit(event);
  }
}
