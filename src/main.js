import Phaser from 'phaser'

import IntroScene from './scenes/IntroScene'
import LevelOne from './scenes/LevelOneScene'
const WIDE = 256 * 16
const HEIGHT = 16 * 16

const config = {
  type: Phaser.AUTO,
  width: 16 * 32,
  height: HEIGHT,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 200 },
    },
  },
  scene: [IntroScene, LevelOne],
}

export default new Phaser.Game(config)
