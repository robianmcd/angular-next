import MyChildService from './myChildService';

class MyService {
    constructor(childService: MyChildService) {
        this.childService = childService;
    }

    getStr() {
        return this.childService.getChildStr();
    }
}

export default MyService;