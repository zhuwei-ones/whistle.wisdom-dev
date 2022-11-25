<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import SwitchButton from "components/SwitchButton/index.svelte";
  import Pannel from "components/Pannel/index.svelte";
  import Style from "./index.less";
  import { isProject } from "lib/index";

  let show = false;
  let isProjectEnv = false;

  /*************************************
   * Lifecycle
   *************************************/

  onMount(() => {
    Style.use();

    setTimeout(() => {
      if (isProject()) {
        isProjectEnv = true;
      }
    }, 4000);
  });

  onDestroy(() => {
    Style.unuse();
  });

  let onShow = () => {
    show = true;
  };
</script>

<div id="__wisdomDev">
  {#if isProjectEnv}
    <SwitchButton bind:onClick={onShow} />
    <Pannel bind:show />
  {/if}
</div>
