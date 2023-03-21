<script lang="ts">
    import List from '$components/board/List.svelte';
    import CreateBtn from "$components/button/Create.svelte";
    import type { PageData } from './$types';
    import { NOTICE } from '$utils/constans';

    export let data: PageData;
    const boardType = NOTICE;
    const boardList = data.list.response.content;
    const list = {
        title: "공지사항",
        list : boardList,
        boardType:boardType,
    }
</script>

<List list={list}/>
<CreateBtn boardType={boardType} />