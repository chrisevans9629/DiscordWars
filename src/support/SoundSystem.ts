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

    healing: Phaser.Sound.BaseSound;
    upgrading: Phaser.Sound.BaseSound;
    upgraded: Phaser.Sound.BaseSound;
    healed: Phaser.Sound.BaseSound;
    destroyed: Phaser.Sound.BaseSound;

    sound: Phaser.Sound.BaseSoundManager;
    constructor(sound: Phaser.Sound.BaseSoundManager){
        this.soundVolume = Number(getCache('sound',"1"));
        this.musicVolume = Number(getCache('music',"1"));
        this.masterVolume = Number(getCache('master',"1"));
        this.sound = sound;
        this.sound.pauseOnBlur = false;
        
        //this.start();
    }
    load(load: Phaser.Loader.LoaderPlugin){
        load.audio('theme','assets/audio/discordwars.wav');
        load.audio('exp_9','assets/audio/Explosion9.wav');
        load.audio('exp_10','assets/audio/Explosion10.wav');
        load.audio('exp_11','assets/audio/Explosion11.wav');
        load.audio('exp_14','assets/audio/Explosion14.wav');

        load.audio('blip_5','assets/audio/Blip_Select5.wav');
        load.audio('blip_6','assets/audio/Blip_Select6.wav');
        load.audio('blip_7','assets/audio/Blip_Select7.wav');
        load.audio('blip_8','assets/audio/Blip_Select8.wav');

        load.audio('hit_7', 'assets/audio/Hit_Hurt7.wav');
        load.audio('hit_8', 'assets/audio/Hit_Hurt8.wav');
        load.audio('hit_9', 'assets/audio/Hit_Hurt9.wav');
        load.audio('hit_10','assets/audio/Hit_Hurt10.wav');
        load.audio('hit_11','assets/audio/Hit_Hurt11.wav');

        load.audio('death','assets/audio/Death.wav');
        load.audio('healed','assets/audio/Healed.wav');
        load.audio('healing','assets/audio/Healing.wav');
        load.audio('upgrading','assets/audio/Upgrade2.wav');
        load.audio('upgraded','assets/audio/UpgradeComplete3.wav');
    }
    start() {
        if(this.explosionSounds){
            return;
        }
        this.destroyed = this.sound.add('death');
        this.healed = this.sound.add('healed');
        this.healing = this.sound.add('healing');
        this.upgraded = this.sound.add('upgraded');
        this.upgrading = this.sound.add('upgrading');

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
    play(sound: Phaser.Sound.BaseSound, cents: number){
        sound.play({volume: this.masterVolume * this.soundVolume, detune: cents});
    }
    playRandom(sounds: Phaser.Sound.BaseSound[]){
        sounds[Math.floor(Math.random() * sounds.length)].play({ volume: this.masterVolume * this.soundVolume });
    }
}