import {Component} from 'component';
import TemplateConfig from 'templateConfig';
import BackgroundColor from 'decorators/backgroundColor';
import ColorUtil from 'services/colorUtil';
import BaseComponent from 'components/base/baseComponent';
import InjectNgOne from 'injectNgOne';

@Component({
    selector: 'ng2-color-settings',
    template: new TemplateConfig({
        url: 'components/colorSettings/colorSettings.html',
        directives: [BackgroundColor]
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
        return this.colorUtil.hslToHash(hue / 100, 0.8, 0.5);
    }

    setParentColor() {
        var hash = this.hueToHash(this.hue);
        this.$log.info(`setting the base component's background color to ${hash}`);
        this.base.setBackgroundColor(hash);
    }
}

export default Ng2ColorSettings;