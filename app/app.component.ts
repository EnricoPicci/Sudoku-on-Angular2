import {Component} from 'angular2/core';

import {BoardComponent} from './board.component'

@Component({
    selector: 'app-cmp',
	providers: [],
    template: `
         <board-cmp></board-cmp>
    `,
	directives: [BoardComponent],
})
export class AppComponent {

}