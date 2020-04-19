/* eslint-disable spellcheck/spell-checker */
import Phaser from 'phaser'
import Player, { PLAYER_KEY, PLAYER_ANIMS } from '../entities/player'

const DEATH_ANIM_KEY = 'please-die'

const ENEMY_KEYS = {
  HELLCAT: 'hellcat',
  SKELETON: 'skeleton',
  SKELETON_BOSS: 'skeleton-boss',
  BAT: 'bat-flat',
  WOLF: 'wolf',
  DIE: 'death',
}

export default class BaseScene extends Phaser.Scene {
  constructor(args) {
    super(args)
  }

  createPlayer() {
    return new Player(this, 100, 150)
  }

  createSkeleton(x, y) {
    console.info('createSkeleton BASE LEVEL')
    const skeleton = this.physics.add.sprite(x, y, ENEMY_KEYS.SKELETON)

    skeleton.setCollideWorldBounds(true)

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers(ENEMY_KEYS.SKELETON, {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: 'stay',
      frames: this.anims.generateFrameNumbers(ENEMY_KEYS.SKELETON, {
        start: 8,
        end: 9,
      }),
      frameRate: 2,
      repeat: -1,
    })
    this.anims.create({
      key: 'rise',
      frames: this.anims.generateFrameNumbers(ENEMY_KEYS.SKELETON, {
        start: 8,
        end: 14,
      }),
      frameRate: 10,
      repeat: 0,
    })

    skeleton.body.setSize(12, 8)

    skeleton.body.setOffset(10, 43)

    const animComplete = function (event, character, deets) {
      console.info('Skeleton Animation Complete', event)
      if (event.key === 'rise') {
        skeleton.anims.play('walk', true)
        skeleton.body.setSize()
        skeleton.setVelocityX(-10)
      }
      if (event.key === DEATH_ANIM_KEY) {
        console.info('Pause Now Please')
        // this.scene.pause()
        console.info('Die Now Please')
        skeleton.destroy()
      }
    }

    skeleton.on('animationcomplete', animComplete, this)

    return skeleton
  }

  createHellcat(x, y) {
    const hellcat = this.physics.add.sprite(x, y, ENEMY_KEYS.HELLCAT)

    hellcat.setCollideWorldBounds(true)

    this.anims.create({
      key: 'catwalk',
      frames: this.anims.generateFrameNumbers(ENEMY_KEYS.HELLCAT, {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    })

    const animComplete = function (event, character, deets) {
      console.info('Hellcat Animation Complete', event)
      if (event.key === DEATH_ANIM_KEY) {
        console.info('Hellcat Die Now Please')
        try {
          hellcat.destroy()
        } catch (err) {
          console.error('destroy fail', err)
        }
      }
    }

    hellcat.on('animationcomplete', animComplete, this)

    return hellcat
  }

  preload() {
    this.load.spritesheet(PLAYER_KEY, 'assets/images/entities/HeroKnight.png', {
      frameWidth: 100,
      frameHeight: 55,
    })
    this.load.spritesheet(
      ENEMY_KEYS.SKELETON,
      'assets/images/entities/skeleton-dark.png',
      {
        frameWidth: 44,
        frameHeight: 52,
      }
    )
    this.load.spritesheet(
      ENEMY_KEYS.SKELETON_BOSS,
      'assets/images/entities/skeleton-large.png',
      {
        frameWidth: 44 * 3,
        frameHeight: 52 * 3,
      }
    )
    this.load.spritesheet(
      ENEMY_KEYS.HELLCAT,
      'assets/images/entities/hell-cat.png',
      {
        frameWidth: 96,
        frameHeight: 53,
      }
    )
    this.load.spritesheet(ENEMY_KEYS.DIE, 'assets/images/entities/death.png', {
      frameWidth: 44,
      frameHeight: 52,
    })
  }

  dieNow(gameObject) {
    const boom = function (event, character, deets) {
      console.info('Kah BOOM?', event)
      if (event.key === DEATH_ANIM_KEY) {
        // character.destroy()
        console.log('Dead?', gameObject)
      }
    }
    gameObject.setVelocityX(0)

    gameObject.setTexture(ENEMY_KEYS.DIE)

    console.info('fall down, go boom')
    gameObject.play(DEATH_ANIM_KEY)
  }

  create() { }

  update() {
    if (this.player.x > 256 * 16 - 100) {
      console.info('bounds???')
      this.scene.start('change-scene')
    }

    if (this.cursors.up.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(-100 + (this.cursors.shift.isDown ? -30 : 0))
    }
    const isAttacking = () => {
      return (
        this.player.anims.currentAnim &&
        this.player.anims.currentAnim.key &&
        (this.player.anims.currentAnim.key === PLAYER_ANIMS.ATTACK1 ||
          this.player.anims.currentAnim.key === PLAYER_ANIMS.ATTACK2 ||
          this.player.anims.currentAnim.key === PLAYER_ANIMS.ATTACK3)
      )
    }
    if (!isAttacking()) {
      const pads = this.input.gamepad.gamepads
      const gamepad = pads[0] || {}

      if (this.cursors.left.isDown || gamepad.left) {
        if (
          this.player.anims.currentAnim &&
          this.player.anims.currentAnim.key !== PLAYER_ANIMS.HIT
        ) {
          this.player.setVelocityX(-160)
          this.player.anims.play('left', true)
          this.player.flipX = true
        }
      } else if (this.cursors.right.isDown || gamepad.right) {
        if (
          this.player.anims.currentAnim &&
          this.player.anims.currentAnim.key !== PLAYER_ANIMS.HIT
        ) {
          this.player.setVelocityX(360)
          this.player.anims.play('right', true)
          this.player.flipX = false
        }
      } else {
        this.player.setVelocityX(0)
        if (
          (this.player.anims.currentAnim &&
            this.player.anims.currentAnim.key === PLAYER_ANIMS.RIGHT) ||
          !this.player.anims.currentAnim
        ) {
          this.player.anims.play('stand-right', true)
          this.player.flipX = false
        } else if (
          this.player.anims.currentAnim &&
          this.player.anims.currentAnim.key === PLAYER_ANIMS.LEFT
        ) {
          this.player.anims.play('stand-left', true)
          this.player.flipX = true
        }
      }

      if ((this.cursors.space.isDown && this.cursors.shift.isUp) || gamepad.A) {
        this.player.anims.play(PLAYER_ANIMS.ATTACK1, true)
        this.player.setVelocityX(0)
        this.player.setSize(80)
      }
      if (
        (this.cursors.shift.isDown && this.cursors.space.isDown) ||
        gamepad.B
      ) {
        this.player.setVelocityX(0)
        this.player.anims.play(PLAYER_ANIMS.ATTACK2, true)
        this.player.setSize(80)
      }
    }
  }
}
