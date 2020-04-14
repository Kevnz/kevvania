import Phaser from 'phaser'

const MAIN_BACKGROUND = 'main-background'

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super('intro-scene')
    this.background = null
  }

  preload() {
    this.load.image(MAIN_BACKGROUND, 'assets/images/backgrounds/moon.png')
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
    this.add.text(110, 110, 'KevVania', {
      fontFamily: '"Times New Roman", Tahoma, serif',
      fontSize: 78,
      color: '#E70B91',
    })
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  update() {
    if (this.cursors.space.isDown) {
      this.scene.start('level-one')
    }
  }
}
