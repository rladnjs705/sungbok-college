<script lang="ts">
    import { page } from "$app/stores";
    import clip from "$lib/images/404-removebg.png";
    import { FREE, LECTURE, NOTICE, QUESTIONS } from "$lib/utils/constans";
</script>

{#if $page.status != 404}
    <div class="w-full h-full flex justify-center items-center">
        <div class="text-center space-y-4">
            <h2>
                {$page.status}:{#if $page.error} {$page.error.message} {/if}
            </h2>
            <p>We're sorry, something went wrong.</p>
        </div>
    </div>
    {:else}
    <main class="my-20 mx-auto w-full max-w-xl sm:my-32">
        <div class="flex justify-center">
            <img src={clip} alt="404"/>
        </div>
        <div class="mx-auto mt-7 max-w-xl px-4 sm:px-0">
            <div class="text-center">
                <h1 class="mt-2 text-2xl font-extrabold tracking-tight sm:text-5xl">
                    This page does not exist.
                </h1>
                <p class="mt-2 text-sm text-gray-500 sm:text-lg">
                    죄송합니다. 찾으시려는 페이지는 존재하지 않습니다.
                </p>
            </div>
            <div class="mt-12">
                <ul
                    class="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200 dark:divide-gray-600 dark:border-gray-600"
                >
                    <li class="relative flex items-start space-x-4 py-4">
                        <div class="flex-shrink-0">
                            <a
                                class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-gray-700"
                                href="/{QUESTIONS}"
                                ><svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                    class="h-5 w-5 text-blue-500 dark:text-blue-300"
                                    ><path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                                    /></svg
                                ></a
                            >
                        </div>
                        <div class="min-w-0 flex-1">
                            <a class="text-base font-medium" href="/{QUESTIONS}"
                                >Q&amp;A</a
                            >
                            <p>
                                <a class="text-sm text-gray-500" href="/{QUESTIONS}"
                                    >기술, 커리어, 일상에 대한 모든 질문과 답변</a
                                >
                            </p>
                        </div>
                        <div class="flex-shrink-0 self-center">
                            <a href="/{QUESTIONS}"
                                ><svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    class="h-5 w-5 text-gray-400 dark:text-gray-600"
                                    ><path
                                        fill-rule="evenodd"
                                        d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                                        clip-rule="evenodd"
                                    /></svg
                                ></a
                            >
                        </div>
                    </li>
                    <!-- <li class="relative flex items-start space-x-4 py-4">
                        <div class="flex-shrink-0">
                            <a
                                class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-gray-700"
                                href="/knowledge"
                                ><svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                    class="h-5 w-5 text-blue-500 dark:text-blue-300"
                                    ><path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                                    /></svg
                                ></a
                            >
                        </div>
                        <div class="min-w-0 flex-1">
                            <a class="text-base font-medium" href="/knowledge"
                                >지식</a
                            >
                            <p>
                                <a class="text-sm text-gray-500" href="/knowledge"
                                    >팁과 칼럼, 모든 지식 나눔</a
                                >
                            </p>
                        </div>
                        <div class="flex-shrink-0 self-center">
                            <a href="/knowledge"
                                ><svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    class="h-5 w-5 text-gray-400 dark:text-gray-600"
                                    ><path
                                        fill-rule="evenodd"
                                        d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                                        clip-rule="evenodd"
                                    /></svg
                                ></a
                            >
                        </div>
                    </li> -->
                    <li class="relative flex items-start space-x-4 py-4">
                        <div class="flex-shrink-0">
                            <a
                                class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-gray-700"
                                href="/{FREE}"
                                ><svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                    class="h-5 w-5 text-blue-500 dark:text-blue-300"
                                    ><path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                                    /></svg
                                ></a
                            >
                        </div>
                        <div class="min-w-0 flex-1">
                            <a class="text-base font-medium" href="/{FREE}"
                                >커뮤니티</a
                            >
                            <p>
                                <a class="text-sm text-gray-500" href="/{FREE}"
                                    >커뮤니티 및 일상 이야기</a
                                >
                            </p>
                        </div>
                        <div class="flex-shrink-0 self-center">
                            <a href="/{FREE}"
                                ><svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    class="h-5 w-5 text-gray-400 dark:text-gray-600"
                                    ><path
                                        fill-rule="evenodd"
                                        d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                                        clip-rule="evenodd"
                                    /></svg
                                ></a
                            >
                        </div>
                    </li>
                    <li class="relative flex items-start space-x-4 py-4">
                        <div class="flex-shrink-0">
                            <a
                                class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-gray-700"
                                href="/{LECTURE}"
                                ><svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                    class="h-5 w-5 text-blue-500 dark:text-blue-300"
                                    ><path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                                    /></svg
                                ></a
                            >
                        </div>
                        <div class="min-w-0 flex-1">
                            <a class="text-base font-medium" href="/{LECTURE}"
                                >강의 콘텐츠</a
                            >
                            <p>
                                <a class="text-sm text-gray-500" href="/{LECTURE}"
                                    >강의 동영상의 다양한 정보</a
                                >
                            </p>
                        </div>
                        <div class="flex-shrink-0 self-center">
                            <a href="/{LECTURE}"
                                ><svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    class="h-5 w-5 text-gray-400 dark:text-gray-600"
                                    ><path
                                        fill-rule="evenodd"
                                        d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                                        clip-rule="evenodd"
                                    /></svg
                                ></a
                            >
                        </div>
                    </li>
                    <!-- <li class="relative flex items-start space-x-4 py-4">
                        <div class="flex-shrink-0">
                            <a
                                class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-gray-700"
                                href="/jobs"
                                ><svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                    class="h-5 w-5 text-blue-500 dark:text-blue-300"
                                    ><path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                                    /></svg
                                ></a
                            >
                        </div>
                        <div class="min-w-0 flex-1">
                            <a class="text-base font-medium" href="/jobs">JOBS</a>
                            <p>
                                <a class="text-sm text-gray-500" href="/jobs"
                                    >프리랜서, 정규직 채용 정보</a
                                >
                            </p>
                        </div>
                        <div class="flex-shrink-0 self-center">
                            <a href="/jobs"
                                ><svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    class="h-5 w-5 text-gray-400 dark:text-gray-600"
                                    ><path
                                        fill-rule="evenodd"
                                        d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                                        clip-rule="evenodd"
                                    /></svg
                                ></a
                            >
                        </div>
                    </li> -->
                    <li class="relative flex items-start space-x-4 py-4">
                        <div class="flex-shrink-0">
                            <a
                                class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-gray-700"
                                href="/{NOTICE}"
                                ><svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                    class="h-5 w-5 text-blue-500 dark:text-blue-300"
                                    ><path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                                    /></svg
                                ></a
                            >
                        </div>
                        <div class="min-w-0 flex-1">
                            <a class="text-base font-medium" href="/{NOTICE}"
                                >공지사항</a
                            >
                            <p>
                                <a class="text-sm text-gray-500" href="/{NOTICE}"
                                    >새벽이슬 청년부에 관련된 이벤트와 공지사항</a
                                >
                            </p>
                        </div>
                        <div class="flex-shrink-0 self-center">
                            <a href="/{NOTICE}"
                                ><svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    class="h-5 w-5 text-gray-400 dark:text-gray-600"
                                    ><path
                                        fill-rule="evenodd"
                                        d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                                        clip-rule="evenodd"
                                    /></svg
                                ></a
                            >
                        </div>
                    </li>
                </ul>
                <div class="mt-8">
                    <a
                        class="text-base font-medium text-blue-500 hover:text-blue-400 dark:hover:text-blue-200"
                        href="/">홈으로 다시 가기 →</a>
                </div>
            </div>
        </div>
    </main>    
{/if}

