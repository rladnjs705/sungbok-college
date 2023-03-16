<script lang="ts">
    import List from "$components/board/List.svelte";

    const boardList:Object = {};

    const notice = {
        title: "공지사항",
        list: boardList,
        boardType: "notice"
    };

    const questions = {
        title: "Q&A 게시판",
        list: boardList,
        boardType: "questions"
    };
</script>

<div class="flex flex-col gap-x-10 gap-y-10 md:flex-row">
    <List list={notice}/>
    <List list={questions}/>
</div>
<div class="flex flex-col gap-x-10 gap-y-10 md:flex-row md:mt-8">
    <List list={notice}/>
    <List list={questions}/>
</div>
