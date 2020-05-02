import Phaser from 'phaser'

import WebFontLoader from 'webfontloader'

export default class WebFontFile extends Phaser.Loader.File {
  /**
   * @param {Phaser.Loader.LoaderPlugin} loader
   * @param {string | string[]} fontNames
   * @param {string} [service]
   */
  constructor(loader, fontNames) {
    super(loader, {
      type: 'webfont',
      key: fontNames.toString(),
    })

    this.fontNames = Array.isArray(fontNames) ? fontNames : [fontNames]
  }

  load() {
    const config = {
      active: () => {
        this.loader.nextFile(this, true)
      },
    }

    WebFontLoader.load(config)
  }
}
