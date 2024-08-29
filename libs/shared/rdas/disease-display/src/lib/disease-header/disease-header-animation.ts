import {
  trigger,
  state,
  style,
  transition,
  animate,
  group,
} from '@angular/animations';

/**
 * animation object than animates the header menu changing background color and pharos logo
 */
export const shrinkOnScroll = [
  trigger('shrinkOnScroll', [
    state(
      'in',
      style({
        height: '22vh',
      }),
    ),
    state(
      'out',
      style({
        height: '8vh',
      }),
    ),
    transition('in => out', [group([animate('200ms ease-out')])]),
    transition('out => in', [group([animate('200ms ease-in')])]),
  ]),
];
