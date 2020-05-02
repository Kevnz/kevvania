/* eslint-disable spellcheck/spell-checker */
import Phaser from 'phaser'
import { PLAYER_KEY, PLAYER_ANIMS } from '../entities/player'
import FlamingSkull from '../entities/flaming-skull'
import {
  MAIN_BACKGROUND,
  CEMETERY_OBJECTS_KEY,
  CEMETERY_TILES_KEY,
  MAP_KEY,
  ENEMY_KEYS,
  DEATH_ANIM_KEY,
  SCENES,
} from '../utils/constants'
import BaseScene from './BaseScene'

export default class LevelOneScene extends BaseScene {
  constructor() {
    super(SCENES.LEVEL1)
    this.background = null
    this.enemies = null
  }

  preload() { }

  create() {
    super.create()
    const image = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      MAIN_BACKGROUND
    )
    const scaleX = this.cameras.main.width / image.width
    const scaleY = this.cameras.main.height / image.height
    const scale = Math.max(scaleX, scaleY)
    image.setScale(scale).setScrollFactor(0)

    this.cameras.main.setBounds(0, 0, 256 * 16, 16 * 16)
    this.physics.world.setBounds(0, 0, 256 * 16, 16 * 16)

    const map = this.make.tilemap({ key: MAP_KEY })
    const ground = map.addTilesetImage('cemetery', CEMETERY_TILES_KEY)
    const platforms = map.createStaticLayer('Platforms', ground, 0, 0)
    platforms.setCollisionByExclusion(-1, true)
    const objects = map.addTilesetImage('swamp objects', CEMETERY_OBJECTS_KEY)

    map.createStaticLayer('Background', ground, 0, 0)

    map.createStaticLayer('BigObjects', [ground, objects], 0, 0)
    map.createStaticLayer('BigObjects2', [ground, objects], 0, 0)

    this.player = this.createPlayer()

    this.physics.add.collider(this.player, platforms)

    this.cursors = this.input.keyboard.createCursorKeys()

    this.cameras.main.startFollow(this.player)

    this.myCam = this.cameras.main

    // making the camera follow the player
    this.myCam.startFollow(this.player)

    this.enemies = this.physics.add.group()
    this.anims.create({
      key: DEATH_ANIM_KEY,
      frames: this.anims.generateFrameNumbers(ENEMY_KEYS.DIE, {
        start: 0,
        end: 3,
      }),
      frameRate: 40,
      repeat: 0,
      onComplete: (t, targets, custom) => {
        // t.destroy()
      },
    })
    const skeletonObjects = map.getObjectLayer('Skeletons').objects
    const hellCatObjects = map.getObjectLayer('HellCats').objects
    const bossObjects = map.getObjectLayer('Boss').objects

    this.enemies = this.physics.add.group()

    skeletonObjects.forEach((skeletonObject, index) => {
      this.createSkeleton(skeletonObject.x, skeletonObject.y - 50)
    })

    bossObjects.forEach(skeletonObject => {
      this.createSkeleton(skeletonObject.x, 50, ENEMY_KEYS.SKELETON_BOSS)
    })

    hellCatObjects.forEach(hellCatObject => {
      this.createHellcat(
        hellCatObject.x,
        hellCatObject.y - hellCatObject.height - 148
      )
    })

    this.physics.add.collider(this.enemies, platforms)

    this.physics.add.collider(
      this.player,
      this.enemies,
      this.playerHit,
      null,
      this
    )
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.playerHit,
      null,
      this
    )

    this.music = this.sound.add('level-1-audio')

    this.music.play()
    this.music.setVolume(0.5)
  }

  update() {
    if (this.player.x > 256 * 16 - 100) {
      console.info('bounds???')
      this.scene.start('change-scene', { nextScene: SCENES.LEVEL2 })
    }

    if (this.cursors.up.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(-100 + (this.cursors.shift.isDown ? -30 : 0))
    }
    this.player.update(this)
    this.enemies.getChildren().forEach(enemy => {
      enemy.update(this.player)
    })
  }
}
