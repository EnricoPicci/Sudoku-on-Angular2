import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

import {Environment} from '../environmentSettings/environment.service';
import {MessageRepositoryService} from '../app/messageRepository.service';

@Injectable()
export class MessageRepositoryRestService extends MessageRepositoryService {
    constructor(private _http: Http, private _environment: Environment) {
        super();
    }
    
    getNastyPlayerMessageRandom() {
        let myUrl = this._environment.baseServiceUrl + 'nastyPlayerMessageRandom';
        return this._http.get(myUrl)
            .map(res => res.json())
            .map(
                data => {
                    return data[0];
                }
            )
            .catch(this.handleError)
    };
    
    private handleError (error: Response) {
        console.error('http error');
        console.error(error);
        let errorText = error.text();
        if (error.status == 200) {
            errorText = 'The whole server is down. The connection has been refused.';
        }
        return Observable.throw(errorText || 'Server error');
    }
    
}