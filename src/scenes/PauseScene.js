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

    this.add.text(110, 110, 'Paused', {
      fontFamily: '"Times New Roman", Tahoma, serif',
      fontSize: 78,
      color: '#E70B91cc',
    })
  }

  update() { }
}
