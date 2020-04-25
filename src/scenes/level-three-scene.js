/* eslint-disable spellcheck/spell-checker */
import Phaser from 'phaser'
import { PLAYER_KEY, PLAYER_ANIMS } from '../entities/player'
import FlamingSkull from '../entities/flaming-skull'
import {
  MAIN_BACKGROUND,
  CEMETERY_OBJECTS_KEY,
  CEMETERY_TILES_KEY,
  MAP_KEY,
  LEVEL_3_MAP_KEY,
  ENEMY_KEYS,
  DEATH_ANIM_KEY,
  MAIN_CASTLE,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  FULL_WIDTH,
  FULL_HEIGHT,
  MAIN_CASTLE_DECORATIVE,
  MAIN_CASTLE_ENVIRONMENT,
  MAIN_CASTLE_WOOD,
} from '../utils/constants'
import BaseScene from './BaseScene'

export default class LevelOneScene extends BaseScene {
  constructor() {
    super('level-three')
    this.background = null
    this.enemies = null
  }

  preload() {
    this.load.image(MAIN_BACKGROUND, 'assets/images/backgrounds/moon.png')
    console.info(`Loaded ${MAIN_BACKGROUND}`)

    this.load.image(MAIN_CASTLE, 'assets/images/tiles/main_lev_build.png')
    this.load.image(
      MAIN_CASTLE_DECORATIVE,
      'assets/images/tiles/other_and_decorative.png'
    )
    this.load.image(
      MAIN_CASTLE_ENVIRONMENT,
      'assets/images/tiles/environment-objects.png'
    )
    this.load.image(MAIN_CASTLE_WOOD, 'assets/images/tiles/wood_env.png')

    this.load.tilemapTiledJSON(LEVEL_3_MAP_KEY, 'assets/tiled/level-3.json')
    console.info(`Loaded ${LEVEL_3_MAP_KEY}`)
    this.load.spritesheet(PLAYER_KEY, 'assets/images/entities/HeroKnight.png', {
      frameWidth: 100,
      frameHeight: 55,
    })
    console.info(`Loaded ${PLAYER_KEY}`)
    this.load.spritesheet(
      ENEMY_KEYS.SKELETON,
      'assets/images/entities/skeleton.png',
      {
        frameWidth: 44,
        frameHeight: 52,
      }
    )
    console.info(`Loaded ${ENEMY_KEYS.SKELETON}`)
    this.load.spritesheet(
      ENEMY_KEYS.SKELETON_BOSS,
      'assets/images/entities/skeleton-large.png',
      {
        frameWidth: 44 * 3,
        frameHeight: 52 * 3,
      }
    )
    this.load.spritesheet(
      ENEMY_KEYS.HELLCAT,
      'assets/images/entities/hell-cat.png',
      {
        frameWidth: 96,
        frameHeight: 53,
      }
    )
    this.load.spritesheet(ENEMY_KEYS.DIE, 'assets/images/entities/death.png', {
      frameWidth: 44,
      frameHeight: 52,
    })
  }

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

    const map = this.make.tilemap({ key: LEVEL_3_MAP_KEY })
    const castleTiles = map.addTilesetImage(MAIN_CASTLE, MAIN_CASTLE)
    const castleDeco = map.addTilesetImage('decorative', MAIN_CASTLE_DECORATIVE)
    const castleWood = map.addTilesetImage('wood', MAIN_CASTLE_WOOD)
    const castleEnv = map.addTilesetImage(
      MAIN_CASTLE_ENVIRONMENT,
      MAIN_CASTLE_ENVIRONMENT
    )
    const layers = [castleTiles, castleDeco, castleWood, castleEnv]
    map.createStaticLayer('Higher', layers, 0, 0)
    map.createStaticLayer('Background', layers, 0, 0)

    map.createStaticLayer('Ladder', layers, 0, 0)
    map.createStaticLayer('Windows', layers, 0, 0)
    const platforms = map.createStaticLayer('Platforms', layers, 0, 0)
    platforms.setCollisionByExclusion(-1, true)

    // map.createStaticLayer('Background', layers, 0, 0)
    // map.createStaticLayer('Windows', layers, 0, 0)
    this.player = this.createPlayer()

    this.physics.add.collider(this.player, platforms)

    this.cursors = this.input.keyboard.createCursorKeys()

    this.cameras.main.startFollow(this.player)

    this.myCam = this.cameras.main

    // making the camera follow the player
    this.myCam.startFollow(this.player)
  }

  update() {
    if (this.player.x > 256 * 16 - 100) {
      console.info('bounds???')
      this.scene.start('change-scene')
    }

    if (this.cursors.up.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(-100 + (this.cursors.shift.isDown ? -30 : 0))
    }
    this.player.update(this)
  }
}
