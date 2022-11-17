import * as THREE from "three";
  // import * as dat from "dat.gui";

import Renderer from "./Renderer";
import Sizes from "../utils/Sizes";
import Camera from "./Camera";
import Scene from "./Scene";
import World from "./World";
import PostProcessing from "./PostProcessing";

/**
 * App constructor.
 * @constructor
 */
export default class Application {
  constructor(_params) {
    this.time = 0;
    
    this.$canvas = _params.$canvas;

    this.sizes = new Sizes();
    this.scene = new Scene({app: this});
    this.renderer = new Renderer(this.$canvas, this.sizes.viewport);


    this.sizes.on("resize", () => {
      const { width, height } = this.sizes.viewport;
      this.renderer.instance.setSize(width, height);
      this.renderer.instance.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
      );
    });

    this.composer = null;
    this.gui = null;

    this.setupGUI();

    this.setupCamera();

    this.postProcessing = new PostProcessing({scene: this.scene, renderer : this.renderer, camera: this.camera});

    this.world = null;
    this.setupWorld();

    this.onFrame();

    // this.onFrame = this.onFrame.bind(this);
  }

  setupConfig() {
    this.config = {};
    this.config.debug = window.location.hash === "#debug";
  }

  async setupGUI() {

    //   this.guiTest = (await import("dat.gui")).default;
    //   console.log('this.guiTest :>> ', this.guiTest);

    // this.gui = new this.guiTest.dat.GUI();
    // let fSettings = this.gui.addFolder("Settings");
    // fSettings.open();
  }

  setupCamera() {
    this.camera = new Camera({
      time: this.time,
      sizes: this.sizes,
      gui: this.gui,
      renderer: this.renderer,
    });

    this.scene.instance.add(this.camera.container);
  }


  setupWorld() {
    //TODO: INIT WORLD
    this.world = new World({scene: this.scene, time: this.time, renderer : this.renderer, camera: this.camera});
    this.scene.instance.add(this.world.container);

  }


  onFrame = () => {
    this.time += 0.1;

    requestAnimationFrame(this.onFrame);
    //this.renderer.render(this.scene.instance, this‡.camera.instance);

    // this.world.globe.update(this.time);
    this.postProcessing.update();
  };
}
