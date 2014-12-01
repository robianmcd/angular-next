import Angular2Adapter from './angular2Adapter';

window.bootstrap = (component, config = {}) => {
    var adapter = new Angular2Adapter(config);
    adapter.bootstrapComponent(component);
};
