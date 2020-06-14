import { getCache } from "../Levels/getCache";

export interface ISoundSystem {
    musicVolume: number;
    soundVolume: number;
    masterVolume: number;
    music: Phaser.Sound.BaseSound;
    explosionSounds: Phaser.Sound.BaseSound[];
    hitSounds: Phaser.Sound.BaseSound[];
    blipSounds: Phaser.Sound.BaseSound[];
    updateVolume(music: number, sound: number, master: number): void;
    playRandom(sounds: Phaser.Sound.BaseSound[]): void;
}

export class SoundSystem implements ISoundSystem {
    musicVolume: number;
    soundVolume: number;
    masterVolume: number;
    music: Phaser.Sound.BaseSound;
    explosionSounds: Phaser.Sound.BaseSound[];
    hitSounds: Phaser.Sound.BaseSound[];
    blipSounds: Phaser.Sound.BaseSound[];
    sound: Phaser.Sound.BaseSoundManager;
    constructor(sound: Phaser.Sound.BaseSoundManager){
        this.soundVolume = Number(getCache('sound',"1"));
        this.musicVolume = Number(getCache('music',"1"));
        this.masterVolume = Number(getCache('master',"1"));
        this.sound = sound;
        this.sound.pauseOnBlur = false;
        
        //this.start();
    }
   
    start() {
        if(this.explosionSounds){
            return;
        }

        this.explosionSounds = [
            this.sound.add('exp_9'),
            this.sound.add('exp_10'),
            this.sound.add('exp_11'),
            this.sound.add('exp_14')
        ];
        this.blipSounds = [
            this.sound.add('blip_5'),
            this.sound.add('blip_6'),
            this.sound.add('blip_7'),
            this.sound.add('blip_8'),
        ];
        this.hitSounds = [
            this.sound.add('hit_7'),
            this.sound.add('hit_8'),
            this.sound.add('hit_9'),
            this.sound.add('hit_10'),
            this.sound.add('hit_11'),
        ];

        this.music = this.sound.add('theme', { loop: true, });

        this.music.play({ volume: this.musicVolume * this.masterVolume, loop: true });
    }

    updateVolume(music: number, sound: number, master: number){
        this.musicVolume = music;
        this.soundVolume = sound;
        this.masterVolume = master;
        localStorage.setItem('master', master.toString());
        localStorage.setItem('sound', sound.toString());
        localStorage.setItem('music', music.toString());
        this.music.play({ volume: this.musicVolume * this.masterVolume, loop: true });
    }

    playRandom(sounds: Phaser.Sound.BaseSound[]){
        sounds[Math.floor(Math.random() * sounds.length)].play({ volume: this.masterVolume * this.soundVolume });
    }
}