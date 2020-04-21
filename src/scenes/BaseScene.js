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
      enemy.HP = enemy.HP - 1
      if (enemy.HP === 0) {
        this.dieNow(enemy)
      } else {
        if (enemy.beenHit) {
          enemy.beenHit(player)
        }
        enemy.body.setVelocity(0, 0)
        enemy.setX(enemy.x + 20)
        enemy.alpha = 0
        const tw = this.tweens.add({
          targets: enemy,
          alpha: 1,
          duration: 100,
          ease: 'Linear',
          repeat: 5,
        })
      }
    } else {
      if (enemy.playerHit) {
        enemy.playerHit(player)
      }
      player.body.setVelocity(0, 0)
      player.setX(player.x - 10)

      player.play(PLAYER_ANIMS.HIT, true)

      enemy.body.setVelocity(0, 0)
      enemy.setX(enemy.x + 50)
    }
  }

  dieNow(gameObject) {
    if (gameObject.DEAD) return
    const boom = function (event, character, deets) {
      console.info('Kah BOOM?', event)
      if (event.key === DEATH_ANIM_KEY) {
        gameObject.destroy()
      }
    }
    gameObject.body.setVelocityX(0)

    gameObject.setTexture(ENEMY_KEYS.DIE)

    console.info('fall down, go boom')
    gameObject.DEAD = true
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
}
