// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { CustomEvent } from "./Event";

const { ccclass, property } = cc._decorator;

export interface TutorialTask {
    uid: number;
    /**形状 0 长方形 1圆型 */
    shape?: cc.Mask.Type;
    /**是否显示遮罩 */
    showMask: boolean;
    /**点击中心 */
    center?: { x: number, y: number };
    /**范围 */
    radius?: number;
    /**宽高 */
    size?: { width: number, height: number };

    /**提示 文本 */
    tips?: string;
    /**提示 世界位置 */
    tipsWorldPosition?: { x: number, y: number };
    /**是否能触摸移动 */
    canTouchMove?: boolean;
    /**手指开始移动位置 */
    handFromPos?: { x: number, y: number };
    /**手指移动到某个位置 */
    handToPos?: { x: number, y: number };
    /**0:一次  1：循环动作 */
    handAction?: number;
    /**动作时长 */
    handActionDuration?: number;

    /**是否打开该界面 */
    isForceOpenView?: boolean;
    /**模块名 */
    bundleName?: string;
    /**目标界面 */
    targetView?: number;
    /**目标点击按钮路径 */
    targetBtnPath?: string;
    /**响应的事件id */
    eventID?: string;
    /**可能遇到的失败事件id */
    failEventID?: string;
    /**返回到某个步骤id（在失败时) */
    backToStepIDWhenFail?: number;
    /**返回到某个步骤id（在重登时) */
    backToStepIDWhenRelogin?: number;
}

export interface TutorialStepParam extends TutorialTask {
    id: number;

}

@ccclass
export default class TutorialStep extends cc.Component {
    @property(cc.Label)
    lab_id: cc.Label = null;
    @property(cc.Label)
    lab_connectId: cc.Label = null;

    @property(cc.EditBox)
    EditBox_shape: cc.EditBox = null;
    @property(cc.EditBox)
    EditBox_module: cc.EditBox = null;
    @property(cc.EditBox)
    EditBox_view: cc.EditBox = null;
    @property(cc.EditBox)
    EditBox_btnPath: cc.EditBox = null;

    @property(cc.Toggle)
    Toggle_showMask: cc.Toggle = null;
    @property(cc.Toggle)
    Toggle_isForceOpenView: cc.Toggle = null;
    @property(cc.Toggle)
    Toggle_canTouchMove: cc.Toggle = null;

    @property(cc.Node)
    node_handAction: cc.Node = null;
    @property(cc.Node)
    node_shape: cc.Node = null;
    @property(cc.Node)
    node_event: cc.Node = null;
    @property(cc.Node)
    node_tips: cc.Node = null;

    @property(cc.EditBox)
    EditBox_worldPosX: cc.EditBox = null;
    @property(cc.EditBox)
    EditBox_worldPosY: cc.EditBox = null;
    @property(cc.EditBox)
    EditBox_width: cc.EditBox = null;
    @property(cc.EditBox)
    EditBox_height: cc.EditBox = null;
    @property(cc.EditBox)
    EditBox_radius: cc.EditBox = null;

    @property(cc.EditBox)
    EditBox_tips: cc.EditBox = null;
    @property(cc.EditBox)
    EditBox_tipsStartX: cc.EditBox = null;
    @property(cc.EditBox)
    EditBox_tipsStartY: cc.EditBox = null;

    @property(cc.EditBox)
    EditBox_handActionType: cc.EditBox = null;
    @property(cc.EditBox)
    EditBox_handStartX: cc.EditBox = null;
    @property(cc.EditBox)
    EditBox_handStartY: cc.EditBox = null;
    @property(cc.EditBox)
    EditBox_handEndX: cc.EditBox = null;
    @property(cc.EditBox)
    EditBox_handEndY: cc.EditBox = null;
    @property(cc.EditBox)
    EditBox_handDuration: cc.EditBox = null;

    @property(cc.EditBox)
    EditBox_successEventID: cc.EditBox = null;
    @property(cc.EditBox)
    EditBox_failEventID: cc.EditBox = null;
    @property(cc.EditBox)
    EditBox_failBackEventID: cc.EditBox = null;
    @property(cc.EditBox)
    EditBox_backToStepIDWhenReloginEventID: cc.EditBox = null;

    @property(cc.Node)
    node_select: cc.Node = null;

