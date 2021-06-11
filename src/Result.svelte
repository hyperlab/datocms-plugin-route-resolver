<script>
  import { value } from "./store";

  export let result = null;

  function handleKeyDown(event) {
    const { keyCode } = event;
    if (keyCode === 13) {
      // Enter
      value.set(result.url);
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

{#if result}
  <ul>
    <li class="active" on:click={() => value.set(result.url)}>
      <h3>{result.url}</h3>
      <span>{result.source}</span>
    </li>
  </ul>
{:else}
  No results were found.
{/if}

<style>
  ul {
    display: block;
    list-style-type: none;
    margin-top: 4px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0.1) 0px 4px 11px;
    padding: 4px 0;
  }

  li {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 12px;
    line-height: 1.5;
  }

  li span {
    text-transform: capitalize;
    margin-left: 1em;
    font-size: 0.75em;
    color: #848484;
  }

  li.active {
    background-color: var(--semi-transparent-accent-color);
  }
</style>
