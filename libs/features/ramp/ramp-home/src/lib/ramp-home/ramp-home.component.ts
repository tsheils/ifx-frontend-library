import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-ramp-home',
  standalone: true,
  imports: [CommonModule, MatButton, MatRipple, RouterLink],
  templateUrl: './ramp-home.component.html',
  styleUrl: './ramp-home.component.scss',
})
export class RampHomeComponent {}
