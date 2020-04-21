import Phaser from 'phaser'
import { ENEMY_KEYS, DEATH_ANIM_KEY, ENEMY_HP } from '../utils/constants'

const BANDIT_ANIM_KEYS = {
  IDLE: 'bandit-idle',
  RUN: 'bandit-run',
  HURT: 'bandit-hurt',
  ATTACK: 'bandit-attack',
  COMBAT_IDLE: 'bandit-combat-idle',
}

export default class Bandit extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, ENEMY_KEYS.BANDIT)
    // this.setCollideWorldBounds(true)
    scene.add.existing(this)
    this.KEY = ENEMY_KEYS.BANDIT
    this.HP = ENEMY_HP[ENEMY_KEYS.BANDIT]

    // 3.3

    scene.physics.world.enableBody(this)

    const animationCompleteHandler = function (event, character, deets) {
      console.info('Bandit Animation Complete', event)

      if (event.key === DEATH_ANIM_KEY) {
        console.info('Bandit Die Now Please')
        this.destroy()
      }
      if (event.key === BANDIT_ANIM_KEYS.HURT) {
        this.anims.play(BANDIT_ANIM_KEYS.COMBAT_IDLE)
      }
    }

    this.on('animationcomplete', animationCompleteHandler, this)

    scene.enemies.add(this)

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
    // HeavyBandit_Hurt_0
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
    console.info('the bandit has been hit')
    this.anims.play(BANDIT_ANIM_KEYS.HURT)
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
      this.anims.play(BANDIT_ANIM_KEYS.ATTACK)
    } else if (
      dist < 200 &&
      dist > 100 &&
      this.anims.currentAnim.key !== BANDIT_ANIM_KEYS.RUN
    ) {
      this.anims.play(BANDIT_ANIM_KEYS.RUN)
      this.body.setVelocityX(-55)
    } else if (
      dist < 350 &&
      dist > 200 &&
      this.anims.currentAnim.key !== BANDIT_ANIM_KEYS.COMBAT_IDLE
    ) {
      this.anims.play(BANDIT_ANIM_KEYS.COMBAT_IDLE)
    } else if (
      dist > 350 &&
      this.anims.currentAnim.key !== BANDIT_ANIM_KEYS.IDLE
    ) {
      this.anims.play(BANDIT_ANIM_KEYS.IDLE)
    }
  }
}
