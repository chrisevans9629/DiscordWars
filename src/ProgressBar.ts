import { Scene } from "phaser";

export class ProgressBar {
    x: number;
    y: number;
    width: number;
    height: number;
    bar: Phaser.GameObjects.Graphics;
    value: number;
    padding: number;
    maxValue: number;
    alpha: number;
    scene: Scene;
    goodColor: number;
    badColor: number;
    constructor(scene: Scene, x: number, y: number) {
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.width = 80;
        this.height = 16;
        this.padding = 2;
        this.x = x;
        this.y = y;
        this.goodColor = 0x00ff00;
        this.badColor = 0xff0000;
        this.maxValue = 100;
        this.alpha = 1;
        this.scene = scene;
        //this.health = 100;
        //this.maxHealth = 100;
        scene.add.existing(this.bar);
        //this.timer = scene.time.addEvent({delay: 1000, callback: this.fadeOut, callbackScope: this});
        //this.draw();
    }

    //timer: Phaser.Time.TimerEvent;
    tween: Phaser.Tweens.Tween;
    draw() {
        this.alpha = 1;
        this.render();
        if (this.tween) {
            this.scene.tweens.remove(this.tween);
        }
        this.tween = this.scene.tweens.addCounter({
            from: 1,
            to: 0,
            duration: 1000,
            delay: 1000,
            onUpdate: function (tween) {
                var value = tween.getValue();
                this.alpha = value;
                this.render();
            },
            onUpdateScope: this,
        });
    }

    render() {
        if (this.value > this.maxValue) {
            this.value = this.maxValue;
        }
        this.bar.clear();

        let x = this.x - this.width / 2;
        let y = this.y - this.height / 2;

        let widthPad = this.width - this.padding * 2;
        let heightPad = this.height - this.padding * 2;
        let valueRatio = widthPad / this.maxValue;
        //  BG
        this.bar.fillStyle(0x000000, this.alpha);
        this.bar.fillRect(x, y, this.width, this.height);

        //  Health
        this.bar.fillStyle(0xffffff, this.alpha);
        this.bar.fillRect(
            x + this.padding,
            y + this.padding,
            widthPad,
            heightPad);

        if (this.value < this.maxValue / 3) {
            this.bar.fillStyle(this.badColor, this.alpha);
        }
        else {
            this.bar.fillStyle(this.goodColor, this.alpha);
        }

        var d = Math.floor(valueRatio * this.value);
        //console.log(this);
        //console.log(d);
        this.bar.fillRect(x + this.padding, y + this.padding, d, heightPad);
    }
}
