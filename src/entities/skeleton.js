import Phaser from 'phaser'
import { ENEMY_KEYS, ENEMY_HP } from '../utils/constants'
console.log('enemey hp', ENEMY_HP)
export default class Skeleton extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key = ENEMY_KEYS.SKELETON) {
    super(scene, x, y, key)

    scene.add.existing(this)

    scene.physics.world.enableBody(this)

    this.body.setCollideWorldBounds(true)

    this.KEY = key
    this.HP = ENEMY_HP[key]
    scene.anims.create({
      key: `${key}-walk`,
      frames: scene.anims.generateFrameNumbers(key, {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    })

    scene.anims.create({
      key: `${key}-stay`,
      frames: scene.anims.generateFrameNumbers(key, {
        start: 8,
        end: 9,
      }),
      frameRate: 2,
      repeat: -1,
    })
    scene.anims.create({
      key: `${key}-rise`,
      frames: scene.anims.generateFrameNumbers(key, {
        start: 8,
        end: 14,
      }),
      frameRate: 10,
      repeat: 0,
    })

    if (key === ENEMY_KEYS.SKELETON) {
      this.body.setSize(12, 8)
      this.body.setOffset(10, 43)
    }
    const animComplete = function (event, character, deets) {
      if (event.key === `${key}-rise`) {
        this.anims.play(`${key}-walk`, true)
        this.body.setSize()
        this.body.setVelocityX(-10)
        console.info('walk')
      }
    }

    this.on('animationcomplete', animComplete, this)

    scene.enemies.add(this)
  }

  startCyle() { }

  update(player) {
    if (this === null) return
    if (this.anims === undefined) {
      return
    }

    if (!this.anims.currentAnim) {
      console.log('stay')
      this.anims.play(`${this.KEY || ENEMY_KEYS.SKELETON}-stay`, true)
    }

    const dist = Phaser.Math.Distance.Between(
      player.x,
      player.y,
      this.x,
      this.y
    )

    if (
      dist < 150 &&
      this.anims.currentAnim.key === `${this.KEY || ENEMY_KEYS.SKELETON}-stay`
    ) {
      this.anims.play(`${this.KEY || ENEMY_KEYS.SKELETON}-rise`, true)
      this.flipX = false
    } else if (dist < 150 && this.x > player.x) {
      this.flipX = false
      this.body.setVelocityX(-10)
    } else if (dist < 150 && this.x < player.x) {
      this.body.setVelocityX(10)
      this.flipX = true
    } else {
      this.body.setVelocityX(0)
    }
  }
}
