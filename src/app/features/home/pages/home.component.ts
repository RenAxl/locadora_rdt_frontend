import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  games = [
    { name: 'Super Mario Galaxy', className: 'mario' },
    { name: 'Final Fantasy VII Rebirth', className: 'final-fantasy' },
    { name: 'Zelda: Ocarina of Time', className: 'zelda' },
    { name: 'Metal Gear Solid', className: 'metal-gear' },
    { name: 'Resident Evil 4 Remake', className: 'resident-evil' },
  ];
}
