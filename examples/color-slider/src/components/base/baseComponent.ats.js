import {Component, TemplateConfig} from 'core/core';
import BackgroundColor from 'decorators/backgroundColor';
import ColorUtil from 'services/colorUtil';
import Ng2ColorSettings from 'components/colorSettings/ng2ColorSettings';

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