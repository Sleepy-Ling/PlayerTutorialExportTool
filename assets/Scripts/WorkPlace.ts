// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { CustomEvent } from "./Event";
import { Global } from "./Global";
import TutorialStep, { TutorialTask } from "./TutorialStep";

const { ccclass, property } = cc._decorator;

enum Enum_State {
    None,
    Connecting,
    FailConnecting,
    ReloginConnecting,
}

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
    @property(cc.Graphics)
    protected graphics: cc.Graphics = null;

    protected curIdx: number = 0;

    protected map_step: Map<number, TutorialStep> = new Map();
    protected state: Enum_State = Enum_State.None;
    protected curSelectID: number = null;

    protected onLoad(): void {
        this.node.on(cc.Node.EventType.MOUSE_WHEEL, this.onMouseWheel, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    protected start(): void {
        this.node.on(CustomEvent.onSelectStep, this.onSelectStep, this);
        this.node.on(CustomEvent.onClickConnect, this.onConnectStart, this);
        this.node.on(CustomEvent.onClickFailBackConnect, this.onClickFailBackConnect, this);
        this.node.on(CustomEvent.onClickReloginBackConnect, this.onClickReloginBackConnect, this);

        // this.schedule(this.updateTreeGraph.bind(this), 0.1);
    }

    protected update(dt: number): void {
        if (this.isStepDirty) {
            this.updateTreeGraph();
        }
    }

    protected onTouchMove(evt: cc.Event.EventTouch) {
        let delta: cc.Vec3 = cc.v3(evt.getDelta());

        console.log("delta 00");

        let pos = this.layer_TutorialTree.position;
        pos = pos.add(delta);

        this.layer_TutorialTree.setPosition(pos);
    }

    public createStep(id: number, param?: TutorialTask) {
        let node = cc.instantiate(this.prefab_tutorialStep);
        node.setParent(this.layer_TutorialTree);

        let pos = this.camera.node.parent.convertToWorldSpaceAR(this.camera.node.position);
        pos = this.layer_TutorialTree.convertToNodeSpaceAR(pos);

        node.setPosition(pos);

        let tutorialStep: TutorialStep = node.getComponent(TutorialStep);
        tutorialStep.init(id, param);
        this.map_step.set(id, tutorialStep);

        node.on(CustomEvent.onSelectStep, this.onSelectStep, this);
        node.on(CustomEvent.onClickConnect, this.onConnectStart, this);
        node.on(CustomEvent.onClickFailBackConnect, this.onClickFailBackConnect, this);
        node.on(CustomEvent.onClickReloginBackConnect, this.onClickReloginBackConnect, this);
        node.on(cc.Node.EventType.MOUSE_MOVE, this.onTouchStepStart, this);
        return tutorialStep;
    }

    protected onClickCreateStep() {
        this.createStep(this.curIdx);

        this.curIdx++;
    }

    protected onClickDeleteNode() {
        if (this.curSelectID != null) {
            const nowSelectStep = this.map_step.get(this.curSelectID);
            if (nowSelectStep) {
                nowSelectStep.node.destroy();
                this.map_step.set(this.curSelectID, null);
            }

        }
    }

    protected onSelectStep(id: number) {
        console.log("onSelectStep =>", id);
        const nowSelectStep = this.map_step.get(this.curSelectID);
        const step = this.map_step.get(id);
        if (this.state == Enum_State.None) {
            nowSelectStep?.setSelecting(false);

            this.curSelectID = this.curSelectID == null ? id : null;
            step?.setSelecting(this.curSelectID != null);

        }
        else {
            if (this.state == Enum_State.Connecting) {
                if (id != this.curSelectID) {
                    nowSelectStep.connectTo(id);
                    this.updateTreeGraph();
                }
            }
            else if (this.state == Enum_State.FailConnecting) {
                if (id != this.curSelectID) {
                    nowSelectStep.setFailBackToID(id);
                    this.updateTreeGraph();
                }
            }
            else if (this.state == Enum_State.ReloginConnecting) {
                if (id != this.curSelectID) {
                    nowSelectStep.setReloginBackToID(id);
                    this.updateTreeGraph();
                }
            }

            nowSelectStep?.setSelecting(false);
            this.state = Enum_State.None;
        }


    }

    protected onConnectStart(id: number) {
        console.log("onConnectStart =>", id);
        this.state = Enum_State.Connecting;
        this.curSelectID = id;
        const nowSelectStep = this.map_step.get(this.curSelectID);
        nowSelectStep?.setSelecting(true);

    }
    protected onClickFailBackConnect(id: number) {
        this.state = Enum_State.FailConnecting;
        console.log("onClickFailBackConnect =>", id);
        this.curSelectID = id;
        const nowSelectStep = this.map_step.get(this.curSelectID);
        nowSelectStep?.setSelecting(true);

    }
    protected onClickReloginBackConnect(id: number) {
        this.state = Enum_State.ReloginConnecting;
        console.log("onClickReloginBackConnect =>", id);
        this.curSelectID = id;
        const nowSelectStep = this.map_step.get(this.curSelectID);
        nowSelectStep?.setSelecting(true);

    }

    protected onClickBackToStart() {
        let keys = Array.from(this.map_step.keys());
        for (const k of keys) {
            let step = this.map_step.get(k);
            if (step) {
                let pos = step.node.position;

                let w1 = this.layer_TutorialTree.convertToWorldSpaceAR(pos);
                console.log("w1", w1.toString());


                let w2 = this.camera.node.parent.convertToWorldSpaceAR(this.camera.node.position);
                console.log("w2", w2.toString());

                let sub = w2.sub(w1);
                console.log("sub", sub.toString());

                let parentPos = this.layer_TutorialTree.position;
                this.layer_TutorialTree.setPosition(parentPos.add(sub));
                break;
            }

        }
    }

    public updateTreeGraph() {
        this.graphics.clear();
        this.graphics.lineWidth = 10;

        let keys = Array.from(this.map_step.keys());
        for (const k of keys) {
            let step = this.map_step.get(k);
            if (step) {
                let nowPos = step.node.position;
                let nextStep = this.map_step.get(step.getConnectID());

                this.graphics.moveTo(nowPos.x, nowPos.y);

                //正常流程连线
                if (nextStep) {
                    this.graphics.strokeColor = cc.Color.GREEN;

                    let nextPos = nextStep.node.position;
                    this.graphics.lineTo(nextPos.x, nextPos.y);
                    this.graphics.stroke();
                }

                //失败流程连线
                nextStep = this.map_step.get(step.getFailBackToID());
                if (nextStep) {
                    this.graphics.strokeColor = cc.Color.RED;

                    this.graphics.moveTo(nowPos.x, nowPos.y);
                    let nextPos = nextStep.node.position;
                    this.graphics.quadraticCurveTo((nowPos.x - nextPos.x) * 2, (nowPos.y + nextPos.y) / 2, nextPos.x, nextPos.y);
                    // this.graphics.lineTo(nextPos.x, nextPos.y);
                    this.graphics.stroke();

                }

                //重连流程连线
                nextStep = this.map_step.get(step.getReloginBackToID());
                if (nextStep) {
                    this.graphics.strokeColor = cc.Color.YELLOW;

                    this.graphics.moveTo(nowPos.x, nowPos.y);
                    let nextPos = nextStep.node.position;
                    this.graphics.quadraticCurveTo((nowPos.x - nextPos.x) * 5, (nowPos.y + nextPos.y) / 2, nextPos.x, nextPos.y);
                    this.graphics.stroke();

                }
            }
        }


    }

    protected scale: number = 1;
    protected onMouseWheel(evt: cc.Event.EventMouse) {

        let delta = evt.getScrollY() / 1200;
        this.scale += delta;

        console.log("delta", delta);
        console.log("scale", this.scale);

        this.layer_TutorialTree.scale = this.scale;
    }


    protected isStepDirty: boolean = false;
    protected onTouchStepStart() {
        this.isStepDirty = true;
    }

    protected onTouchStepEnd() {
        this.isStepDirty = false;
        console.log("11");
        
    }

    /**导出配置表 */
    protected onClickExportJson() {
        let result = {};
        let keys = Array.from(this.map_step.keys());
        for (const k of keys) {
            let step = this.map_step.get(k);
            if (step) {
                let t = step.exportJson();
                result[k] = t;
            }

        }

        this.WriteFile("Table_PlayerTutorial.json", JSON.stringify(result));
    }

    /**保存节点树 */
    protected onClickSaveNodeTree() {
        let keys = Array.from(this.map_step.keys());
        let result = {
            idx: 0,
            tree: {}
        }

        let tree = {

        }

        for (const k of keys) {
            let step = this.map_step.get(k);
            // console.log(k, step.toString());
            // result += step.toString();
            // result.push(step.toString());
            if (step) {
                tree[k] = step.exportData();
            }
        }

        result.idx = this.curIdx;
        result.tree = tree;

        console.log("result ", JSON.stringify(result));

        this.WriteFile("TutorialNodeTree", JSON.stringify(result));

        return result;
    }

    protected onClickImportNodeTree(): void {
        let value = Array.from(this.map_step.values());
        for (const v of value) {
            v.node.destroy();
        }

        this.state = Enum_State.None;
        this.curSelectID = null;

        this.map_step.clear();

        this.ReadFile((result: any) => {

            let data = result;
            this.curIdx = data.idx || 0;
            let tree = data.tree;

            for (const key in tree) {
                if (Object.prototype.hasOwnProperty.call(tree, key)) {
                    const element = tree[key];

                    let step = this.createStep(element.id, element.param);
                    step.node.setPosition(cc.v3(element.pos.x, element.pos.y));
                }
            }

            for (const key in tree) {
                if (Object.prototype.hasOwnProperty.call(tree, key)) {
                    const element = tree[key];
                    const step = this.map_step.get(element.id);

                    if (step) {
                        if (element.connectToID) {
                            step.connectTo(element.connectToID);
                        }

                        if (element.failBackToID) {
                            step.setFailBackToID(element.failBackToID);
                        }

                        if (element.reloginBackToID) {
                            step.setReloginBackToID(element.reloginBackToID);
                        }
                    }

                }
            }


        })
    }

    WriteFile(fileName: string, content: string, cb?: Function) {
        console.log("export");
        try {
            console.log("data: ", content);
            let link = document.createElement('a');
            link.download = fileName;
            link.style.display = 'none';    // 字符内容转变成blob地址
            let blob = new Blob([content]);
            link.href = URL.createObjectURL(blob);    // 触发点击
            link.click();    // 然后移除

            if (cb) cb();
        } catch (err) {
            console.error('exportData() 导入数据异常')
        }
    }

    ReadFile(cb: Function) {
        try {
            let input = document.createElement("input");
            input.type = "file";
            input.click();
            input.onchange = () => {
                var file = input.files[0];
                var reader = new FileReader();
                reader.readAsText(file);
                reader.onload = (env) => {
                    const result = env.target.result as string;
                    const data = JSON.parse(result);
                    console.log("input data: ", data);

                    cb(data);
                };
            }
        } catch (err) {
            console.error('importData() 导出数据异常')
        }
    }
}
