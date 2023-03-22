<script lang="ts">
    import CreateBtn from "$components/button/Create.svelte";
    import { itemCategorySelected,boardDetailList } from '$stores';
    import { ALL } from '$utils/constans';

    export let boardType:any;
    export let categories:any;

    const onSelectCategory = (_id:any) => {
        $itemCategorySelected = ALL;
        itemCategorySelected.selectCategory(_id);
        boardDetailList.getBoardDetailList(boardType,_id);
    };
</script>
<div class="justify-between relative my-6 flex items-center">
    <div class="flex grow flex-col gap-y-4">
        <div class="flex justify-start">
            <CreateBtn boardType={boardType} />
            <nav class="scroll-hidden flex lg:space-x-8">
                {#each categories as category}
                    {#if $itemCategorySelected === category.categoryEng}
                        <a href="/{boardType}/{category.categoryEng}" class="bg-gray-100 dark:bg-gray-700 flex shrink-0 rounded-md py-2 px-1 md:px-3 text-sm font-medium sm:text-base sm:leading-5" on:click={() => onSelectCategory(category.categoryEng)} >{category.categoryName}</a>
                    {:else}
                        <a href="/{boardType}/{category.categoryEng}" class="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-200 flex shrink-0 rounded-md py-2 px-1 md:px-3 text-sm font-medium sm:text-base sm:leading-5" on:click={() => onSelectCategory(category.categoryEng)}>{category.categoryName}</a>
                    {/if}
                {/each}
                {#if $itemCategorySelected === ALL}
                <a href="/{boardType}" class="bg-gray-100 dark:bg-gray-700 flex shrink-0 rounded-md py-2 px-0 md:px-3 text-sm font-medium sm:text-base sm:leading-5" on:click={() => onSelectCategory(ALL)}>전체</a>
                {:else}
                <a href="/{boardType}" class="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-200 flex shrink-0 rounded-md py-2 px-1 md:px-3 text-sm font-medium sm:text-base sm:leading-5" on:click={() => onSelectCategory(ALL)}>전체</a>
                {/if}
            </nav>
        </div>
    </div>
</div>