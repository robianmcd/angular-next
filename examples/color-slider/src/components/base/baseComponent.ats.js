import {Component, TemplateConfig} from 'core/core.js';
import BackgroundColor from 'decorators/backgroundColor.js';
import ColorUtil from 'services/colorUtil.js';
import Ng2ColorSettings from 'components/colorSettings/ng2ColorSettings.js';

@Component({
    selector: 'base-component',
    componentServices: [ColorUtil],
    template: new TemplateConfig({
        url: 'components/base/baseComponent.html',
        directives: [BackgroundColor, Ng2ColorSettings]
    })
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