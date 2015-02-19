import MyChildService from 'myChildService.js';
import {InjectNgOne} from 'angular2/angular2.js';

class MyService {
    constructor(childService: MyChildService, @InjectNgOne('$log') $log) {
        $log.info('successfully injected angular 1 service');
        this.childService = childService;
    }

    getStr() {
        return this.childService.getChildStr();
    }
}

export default MyService;