/* eslint-disable spellcheck/spell-checker */
import Phaser from 'phaser'

const MAIN_BACKGROUND = 'main-background'
const MAP_KEY = 'map'
const CEMETERY_OBJECTS_KEY = 'cemetery-objects'
const CEMETERY_TILES_KEY = 'cemetery-tiles'

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

const ENEMY_HP = {
  [ENEMY_KEYS.SKELETON_BOSS]: 5,
  [ENEMY_KEYS.SKELETON]: 1,
  [ENEMY_KEYS.HELLCAT]: 1,
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
    this.enemies = null
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

  createSkeleton(x, y, key = ENEMY_KEYS.SKELETON) {
    const skeleton = this.physics.add.sprite(x, y, key)
    skeleton.KEY = key
    skeleton.HP = ENEMY_HP[key]
    skeleton.setCollideWorldBounds(true)

    this.anims.create({
      key: `${key}-walk`,
      frames: this.anims.generateFrameNumbers(key, {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: `${key}-stay`,
      frames: this.anims.generateFrameNumbers(key, {
        start: 8,
        end: 9,
      }),
      frameRate: 2,
      repeat: -1,
    })
    this.anims.create({
      key: `${key}-rise`,
      frames: this.anims.generateFrameNumbers(key, {
        start: 8,
        end: 14,
      }),
      frameRate: 10,
      repeat: 0,
    })

    skeleton.body.setSize(12, 8)

    skeleton.body.setOffset(10, 43)

    const animComplete = function (event, character, deets) {
      console.info('Skeleton Animation Complete', event)
      if (event.key === `${key}-rise`) {
        skeleton.anims.play(`${key}-walk`, true)
        skeleton.body.setSize()
        skeleton.setVelocityX(-10)
      }
    }

    skeleton.on('animationcomplete', animComplete, this)

    return skeleton
  }

  createHellcat(x, y) {
    const hellcat = this.physics.add.sprite(x, y, ENEMY_KEYS.HELLCAT)

    hellcat.setCollideWorldBounds(true)

    this.anims.create({
      key: 'catwalk',
      frames: this.anims.generateFrameNumbers(ENEMY_KEYS.HELLCAT, {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    })

    const animComplete = function (event, character, deets) {
      console.info('Hellcat Animation Complete', event)
    }

    hellcat.on('animationcomplete', animComplete, this)

    return hellcat
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

  dieNow(gameObject) {
    const boom = function (event, character, deets) {
      console.info('Kah BOOM?', event)
      if (event.key === DEATH_ANIM_KEY) {
        console.log('Dead?', gameObject)
        gameObject.destroy()
      }
    }
    gameObject.setVelocityX(0)

    gameObject.setTexture(ENEMY_KEYS.DIE)

    console.info('fall down, go boom')

    gameObject.play(DEATH_ANIM_KEY)
    gameObject.once('animationcomplete', boom, this)
  }

  create() {
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

    // Let's get the spike objects, these are NOT sprites

    const skeletonObjects = map.getObjectLayer('Skeletons').objects
    const hellCatObjects = map.getObjectLayer('HellCats').objects
    const bossObjects = map.getObjectLayer('Boss').objects

    this.enemies = this.physics.add.group()

    this.physics.add.collider(this.enemies, platforms)

    skeletonObjects.forEach((skeletonObject, index) => {
      // Add new skeletons to our sprite group, change the start y position to meet the platform
      // const skeleton = this.skeletons.create(skeletonObject.x, skeletonObject.y - skeletonObject.height - 148, ENEMY_KEYS.SKELETON, 8).setOrigin(0, 0);

      const skeleton = this.createSkeleton(
        skeletonObject.x,
        skeletonObject.y - 50
      )

      this.enemies.add(skeleton)
    })

    bossObjects.forEach(skeletonObject => {
      const skeleton = this.createSkeleton(
        skeletonObject.x,
        30,
        ENEMY_KEYS.SKELETON_BOSS
      )

      this.enemies.add(skeleton)
    })

    this.hellcats = this.physics.add.group()
    hellCatObjects.forEach(hellCatObject => {
      // Add new skeletons to our sprite group, change the start y position to meet the platform
      // const skeleton = this.skeletons.create(skeletonObject.x, skeletonObject.y - skeletonObject.height - 148, ENEMY_KEYS.SKELETON, 8).setOrigin(0, 0);
      const hellcat = this.createHellcat(
        hellCatObject.x,
        hellCatObject.y - hellCatObject.height - 148
      )
      this.physics.add.collider(hellcat, platforms)

      this.hellcats.add(hellcat)
    })

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
        player.setVelocity(0, 0)
        player.setX(player.x - 50)

        player.play(PLAYER_ANIMS.HIT, true)

        enemy.setVelocity(0, 0)
        enemy.setX(enemy.x - 50)
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

    this.physics.add.collider(
      this.player,
      this.skeletons,
      playerHit,
      null,
      this
    )
    this.physics.add.collider(this.player, this.hellcats, playerHit, null, this)

    this.events.on('pause', function () {
      console.log('Scene paused')
    })

    this.events.on('resume', function () {
      console.log('Scene A resumed')
    })

    var callback = function (
      body,
      blockedUp,
      blockedDown,
      blockedLeft,
      blockedRight
    ) {
      console.info('worldbounds body', body)
    }
    this.physics.world.on('worldbounds or collide', callback)

    this.physics.world.on('collide', callback)

    this.input.on(
      'gameobjectdown',
      function () {
        console.log('game object down???')
      },
      this
    )
    console.info('this input', this.input)
    this.input.gamepad.on(
      'down',
      function (pad, button, index) {
        console.info('gamepad down', button)

        if (button.index === 9) {
          this.scene.launch('pause-scene')
          this.scene.pause()
        }
      },
      this
    )
    this.physics.add.collider(this.player, this.enemies, playerHit, null, this)

    const pads = this.input.gamepad.gamepads
    const gamepad = pads[0] || { buttons: [] }
    console.info('Gamepad', gamepad)
  }

  update() {
    if (this.player.x > 256 * 16 - 100) {
      this.scene.start('change-scene')
    }

    this.enemies.getChildren().forEach(skel => {
      if (skel === null) return
      if (skel.anims === undefined) {
        return
      }

      if (!skel.anims.currentAnim) {
        skel.anims.play(`${skel.KEY || ENEMY_KEYS.SKELETON}-stay`, true)
      }

      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        skel.x,
        skel.y
      )

      if (
        dist < 150 &&
        skel.anims.currentAnim &&
        skel.anims.currentAnim.key === `${skel.KEY || ENEMY_KEYS.SKELETON}-stay`
      ) {
        console.info('distance', dist)
        skel.anims.play(`${skel.KEY || ENEMY_KEYS.SKELETON}-rise`, true)
      }

      if (
        skel.x < this.player.x &&
        skel.anims.currentAnim &&
        skel.anims.currentAnim.key === `${skel.KEY || ENEMY_KEYS.SKELETON}-walk`
      ) {
        skel.setVelocityX(10)
        skel.flipX = true
      }
    })

    this.hellcats.getChildren().forEach(kitty => {
      try {
        if (kitty === undefined || kitty.anims === undefined) {
          return
        }
        const dist = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          kitty.x,
          kitty.y
        )

        if (dist < 350 && kitty.x > this.player.x) {
          console.info('distance', dist)
          kitty.anims.play('catwalk', true)
          kitty.setVelocityX(-45)
        } else if (dist < 350 && kitty.x < this.player.x) {
          kitty.setVelocityX(45)
          kitty.flipX = true
        }
      } catch (err) {
        console.error('kitty err', err)
      }
    })
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
      const pads = this.input.gamepad.gamepads
      const gamepad = pads[0] || { buttons: [] }

      if (gamepad.start) {
        console.info('START PRESSED')
      }

      if (this.cursors.left.isDown || gamepad.left) {
        if (
          this.player.anims.currentAnim &&
          this.player.anims.currentAnim.key !== PLAYER_ANIMS.HIT
        ) {
          this.player.setVelocityX(-160)
          this.player.anims.play('left', true)
          this.player.flipX = true
        }
      } else if (this.cursors.right.isDown || gamepad.right) {
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

      if ((this.cursors.space.isDown && this.cursors.shift.isUp) || gamepad.A) {
        this.player.anims.play(PLAYER_ANIMS.ATTACK1, true)
        this.player.setVelocityX(0)
        this.player.setSize(80)
      }
      if (
        (this.cursors.shift.isDown && this.cursors.space.isDown) ||
        gamepad.B
      ) {
        this.player.setVelocityX(0)
        this.player.anims.play(PLAYER_ANIMS.ATTACK2, true)
        this.player.setSize(80)
      }
    }
  }
}
