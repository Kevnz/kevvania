/* eslint-disable spellcheck/spell-checker */
import Phaser from 'phaser'

export default class PauseScene extends Phaser.Scene {
  constructor() {
    super('pause-scene')
  }

  create() {
    this.input.gamepad.on(
      'down',
      function (pad, button, index) {
        if (button.index === 9) {
          this.scene.resume('level-one')
          this.scene.stop()
        }
      },
      this
    )
  }

  update() { }
}
