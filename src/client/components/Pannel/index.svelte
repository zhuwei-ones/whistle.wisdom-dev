<script lang="ts">
  import { PanelConfigList } from "const";
  import { onDestroy, onMount } from "svelte";

  import Style from "./index.less";

  export let show = false;
  export let onJump;
  export let selectList = {};

  /*************************************
   * Lifecycle
   *************************************/

  onMount(() => {
    Style.use();
  });

  onDestroy(() => {
    Style.unuse();
  });

  const jumpLink = () => {
    show = false;
    onJump();
  };

  const onClose = () => {
    show = false;
  };
</script>

<div class="ws-panel" style="display: {show ? 'block' : 'none'};">
  <div class="mdc-dialog mdc-dialog--open">
    <div class="mdc-dialog__container">
      <div class="mdc-dialog__surface">
        <h2 class="mdc-dialog__title">新建一个Project独立开发环境</h2>
        <div class="mdc-dialog__content">
          {#each PanelConfigList as config}
            <div class="form-row">
              <span>{config.title}：</span>

              {#each config.options as opt}
                <div class="mdc-form-field">
                  <div
                    class="mdc-radio mdc-ripple-upgraded--unbounded mdc-ripple-upgraded"
                  >
                    <input
                      class="mdc-radio__native-control"
                      type="radio"
                      id={`radio-${opt.value}`}
                      value={opt.value}
                      bind:group={selectList[config.key]}
                    />
                    <div class="mdc-radio__background">
                      <div class="mdc-radio__outer-circle" />
                      <div class="mdc-radio__inner-circle" />
                    </div>
                    <div class="mdc-radio__ripple" />
                  </div>
                  <label for={`radio-${opt.value}`}>{opt.label} </label>
                </div>
              {/each}
            </div>
          {/each}
        </div>
        <div style="padding:20px">当前配置：{JSON.stringify(selectList)}</div>
        <button class="jump-btn" on:click={jumpLink}> 跳转 </button>
      </div>
    </div>
    <div class="mdc-dialog__scrim" on:click={onClose} on:keypress={onClose} />
  </div>
</div>
