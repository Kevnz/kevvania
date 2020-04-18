import Phaser from 'phaser'

import IntroScene from './scenes/IntroScene'
import PauseScene from './scenes/PauseScene'
import LevelOne from './scenes/LevelOneScene'
import ChangeScene from './scenes/ChangeScene'
import LevelTwo from './scenes/LevelTwoScene'
import { SCREEN_WIDTH, FULL_HEIGHT, FULL_WIDTH } from './utils/constants'

const config = {
  type: Phaser.AUTO,
  width: SCREEN_WIDTH,
  height: FULL_HEIGHT,
  input: {
    gamepad: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 200 },
    },
  },
  scene: [IntroScene, LevelOne, ChangeScene, LevelTwo, PauseScene],
}

export default new Phaser.Game(config)
