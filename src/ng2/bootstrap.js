import {Angular2Adapter} from 'ngNext/angular2Adapter';

export function bootstrap (component, config = {}) {
    var adapter = new Angular2Adapter(config);
    adapter.bootstrapComponent(component);
};
