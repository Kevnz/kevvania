import Phaser from 'phaser'
import { ENEMY_KEYS, DEATH_ANIM_KEY, ENEMY_HP } from '../utils/constants'

export default class FlamingSkull extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, ENEMY_KEYS.FLAMING_SKULL)
    this.BEING_HIT = false
    // this.setCollideWorldBounds(true)
    scene.add.existing(this)
    this.KEY = ENEMY_KEYS.FLAMING_SKULL
    this.HIT_POINTS = ENEMY_HP[ENEMY_KEYS.FLAMING_SKULL]

    // 3.3
    this.play('float')
    scene.physics.world.enableBody(this)
    this.body.velocity.y = -250
    this.body.setSize(24, 64, true)
    const animationCompleteHandler = function (event, character, deets) {
      console.info('Flaming Skull Animation Complete', event)

      if (event.key === DEATH_ANIM_KEY) {
        console.info('Skull Now Please')
        this.destroy()
      }
    }
    this.anims.play('float', true)
    this.on('animationcomplete', animationCompleteHandler, this)
  }

  update(player) {
    const dist = Phaser.Math.Distance.Between(
      player.x,
      player.y,
      this.x,
      this.y
    )
    if (dist < 250 && this.x > player.x && dist > 125) {
      this.body.setVelocityX(-15)
      this.flipX = false
    } else if (dist < 2500 && this.x < player.x && dist > 125) {
      this.body.setVelocityX(15)
      this.flipX = true
    } else if (dist < 125 && this.x > player.x) {
      this.body.setVelocityX(-55)
      this.flipX = false
    } else if (this.x < player.x && dist < 125) {
      this.body.setVelocityX(55)
      this.flipX = true
    } else {
      this.body.setVelocityX(0)
    }
  }
}
