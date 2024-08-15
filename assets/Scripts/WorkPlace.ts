// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "./Global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WorkPlace extends cc.Component {
    @property(cc.Node)
    layer_UI: cc.Node = null;
    @property(cc.Node)
    layer_TutorialTree: cc.Node = null;
    @property(cc.Camera)
    camera: cc.Camera = null;

    @property(cc.Prefab)
    prefab_tutorialStep: cc.Prefab = null;

    protected onLoad(): void {

        // cc.Canvas.instance.designResolution = cc.size(Global.width || 1280, Global.height || 720);

        // cc.Canvas.instance.fitWidth = !Global.isVertical;

        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    protected onTouchMove(evt: cc.Event.EventTouch) {
        let delta: cc.Vec3 = cc.v3(evt.getDelta());

        // console.log("delta", delta.toString());

        let pos = this.layer_TutorialTree.position;
        pos = pos.add(delta);

        this.layer_TutorialTree.setPosition(pos);
    }

    protected onClickCreateStep() {
        let node = cc.instantiate(this.prefab_tutorialStep);
        node.setParent(this.layer_TutorialTree);

        let pos = this.camera.node.parent.convertToWorldSpaceAR(this.camera.node.position);
        pos = this.layer_TutorialTree.convertToNodeSpaceAR(pos);

        node.setPosition(pos);
    }

}