    protected id: number;
    protected connectToID: number;
    protected failBackToID: number;
    protected reloginBackToID: number;

    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClickSelf, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    public init(id: number, param: TutorialTask): void {
        this.id = id;
        this.lab_id.string = `id:${id}`;

        if (param && param.shape != null) {
            this.EditBox_shape.string = param.shape.toString();
        }

        if (param && param.center) {
            this.EditBox_worldPosX.string = param.center.x.toString();
            this.EditBox_worldPosY.string = param.center.y.toString();
        }

        if (param && param.radius) {
            this.EditBox_radius.string = param.radius.toString();
        }

        if (param && param.size) {
            this.EditBox_width.string = param.size.width.toString();
            this.EditBox_height.string = param.size.height.toString();
        }

        if (param && param.tips) {
            this.EditBox_tips.string = param.tips.toString();
        }

        if (param && param.tipsWorldPosition) {
            this.EditBox_tipsStartX.string = param.tipsWorldPosition.x.toString();
            this.EditBox_tipsStartY.string = param.tipsWorldPosition.y.toString();
        }

        if (param && param.handAction) {
            this.EditBox_handActionType.string = param.handAction.toString();
        }

        if (param && param.handActionDuration) {
            this.EditBox_handDuration.string = param.handActionDuration.toString();
        }
        if (param && param.handFromPos) {
            this.EditBox_handStartX.string = param.handFromPos.x.toString();
            this.EditBox_handStartY.string = param.handFromPos.y.toString();
        }
        if (param && param.handToPos) {
            this.EditBox_handEndX.string = param.handToPos.x.toString();
            this.EditBox_handEndY.string = param.handToPos.y.toString();
        }

        if (param && param.eventID) {
            this.EditBox_successEventID.string = param.eventID;
        }

        if (param && param.failEventID) {
            this.EditBox_failEventID.string = param.failEventID;
        }

        if (param && param.backToStepIDWhenFail) {
            this.EditBox_failBackEventID.string = param.backToStepIDWhenFail.toString();
        }

        if (param && param.backToStepIDWhenRelogin) {
            this.EditBox_backToStepIDWhenReloginEventID.string = param.backToStepIDWhenRelogin.toString();
        }

        if (param && param.bundleName) {
            this.EditBox_module.string = param.bundleName;
        }

        if (param && param.targetView) {
            this.EditBox_view.string = param.targetView.toString();
        }

        if (param && param.targetBtnPath) {
            this.EditBox_btnPath.string = param.targetBtnPath;
        }

        this.Toggle_showMask.isChecked = param && param.showMask;
        this.Toggle_canTouchMove.isChecked = param && param.canTouchMove;
        this.Toggle_isForceOpenView.isChecked = param && param.isForceOpenView;
    }

