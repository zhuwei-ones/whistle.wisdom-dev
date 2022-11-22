<script lang="ts">
  import { getEnvInfoFormConfig } from "lib";
  import { onMount, onDestroy } from "svelte";
  import * as tool from "../../lib/tool";
  import Style from "./index.less";

  /*************************************
   * Public properties
   *************************************/

  export let position = { x: 0, y: 0 };
  export let onClick;
  let btnText = "正在读取环境信息...";

  /*************************************
   * Inner properties
   *************************************/

  const switchPos = {
    startMove: false,
    moving: false,
    x: 0, // right
    y: 0, // bottom
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  };
  const btnSwitchPos = {
    x: 0,
    y: 0,
  };
  let btnSwitch: HTMLElement;

  $: {
    if (btnSwitch) {
      setSwitchPosition(position.x, position.y);
    }
  }

  /*************************************
   * Lifecycle
   *************************************/

  onMount(() => {
    Style.use();

    setTimeout(() => {
      btnText = getEnvInfoFormConfig();
    }, 2000);
  });

  onDestroy(() => {
    Style.unuse();
  });

  /*************************************
   * Methods
   *************************************/

  const setSwitchPosition = (switchX: number, switchY: number) => {
    [switchX, switchY] = _getSwitchButtonSafeAreaXY(switchX, switchY);
    switchPos.x = switchX;
    switchPos.y = switchY;
    btnSwitchPos.x = switchX;
    btnSwitchPos.y = switchY;
    tool.setStorage("switch_x", switchX + "");
    tool.setStorage("switch_y", switchY + "");
  };

  /**
   * Get an safe [x, y] position for switch button
   */
  const _getSwitchButtonSafeAreaXY = (x: number, y: number) => {
    const docWidth = Math.max(
      document.documentElement.offsetWidth,
      window.innerWidth
    );
    const docHeight = Math.max(
      document.documentElement.offsetHeight,
      window.innerHeight
    );
    // check edge
    if (x + btnSwitch.offsetWidth > docWidth) {
      x = docWidth - btnSwitch.offsetWidth;
    }
    if (y + btnSwitch.offsetHeight > docHeight) {
      y = docHeight - btnSwitch.offsetHeight;
    }
    if (x < 0) {
      x = 0;
    }
    if (y < 20) {
      y = 20;
    } // safe area for iOS Home indicator
    return [x, y];
  };

  /*************************************
   * DOM Events
   *************************************/

  const onMouseDown = (e) => {
    console.log("start");

    switchPos.startX = e.pageX;
    switchPos.startY = e.pageY;
    switchPos.moving = false;
    switchPos.startMove = true;
  };

  const onEnd = () => {
    if (!switchPos.moving) {
      return;
    }
    console.log("end");

    switchPos.startX = 0;
    switchPos.startY = 0;
    switchPos.moving = false;
    switchPos.startMove = false;
    setSwitchPosition(switchPos.endX, switchPos.endY);
  };

  const onMove = (e) => {
    e.preventDefault();

    if (!switchPos.startMove) {
      return;
    }

    switchPos.moving = true;

    console.log("move");

    const offsetX = e.pageX - switchPos.startX;
    const offsetY = e.pageY - switchPos.startY;
    let x = Math.floor(switchPos.x - offsetX);
    let y = Math.floor(switchPos.y - offsetY);
    [x, y] = _getSwitchButtonSafeAreaXY(x, y);

    btnSwitchPos.x = x;
    btnSwitchPos.y = y;
    switchPos.endX = x;
    switchPos.endY = y;
  };

  const onMouseUp = (e) => {
    if (!switchPos.moving) {
      console.log("click");
      switchPos.startMove = false;
      switchPos.moving = false;
      onClick();
      return;
    }
    console.log("up");
    onEnd();
  };
</script>

<button
  class="ws-switch"
  style="right: {btnSwitchPos.x}px; bottom: {btnSwitchPos.y}px; "
  bind:this={btnSwitch}
  on:mousedown={onMouseDown}
  on:mousemove={onMove}
  on:mouseleave={onEnd}
  on:mouseup={onMouseUp}
>
  {btnText}
</button>
