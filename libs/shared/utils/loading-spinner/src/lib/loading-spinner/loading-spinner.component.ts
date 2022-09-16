import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: 'ncats-frontend-library-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
  @Input() isLoading = true;
  @Input() position: 'left' | 'right' | 'center' = 'center';
  @Input() size: 'small' | 'medium' | 'large' = 'large';
  sizes = {
    large: 100,
    medium: 50,
    small: 25,
  };

  positions = {
    left: 'spinner-left',
    right: 'spinner-right',
    center: '',
  };
}
