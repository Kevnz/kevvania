/* eslint-disable spellcheck/spell-checker */
import Phaser from 'phaser'
import { PLAYER_KEY, PLAYER_ANIMS } from '../entities/player'
import FlamingSkull from '../entities/flaming-skull'
import {
  MAIN_BACKGROUND,
  CEMETERY_OBJECTS_KEY,
  STONE_ANGEL_KEY,
  CHURCH_TILES_KEY,
  ENV_TILES_KEY,
  TWILIGHT_BW_TILES,
  TWILIGHT_TILES,
  MAP_KEY,
  ENEMY_KEYS,
  DEATH_ANIM_KEY,
} from '../utils/constants'
import BaseScene from './BaseScene'

export default class LevelTwoScene extends BaseScene {
  constructor() {
    super('level-two')
    this.enemies = null
    console.info('LEVEL TWO')
  }

  createFlamingSkull(x, y) {
    return new FlamingSkull(this, x, y)
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
    this.load.image(TWILIGHT_TILES, 'assets/images/tiles/twilight-tiles.png')
    this.load.tilemapTiledJSON(MAP_KEY, 'assets/tiled/level-2.json')

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
      ENEMY_KEYS.SKELETON_SWORD,
      'assets/images/entities/skeleton-sword.png',
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
      console.info('Kah BOOM?', event)
      if (event.key === DEATH_ANIM_KEY) {
        console.log('Dead?', gameObject)
        gameObject.destroy()
      }
    }
    gameObject.body.setVelocityX(0)

    gameObject.setTexture(ENEMY_KEYS.DIE)

    console.info('fall down, go boom')

    gameObject.play(DEATH_ANIM_KEY)
    gameObject.once('animationcomplete', boom, this)
  }

  create() {
    super.create()
    console.info('CREATE LEVEL TWO')
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
    const ground = map.addTilesetImage('church-tileset', CHURCH_TILES_KEY)
    const env = map.addTilesetImage('env-tiles', ENV_TILES_KEY)
    const twilightBW = map.addTilesetImage(
      'twilight-bw-tiles',
      TWILIGHT_BW_TILES
    )
    const stoneAngel = map.addTilesetImage('stone-angel', STONE_ANGEL_KEY)

    const platforms = map.createStaticLayer('Platforms', [ground, env], 0, 0)
    platforms.setCollisionByExclusion(-1, true)

    map.createStaticLayer('Background', [ground, twilightBW, env], 0, 0)

    map.createStaticLayer(
      'Background2',
      [twilightBW, ground, env, stoneAngel],
      0,
      0
    )
    map.createStaticLayer('PreBackground', [ground, twilightBW, env], 0, 0)

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

    function playerHit(player, enemy) {
      console.info('player hit')

      if (
        player.anims.currentAnim.key === PLAYER_ANIMS.ATTACK1 ||
        player.anims.currentAnim.key === PLAYER_ANIMS.ATTACK2 ||
        player.anims.currentAnim.key === PLAYER_ANIMS.ATTACK3
      ) {
        console.info('DIE MOTHERFUCKER DIE')
        this.dieNow(enemy)
      } else {
        player.body.setVelocity(0, 0)
        player.setX(player.x - 50)

        player.play(PLAYER_ANIMS.HIT, true)

        enemy.body.setVelocity(0, 0)
        enemy.setX(enemy.x - 50)
      }
    }
    this.physics.add.collider(
      this.player,
      this.enemies,
      this.playerHit,
      null,
      this
    )
    /*
    const skullguy = this.add.sprite(
      200,
      200,
      ENEMY_KEYS.SKELETON_SWORD,
      'attack2_2.png'
    )
    skullguy.setScale(1.3, 1.3)

    const readyFrameNames = this.anims.generateFrameNames(
      ENEMY_KEYS.SKELETON_SWORD,
      {
        start: 1,
        end: 3,
        zeroPad: 0,
        prefix: 'ready_',
        suffix: '.png',
      }
    )
    const walkFrameNames = this.anims.generateFrameNames(
      ENEMY_KEYS.SKELETON_SWORD,
      {
        start: 1,
        end: 6,
        zeroPad: 0,
        prefix: 'walk_',
        suffix: '.png',
      }
    )

    this.anims.create({
      key: 'skeleton-sword-ready',
      frames: readyFrameNames,
      frameRate: 6,
      repeat: -1,
    })
    this.anims.create({
      key: 'sketon-sword-walk',
      frames: walkFrameNames,
      frameRate: 6,
      repeat: -1,
    })
    skullguy.anims.play('skeleton-sword-ready')
    */
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
