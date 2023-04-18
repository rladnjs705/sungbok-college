<script lang="ts">
    import { goto } from '$app/navigation';
    import { boardDetailList, pageNumber, itemCategorySelected, isDark } from '$stores';
    import Category from './Category.svelte';
    import { paginate, LightPaginationNav, DarkPaginationNav } from 'svelte-paginate'
    import lectureSvg from "$lib/images/lecture-remove.png";
    import patternSvg from "$lib/images/pattern.svg";
    import profileSvg from "$lib/images/profile.png";
    import noImage from "$lib/images/noImage.jpg";
    import { LECTURE } from '$lib/utils/constans';
    
    export let list:any;
    export let categories:any=[];
    export let boardType:any;
    export let boardList:any = list.list;
    export let response:any;
    let items:any[];
    let paginatedItems:any;
    let currentPage = 1
    let pageSize:number = 4

    function displayedAt(createDate:Array<number>) {
        const milliSeconds = new Date().valueOf() - new Date(dateFommater(createDate)).valueOf();
        const seconds = milliSeconds / 1000
        if (seconds < 60) return `방금 전`
        const minutes = seconds / 60
        if (minutes < 60) return `${Math.floor(minutes)}분 전`
        const hours = minutes / 60
        if (hours < 24) return `${Math.floor(hours)}시간 전`
        const days = hours / 24
        if (days < 7) return `${Math.floor(days)}일 전`
        const weeks = days / 7
        if (weeks < 5) return `${Math.floor(weeks)}주 전`
        const months = days / 30
        if (months < 12) return `${Math.floor(months)}개월 전`
        const years = days / 365
        return `${Math.floor(years)}년 전`
    }

    const dateFommater = (date:Array<number>):string => {
        const yyyy = date[0];
        const MM = date[1];
        const dd = date[2];
        const HH = date[3];
        const mm = date[4];
        const ss = date[5];

        return yyyy+"-"+MM+"-"+dd+" "+HH+":"+mm+":"+ss;
    }

    const formatLargeNumber = (n:number) => {
        if (n < 1e3) return n
        if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K'
        if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M'
        if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B'
        if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T'
    }

    $:
    {
        if($boardDetailList){
            boardList = $boardDetailList.response.content;
            response = $boardDetailList.response;
            items = boardList;
            paginatedItems = paginate({ items, pageSize, currentPage});
        }
    }

    const errorImage = (e:any) => {
        e.target.src = noImage;
    }
</script>

<div class="w-full mt-5">
    <a
        class="relative mb-2 text-gray-900 no-underline dark:text-gray-100"
        href={boardType}
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
            <div class="absolute -top-[5px] right-0 mr-10 h-28 w-28 overflow-y-hidden">
                <img src={lectureSvg} alt={LECTURE}/>
            </div>
        </div>
    </a>

    {#if categories}
        <Category boardType={boardType} categories={categories} />
    {/if}
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
        {#if paginatedItems}
            {#each paginatedItems as lecture}
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
                            <!-- <a class="line-clamp-1 break-all text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-200"
                                href="/users/{lecture.writer.userId}">{lecture.writer.nickName}</a> -->
                            <div class="line-clamp-1 break-all text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-200">
                                {lecture.teacher}
                            </div>
                            <span class="h-0.5 w-0.5 rounded-full bg-gray-700 dark:bg-gray-300" />
                            <span class="line-clamp-1 break-all text-gray-700 dark:text-gray-300">
                                {displayedAt(lecture.createDate)}
                            </span>
                        </div>
                        <div class="inline-flex items-center space-x-0.5 text-xs sm:text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-5 w-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span class="font-medium">{formatLargeNumber(lecture.viewCount)}</span>
                            <span class="sr-only">views</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-5 w-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"></path>
                            </svg>
                            <span class="font-medium">{formatLargeNumber(lecture.commentCount)}</span>
                            <span class="sr-only">comments</span>
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
    {#if $isDark}
        <DarkPaginationNav
            totalItems="{response.totalElements}"
            pageSize="{pageSize}"
            currentPage="{currentPage}"
            limit="{1}"
            showStepOptions="{true}"
            on:setPage="{(e) => currentPage = e.detail.page}"
        />
        {:else}
        <LightPaginationNav
            totalItems="{response.totalElements}"
            pageSize="{pageSize}"
            currentPage="{currentPage}"
            limit="{1}"
            showStepOptions="{true}"
            on:setPage="{(e) => currentPage = e.detail.page}"
        />
    {/if}
</div>
