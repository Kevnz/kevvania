/* eslint-disable spellcheck/spell-checker */
import Phaser from 'phaser'

const MAIN_BACKGROUND = 'main-background'
const MAP_KEY = 'map'
const CEMETERY_OBJECTS_KEY = 'cemetery-objects'
const CEMETERY_TILES_KEY = 'cemetery-tiles'

const PLAYER_KEY = 'player'

const DEATH_ANIM_KEY = 'please-die'

const ENEMY_KEYS = {
  SKELETON: 'skeleton',
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

export default class LevelOneScene extends Phaser.Scene {
  constructor() {
    super('level-one')
    this.background = null
  }

  createPlayer() {
    const player = this.physics.add.sprite(100, 150, PLAYER_KEY)
    player.setSize(34, 48, true)
    player.setBounce(0.1)
    player.setCollideWorldBounds(true)

    this.anims.create({
      key: PLAYER_ANIMS.LEFT,
      frames: this.anims.generateFrameNumbers(PLAYER_KEY, {
        start: 8,
        end: 12,
      }),
      frameRate: 10,
      repeat: -1,
    })
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers(PLAYER_KEY, {
        start: 8,
        end: 17,
      }),
      frameRate: 10,
      repeat: -1,
    })
    this.anims.create({
      key: 'stand-right',
      frames: this.anims.generateFrameNumbers(PLAYER_KEY, { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    })
    this.anims.create({
      key: 'stand-left',
      frames: this.anims.generateFrameNumbers(PLAYER_KEY, { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    })
    this.anims.create({
      key: PLAYER_ANIMS.ATTACK1,
      frames: this.anims.generateFrameNumbers(PLAYER_KEY, {
        start: 18,
        end: 23,
      }),
      frameRate: 10,
      repeat: 0,
    })
    this.anims.create({
      key: PLAYER_ANIMS.ATTACK2,
      frames: this.anims.generateFrameNumbers(PLAYER_KEY, {
        start: 23,
        end: 29,
      }),
      frameRate: 10,
      repeat: 0,
    })
    this.anims.create({
      key: PLAYER_ANIMS.ATTACK3,
      frames: this.anims.generateFrameNumbers(PLAYER_KEY, {
        start: 30,
        end: 37,
      }),
      frameRate: 10,
      repeat: 0,
    })

    this.anims.create({
      key: PLAYER_ANIMS.HIT,
      frames: this.anims.generateFrameNumbers(PLAYER_KEY, {
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
        this.player.anims.play('stand-right', true)
        player.setSize(34, 48, true)
      }
    }

    player.on('animationcomplete', animComplete, this)
    return player
  }

  createSkeleton(x, y) {
    const skeleton = this.physics.add.sprite(x, y, ENEMY_KEYS.SKELETON)

    skeleton.setCollideWorldBounds(true)

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers(ENEMY_KEYS.SKELETON, {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: 'stay',
      frames: this.anims.generateFrameNumbers(ENEMY_KEYS.SKELETON, {
        start: 8,
        end: 9,
      }),
      frameRate: 2,
      repeat: -1,
    })
    this.anims.create({
      key: 'rise',
      frames: this.anims.generateFrameNumbers(ENEMY_KEYS.SKELETON, {
        start: 8,
        end: 14,
      }),
      frameRate: 2,
      repeat: 0,
    })

    skeleton.body.setSize(12, 8)

    skeleton.body.setOffset(10, 43)

    const animComplete = function (event, character, deets) {
      console.info('event', event)
      if (event.key === 'rise') {
        skeleton.anims.play('walk', true)
        skeleton.body.setSize()
        skeleton.setVelocityX(-10)
      }
    }

    skeleton.on('animationcomplete', animComplete, this)

    return skeleton
  }

  preload() {
    this.load.image(MAIN_BACKGROUND, 'assets/images/backgrounds/moon.png')
    this.load.image(
      CEMETERY_OBJECTS_KEY,
      'assets/images/tiles/cemetery-objects.png'
    )
    this.load.image(
      CEMETERY_TILES_KEY,
      'assets/images/tiles/cemetery-tileset.png'
    )
    this.load.tilemapTiledJSON(MAP_KEY, 'assets/tiled/intro.json')

    this.load.spritesheet(PLAYER_KEY, 'assets/images/entities/HeroKnight.png', {
      frameWidth: 100,
      frameHeight: 55,
    })
    this.load.spritesheet(
      ENEMY_KEYS.SKELETON,
      'assets/images/entities/skeleton.png',
      {
        frameWidth: 44,
        frameHeight: 52,
      }
    )
    this.load.spritesheet(ENEMY_KEYS.DIE, 'assets/images/entities/death.png', {
      frameWidth: 44,
      frameHeight: 52,
    })
  }

  dieNow(gameObject) {
    const boom = function (event, character, deets) {
      console.info('Kah BOOM?', event)
      if (event.key === DEATH_ANIM_KEY) {
        // character.destroy()
        console.log('Dead?', gameObject)
      }
    }

    gameObject.setTexture(ENEMY_KEYS.DIE)

    console.info('fall down, go boom')
    gameObject.play(DEATH_ANIM_KEY)
    gameObject.on('animationcomplete', boom, this)
  }

  create() {
    // this.background = this.add.image(0, 0, MAIN_BACKGROUND)
    // this.background.setDisplaySize(800, 600)

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
    map.createStaticLayer('BigObjectsA', [ground], 0, 0)
    map.createStaticLayer('BigObjects2A', [ground], 0, 0)
    this.player = this.createPlayer()
    this.player.setBounce(0.1)
    this.player.setCollideWorldBounds(true)
    this.physics.add.collider(this.player, platforms)

    this.cursors = this.input.keyboard.createCursorKeys()

    this.cameras.main.startFollow(this.player)

    this.myCam = this.cameras.main

    // making the camera follow the player
    this.myCam.startFollow(this.player)

    this.anims.create({
      key: DEATH_ANIM_KEY,
      frames: this.anims.generateFrameNumbers(ENEMY_KEYS.DIE, {
        start: 0,
        end: 3,
      }),
      frameRate: 20,
      repeat: 0,
    })

    this.skeletonGroup = this.physics.add.group({
      allowGravity: true,
      immovable: true,
    })
    // Let's get the spike objects, these are NOT sprites

    const skeletonObjects = map.getObjectLayer('Skeletons').objects
    console.log('seke', skeletonObjects)

    this.skeletons = skeletonObjects.map(skeletonObject => {
      console.log('skeletonObject', 16 * 12 + 3)
      // Add new skeletons to our sprite group, change the start y position to meet the platform
      // const skeleton = this.skeletons.create(skeletonObject.x, skeletonObject.y - skeletonObject.height - 148, ENEMY_KEYS.SKELETON, 8).setOrigin(0, 0);
      const skeleton = this.createSkeleton(
        skeletonObject.x,
        skeletonObject.y - skeletonObject.height - 148
      )
      this.physics.add.collider(skeleton, platforms)
      return skeleton
    })

    function playerHit(player, enemy) {
      if (player.anims.currentAnim.key === PLAYER_ANIMS.ATTACK1) {
        console.info('DIE MOTHERFUCKER DIE')
        this.dieNow(enemy)
      } else {
        player.setVelocity(0, 0)
        player.setX(player.x - 50)

        player.play(PLAYER_ANIMS.HIT, true)
      }
      // player.setAlpha(0);
      /*
    let tw = this.tweens.add({
      targets: player,
      alpha: 1,
      duration: 100,
      ease: 'Linear',
      repeat: 5,
    });
    */
    }

    // this.physics.add.collider(this.player, this.skeletors, playerHit, null, this);

    this.physics.add.overlap(this.player, this.skeletons, playerHit, null, this)
  }

  update() {
    this.skeletons.forEach(skel => {
      if (skel.anims === undefined) {
        return
      }
      if (!skel.anims.currentAnim) {
        skel.anims.play('stay', true)
      }

      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        skel.x,
        skel.y
      )

      if (dist < 150 && skel.anims.currentAnim.key === 'stay') {
        console.info('distance', dist)
        skel.anims.play('rise', true)
      }
    })
    if (this.cursors.up.isDown && this.player.body.onFloor()) {
      console.log('up')
      this.player.setVelocityY(-130)
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
        this.player.setSize(100)
      }
      if (this.cursors.shift.isDown && this.cursors.space.isDown) {
        this.player.setVelocityX(0)
        this.player.anims.play(PLAYER_ANIMS.ATTACK2, true)
        this.player.setSize(0)
      }
    }
  }
}
