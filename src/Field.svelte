<script>
  import Result from "./Result.svelte";
  import { value } from "./store";
  import { lookup } from "./lookup";

  export let placeholder = "URL",
    urlPrefix;
  let result = null;
  let timeout = null;

  async function change(e) {
    const value = e.target.value;

    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      result = await lookup(value);
    }, 500);
  }

  function deselect() {
    value.set(null);
  }
</script>

{#if $value}
  <div class="details">
    <h3>{$value}</h3>
    <div class="controls">
      <a href={`${urlPrefix}${$value}`} target="_blank">Open url</a>
      <button on:click={deselect}
        ><svg
          height="20"
          width="20"
          viewBox="0 0 20 20"
          aria-hidden="true"
          focusable="false"
          class="css-19bqh2r"
          ><path
            d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"
          /></svg
        ></button
      >
    </div>
  </div>
{:else}
  <div class="field">
    <input type="text" {placeholder} on:input={change} />
  </div>
  {#if result}
    <Result {result} />
  {/if}
{/if}

<style>
  .details .controls {
    display: flex;
    flex-direction: row;
  }

  .details .controls button {
    border: none;
    background: transparent;
    padding: 4px;
    margin: -4px;
    margin-left: 0;
    cursor: pointer;
  }

  .field {
    position: relative;
  }

  input::placeholder {
    color: rgb(215, 215, 215);
  }
</style>
