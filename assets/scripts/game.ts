// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

import pipePool from './pipePool'
import Bird from './bird'
import Ground from './ground'
import Result from './result'

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Component)
    bird: Bird = null;

    @property(cc.Component)
    poolMng: pipePool

    @property(cc.Component)
    ground: Ground = null;

    @property(cc.Component)
    result: Result = null;

    speed: number = 200 // 运行速度
    gravity: cc.Vec2 = cc.v2(0, -980 * 2) // 重力
    isStart: boolean = false // 是否开始
    isOver: boolean = false // 是否结束

    onLoad() {
        this.bird = this.bird.getComponent('bird')
        this.bird.init(this)

        this.poolMng = this.poolMng.getComponent('pipePool')
        this.poolMng.init(this)

        this.ground = this.ground.getComponent('ground')
        this.ground.init(this)

        this.result = this.result.getComponent('result')
        this.result.init(this)

        this.initPhysicsManager()
        this.initListener()
    }


    initPhysicsManager() {
        const instance = cc.director.getPhysicsManager()
        instance.enabled = true
        // instance.debugDrawFlags = 4 // 调试模式
        instance.gravity = this.gravity;
        const collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true
    }

    initListener() {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, () => {
            if (this.isOver) return

            if (!this.isStart) this.startGame()

            this.bird.fly()
        })
    }

    startGame() {
        this.isStart = true
        this.bird.startBird()
        this.createPipe()

        cc.director.resume()
    }


    createPipe() {
        const node = this.poolMng.createPipe()
        if (node) {
            this.node.addChild(node);
        }
    }

    passPipe() {
        this.result.addScore()
    }

    gameOver() {
        this.isOver = true

        console.log('碰到障碍，游戏结束')
        this.result.showResult()

        cc.director.pause()
    }

    resStartGame() {
        this.isStart = false
        this.isOver = false

        this.result.initResult()
        this.poolMng.reset()
        this.bird.resetBird()


        cc.director.resume()

    }

}
