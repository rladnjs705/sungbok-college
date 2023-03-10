<script lang="ts">
	import List from '$components/board/List.svelte';
    import CreateBtn from "$components/button/Create.svelte";

    const boardType = "questions";
    const boardList = {};
    const list = {
        title: "Q&A 게시판",
        list : boardList,
        boardType: boardType,
    }
</script>

<List list={list}/>
<CreateBtn link={boardType} />
