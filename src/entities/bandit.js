import Phaser from 'phaser'
import { ENEMY_KEYS, DEATH_ANIM_KEY, ENEMY_HP } from '../utils/constants'

const BANDIT_ANIM_KEYS = {
  IDLE: 'bandit-idle',
  RUN: 'bandit-run',
  HURT: 'bandit-hurt',
  ATTACK: 'bandit-attack',
  COMBAT_IDLE: 'bandit-combat-idle',
}
const BANDIT_STATES = Object.assign({}, BANDIT_ANIM_KEYS, {
  DEAD: 'bandit-dead',
})

export default class Bandit extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, ENEMY_KEYS.BANDIT)

    scene.add.existing(this)
    this.KEY = ENEMY_KEYS.BANDIT
    this.HIT_POINTS = ENEMY_HP[ENEMY_KEYS.BANDIT]
    this.BEING_HIT = false
    this.STATE = BANDIT_STATES.IDLE

    scene.physics.world.enableBody(this)

    const animationCompleteHandler = function (event, character, deets) {
      console.info('animation comp handler')
      if (event.key === DEATH_ANIM_KEY) {
        console.info('Bandit Die Now Please')
        this.destroy()
      }
      if (this.HIT_POINTS < 1 && event.key === BANDIT_ANIM_KEYS.HURT) {
        this.anims.play(DEATH_ANIM_KEY)
        this.BEING_HIT = false
      } else if (event.key === BANDIT_ANIM_KEYS.HURT) {
        this.BEING_HIT = false
        this.anims.play(BANDIT_ANIM_KEYS.COMBAT_IDLE)
      }
    }
    const animationStartHandler = function (animation, frame, entity) {
      console.info('animation start handler')

      if (animation.key === BANDIT_ANIM_KEYS.ATTACK) {
        this.STATE = BANDIT_STATES.ATTACK
      }
      if (animation.key === BANDIT_ANIM_KEYS.HURT) {
        this.STATE = BANDIT_STATES.HURT
      }
    }

    this.on('animationcomplete', animationCompleteHandler, this)
    this.on('animationstart', animationStartHandler, this)
    this.setScale(1.25, 1.25)

    const idleFrameNames = scene.anims.generateFrameNames(ENEMY_KEYS.BANDIT, {
      start: 0,
      end: 3,
      zeroPad: 0,
      prefix: 'HeavyBandit_Idle_',
      suffix: '.png',
    })
    const runFrameNames = scene.anims.generateFrameNames(ENEMY_KEYS.BANDIT, {
      start: 0,
      end: 6,
      zeroPad: 0,
      prefix: 'HeavyBandit_Run_',
      suffix: '.png',
    })
    const attackFrameNames = scene.anims.generateFrameNames(ENEMY_KEYS.BANDIT, {
      start: 0,
      end: 7,
      zeroPad: 0,
      prefix: 'HeavyBandit_Attack_',
      suffix: '.png',
    })
    const combatIdleFrameNames = scene.anims.generateFrameNames(
      ENEMY_KEYS.BANDIT,
      {
        start: 0,
        end: 3,
        zeroPad: 0,
        prefix: 'HeavyBandit_CombatIdle_',
        suffix: '.png',
      }
    )

    const hurtFrameNames = scene.anims.generateFrameNames(ENEMY_KEYS.BANDIT, {
      start: 0,
      end: 3,
      zeroPad: 0,
      prefix: 'HeavyBandit_Hurt_',
      suffix: '.png',
    })
    scene.anims.create({
      key: BANDIT_ANIM_KEYS.IDLE,
      frames: idleFrameNames,
      frameRate: 6,
      repeat: -1,
    })
    scene.anims.create({
      key: BANDIT_ANIM_KEYS.RUN,
      frames: runFrameNames,
      frameRate: 6,
      repeat: -1,
    })
    scene.anims.create({
      key: BANDIT_ANIM_KEYS.ATTACK,
      frames: attackFrameNames,
      frameRate: 6,
      repeat: -1,
    })
    scene.anims.create({
      key: BANDIT_ANIM_KEYS.COMBAT_IDLE,
      frames: combatIdleFrameNames,
      frameRate: 6,
      repeat: -1,
    })
    scene.anims.create({
      key: BANDIT_ANIM_KEYS.HURT,
      frames: hurtFrameNames,
      frameRate: 6,
      repeat: 1,
    })
    this.anims.play(BANDIT_ANIM_KEYS.IDLE)
  }

  beenHit(player) {
    if (this.anims.currentAnim.key === 'please-die') return
    this.anims.play(BANDIT_ANIM_KEYS.HURT)
  }

  hasDeath() {
    return true
  }

  update(player) {
    if (this.anims.currentAnim.key === BANDIT_ANIM_KEYS.HURT) return

    const dist = Phaser.Math.Distance.Between(
      player.x,
      player.y,
      this.x,
      this.y
    )

    if (dist < 50 && this.anims.currentAnim.key !== BANDIT_ANIM_KEYS.ATTACK) {
      this.body.setVelocityX(0)
      this.STATE = BANDIT_STATES.ATTACK
      this.anims.play(BANDIT_ANIM_KEYS.ATTACK)
    } else if (
      dist < 200 &&
      dist > 100 &&
      this.anims.currentAnim.key !== BANDIT_ANIM_KEYS.RUN
    ) {
      this.anims.play(BANDIT_ANIM_KEYS.RUN)
      this.STATE = BANDIT_STATES.RUN
      this.body.setVelocityX(-55)
    } else if (
      dist < 350 &&
      dist > 200 &&
      this.anims.currentAnim.key !== BANDIT_ANIM_KEYS.COMBAT_IDLE
    ) {
      this.STATE = BANDIT_STATES.IDLE
      this.anims.play(BANDIT_ANIM_KEYS.COMBAT_IDLE)
    } else if (
      dist > 350 &&
      this.anims.currentAnim.key !== BANDIT_ANIM_KEYS.IDLE
    ) {
      this.STATE = BANDIT_STATES.IDLE
      this.anims.play(BANDIT_ANIM_KEYS.IDLE)
    }
  }
}
