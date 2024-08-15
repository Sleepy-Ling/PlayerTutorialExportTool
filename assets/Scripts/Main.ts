// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "./Global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(cc.EditBox)
    editBox_width: cc.EditBox = null;

    @property(cc.EditBox)
    editBox_height: cc.EditBox = null;

    @property(cc.Toggle)
    toggle: cc.Toggle = null;

    onClickGo() {

        let isVertical: boolean = this.toggle.isChecked;
        let sceneName: string = isVertical ? "Vertical" : "Horizontal"

        Global.isVertical = isVertical;
        Global.height = Number(this.editBox_height.string);
        Global.width = Number(this.editBox_width.string);
        cc.director.loadScene(sceneName);
    }
}
