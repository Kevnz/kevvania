import Phaser from 'phaser'
import { ENEMY_KEYS, DEATH_ANIM_KEY, ENEMY_HP } from '../utils/constants'

const SKELETON_WARRIOR_ANIM_KEYS = {
  IDLE: 'sw-idle',
  RUN: 'sw-run',
  HURT: 'sw-hurt',
  ATTACK: 'sw-attack',
  ATTACK2: 'sw-attack2',
  DEAD: 'sw-attack',
  WALK: 'sw-walk',
}

export default class SleletalWarrior extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, ENEMY_KEYS.SKELETON_WARRIOR)

    scene.add.existing(this)
    this.KEY = ENEMY_KEYS.SKELETON_WARRIOR
    this.HIT_POINTS = ENEMY_HP[ENEMY_KEYS.SKELETON_WARRIOR]
    this.BEING_HIT = false
    const readyFrameNames = scene.anims.generateFrameNames(
      ENEMY_KEYS.SKELETON_WARRIOR,
      {
        start: 1,
        end: 3,
        zeroPad: 0,
        prefix: 'ready_',
        suffix: '.png',
      }
    )
    const walkFrameNames = scene.anims.generateFrameNames(
      ENEMY_KEYS.SKELETON_WARRIOR,
      {
        start: 1,
        end: 6,
        zeroPad: 0,
        prefix: 'walk_',
        suffix: '.png',
      }
    )

    scene.anims.create({
      key: SKELETON_WARRIOR_ANIM_KEYS.IDLE,
      frames: readyFrameNames,
      frameRate: 6,
      repeat: -1,
    })
    scene.anims.create({
      key: SKELETON_WARRIOR_ANIM_KEYS.WALK,
      frames: walkFrameNames,
      frameRate: 6,
      repeat: -1,
    })

    scene.physics.world.enableBody(this)
    this.setScale(1.35, 1.35)
    this.flipX = true
    this.body.setSize(22, 30)

    this.body.setOffset(12, 13)
    const animationCompleteHandler = function (event, character, deets) {
      if (event.key === DEATH_ANIM_KEY) {
        console.info('Skeleton Warrior Die Now Please')
        this.destroy()
      }
      if (
        this.HIT_POINTS === 0 &&
        event.key === SKELETON_WARRIOR_ANIM_KEYS.HURT
      ) {
        this.anims.play(DEATH_ANIM_KEY)
      } else if (event.key === SKELETON_WARRIOR_ANIM_KEYS.HURT) {
        this.BEING_HIT = false
        this.anims.play(SKELETON_WARRIOR_ANIM_KEYS.IDLE)
      }
    }

    this.on('animationcomplete', animationCompleteHandler, this)

    const runFrameNames = scene.anims.generateFrameNames(
      ENEMY_KEYS.SKELETON_WARRIOR,
      {
        start: 1,
        end: 6,
        zeroPad: 0,
        prefix: 'run_',
        suffix: '.png',
      }
    )
    const attackFrameNames = scene.anims.generateFrameNames(
      ENEMY_KEYS.SKELETON_WARRIOR,
      {
        start: 1,
        end: 6,
        zeroPad: 0,
        prefix: 'attack1_',
        suffix: '.png',
      }
    )
    const attack2FrameNames = scene.anims.generateFrameNames(
      ENEMY_KEYS.SKELETON_WARRIOR,
      {
        start: 1,
        end: 6,
        zeroPad: 0,
        prefix: 'attack2_',
        suffix: '.png',
      }
    )

    const hurtFrameNames = scene.anims.generateFrameNames(
      ENEMY_KEYS.SKELETON_WARRIOR,
      {
        start: 1,
        end: 3,
        zeroPad: 0,
        prefix: 'hit_',
        suffix: '.png',
      }
    )
    const deadFrameNames = scene.anims.generateFrameNames(
      ENEMY_KEYS.SKELETON_WARRIOR,
      {
        start: 1,
        end: 6,
        zeroPad: 0,
        prefix: 'dead_near_',
        suffix: '.png',
      }
    )

    scene.anims.create({
      key: SKELETON_WARRIOR_ANIM_KEYS.RUN,
      frames: runFrameNames,
      frameRate: 6,
      repeat: -1,
    })
    scene.anims.create({
      key: SKELETON_WARRIOR_ANIM_KEYS.ATTACK,
      frames: attackFrameNames,
      frameRate: 6,
      repeat: -1,
    })

    scene.anims.create({
      key: SKELETON_WARRIOR_ANIM_KEYS.ATTACK2,
      frames: attack2FrameNames,
      frameRate: 6,
      repeat: -1,
    })

    scene.anims.create({
      key: SKELETON_WARRIOR_ANIM_KEYS.HURT,
      frames: hurtFrameNames,
      frameRate: 6,
      repeat: 1,
    })
    scene.anims.create({
      key: SKELETON_WARRIOR_ANIM_KEYS.DEAD,
      frames: deadFrameNames,
      frameRate: 6,
      repeat: 0,
    })
    this.anims.play(SKELETON_WARRIOR_ANIM_KEYS.IDLE)
  }

  beenHit(player) {
    if (this.anims.currentAnim.key === 'please-die') return
    this.anims.play(SKELETON_WARRIOR_ANIM_KEYS.HURT)
  }

  update(player) {
    if (this.anims.currentAnim.key === SKELETON_WARRIOR_ANIM_KEYS.HURT) return

    if (this.anims.currentAnim.key === SKELETON_WARRIOR_ANIM_KEYS.ATTACK) {
      this.body.setSize(55, 30)
      this.body.setOffset(20, 30)
    }
    if (this.anims.currentAnim.key === SKELETON_WARRIOR_ANIM_KEYS.RUN) {
      this.body.setSize(22, 30)

      this.body.setOffset(12, 13)
    }
    if (this.anims.currentAnim.key === SKELETON_WARRIOR_ANIM_KEYS.WALK) {
      this.body.setSize(22, 30)

      this.body.setOffset(12, 13)
    }

    const dist = Phaser.Math.Distance.Between(
      player.x,
      player.y,
      this.x,
      this.y
    )

    if (
      dist < 100 &&
      this.anims.currentAnim.key !== SKELETON_WARRIOR_ANIM_KEYS.ATTACK
    ) {
      this.body.setVelocityX(0)
      this.anims.play(SKELETON_WARRIOR_ANIM_KEYS.ATTACK)
    } else if (
      dist < 200 &&
      dist > 100 &&
      this.anims.currentAnim.key !== SKELETON_WARRIOR_ANIM_KEYS.RUN
    ) {
      this.anims.play(SKELETON_WARRIOR_ANIM_KEYS.RUN)
      this.body.setVelocityX(-55)
    } else if (
      dist < 350 &&
      dist > 200 &&
      this.anims.currentAnim.key !== SKELETON_WARRIOR_ANIM_KEYS.IDLE
    ) {
      this.anims.play(SKELETON_WARRIOR_ANIM_KEYS.IDLE)
    } else if (
      dist > 350 &&
      this.anims.currentAnim.key !== SKELETON_WARRIOR_ANIM_KEYS.IDLE
    ) {
      this.anims.play(SKELETON_WARRIOR_ANIM_KEYS.IDLE)
    }
  }
}
