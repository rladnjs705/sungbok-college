<script lang="ts">
    export let toggleTheme:any;
    export let isDark:any;
    export let onSideBar:any;
</script>

<!-- Header -->
<div class="absolute md:fixed w-full flex items-center justify-between h-14 text-white z-10">
    <div class="flex items-center justify-start md:justify-center pl-3 w-14 md:w-64 h-14 bg-blue-600 dark:bg-gray-600 border-none">
      <img class="w-7 h-7 md:w-10 md:h-10 mr-2 rounded-md overflow-hidden hidden processing" src="/dummy-avatar.jpg" alt="profile" />
      <button class="w-12 h-16 -mr-2 border-r rounded-md overflow-hidden md:hidden" on:click={onSideBar}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 my-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
       </button>
       <a href="/">
        <img class="w-24 h-24 bg-transparent hidden md:block" src="/logo-removebg.png" alt="logo">
      </a>
    </div>
    <div class="flex justify-between items-center h-14 bg-blue-600 dark:bg-gray-600 header-right">
      <div class="flex items-center">
        <div class="block w-px h-6 bg-gray-400 dark:bg-gray-700 md:hidden"></div>
        <a href="/">
          <img class="w-24 h-24 bg-transparent md:hidden" src="/logo-removebg.png" alt="logo">
        </a>
        <div class="hidden items-center md:space-x-3 lg:space-x-7 md:flex lg:ml-[60px]">
          <div class="shrink-0">
              <a
                  class="hover:text-blue-100 dark:text-gray-100 dark:hover:text-blue-200 text-sm font-medium"
                  href="/notice"><span class="hover:no-underline">공지사항</span></a
              >
          </div>
          <div class="h-3 w-[1px] bg-gray-400 dark:bg-gray-400/70" />
          <div class="shrink-0">
              <a
                  class="hover:text-blue-100 dark:text-gray-100 dark:hover:text-blue-100 text-sm font-medium hover:no-underline"
                  href="/lecture">강의콘텐츠</a
              >
          </div>
          <div class="h-3 w-[1px] bg-gray-400 dark:bg-gray-400/70" />
          <div class="shrink-0">
            <a
                class="hover:text-blue-100 dark:text-gray-100 dark:hover:text-blue-100 text-sm font-medium hover:no-underline"
                href="/reportCard">출결 현황</a
            >
          </div>
          <div class="h-3 w-[1px] bg-gray-400 dark:bg-gray-400/70" />
          <div class="shrink-0">
              <a
                  class="hover:text-blue-100 dark:text-gray-100 dark:hover:text-blue-100 text-sm font-medium hover:no-underline"
                  href="/reportCard">성적</a
              >
          </div>
          <div class="h-3 w-[1px] bg-gray-400 dark:bg-gray-400/70" />
          <div class="shrink-0">
            <a
                class="hover:text-blue-100 dark:text-gray-100 dark:hover:text-blue-100 text-sm font-medium hover:no-underline"
                href="/questions">Q&amp;A</a
            >
        </div>
      </div>      
      </div>
      <ul class="flex items-center">
        <li>
            <button
            aria-hidden="true"
            on:click={toggleTheme}
            class="group p-2 transition-colors duration-200 rounded-full shadow-md bg-blue-200 hover:bg-blue-200 dark:bg-gray-50 dark:hover:bg-gray-200 text-gray-900 focus:outline-none"
          >
          {#if isDark}
            <svg
            width="24"
            height="24"
            class="fill-current text-gray-700 group-hover:text-gray-500 group-focus:text-gray-700 dark:text-gray-700 dark:group-hover:text-gray-500 dark:group-focus:text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke=""
            >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
            </svg>
           {:else}
                <svg
                width="24"
                height="24"
                class="fill-current text-gray-700 group-hover:text-gray-500 group-focus:text-gray-700 dark:text-gray-700 dark:group-hover:text-gray-500 dark:group-focus:text-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke=""
                >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
                </svg>
            {/if}
          </button>
        </li>
        <li>
          <div class="block w-px h-6 mx-3 bg-gray-400 dark:bg-gray-700"></div>
        </li>
        <li>
          <a href="#null" class="flex items-center mr-4 hover:text-blue-100">
            <span class="inline-flex mr-1">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </span>
            Logout
          </a>
        </li>
      </ul>
    </div>
  </div>
  <!-- ./Header -->