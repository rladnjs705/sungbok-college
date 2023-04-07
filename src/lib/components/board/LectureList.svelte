<script lang="ts">
    export let list: any;
    import patternSvg from "$lib/images/folk-pattern.png";
    import noImage from "$lib/images/noImage.jpg";
    import lectureSvg from "$lib/images/work_from_home-remove.png";
    import { LECTURE } from "$lib/utils/constans";
    let lectureList:any[] = list.list;

    function displayedAt(createDate: Array<number>) {
        const milliSeconds =
            new Date().valueOf() - new Date(dateFommater(createDate)).valueOf();
        const seconds = milliSeconds / 1000;
        if (seconds < 60) return `방금 전`;
        const minutes = seconds / 60;
        if (minutes < 60) return `${Math.floor(minutes)}분 전`;
        const hours = minutes / 60;
        if (hours < 24) return `${Math.floor(hours)}시간 전`;
        const days = hours / 24;
        if (days < 7) return `${Math.floor(days)}일 전`;
        const weeks = days / 7;
        if (weeks < 5) return `${Math.floor(weeks)}주 전`;
        const months = days / 30;
        if (months < 12) return `${Math.floor(months)}개월 전`;
        const years = days / 365;
        return `${Math.floor(years)}년 전`;
    }

    const dateFommater = (date: Array<number>): string => {
        const yyyy = date[0];
        const MM = date[1];
        const dd = date[2];
        const HH = date[3];
        const mm = date[4];
        const ss = date[5];

        return yyyy + "-" + MM + "-" + dd + " " + HH + ":" + mm + ":" + ss;
    };

    const errorImage = (e:any) => {
        e.target.src = noImage;
    }
</script>

<div class="w-full mt-5">
    <a
        class="relative mb-2 text-gray-900 no-underline dark:text-gray-100"
        href={list.boardType}
        ><div class="group relative">
            <div class="h-16 w-full rounded-xl bg-blue-50 dark:bg-gray-600">
                <div
                    class="h-full rounded-xl opacity-10 bg-left-bottom"
                    style="background-image: url({patternSvg});"
                />
            </div>
            <div
                class="absolute top-0 flex h-full w-full items-center px-8 hover:no-underline dark:hover:no-underline"
            >
                <span
                    class="w-full font-semibold hover:text-blue-500 hover:no-underline group-hover:text-blue-500 dark:hover:text-blue-200 dark:hover:no-underline dark:group-hover:text-blue-200 sm:text-lg"
                    >{list.title}</span
                >
            </div>
            <div class="absolute -top-[30px] right-0 mr-10 h-28 w-28 overflow-y-hidden">
                <img src={lectureSvg} alt={LECTURE}/>
            </div>
        </div></a>
        <div>
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {#if lectureList.length > 0}
            {#each lectureList as lecture}
                <div class="w-full space-y-[9px]">
                    <a
                        href="/articles/{lecture.id}"
                        class="line-clamp-1 w-full break-all rounded-md bg-gray-50 hover:cursor-pointer"
                        ><img
                            class="h-40 w-full rounded-md border border-gray-300 pt-4 pb-4"
                            src={lecture.thumbnailPath}
                            alt="thumbnail"
                            on:error|once={errorImage}
                        /></a
                    >
                    <div class="flex justify-between text-xs font-normal">
                        <div class="flex items-center space-x-1">
                            <a
                                class="line-clamp-1 break-all text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-200"
                                href="/users/{lecture.writer.userId}">{lecture.writer.nickName}</a
                            ><span
                                class="h-0.5 w-0.5 rounded-full bg-gray-700 dark:bg-gray-300"
                            /><span
                                class="line-clamp-1 break-all text-gray-700 dark:text-gray-300"
                                >{displayedAt(lecture.createDate)}</span
                            >
                        </div>
                        <div class="text-gray-700 dark:text-gray-300">
                            {lecture.teacher}
                        </div>
                    </div>
                    <a
                        class="block truncate font-semibold text-gray-900 hover:text-blue-500 dark:text-gray-100 dark:hover:text-blue-200"
                        href="/articles/{lecture.id}"
                        >{lecture.title}</a
                    >
                </div>
            {/each}
            {:else}
                    <div class="text-center">게시물이 없습니다.</div>
        {/if}
    </div>
</div>
</div>