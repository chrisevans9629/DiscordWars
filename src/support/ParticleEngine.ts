import { Scene } from 'phaser';
export class ParticleEngine {
    scene: Scene;
    constructor(scene: Scene) {
        this.scene = scene;
    }
    explosion(x: number, y: number, amt: number, scale: number, duration: number, tint: number) {
        for (let i = 0; i < amt; i++) {
            let img = this.scene.physics.add.sprite(0, 0, 'particle').setOrigin(0.5, 0.5).setScale(scale).setTint(tint);
            img.setBlendMode(Phaser.BlendModes.ADD);
            img.x = x + 64;
            img.y = y + 64;
            img.setVelocity(Phaser.Math.FloatBetween(-30, 30), Phaser.Math.FloatBetween(-30, 30));
            img.setDepth(2);
            this.scene.tweens.add({
                targets: img,
                scale: 0,
                duration: duration,
                ease: 'Sine.easeInOut',
                onComplete: (p, s, t) => {
                    img.destroy();
                }
            });
        }
    }
}
