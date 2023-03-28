<script lang="ts">
    import DetailList from '$components/board/DetailList.svelte';
    import type { PageData } from './$types';
    import { LECTURE } from '$utils/constans';

    export let data: PageData;
    const boardType = LECTURE;
    const boardList = data.list.response.content;
    const response = data.list.response;
    const categories = data.categories.response;
    const list = {
        title: "강의 콘텐츠",
        list : boardList,
        boardType:boardType,
    }
</script>

<DetailList list={list} categories={categories} boardType={boardType} response={response}/>