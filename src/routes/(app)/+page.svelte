<script lang="ts">
    import List from "$components/board/List.svelte";
    import { FREE, LECTURE, NOTICE, QUESTIONS } from "$lib/utils/constans";
    import type { PageData } from './$types';
    export let data: PageData;

    const notice = {
        title: "공지사항",
        list: data.noticeList.response.content,
        boardType: NOTICE
    };

    console.log(data)

    const questions = {
        title: "Q&A 게시판",
        list: data.questionList.response,
        boardType: QUESTIONS
    };
    
    const free = {
        title: "커뮤니티",
        list: data.freeList.response,
        boardType: FREE
    };

    const lecture = {
        title: "강의 콘텐츠",
        list: data.lectureList.response,
        boardType: LECTURE
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
