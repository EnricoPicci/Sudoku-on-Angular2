import {provide}    from 'angular2/core';
import {enableProdMode} from 'angular2/core';

import {bootstrap}    from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http';
// Add all operators to Observable -- from https://angular.io/docs/ts/latest/guide/server-communication.html
import 'rxjs/Rx';

import {AppComponent} from './app.component';
import {Environment} from '../environmentSettings/environment.service';
import {MessageRepositoryService} from './messageRepository.service';
import {MessageRepositoryRestService} from '../externalServicesRest/messageRepositoryRest.service'

bootstrap(AppComponent, [Environment, HTTP_PROVIDERS, 
                            provide(MessageRepositoryService, {useClass: MessageRepositoryRestService})])