import MyChildService from './myChildService';
import InjectNgOne from './injectNgOne';

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