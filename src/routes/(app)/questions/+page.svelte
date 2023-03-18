<script lang="ts">
	import List from '$components/board/List.svelte';
    import CreateBtn from "$components/button/Create.svelte";
    import type { PageData } from './$types';

    export let data: PageData;
    const boardType = "questions";
    const boardList = data.list.response.content;
    const list = {
        title: "Q&A 게시판",
        list : boardList,
        link : "/"+boardType,
        boardType:boardType,
    }
</script>

<List list={list}/>
<CreateBtn link={boardType} />
