/* eslint-disable spellcheck/spell-checker */
import Phaser from 'phaser'
import Player, { PLAYER_KEY, PLAYER_ANIMS } from '../entities/player'
import Skeleton from '../entities/skeleton'
import Hellcat from '../entities/hellcat'
import HellCat from '../entities/hellcat'

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
export default class BaseScene extends Phaser.Scene {
  constructor(args) {
    super(args)
    this.enemies = null
  }

  createPlayer(x = 100, y = 150) {
    console.log('put player at ', x)
    return new Player(this, x, y)
  }

  //
  createSkeleton(x, y, key = ENEMY_KEYS.SKELETON) {
    const c = new Skeleton(this, x, y, key)
    this.enemies.add(c)
  }

  createHellcat(x, y) {
    const h = new HellCat(this, x, y, ENEMY_KEYS.HELLCAT)
    this.enemies.add(h)
  }

  preload() { }

  playerHit(player, enemy) {
    console.info('enemy hit points', enemy.HIT_POINTS)

    console.info('enemy hit', enemy.KEY)
    if (enemy.BEING_HIT || player.BEING_HIT) {
      console.info('someone has already been hit')
      console.info('enemy? has already been hit', enemy.BEING_HIT)
      console.info('player? has already been hit', player.BEING_HIT)

      return
    }
    if (
      player.anims.currentAnim.key === PLAYER_ANIMS.ATTACK1 ||
      player.anims.currentAnim.key === PLAYER_ANIMS.ATTACK2 ||
      player.anims.currentAnim.key === PLAYER_ANIMS.ATTACK3
    ) {
      console.info('enemy is being hit')
      enemy.BEING_HIT = true
      enemy.HIT_POINTS = enemy.HIT_POINTS - 1
      console.info('enemy hit points', enemy.HIT_POINTS)
      if (enemy.HIT_POINTS < 1) {
        console.info('die')
        enemy.DEAD = true

        if (!enemy.hasDeath) {
          this.dieNow(enemy)
        } else {
          enemy.beenHit(player)
        }
      } else {
        if (enemy.beenHit) {
          enemy.beenHit(player)
        }
        enemy.body.setVelocity(0, 0)
        enemy.setX(enemy.x + 20)
        enemy.alpha = 0
        const tw = this.tweens.add({
          targets: enemy,
          alpha: 1,
          duration: 100,
          ease: 'Linear',
          repeat: 5,
          onComplete: function () {
            enemy.BEING_HIT = false
          },
        })
      }
    } else {
      player.BEING_HIT = true
      if (enemy.playerHit) {
        enemy.playerHit(player)
      }
      player.body.setVelocity(0, 0)
      player.setX(player.x - 10)

      player.play(PLAYER_ANIMS.HIT, true)

      enemy.body.setVelocity(0, 0)
      enemy.setX(enemy.x + 50)
    }
  }

  dieNow(gameObject) {
    if (gameObject.DEAD) return
    const boom = function (event, character, deets) {
      console.info('Kah BOOM?', event)
      if (event.key === DEATH_ANIM_KEY) {
        gameObject.destroy()
      }
    }
    gameObject.body.setVelocityX(0)

    gameObject.setTexture(ENEMY_KEYS.DIE)

    console.info('fall down, go boom')
    gameObject.DEAD = true
    gameObject.play(DEATH_ANIM_KEY)
    gameObject.once('animationcomplete', boom, this)
  }

  create() {
    this.input.gamepad.on(
      'down',
      function (pad, button, index) {
        if (button.index === 9) {
          this.scene.launch('pause-scene', { pausedScene: this.scene.key })
          this.scene.pause()
        }
      },
      this
    )
    this.events.on(
      'pause',
      function () {
        console.log('Scene paused', this)
        this.music.pause()
      },
      this
    )

    this.events.on(
      'resume',
      function () {
        console.log('Scene A resumed')
        this.music.resume()
      },
      this
    )
  }
}
