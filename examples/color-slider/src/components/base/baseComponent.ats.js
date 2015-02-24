import {Component, Template} from 'angular2/angular2.js';
import BackgroundColor from 'decorators/backgroundColor.js';
import ColorUtil from 'services/colorUtil.js';
import Ng2ColorSettings from 'components/colorSettings/ng2ColorSettings.js';

@Component({
    selector: 'base-component',
    componentServices: [ColorUtil]
})
@Template({
    url: 'components/base/baseComponent.html',
    directives: [BackgroundColor, Ng2ColorSettings]
})
class BaseComponent {
    constructor() {
        this.backgroundColor = '#fff';
    }

    setBackgroundColor(hash) {
        this.backgroundColor = hash;
    }
}

export default BaseComponent;