<script lang="ts">
    import { goto } from "$app/navigation";

    export let link:any;
    export let onAddBoard:any;

    function goBack() {
        goto(link);
    }
</script>

<div class="flex justify-center gap-x-3 sm:justify-end">
    <button
        type="button"
        class="w-20 rounded-md border border-gray-500/30 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-100 focus:outline-none dark:border-gray-500/70 dark:bg-gray-700 dark:hover:bg-gray-600"
        on:click={goBack}
        >취소</button>
    <button 
        type="submit" 
        class="inline-flex items-center space-x-2 rounded-md bg-blue-500 px-8 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600"
        on:click={() => onAddBoard()}
        >등록</button>
</div>