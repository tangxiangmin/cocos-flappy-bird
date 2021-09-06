// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import Game from './game'

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    pipePrefab: cc.Prefab

    pool: cc.NodePool = null
    nodeList: cc.Node[]
    game: Game

    init(game: Game) {
        this.game = game
        this.nodeList = []
        this.initPool()
        // todo 其他初始化逻辑
    }


    initPool() {
        this.pool = new cc.NodePool();
        let initCount = 3;
        for (let i = 0; i < initCount; ++i) {
            let node = cc.instantiate(this.pipePrefab); // 创建节点
            this.pool.put(node); // 通过 put 接口放入对象池
            this.nodeList.push(node)
        }
    }

    createPipe() {
        let pipe = null
        if (this.pool.size() > 0) {
            pipe = this.pool.get()
        } else {
            pipe = cc.instantiate(this.pipePrefab)
        }
        pipe.getComponent("pipe").init(this.game)

        return pipe
    }

    reusePipe(pipe: cc.Node) {
        this.pool.put(pipe)
    }

    reset() {
        this.nodeList.forEach(node => {
            this.reusePipe(node)
        })
    }
}
