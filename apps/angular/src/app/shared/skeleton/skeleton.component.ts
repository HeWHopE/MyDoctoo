import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [MatCardModule, NgClass],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
})
export class SkeletonComponent {
  @Input() type: 'text' | 'image' = 'text';
  @Input() size?: 'small' | 'medium' | 'large' = 'small';
}
