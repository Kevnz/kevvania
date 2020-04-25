/* eslint-disable spellcheck/spell-checker */
import Phaser from 'phaser'
import { PLAYER_KEY, PLAYER_ANIMS } from '../entities/player'
import FlamingSkull from '../entities/flaming-skull'
import SkeletonWarrior from '../entities/skeletal-warrior'
import Bandit from '../entities/bandit'
import {
  MAIN_BACKGROUND,
  CEMETERY_OBJECTS_KEY,
  STONE_ANGEL_KEY,
  CHURCH_TILES_KEY,
  ENV_TILES_KEY,
  TWILIGHT_BW_TILES,
  LEVEL_2_MAP_KEY,
  ENEMY_KEYS,
  DEATH_ANIM_KEY,
  CASTLE_EXTERIOR_KEY,
} from '../utils/constants'
import BaseScene from './BaseScene'

export default class LevelTwoScene extends BaseScene {
  constructor() {
    super('level-two')
    this.enemies = null
  }

  createFlamingSkull(x, y) {
    const f = new FlamingSkull(this, x, y)
    this.enemies.add(f)
  }

  createSkeletonWarriors(x, y) {
    const f = new SkeletonWarrior(this, x, y)
    this.enemies.add(f)
  }

  createBandit(x, y) {
    const b = new Bandit(this, x, y)
    this.enemies.add(b)
  }

  preload() {
    console.info('level 2 preload')
    this.load.image(MAIN_BACKGROUND, 'assets/images/backgrounds/moon.png')
    this.load.image(
      CEMETERY_OBJECTS_KEY,
      'assets/images/tiles/cemetery-objects.png'
    )
    this.load.image(STONE_ANGEL_KEY, 'assets/images/tiles/stone-angel.png')
    this.load.image(CHURCH_TILES_KEY, 'assets/images/tiles/church-tileset.png')
    this.load.image(ENV_TILES_KEY, 'assets/images/tiles/env-tiles.png')
    this.load.image(
      TWILIGHT_BW_TILES,
      'assets/images/tiles/twilight-bw-tiles.png'
    )
    this.load.image(
      CASTLE_EXTERIOR_KEY,
      'assets/images/tiles/castle_tileset_part1.png'
    )

    this.load.tilemapTiledJSON(LEVEL_2_MAP_KEY, 'assets/tiled/level-2-a.json')

    this.load.spritesheet(PLAYER_KEY, 'assets/images/entities/HeroKnight.png', {
      frameWidth: 100,
      frameHeight: 55,
    })

    this.load.spritesheet(
      ENEMY_KEYS.FLAMING_SKULL,
      'assets/images/entities/flaming-skull.png',
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    )

    this.load.spritesheet(ENEMY_KEYS.DIE, 'assets/images/entities/death.png', {
      frameWidth: 44,
      frameHeight: 52,
    })

    this.load.atlas(
      ENEMY_KEYS.SKELETON_WARRIOR,
      'assets/images/entities/skeleton-sword-0.png',
      'assets/images/entities/skeleton-sword.json'
    )

    this.load.atlas(
      ENEMY_KEYS.BANDIT,
      'assets/images/entities/heav-bandit-tp.png',
      'assets/images/entities/heav-bandit-tp.json'
    )

    // sprite
  }

  dieNow(gameObject) {
    const boom = function (event, character, deets) {
      if (event.key === DEATH_ANIM_KEY) {
        gameObject.destroy()
      }
    }
    gameObject.body.setVelocityX(0)

    gameObject.setTexture(ENEMY_KEYS.DIE)
    // if (gameObject.KEY === 'bandit') return
    gameObject.once('animationcomplete', boom, this)
    if (gameObject) {
      gameObject.play(DEATH_ANIM_KEY)
    }
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

    const map = this.make.tilemap({ key: LEVEL_2_MAP_KEY })
    const ground = map.addTilesetImage('church-tileset', CHURCH_TILES_KEY)
    const env = map.addTilesetImage('env-tiles', ENV_TILES_KEY)
    const twilightBW = map.addTilesetImage(
      'twilight-bw-tiles',
      TWILIGHT_BW_TILES
    )
    const castleTiles = map.addTilesetImage(
      CASTLE_EXTERIOR_KEY,
      CASTLE_EXTERIOR_KEY
    )
    const stoneAngel = map.addTilesetImage('stone-angel', STONE_ANGEL_KEY)

    const platforms = map.createStaticLayer(
      'Platforms',
      [ground, env, castleTiles],
      0,
      0
    )
    platforms.setCollisionByExclusion(-1, true)

    map.createStaticLayer('Background', [ground, twilightBW, env], 0, 0)

    map.createStaticLayer(
      'Background2',
      [twilightBW, ground, env, stoneAngel],
      0,
      0
    )
    map.createStaticLayer('PreBackground', [ground, twilightBW, env], 0, 0)

    map.createStaticLayer('Castle', [castleTiles], 0, 0)
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
        t.destroy()
      },
    })
    this.anims.create({
      key: 'float',
      frames: this.anims.generateFrameNumbers(ENEMY_KEYS.FLAMING_SKULL, {
        start: 0,
        end: 2,
      }),
      frameRate: 5,
      repeat: -1,
    })
    const skullDrops = [356, 598, 780, 900]
    skullDrops.forEach(x => this.createFlamingSkull(x, 140))
    this.physics.add.collider(this.enemies, platforms)

    this.physics.add.collider(
      this.player,
      this.enemies,
      this.playerHit,
      null,
      this
    )
    /* */
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.playerHit,
      null,
      this
    )

    const banditDrops = [1150, 1320, 1600, 2100]
    banditDrops.forEach(x => this.createBandit(x, 200))

    const skeletonWarriorDrops = [2400, 2550, 3000]
    skeletonWarriorDrops.forEach(x => this.createSkeletonWarriors(x, 200))
  }

  update() {
    if (this.player.x > 256 * 16 - 100) {
      console.info('bounds???')
      this.scene.start('change-scene')
    }

    if (this.cursors.up.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(-100 + (this.cursors.shift.isDown ? -30 : 0))
    }

    for (var i = 0; i < this.enemies.getChildren().length; i++) {
      var fs = this.enemies.getChildren()[i]
      fs.update(this.player)
    }
    this.player.update(this)
  }
}
