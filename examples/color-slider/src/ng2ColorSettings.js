import {Component} from 'component';
import TemplateConfig from 'templateConfig';
import BackgroundColor from 'backgroundColor';
import ColorUtil from 'colorUtil';
import BaseComponent from 'baseComponent';
import InjectNgOne from 'injectNgOne';

//TODO: should be able to specify BackgroundColor in directives but it throws an error because it is included in baseComponent

@Component({
    selector: 'ng2-color-settings',
    template: new TemplateConfig({
        url: 'colorSettings.html',
        directives: []
    })
})
class Ng2ColorSettings {
    //Notice how this constructor injects a service, a parent component, and an Angular 1 service.
    constructor(colorUtil:ColorUtil, base: BaseComponent, @InjectNgOne('$log') $log) {
        this.colorUtil = colorUtil;
        this.base = base;
        this.$log = $log;

        this.hue = 0;
    }

    hueToHash(hue) {
        return this.colorUtil.hslToHash(hue / 100, 0.7, 0.5);
    }

    setParentColor() {
        var hash = this.hueToHash(this.hue);
        this.$log.info(`setting the base component's background color to ${hash}`);
        this.base.setBackgroundColor(hash);
    }
}

export default Ng2ColorSettings;