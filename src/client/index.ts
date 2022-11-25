import { SvelteComponent } from "svelte";
import CoreCompClass from "components/Core/index.svelte";

const WISDOMDEV_ID = "__wisdomDev";

class WisdomDev {
  public version: string = __VERSION__;
  public isInited = false;
  protected compInstance: SvelteComponent;

  constructor() {
    // try to init
    const _onload = () => {
      if (this.isInited) {
        return;
      }
      this._initComponent();
      this._autoRun();
      console.log("onload");
    };

    if (document !== undefined) {
      if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", _onload);
      } else {
        _onload();
      }
    }
  }

  /**
   * Init svelte component.
   */
  private _initComponent() {
    if (!document.getElementById(WISDOMDEV_ID)) {
      const target: HTMLElement = document.documentElement;

      this.compInstance = new CoreCompClass({
        target
      });

      // bind events
      this.compInstance.$on("show", (e) => {
        if (e.detail.show) {
          this.show();
        } else {
          this.hide();
        }
      });
    }
  }

  /**
   * Auto run after initialization.
   * @private
   */
  private _autoRun() {
    this.isInited = true;
  }

  /**
   * Show console panel.
   */
  public show() {
    if (!this.isInited) {
      return;
    }
    this.compInstance.show = true;
    // this._triggerPluginsEvent('showConsole');
  }

  /**
   * Hide console panel.
   */
  public hide() {
    if (!this.isInited) {
      return;
    }
    this.compInstance.show = false;
    // this._triggerPluginsEvent('hideConsole');
  }
}

if (typeof document !== "undefined") {
  new WisdomDev();
}
