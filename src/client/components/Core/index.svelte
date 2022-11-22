<script lang="ts">
  import {
    LanguageList,
    FormKeys,
    OperationOriginList,
    CloudTypeList,
  } from "const";
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import SwitchButton from "components/SwitchButton/index.svelte";
  import Pannel from "components/Pannel/index.svelte";
  import Style from "./index.less";

  let show = false;
  let switchButtonPosition = { x: 0, y: 0 };
  let currentSetting = {
    [FormKeys.origin]: OperationOriginList[0].value,
    [FormKeys.cloud]: CloudTypeList[0].value,
    [FormKeys.lang]: LanguageList[0].value,
  }; // 当前配置的信息

  /*************************************
   * Lifecycle
   *************************************/

  onMount(() => {
    Style.use();
  });

  onDestroy(() => {
    Style.unuse();
  });

  let onHide = () => {
    show = false;
  };
  let onShow = () => {
    show = true;
  };

  let onJump = () => {
    console.log("setting", currentSetting);
  };
</script>

<div id="__wisdomDev">
  <SwitchButton
    bind:position={switchButtonPosition}
    bind:currentSetting
    bind:onClick={onShow}
  />

  <Pannel bind:show bind:onJump bind:currentSetting />
</div>
