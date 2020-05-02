import Phaser from 'phaser'
import {
  SCREEN_WIDTH,
  FULL_HEIGHT,
  PLAYER_KEY,
  SCENES,
} from '../utils/constants'
const MAIN_BACKGROUND = 'main-background'

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super('intro-scene')
    this.background = null
  }

  preload() { }

  create() {
    // this.background = this.add.image(0, 0, MAIN_BACKGROUND)
    // this.background.setDisplaySize(800, 600)
    // this.scale.resize(SCREEN_WIDTH * 2, FULL_HEIGHT * 2)
    const image = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      MAIN_BACKGROUND
    )
    const scaleX = this.cameras.main.width / image.width
    const scaleY = this.cameras.main.height / image.height
    const scale = Math.max(scaleX, scaleY)
    image.setScale(scale).setScrollFactor(0)
    this.add.text(110, 110, 'KevVania', {
      fontFamily: 'deutsch_gothicnormal, "Times New Roman", Tahoma, serif',
      fontSize: 78,
      color: '#E70B91',
    })
    this.cursors = this.input.keyboard.createCursorKeys()

    this.music = this.sound.add('intro-audio')

    this.music.play()
    this.music.setVolume(0.5)
  }

  update() {
    if (this.cursors.space.isDown) {
      this.scene.start('level-one')
    }
    var pads = this.input.gamepad.gamepads

    for (var i = 0; i < pads.length; i++) {
      var gamepad = pads[i]

      if (!gamepad) {
        continue
      }

      if (gamepad.left) {
        console.info('left')
      } else if (gamepad.right) {
        console.info('right')
      }

      if (gamepad.up) {
        console.info('up')
      } else if (gamepad.down) {
        console.info('down')
      }
      if (gamepad.B) {
        this.music.stop()
        this.scene.start(SCENES.LEVEL1)
      }
      if (gamepad.A) {
        this.music.stop()
        this.scene.start(SCENES.LEVEL2)
      }
      if (gamepad.X) {
        this.music.stop()
        this.scene.start(SCENES.LEVEL3)
      }
      if (gamepad.Y) {
        this.music.stop()
      }
      if (gamepad.R1) {
        console.log('gamepad', gamepad)
      }
    }
  }
}
