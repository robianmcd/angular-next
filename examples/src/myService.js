import MyChildService from './myChildService';

export default class MyService {
    constructor(childService: MyChildService) {
        this.childService = childService;
    }

    getStr() {
        return this.childService.getChildStr();
    }
}