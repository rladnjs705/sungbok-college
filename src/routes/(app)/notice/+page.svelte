<script lang="ts">
	import List from '$components/board/List.svelte';
    import CreateBtn from "$components/button/Create.svelte";
    const boardType = "notice";
    const boardList = {};
    const list = {
        title: "공지사항",
        list : boardList,
        link : "/"+boardType,
        boardType:boardType,
    }
</script>

<List list={list}/>
<CreateBtn link={boardType} />