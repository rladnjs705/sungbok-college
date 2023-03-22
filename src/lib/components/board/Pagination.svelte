<script lang="ts">
	import { pageNumber } from '$stores';
    export let response:any;

    let totalElements:number = response.totalElements;
    let totalPages:number = response.totalPages;
    let size:number = response.size;
    $: totalPages = Math.floor(totalElements / size)+1;

</script>
<span class="flex justify-center col-span-4 mt-1 sm:mt-auto">
    <nav aria-label="Table navigation">
      <ul class="inline-flex items-center mt-4">
        <li>
          <button class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple" 
          on:click={() => $pageNumber--} disabled={$pageNumber === 1} class:hidden={$pageNumber === 1}>
            <svg aria-hidden="true" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path>
            </svg>
          </button>
        </li>
        {#each Array(totalPages) as _, idx}
            {#if $pageNumber === idx+1}
            <li>
                <button class="px-3 py-1 text-white dark:text-gray-800 transition-colors duration-150 bg-blue-600 dark:bg-gray-100 border border-r-0 border-blue-600 dark:border-gray-100 rounded-md focus:outline-none focus:shadow-outline-purple">{idx+1}</button>
            </li>
            {:else}
            <li>
                <button class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple" on:click={() => $pageNumber=idx+1}>{idx+1}</button>
            </li>
            {/if}
        {/each}
        <li>
          <button class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
          on:click={() => $pageNumber++} disabled={$pageNumber === totalPages} class:hidden={$pageNumber === totalPages}>
            <svg class="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
              <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path>
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  </span> 