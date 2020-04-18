/* eslint-disable spellcheck/spell-checker */
import Phaser from 'phaser'
import BaseScene from './BaseScene'

const MAIN_BACKGROUND = 'main-background'
const MAP_KEY = 'map'
const CEMETERY_OBJECTS_KEY = 'cemetery-objects'
const ENV_TILES_KEY = 'env-tiles'
const CHURCH_TILES_KEY = 'church-tileset'
const TWILIGHT_BW_TILES = 'twilight-bw-tiles'
const TWILIGHT_TILES = 'twilight-tiles'
const STONE_ANGEL_KEY = 'stone-angel'

const PLAYER_KEY = 'player'

const DEATH_ANIM_KEY = 'please-die'

const ENEMY_KEYS = {
  HELLCAT: 'hellcat',
  SKELETON: 'skeleton',
  SKELETON_BOSS: 'skeleton-boss',
  BAT: 'bat-flat',
  WOLF: 'wolf',
  DIE: 'death',
}

const PLAYER_ANIMS = {
  RIGHT: 'right',
  LEFT: 'left',
  STAND_RIGHT: 'stand-right',
  STAND_LEFT: 'stand-left',
  ATTACK1: 'attack1',
  ATTACK2: 'attack2',
  ATTACK4: 'attack3',
  HIT: 'hit',
}

export default class LevelOneScene extends BaseScene {
  constructor() {
    super('level-two')
    console.info('LEVEL TWO')
  }

  preload() {
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

    this.load.spritesheet(ENEMY_KEYS.DIE, 'assets/images/entities/death.png', {
      frameWidth: 44,
      frameHeight: 52,
    })
  }

  dieNow(gameObject) {
    gameObject.setVelocityX(0)

    gameObject.setTexture(ENEMY_KEYS.DIE)

    console.info('fall down, go boom')
    gameObject.play(DEATH_ANIM_KEY)
  }

  create() {
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

    map.createStaticLayer(
      'Background',
      [ground, twilightBW, env, stoneAngel],
      0,
      0
    )

    map.createStaticLayer(
      'Background2',
      [twilightBW, ground, env, stoneAngel],
      0,
      0
    )
    map.createStaticLayer(
      'PreBackground',
      [ground, twilightBW, env, stoneAngel],
      0,
      0
    )

    this.player = this.createPlayer()
    this.player.setBounce(0.1)
    this.player.setCollideWorldBounds(true)
    this.physics.add.collider(this.player, platforms)

    this.cursors = this.input.keyboard.createCursorKeys()

    this.cameras.main.startFollow(this.player)

    this.myCam = this.cameras.main

    // making the camera follow the player
    this.myCam.startFollow(this.player)

    // this.physics.add.collider(this.player, this.skeletors, playerHit, null, this);

    this.events.on('pause', function () {
      console.log('Scene paused')
    })

    this.events.on('resume', function () {
      console.log('Scene A resumed')
    })
  }

  update() {
    if (this.player.x > 256 * 16 - 100) {
      console.info('bounds???')
      this.scene.start('change-scene')
    }

    if (this.cursors.up.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(-100 + (this.cursors.shift.isDown ? -30 : 0))
    }
    const isAttacking = () => {
      return (
        this.player.anims.currentAnim &&
        this.player.anims.currentAnim.key &&
        (this.player.anims.currentAnim.key === PLAYER_ANIMS.ATTACK1 ||
          this.player.anims.currentAnim.key === PLAYER_ANIMS.ATTACK2 ||
          this.player.anims.currentAnim.key === PLAYER_ANIMS.ATTACK3)
      )
    }
    if (!isAttacking()) {
      if (this.cursors.left.isDown) {
        if (
          this.player.anims.currentAnim &&
          this.player.anims.currentAnim.key !== PLAYER_ANIMS.HIT
        ) {
          this.player.setVelocityX(-160)
          this.player.anims.play('left', true)
          this.player.flipX = true
        }
      } else if (this.cursors.right.isDown) {
        if (
          this.player.anims.currentAnim &&
          this.player.anims.currentAnim.key !== PLAYER_ANIMS.HIT
        ) {
          this.player.setVelocityX(360)
          this.player.anims.play('right', true)
          this.player.flipX = false
        }
      } else {
        this.player.setVelocityX(0)
        if (
          (this.player.anims.currentAnim &&
            this.player.anims.currentAnim.key === PLAYER_ANIMS.RIGHT) ||
          !this.player.anims.currentAnim
        ) {
          this.player.anims.play('stand-right', true)
          this.player.flipX = false
        } else if (
          this.player.anims.currentAnim &&
          this.player.anims.currentAnim.key === PLAYER_ANIMS.LEFT
        ) {
          this.player.anims.play('stand-left', true)
          this.player.flipX = true
        }
      }

      if (this.cursors.space.isDown && this.cursors.shift.isUp) {
        this.player.anims.play(PLAYER_ANIMS.ATTACK1, true)
        this.player.setVelocityX(0)
        this.player.setSize(80)
      }
      if (this.cursors.shift.isDown && this.cursors.space.isDown) {
        this.player.setVelocityX(0)
        this.player.anims.play(PLAYER_ANIMS.ATTACK2, true)
        this.player.setSize(80)
      }
    }
  }
}
