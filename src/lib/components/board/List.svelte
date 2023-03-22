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
            {#if list.list}
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
                            class="text-xs font-normal leading-5 text-gray-700 dark:text-gray-200 sm:text-sm"
                        >
                            <span class="mr-0.5">·</span><svg
                                class="inline h-3 w-3"
                                width="9"
                                height="12"
                                viewBox="0 1 9 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                ><title>bolt icon</title><path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M5.21535 0.575533C5.4443 0.647704 5.6 0.86003 5.6 1.10009V3.85009L7.8 3.85009C8.00508 3.85009 8.19313 3.96419 8.28783 4.14609C8.38254 4.328 8.36818 4.54748 8.25057 4.71549L4.40057 10.2155C4.26291 10.4122 4.0136 10.4968 3.78464 10.4246C3.55569 10.3525 3.4 10.1401 3.4 9.90009L3.4 7.15009H1.2C0.994914 7.15009 0.806866 7.03599 0.712157 6.85408C0.617448 6.67218 0.631811 6.45269 0.749418 6.28468L4.59942 0.784684C4.73708 0.588021 4.98639 0.503362 5.21535 0.575533Z"
                                    fill="currentColor"
                                /></svg
                            ><span class="space-x-1"
                                ><span>{boardList.viewCount}</span><span>·</span><span
                                    >{displayedAt(boardList.createDate)}</span
                                ></span
                            >
                        </div>
                    </div>
                    <div
                        class="flex space-x-2 text-gray-700 dark:text-gray-200"
                    >
                        <div class="flex flex-1 items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                                class="h-4 w-4 shrink-0"
                                ><path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                /></svg
                            ><span class="text-xs font-normal sm:text-sm"
                                >{boardList.likeCount}</span
                            >
                        </div>
                        <div class="flex flex-1 items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                                class="h-4 w-4 shrink-0"
                                ><path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                                /></svg
                            ><span class="ml-0.5 text-xs font-normal sm:text-sm"
                                >{boardList.commentCount}</span
                            >
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
                <div>게시물이 없습니다.</div>
            </li>
            {/if}
        </ul>
    </div>
</div>