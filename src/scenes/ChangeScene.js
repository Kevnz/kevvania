import Phaser from 'phaser'

const MAIN_BACKGROUND = 'main-background'

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super('change-scene')
    this.background = null
    this.nextScene = null
  }

  preload() {
    this.load.image(MAIN_BACKGROUND, 'assets/images/backgrounds/moon.png')
  }

  create({ nextScene }) {
    console.log('the next scene to load', nextScene)
    // this.background = this.add.image(0, 0, MAIN_BACKGROUND)
    // this.background.setDisplaySize(800, 600)
    this.nextScene = nextScene
    const image = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      MAIN_BACKGROUND
    )
    const scaleX = this.cameras.main.width / image.width
    const scaleY = this.cameras.main.height / image.height
    const scale = Math.max(scaleX, scaleY)
    image.setScale(scale).setScrollFactor(0)
    this.add.text(110, 110, 'Next', {
      fontFamily: 'deutsch_gothicnormal, "Times New Roman", Tahoma, serif',
      fontSize: 78,
      color: '#E70B91',
    })
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  update() {
    if (this.cursors.space.isDown) {
      this.scene.start(this.nextScene)
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
      if (gamepad.A) {
        console.log('start ', this.nextScene)
        this.scene.start(this.nextScene)
      }
    }
  }
}
