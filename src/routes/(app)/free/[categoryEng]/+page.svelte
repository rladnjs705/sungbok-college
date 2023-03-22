<script lang="ts">
    import DetailList from '$components/board/DetailList.svelte';
    import type { PageData } from './$types';
    import { FREE } from '$utils/constans';

    export let data: PageData;
    const boardType = FREE;
    const boardList = data.list.response.content;
    const categories = data.categories.response;
    const list = {
        title: "커뮤니티",
        list : boardList,
        boardType:boardType,
    }
</script>

<DetailList list={list} boardList={boardList} categories={categories} boardType={boardType}/>