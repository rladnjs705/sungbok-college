<script lang="ts">
    import DetailList from '$components/board/DetailList.svelte';
    import type { PageData } from './$types';
    import { QUESTIONS } from '$utils/constans';

    export let data: PageData;
    const boardType = QUESTIONS;
    const boardList = data.list.response.content;
    const categories = data.categories.response;
    const list = {
        title: "Q&A 게시판",
        list : boardList,
        boardType:boardType,
    }
</script>

<DetailList list={list} categories={categories} boardType={boardType}/>