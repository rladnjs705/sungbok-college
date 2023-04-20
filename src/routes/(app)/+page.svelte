<script lang="ts">
    import { itemFooterSelected} from "$lib/stores";
    import List from "$components/board/List.svelte";
    import { ALL, FREE, LECTURE, NOTICE, QUESTIONS } from "$lib/utils/constans";
    import { onMount } from "svelte";
    import type { PageData } from './$types';
    import LectureList from "$lib/components/board/LectureList.svelte";


    import type { AdOptions, BannerAdOptions, AdMobBannerSize } from "@capacitor-community/admob";
    import { AdMob, BannerAdSize, BannerAdPosition, BannerAdPluginEvents } from "@capacitor-community/admob";

    export let data: PageData;

    const notice = {
        title: "공지사항",
        list: data.noticeList.response,
        boardType: NOTICE
    };

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

    onMount(async () => {
        itemFooterSelected.selectFooter(ALL);

        const options:BannerAdOptions = {
            adId: 'ca-app-pub-3940256099942544/6300978111',
            adSize: BannerAdSize.BANNER,
            position: BannerAdPosition.BOTTOM_CENTER,
            margin: 64,
            isTesting: true
            // npa: true
        }

        await AdMob.showBanner(options);
    })
</script>

<div class="flex flex-col gap-x-10 md:flex-row">
    <List list={notice}/>
    <List list={questions}/>
</div>
<div class="flex flex-col gap-x-10 md:flex-row">
    <List list={free}/>
    <LectureList list={lecture}/>
</div>