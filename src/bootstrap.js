import Angular2Adapter from './angular2Adapter';

export default function bootstrap (component, config = {}) {
    var adapter = new Angular2Adapter(config);
    adapter.bootstrapComponent(component);
};
