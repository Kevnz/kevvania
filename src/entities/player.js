import Phaser from 'phaser'

export const PLAYER_KEY = 'player'

export const PLAYER_ANIMS = {
  RUN: 'run',
  IDLE: 'idle',
  BLOCK: 'block',
  DEATH: 'death',
  JUMP: 'jump',
  ATTACK1: 'attack1',
  ATTACK2: 'attack2',
  ATTACK3: 'attack3',
  HIT: 'hit',
}

export default class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, PLAYER_KEY)
    this.BEING_HIT = false
    this.HIT_POINTS = 20
    scene.physics.world.enableBody(this)
    this.body.setCollideWorldBounds(true)
    this.body.setSize(34, 48, true)
    this.body.setBounce(0.1)
    scene.add.existing(this)
    scene.anims.create({
      key: PLAYER_ANIMS.RUN,
      frames: scene.anims.generateFrameNumbers(PLAYER_KEY, {
        start: 8,
        end: 17,
      }),
      frameRate: 10,
      repeat: -1,
    })

    scene.anims.create({
      key: PLAYER_ANIMS.IDLE,
      frames: scene.anims.generateFrameNumbers(PLAYER_KEY, {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    })

    scene.anims.create({
      key: PLAYER_ANIMS.ATTACK1,
      frames: scene.anims.generateFrameNumbers(PLAYER_KEY, {
        start: 18,
        end: 23,
      }),
      frameRate: 10,
      repeat: 0,
    })
    scene.anims.create({
      key: PLAYER_ANIMS.ATTACK2,
      frames: scene.anims.generateFrameNumbers(PLAYER_KEY, {
        start: 23,
        end: 29,
      }),
      frameRate: 10,
      repeat: 0,
    })
    scene.anims.create({
      key: PLAYER_ANIMS.ATTACK3,
      frames: scene.anims.generateFrameNumbers(PLAYER_KEY, {
        start: 30,
        end: 37,
      }),
      frameRate: 10,
      repeat: 0,
    })

    scene.anims.create({
      key: PLAYER_ANIMS.HIT,
      frames: scene.anims.generateFrameNumbers(PLAYER_KEY, {
        start: 45,
        end: 47,
      }),
      frameRate: 10,
      repeat: 2,
    })

    const animComplete = function (event, character, deets) {
      if (
        event.key === PLAYER_ANIMS.ATTACK2 ||
        event.key === PLAYER_ANIMS.ATTACK1 ||
        event.key === PLAYER_ANIMS.ATTACK3 ||
        event.key === PLAYER_ANIMS.HIT
      ) {
        this.anims.play(PLAYER_ANIMS.IDLE, true)
        this.body.setSize(34, 48, true)
        this.BEING_HIT = false
      } else if (event.key === PLAYER_ANIMS.HIT) {
        this.BEING_HIT = false
      } else {
      }
    }

    this.on('animationcomplete', animComplete, this)
  }

  update(scene) {
    if (scene.cursors.up.isDown && this.body.onFloor()) {
      this.body.setVelocityY(-100 + (scene.cursors.shift.isDown ? -30 : 0))
    }
    const isAttacking = () => {
      return (
        this?.anims?.currentAnim?.key === PLAYER_ANIMS.ATTACK1 ||
        this?.anims?.currentAnim?.key === PLAYER_ANIMS.ATTACK2 ||
        this?.anims?.currentAnim?.key === PLAYER_ANIMS.ATTACK3
      )
    }

    if (!isAttacking()) {
      const pads = scene.input.gamepad.gamepads
      const gamepad = pads[0] || { buttons: [] }

      if (scene.cursors.left.isDown || gamepad.left) {
        if (
          this.anims.currentAnim &&
          this.anims.currentAnim.key !== PLAYER_ANIMS.HIT
        ) {
          this.body.setVelocityX(-160)
          this.anims.play(PLAYER_ANIMS.RUN, true)
          this.flipX = true
        }
      } else if (scene.cursors.right.isDown || gamepad.right) {
        if (
          this.anims.currentAnim &&
          this.anims.currentAnim.key !== PLAYER_ANIMS.HIT
        ) {
          this.body.setVelocityX(360)
          this.anims.play(PLAYER_ANIMS.RUN, true)
          this.flipX = false
        }
      } else {
        this.body.setVelocityX(0)
        this.anims.play(PLAYER_ANIMS.IDLE, true)
      }

      if (
        (scene.cursors.space.isDown && scene.cursors.shift.isUp) ||
        gamepad.A
      ) {
        this.anims.play(PLAYER_ANIMS.ATTACK1, true)
        this.body.setVelocityX(0)
        this.body.setSize(80)
      }
      if (
        (scene.cursors.shift.isDown && scene.cursors.space.isDown) ||
        gamepad.B
      ) {
        this.body.setVelocityX(0)
        this.anims.play(PLAYER_ANIMS.ATTACK2, true)
        this.body.setSize(80)
      }

      if (gamepad.X) {
        this.body.setVelocityY(-100)
      }
    }
  }
}
