import {Angular2Adapter} from '../ngNext/angular2Adapter.js';

export function bootstrap (component, config = {}) {
    var adapter = new Angular2Adapter(config);
    adapter.bootstrapComponent(component);
};
