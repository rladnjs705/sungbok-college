<script lang="ts">
    import DetailList from '$components/board/DetailList.svelte';
    import type { PageData } from './$types';
    import { NOTICE } from '$utils/constans';

    export let data: PageData;
    const boardType = NOTICE;
    const boardList = data.list.response.content;
    const response = data.list.response;
    const categories = data.categories.response;
    const list = {
        title: "공지사항",
        list : boardList,
        boardType:boardType,
    }
</script>

<DetailList list={list} categories={categories} boardType={boardType} response={response}/>