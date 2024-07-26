import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NcatsHeaderComponent } from 'ncats-header';

@Component({
  standalone: true,
  imports: [RouterModule, NcatsHeaderComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'NCATSFind Resolver';
}
