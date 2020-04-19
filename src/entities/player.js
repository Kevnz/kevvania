import Phaser from 'phaser'

export const PLAYER_KEY = 'player'

export const PLAYER_ANIMS = {
  RIGHT: 'right',
  LEFT: 'left',
  STAND_RIGHT: 'stand-right',
  STAND_LEFT: 'stand-left',
  ATTACK1: 'attack1',
  ATTACK2: 'attack2',
  ATTACK4: 'attack3',
  HIT: 'hit',
}

export default class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, PLAYER_KEY)

    scene.add.existing(this)
    scene.physics.world.enableBody(this)

    this.body.setSize(34, 48, true)
    this.body.setBounce(0.1)
    this.body.setCollideWorldBounds(true)

    scene.anims.create({
      key: PLAYER_ANIMS.LEFT,
      frames: scene.anims.generateFrameNumbers(PLAYER_KEY, {
        start: 8,
        end: 12,
      }),
      frameRate: 10,
      repeat: -1,
    })
    scene.anims.create({
      key: 'right',
      frames: scene.anims.generateFrameNumbers(PLAYER_KEY, {
        start: 8,
        end: 17,
      }),
      frameRate: 10,
      repeat: -1,
    })
    scene.anims.create({
      key: 'stand-right',
      frames: scene.anims.generateFrameNumbers(PLAYER_KEY, {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    })
    scene.anims.create({
      key: 'stand-left',
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
      console.info('Animation Event Complete', event)
      if (
        event.key === PLAYER_ANIMS.ATTACK2 ||
        event.key === PLAYER_ANIMS.ATTACK1 ||
        event.key === PLAYER_ANIMS.ATTACK3 ||
        event.key === PLAYER_ANIMS.HIT
      ) {
        this.anims.play('stand-right', true)
        this.body.setSize(34, 48, true)
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
        scene.anims.currentAnim &&
        scene.anims.currentAnim.key &&
        (scene.anims.currentAnim.key === PLAYER_ANIMS.ATTACK1 ||
          scene.anims.currentAnim.key === PLAYER_ANIMS.ATTACK2 ||
          scene.anims.currentAnim.key === PLAYER_ANIMS.ATTACK3)
      )
    }
    if (!isAttacking()) {
      const pads = scene.input.gamepad.gamepads
      const gamepad = pads[0] || { buttons: [] }

      if (gamepad.start) {
        console.info('START PRESSED')
      }
      if (gamepad.left) {
        console.log('left')
        console.log('scene.cursors.left.isDown', scene.cursors.left.isDown)
      }
      if (gamepad.right) {
        console.log('right')
      }

      if (scene.cursors.left.isDown || gamepad.left) {
        if (
          this.anims.currentAnim &&
          this.anims.currentAnim.key !== PLAYER_ANIMS.HIT
        ) {
          console.log('left')
          this.body.setVelocityX(-160)
          this.anims.play('left', true)
          this.flipX = true
        }
      } else if (scene.cursors.right.isDown || gamepad.right) {
        if (
          this.anims.currentAnim &&
          this.anims.currentAnim.key !== PLAYER_ANIMS.HIT
        ) {
          console.log('right')
          this.body.setVelocityX(360)
          this.anims.play('right', true)
          this.flipX = false
        }
      } else {
        this.body.setVelocityX(0)
        if (
          (this.anims.currentAnim &&
            this.anims.currentAnim.key === PLAYER_ANIMS.RIGHT) ||
          !this.anims.currentAnim
        ) {
          this.anims.play('stand-right', true)
          this.flipX = false
        } else if (
          this.anims.currentAnim &&
          this.anims.currentAnim.key === PLAYER_ANIMS.LEFT
        ) {
          this.anims.play('stand-left', true)
          this.flipX = true
        }
      }

      if (
        (scene.cursors.space.isDown && scene.cursors.shift.isUp) ||
        gamepad.A
      ) {
        console.log('scene in player', scene)
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
    }
  }
}
