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
    // LIFE-CYCLE CALLBACKS:

    game: Game

    maxScore: number = 0 // 最大分数
    score: number = 0 // 当前分数

    @property(cc.Label)
    scoreLabel: cc.Label = null

    @property(cc.Label)
    currentScoreLabel: cc.Label = null

    @property(cc.Label)
    bestScoreLabel: cc.Label = null


    init(game: Game) {
        this.game = game

        this.initResult()
    }

    initResult() {
        this.updateScore(0)

        this.node.active = false
        this.scoreLabel.node.active = true
        this.scoreLabel.node.zIndex = 999
    }

    addScore() {
        this.updateScore(this.score + 1)
    }


    updateScore(num: number) {
        this.score = num
        this.scoreLabel.string = this.score.toString()
    }

    showResult() {
        this.maxScore = Math.max(this.maxScore, this.score)

        this.scoreLabel.node.active = false


        this.node.active = true
        this.node.zIndex = 9999

        this.currentScoreLabel.string = this.score.toString()
        this.bestScoreLabel.string = this.maxScore.toString()

        this.scoreLabel.node.active = false

    }

}
