<script lang="ts">
    import List from "$components/board/List.svelte";
    import type { PageData } from './$types';

    export let data: PageData;

    const notice = {
        title: "공지사항",
        list: data.noticeList.response.content,
        boardType: "notice"
    };

    const questions = {
        title: "Q&A 게시판",
        list: data.questionList.response.content,
        boardType: "questions"
    };
    
    const free = {
        title: "자유 게시판",
        list: data.freeList.response.content,
        boardType: "free"
    };

    const lecture = {
        title: "강의 콘텐츠",
        list: data.lectureList.response.content,
        boardType: "lecture"
    };
</script>

<div class="flex flex-col gap-x-10 gap-y-10 md:flex-row">
    <List list={notice}/>
    <List list={questions}/>
</div>
<div class="flex flex-col gap-x-10 md:flex-row md:mt-8">
    <List list={free}/>
    <List list={lecture}/>
</div>