    public exportJson() {
        let shape: number = this.EditBox_shape.string.length <= 0 ? null : Number(this.EditBox_shape.string);

        let center: { x: number, y: number } = null;
        let cx: number = Number(this.EditBox_worldPosX?.string);
        let cy: number = Number(this.EditBox_worldPosY?.string);
        if (this.EditBox_worldPosX.string.length && this.EditBox_worldPosY.string.length) {
            center = {
                x: cx, y: cy
            }
        }

        let radius: number = this.EditBox_radius?.string.length > 0 ? Number(this.EditBox_radius?.string) : null;
        let size: { width: number, height: number } = null;
        if (this.EditBox_width?.string.length && this.EditBox_height?.string.length) {
            size = {
                width: Number(this.EditBox_width?.string),
                height: Number(this.EditBox_height?.string),
            }
        }

        let tips: string = this.EditBox_tips.string;
        let tipsWorldPosition: { x: number, y: number } = null
        if (this.EditBox_tipsStartX?.string.length && this.EditBox_tipsStartY?.string.length) {
            tipsWorldPosition = {
                x: Number(this.EditBox_tipsStartX?.string),
                y: Number(this.EditBox_tipsStartY?.string),
            }
        }

        let canTouchMove: boolean = this.Toggle_canTouchMove.isChecked;

        let handFromPos: { x: number, y: number } = null;
        if (this.EditBox_handStartX?.string.length &&
            this.EditBox_handStartY?.string.length) {
            handFromPos = {
                x: Number(this.EditBox_handStartX?.string),
                y: Number(this.EditBox_handStartY?.string),
            }
        }

        let handToPos: { x: number, y: number } = null;
        if (this.EditBox_handEndX?.string.length &&
            this.EditBox_handEndY?.string.length) {
            handToPos = {
                x: Number(this.EditBox_handEndX?.string),
                y: Number(this.EditBox_handEndY?.string),
            }
        }

        let handAction: number = this.EditBox_handActionType?.string.length > 0 ? Number(this.EditBox_handActionType?.string) : null;
        let handActionDuration: number = this.EditBox_handDuration?.string.length > 0 ? Number(this.EditBox_handDuration?.string) : null;

        let isForceOpenView: boolean = this.Toggle_isForceOpenView.isChecked;
        let bundleName: string = this.EditBox_module.string;
        let targetView: number = this.EditBox_view.string.length > 0 ? Number(this.EditBox_view.string) : null;
        let targetBtnPath: string = this.EditBox_btnPath.string;
        let eventID: string = this.EditBox_successEventID?.string;
        let failEventID: string = this.EditBox_failEventID.string;

        let backToStepIDWhenFail: number = this.EditBox_failBackEventID.string.length > 0 ? Number(this.EditBox_failBackEventID.string) : null;

        let backToStepIDWhenRelogin: number = this.EditBox_backToStepIDWhenReloginEventID?.string.length > 0 ? Number(this.EditBox_backToStepIDWhenReloginEventID?.string) : null;

        let result: TutorialTask = {
            shape: shape,
            showMask: this.Toggle_showMask.isChecked == true,
            center: center,
            radius: radius,
            size: size,
            tips: tips,
            tipsWorldPosition: tipsWorldPosition,
            canTouchMove: canTouchMove,
            handFromPos: handFromPos,
            handToPos: handToPos,
            handAction: handAction,
            handActionDuration: handActionDuration,
            isForceOpenView: isForceOpenView,
            bundleName: bundleName,
            targetView: targetView,
            targetBtnPath: targetBtnPath,
            eventID: eventID,
            failEventID: failEventID,
            backToStepIDWhenFail: backToStepIDWhenFail,
            backToStepIDWhenRelogin: backToStepIDWhenRelogin,
            uid: this.id,
        }

        return result;
    }

    protected onClickPrint() {
        // let str: string = JSON.stringify(this.exportJson());
        console.log("data:", this.exportJson());
    }

    protected onTouchMove(evt: cc.Event.EventTouch) {
        evt.stopPropagation();

        let delta: cc.Vec3 = cc.v3(evt.getDelta());

        console.log("delta 11");

        let pos = this.node.position;
        pos = pos.add(delta.mul(1 / this.node.parent.scale));

        this.node.setPosition(pos);
    }

    protected onClickSelf() {
        this.node.emit(CustomEvent.onSelectStep, this.id);
    }

    protected onClickDetail() {
        this.node_handAction.active = !this.node_handAction.active;
        this.node_shape.active = !this.node_shape.active;
        this.node_event.active = !this.node_event.active;
        this.node_tips.active = !this.node_tips.active;
    }

    protected onClickConnect() {
        this.node.emit(CustomEvent.onClickConnect, this.id);
    }
    protected onClickFailBackConnect() {
        this.node.emit(CustomEvent.onClickFailBackConnect, this.id);
    }
    protected onClickReloginBackConnect() {
        this.node.emit(CustomEvent.onClickReloginBackConnect, this.id);
    }

    public setSelecting(v: boolean) {
        this.node_select.active = v;
    }

    public connectTo(id: number) {
        this.connectToID = id;
        this.lab_connectId.string = id.toString();

    }

    public getConnectID() {
        return this.connectToID;
    }

    public setFailBackToID(id: number) {
        this.failBackToID = id;
        this.EditBox_failBackEventID.string = id ? id.toString() : null;
    }
    public getFailBackToID() {
        return this.failBackToID;
    }

    public setReloginBackToID(id: number) {
        this.reloginBackToID = id;
        this.EditBox_backToStepIDWhenReloginEventID.string = id ? id.toString() : null;
    }
    public getReloginBackToID() {
        return this.reloginBackToID;
    }

    public exportData() {
        let result = {
            id: this.id,
            connectToID: this.connectToID,
            failBackToID: this.failBackToID,
            reloginBackToID: this.reloginBackToID,

            param: this.exportJson(),

            pos: this.node.position,
        }

        return result;
    }
}
