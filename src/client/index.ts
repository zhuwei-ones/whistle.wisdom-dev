import { SvelteComponent } from "svelte";
import CoreCompClass from "components/Core/index.svelte";

class WisdomDev {
  public version: string = __VERSION__;
  public isInited = false;
  protected compInstance: SvelteComponent;

  constructor() {
    const _onload = () => {
      if (this.isInited) {
        return;
      }
      this._initComponent();
      this.isInited = true;
      console.log("wisdom 插件加载完毕");
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
    this.compInstance = new CoreCompClass({
      target: document.documentElement
    });
  }
}

if (typeof document !== "undefined") {
  new WisdomDev();
}
