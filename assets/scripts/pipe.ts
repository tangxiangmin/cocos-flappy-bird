// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import Game from './game'
const random = (min, max) => {
    return Math.random() * (max - min) + min
}
@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Sprite)
    topPipe: cc.Sprite = null;

    @property(cc.Sprite)
    bottomPipe: cc.Sprite = null;

    game: Game

    isPass: boolean = false
    // LIFE-CYCLE CALLBACKS:

    init(game) {
        this.game = game
        this.isPass = false

        this.initPos()
    }

    initPos() {
        this.node.setPosition(cc.v2(360, 0));

        const groundH = 64
        const screenH = 960

        let gap = random(200, 300) // 可以通过的区域
        let h1 = random(200, 400) // 顶部管道高度，通过顶部管道和可通过区域，就可以计算出底部管道的高度
        // let gap = 150
        // let h1 = 300

        let y1 = (screenH / 2 - h1) + h1 / 2

        this.topPipe.node.height = h1
        this.topPipe.node.y = y1

        // h1 + h2 + gap = screenH - groundH
        let h2 = screenH - groundH - h1 - gap

        // y2 + h2/2 = screenH/2 - groundH
        let y2 = screenH / 2 - groundH - h2 / 2

        this.bottomPipe.node.height = h2
        this.bottomPipe.node.y = -y2


        // console.log({ h1, y1 })

        // 设置宽高后需要重新设置碰撞区域
        const physicsBox = this.topPipe.getComponent(cc.PhysicsBoxCollider)
        physicsBox.size = this.topPipe.node.getContentSize()
        physicsBox.offset = cc.v2(0, 0);
        physicsBox.apply()

        const physicsBox2 = this.bottomPipe.getComponent(cc.PhysicsBoxCollider)
        physicsBox2.size = this.bottomPipe.node.getContentSize()
        physicsBox2.offset = cc.v2(0, 0);
        physicsBox2.apply()
    }

    update(dt) {
        const speed = this.game.speed * dt
        this.node.x -= speed

        // 刚体需要手动同步
        this.topPipe.getComponent(cc.RigidBody).syncPosition(true);
        this.bottomPipe.getComponent(cc.RigidBody).syncPosition(true);

        // 否则就需要手动设置
        // this.topPipe.node.x -= speed
        // this.bottomPipe.node.x -= speed

        if (!this.isPass && this.game && this.game.bird.node.x > this.node.x) {
            this.isPass = true
            this.game.passPipe()
            this.game.createPipe()
        }

        // 回收
        if (this.isPass && this.node.x <= -400) {
            this.game.poolMng.reusePipe(this.node)
        }

    }
}
