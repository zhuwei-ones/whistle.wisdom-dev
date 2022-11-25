<script lang="ts">
  import {
    CloudTypeList,
    FormKeys,
    jumpOriginMap,
    LanguageList,
    OperationOriginList,
    PanelConfigList,
  } from "const/index";
  import { getOriginalUrl } from "lib/index";
  import { onDestroy, onMount } from "svelte";

  import Style from "./index.less";

  export let show = false;
  export let selectList = {
    [FormKeys.cloud]: CloudTypeList[0].value,
    [FormKeys.origin]: OperationOriginList[0].value,
    [FormKeys.lang]: LanguageList[0].value,
  };

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
    const cloud = selectList[FormKeys.cloud];
    const origin = selectList[FormKeys.origin];
    const lang = selectList[FormKeys.lang];
    const { host, pathname, protocol, href } = location;

    window.open(
      `${protocol}//${lang}.${
        jumpOriginMap[cloud + "_" + origin]
      }.${getOriginalUrl(href)}`
    );

    show = false;
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
