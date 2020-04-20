import Phaser from 'phaser'
import { ENEMY_KEYS, DEATH_ANIM_KEY } from '../utils/constants'

export default class HellCat extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, ENEMY_KEYS.HELLCAT)
    // this.setCollideWorldBounds(true)
    scene.add.existing(this)
    scene.physics.world.enableBody(this)
    this.body.setCollideWorldBounds(true)

    scene.enemies.add(this)

    this.KEY = ENEMY_KEYS.HELLCAT
    this.HP = 1 // ENEMY_HP[key]

    scene.anims.create({
      key: 'catwalk',
      frames: scene.anims.generateFrameNumbers(ENEMY_KEYS.HELLCAT, {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    })

    const animComplete = function (event, character, deets) {
      console.info('Hellcat Animation Complete', event)
    }

    this.on('animationcomplete', animComplete, this)

    scene.enemies.add(this)
  }

  update(player) {
    // console.log('here kitty kitty')
    if (this === null) {
      console.log('no kitty')
      return
    }
    if (this.anims === undefined) {
      console.log('no kitty')
      return
    }
    if (!this.anims.currentAnim) {
      console.log('stay')
      this.anims.play(`catwalk`, true)
    }
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

    if (dist < 350 && this.x > this.player.x) {
      console.info('here kitty kitty')
      this.anims.play('catwalk', true)
      this.body.setVelocityX(-45)
    } else if (dist < 350 && this.x < this.player.x) {
      this.body.setVelocityX(45)
      this.body.flipX = true
    }
  }
}
