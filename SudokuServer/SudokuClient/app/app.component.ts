import {Component} from 'angular2/core';

import {DoubleBoardComponent} from './doubleBoard.component'

@Component({
    selector: 'app-cmp',
	providers: [],
    template: `
         <double-board-cmp></double-board-cmp>
    `,
	directives: [DoubleBoardComponent],
})
export class AppComponent {

}