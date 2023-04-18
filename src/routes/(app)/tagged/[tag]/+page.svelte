<script lang="ts">
    import type { PageData } from './$types';
    import TagDetailList from '$lib/components/board/TagDetailList.svelte';
    export let data: PageData;
    const boardList = data.taggedList.response.content;
    const response = data.taggedList.response;
    const list = {
        title: data.tagName,
        list : boardList
    }
</script>

<TagDetailList list={list} response={response}/>
