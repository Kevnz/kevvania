/* eslint-disable spellcheck/spell-checker */
import Phaser from 'phaser'
import Player, { PLAYER_KEY, PLAYER_ANIMS } from '../entities/player'
import Skeleton from '../entities/skeleton'
import Hellcat from '../entities/hellcat'
import HellCat from '../entities/hellcat'

const DEATH_ANIM_KEY = 'please-die'

const ENEMY_KEYS = {
  HELLCAT: 'hellcat',
  SKELETON: 'skeleton',
  SKELETON_BOSS: 'skeleton-boss',
  BAT: 'bat-flat',
  WOLF: 'wolf',
  DIE: 'death',
}
const ENEMY_HP = {
  [ENEMY_KEYS.SKELETON_BOSS]: 5,
  [ENEMY_KEYS.SKELETON]: 1,
  [ENEMY_KEYS.HELLCAT]: 1,
}
export default class BaseScene extends Phaser.Scene {
  constructor(args) {
    super(args)
  }

  createPlayer() {
    return new Player(this, 100, 150)
  }

  //
  createSkeleton(x, y, key = ENEMY_KEYS.SKELETON) {
    new Skeleton(this, x, y, key)
  }

  createSkeletonOld(x, y, key = ENEMY_KEYS.SKELETON) {
    const skeleton = this.physics.add.sprite(x, y, key)
    skeleton.KEY = key
    skeleton.HP = ENEMY_HP[key]
    skeleton.setCollideWorldBounds(true)

    this.anims.create({
      key: `${key}-walk`,
      frames: this.anims.generateFrameNumbers(key, {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: `${key}-stay`,
      frames: this.anims.generateFrameNumbers(key, {
        start: 8,
        end: 9,
      }),
      frameRate: 2,
      repeat: -1,
    })
    this.anims.create({
      key: `${key}-rise`,
      frames: this.anims.generateFrameNumbers(key, {
        start: 8,
        end: 14,
      }),
      frameRate: 10,
      repeat: 0,
    })

    skeleton.body.setSize(12, 8)

    skeleton.body.setOffset(10, 43)

    const animComplete = function (event, character, deets) {
      if (event.key === `${key}-rise`) {
        skeleton.anims.play(`${key}-walk`, true)
        skeleton.body.setSize()
        skeleton.setVelocityX(-10)
      }
    }

    skeleton.on('animationcomplete', animComplete, this)

    return skeleton
  }

  createHellcat(x, y) {
    new HellCat(this, x, y, ENEMY_KEYS.HELLCAT)
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

  playerHit(player, enemy) {
    console.info('player hit')

    if (
      player.anims.currentAnim.key === PLAYER_ANIMS.ATTACK1 ||
      player.anims.currentAnim.key === PLAYER_ANIMS.ATTACK2 ||
      player.anims.currentAnim.key === PLAYER_ANIMS.ATTACK3
    ) {
      this.dieNow(enemy)
    } else {
      player.body.setVelocity(0, 0)
      player.setX(player.x - 50)

      player.play(PLAYER_ANIMS.HIT, true)

      enemy.body.setVelocity(0, 0)
      enemy.setX(enemy.x - 50)
    }
  }

  dieNow2(gameObject) {
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

  dieNow(gameObject) {
    const boom = function (event, character, deets) {
      console.info('Kah BOOM?', event)
      if (event.key === DEATH_ANIM_KEY) {
        gameObject.destroy()
      }
    }
    gameObject.body.setVelocityX(0)

    gameObject.setTexture(ENEMY_KEYS.DIE)

    console.info('fall down, go boom')

    gameObject.play(DEATH_ANIM_KEY)
    gameObject.once('animationcomplete', boom, this)
  }

  create() {
    this.input.gamepad.on(
      'down',
      function (pad, button, index) {
        if (button.index === 9) {
          this.scene.launch('pause-scene', { pausedScene: this.scene.key })
          this.scene.pause()
        }
      },
      this
    )
  }

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
