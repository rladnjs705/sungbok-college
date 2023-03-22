<script lang="ts">
    import type { PageData } from './$types';
    import { FREE } from '$utils/constans';
    import DetailList from '$lib/components/board/DetailList.svelte';

    export let data: PageData;
    const boardType = FREE;
    const boardList = data.list.response.content;
    const response = data.list.response;
    const categories = data.categories.response;
    const list = {
        title: "커뮤니티",
        list : boardList,
        boardType:boardType,
    }
</script>

<DetailList list={list} categories={categories} boardType={boardType} response={response}/>