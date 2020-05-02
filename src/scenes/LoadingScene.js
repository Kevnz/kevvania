import Phaser from 'phaser'
import WebFontLoaderPlugin from 'phaser3-rex-plugins/plugins/webfontloader-plugin'
import {
  MAIN_BACKGROUND,
  PLAYER_KEY,
  CEMETERY_OBJECTS_KEY,
  CEMETERY_TILES_KEY,
  MAP_KEY,
  ENEMY_KEYS,
  DEATH_ANIM_KEY,
  STONE_ANGEL_KEY,
  CHURCH_TILES_KEY,
  ENV_TILES_KEY,
  TWILIGHT_BW_TILES,
  LEVEL_2_MAP_KEY,
  CASTLE_EXTERIOR_KEY,
  MUSIC_SCENES,
} from '../utils/constants'

export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super('loading-scene')
  }

  preload() {
    // this.load.plugin('rexwebfontloaderplugin', WebFontLoaderPlugin)

    this.plugins.get('rexwebfontloaderplugin').addToScene(this)
    var progressBar = this.add.graphics()
    var progressBox = this.add.graphics()
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(240, 270, 320, 50)

    var width = this.cameras.main.width
    var height = this.cameras.main.height
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff',
      },
    })
    loadingText.setOrigin(0.5, 0.5)

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    })
    percentText.setOrigin(0.5, 0.5)

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    })

    assetText.setOrigin(0.5, 0.5)

    this.load.on('progress', function (value) {
      percentText.setText(parseInt(value * 100) + '%')
      progressBar.clear()
      progressBar.fillStyle(0xffffff, 1)
      progressBar.fillRect(250, 280, 300 * value, 30)
    })

    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key)
    })

    this.load.on(
      'complete',
      function () {
        progressBar.destroy()
        progressBox.destroy()
        loadingText.destroy()
        percentText.destroy()
        assetText.destroy()
        this.scene.start('intro-scene')
      },
      this
    )
    console.info(PLAYER_KEY)
    this.load.image(MAIN_BACKGROUND, 'assets/images/backgrounds/moon.png')
    this.load.spritesheet(PLAYER_KEY, 'assets/images/entities/HeroKnight.png', {
      frameWidth: 100,
      frameHeight: 55,
    })
    this.load.image(
      CEMETERY_OBJECTS_KEY,
      'assets/images/tiles/cemetery-objects.png'
    )
    console.info(`Loaded ${CEMETERY_OBJECTS_KEY}`)
    this.load.image(
      CEMETERY_TILES_KEY,
      'assets/images/tiles/cemetery-tileset.png'
    )
    console.info(`Loaded ${CEMETERY_TILES_KEY}`)
    this.load.tilemapTiledJSON(MAP_KEY, 'assets/tiled/intro.json')
    console.info(`Loaded ${MAP_KEY}`)
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
    this.load.audio(MUSIC_SCENES.INTRO, ['assets/music/Title Screen.wav'])
    this.load.audio(MUSIC_SCENES.LEVEL1, ['assets/music/Level 1.wav'])
    this.load.audio(MUSIC_SCENES.LEVEL2, ['assets/music/Level 2.wav'])
    this.load.audio(MUSIC_SCENES.LEVEL3, ['assets/music/Level 3.wav'])
    this.load.audio(MUSIC_SCENES.ENDING, ['assets/music/Ending.wav'])

    this.load.spritesheet(
      ENEMY_KEYS.SKELETON,
      'assets/images/entities/skeleton-dark.png',
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

    this.load.rexWebFont({
      custom: {
        families: ['deutsch_gothicnormal'],
        urls: ['/assets/fonts/deutsch/stylesheet.css'],
      },
    })
  }

  create() { }

  update() { }
}
