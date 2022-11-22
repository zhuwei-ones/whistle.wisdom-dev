<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Style from "./index.less";

  export let show = false;

  /*************************************
   * Lifecycle
   *************************************/

  onMount(() => {
    Style.use();
  });

  onDestroy(() => {
    Style.unuse();
  });
</script>

<div
  class="ws-mask"
  style="display: {show ? 'block' : 'none'};"
  on:click
  on:keypress
/>
