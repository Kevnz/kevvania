import Phaser from 'phaser'
import { ENEMY_KEYS, ENEMY_HP } from '../utils/constants'

export default class HellCat extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, ENEMY_KEYS.HELLCAT)

    scene.add.existing(this)
    scene.physics.world.enableBody(this)
    this.body.setCollideWorldBounds(true)

    scene.enemies.add(this)
    this.BEING_HIT = false
    this.KEY = ENEMY_KEYS.HELLCAT
    this.HIT_POINTS = ENEMY_HP[ENEMY_KEYS.HELLCAT]

    scene.anims.create({
      key: 'catwalk',
      frames: scene.anims.generateFrameNumbers(ENEMY_KEYS.HELLCAT, {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    })

    scene.enemies.add(this)
  }

  ifNoAnimationPlay() {
    if (!this.anims.currentAnim) {
      this.anims.play(`catwalk`, true)
    }
  }

  ifPlayerIsCloseOnTheLeft(distance, player) {
    if (distance < 250 && this.x > player.x && distance > 125) {
      console.info('ifPlayerIsCloseOnTheLeft')
      this.body.setVelocityX(-15)
      this.flipX = false
    }
  }

  ifPlayerIsCloseOnTheRight(distance, player) {
    if (distance < 250 && this.x < player.x && distance > 125) {
      console.info('ifPlayerIsCloseOnTheRight')
      this.body.setVelocityX(15)
      this.flipX = true
    }
  }

  ifPlayerIsNearOnTheLeft(distance, player) {
    if (distance < 125 && this.x > player.x) {
      console.info('ifPlayerIsNearOnTheLeft')
      this.body.setVelocityX(-55)

      this.flipX = false
    }
  }

  ifPlayerIsNearOnTheRight(distance, player) {
    if (distance < 125 && this.x < player.x) {
      this.body.setVelocityX(55)
      this.flipX = true
    }
  }

  ifPlayerIsComing(distance, player) {
    if (distance < 350 && distance > 250 && this.x > player.x) {
      this.body.setVelocityX(-45)
    } else if (distance < 350 && distance > 250 && this.x < this.player.x) {
      this.body.setVelocityX(45)
      this.body.flipX = true
    }
  }

  update(player) {
    if (this === null) {
      return
    }
    if (this.DEAD) return
    if (this.anims === undefined) {
      return
    }
    this.ifNoAnimationPlay()
    const dist = Phaser.Math.Distance.Between(
      player.x,
      player.y,
      this.x,
      this.y
    )

    this.ifPlayerIsComing(dist, player)

    this.ifPlayerIsNearOnTheLeft(dist, player)
    this.ifPlayerIsNearOnTheRight(dist, player)

    this.ifPlayerIsCloseOnTheLeft(dist, player)
    this.ifPlayerIsCloseOnTheRight(dist, player)
    if (dist > 350) {
      this.body.setVelocityX(0)
    }
  }
}
