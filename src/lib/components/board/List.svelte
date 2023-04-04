<script lang="ts">
    export let list:any;

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

</script>

<div class="w-full mt-5">
    <a
        class="relative mb-2 text-gray-900 no-underline dark:text-gray-100"
        href={list.boardType}
        ><div class="group relative">
            <div class="h-16 w-full rounded-xl bg-blue-50 dark:bg-gray-600">
                <div
                    class="h-full rounded-xl opacity-10"
                    style="background-image: url(&quot;pattern.svg&quot;);"
                    class:bg-bottom={list.boardType==="notice"}
                    class:bg-right-bottom={list.boardType=="questions"}
                    class:bg-right-top={list.boardType==""}
                    class:bg-left-top={list.boardType==""}
                    class:bg-left-bottom={list.boardType==""}
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
            <div
                class="absolute -top-[10px] right-0 mr-10 h-[74px] w-[112px] overflow-y-hidden"
            >
                <img class="dark:hidden" src="/notice.svg" alt="notice" /><img
                    class="hidden dark:block"
                    src="/darkmode/notice.svg"
                    alt="notice"
                />
            </div>
        </div></a>
    <div>
        <ul class="divide-y divide-gray-500/30 dark:divide-gray-500/70">
            {#if list.list.length > 0}
            {#each list.list as boardList}
            <li class="py-4 last:pb-0">
                <div class="mb-2 flex">
                    <div class="flex flex-1 items-center space-x-1">
                        <!-- <a href="/users/138400"> -->
                            <img
                                class="h-5 w-5 rounded-full"
                                src="/profile.png"
                                alt="프로필 사진"
                            />
                        <!-- </a> -->
                        <div
                            class="inline pl-1 text-xs font-medium text-gray-700 hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-200 sm:text-sm"
                            >{boardList.isSecret === false ? boardList.writer.nickName : "익명"}</div
                        >
                        <div
                            class="text-xs font-normal leading-5 text-gray-700 dark:text-gray-200 sm:text-sm flex"
                        >
                            <span class="mr-1">·</span>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline w-3 h-3 md:w-4 md:h-4 text-red-500 fill-red-500 mb-0.5 mr-0.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                </svg>
                            </span>
                            <span>{formatLargeNumber(boardList.likeCount)}</span>
                            <span>
                                <span class="ml-1">·</span>
                                <span>{displayedAt(boardList.createDate)}</span>
                            </span>
                        </div>
                    </div>
                    <div
                        class="flex space-x-2 text-gray-700 dark:text-gray-200"
                    >
                        <div class="flex flex-1 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-4 w-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>                               
                            <span class="text-xs font-normal sm:text-sm">{formatLargeNumber(boardList.viewCount)}</span>
                        </div>
                        <div class="flex flex-1 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-4 w-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"></path>
                            </svg>
                            <span class="ml-0.5 text-xs font-normal sm:text-sm">{formatLargeNumber(boardList.commentCount)}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <a
                        class="line-clamp-1 w-fit break-all text-sm font-semibold text-gray-900 hover:text-blue-500 dark:text-gray-100 dark:hover:text-blue-200 sm:text-base sm:leading-5"
                        href="/articles/{boardList.id}"
                        >{boardList.title}</a
                    >
                </div>
            </li>
            {/each}
            {:else}
            <li>
                <div class="text-center">게시물이 없습니다.</div>
            </li>
            {/if}
        </ul>
    </div>
</div>