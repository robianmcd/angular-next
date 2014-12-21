import {Component} from 'component';
import TemplateConfig from 'templateConfig';
import BackgroundColor from 'backgroundColor';
import ColorUtil from 'colorUtil';
import Ng2ColorSettings from 'ng2ColorSettings';

@Component({
    selector: 'base-component',
    componentServices: [ColorUtil],
    template: new TemplateConfig({
        url: 'base.html',
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