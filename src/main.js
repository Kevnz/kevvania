import Phaser from 'phaser'
import WebFontLoaderPlugin from 'phaser3-rex-plugins/plugins/webfontloader-plugin'
import LoadingScene from './scenes/LoadingScene'
import IntroScene from './scenes/IntroScene'
import PauseScene from './scenes/PauseScene'
import LevelOne from './scenes/level-one-scene'
import ChangeScene from './scenes/ChangeScene'
import LevelTwo from './scenes/LevelTwoScene'

import LevelThreeScene from './scenes/level-three-scene'

import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  FULL_HEIGHT,
  FULL_WIDTH,
} from './utils/constants'

const config = {
  type: Phaser.AUTO,
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
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
  scene: [
    LoadingScene,
    IntroScene,
    LevelOne,
    ChangeScene,
    LevelTwo,
    LevelThreeScene,
    PauseScene,
  ],
  plugins: {
    global: [
      {
        key: 'rexwebfontloaderplugin',
        plugin: WebFontLoaderPlugin,
        start: true,
        // mapping: memberName  // member name in each scene instance, optional
      },
      // ...
    ],
  },
}

export default new Phaser.Game(config)
