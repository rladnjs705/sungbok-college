<script lang="ts">
	import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { ALL, NOTICE, QUESTIONS, LECTURE, FREE, REPORTCARD, PROFILE, ATTENDANCE} from '$utils/constans';
  import { auth, itemFooterSelected,itemCategorySelected, pageNumber, authToken, isProfileOpen } from '$stores';
  import { goto } from '$app/navigation';
  import axios from 'axios';
  import { Notyf } from 'notyf';
  import 'notyf/notyf.min.css';
  const notyf = new Notyf({
    duration: 3000,
    position: {
      x: 'right',
      y: 'top',
    }
  });

  import dummyAvatar from "$lib/images/dummy-avatar.jpg";

  export let isSidebar: boolean;
  export let onSideBar:any;
  export let closedSidebar:any;
  let isMobile = true;

  onMount(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    if($page.params.categoryEng){
          itemCategorySelected.selectCategory($page.params.categoryEng);
          $pageNumber = 1
      }else{
          $itemCategorySelected = ALL;
          itemCategorySelected.selectCategory(ALL);
          $pageNumber = 1
      }
  });

  function checkMobile() {
 		isMobile = window.innerWidth < 768;
	}

  const onLogout = async () => {
    try {
      auth.resetAuth();
      onSideBar(ALL)
      clearFile();
      itemCategorySelected.selectCategory(ALL);
      $pageNumber = 1;
      
      goto("/")
    } catch (error) {
      console.log(error);
    }
  }

  const profileUpload = async (e:any) => {
    const { files } = e.target;
    try {
      if(!files || files.length === 0){
        clearFile()
        return;
      }

      const file = files[0];

      // Check file extension
      const allowedExtensions = ["bmp", "jpg", "jpeg", "png", "webp"];
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        notyf.error('이미지 파일만 업로드 가능합니다.');
        clearFile()
        return;
      }

      // Check file size (in bytes)
      const allowedSize = 2 * 1024 * 1024; // 2MB
      if (file.size > allowedSize) {
        notyf.error('파일 크기가 큽니다. 2MB아래로 업로드 해주세요.');
        clearFile()
        return;
      }

      const formData = new FormData();
      const upload = formData.append('file', files[0]);
      const response =  await axios.post('/api/admin/upload/files', formData, {
        headers: {
           'Content-Type': 'multipart/form-data'
         }
      });
      if(response.status == 200){
        await profileUpdate(response.data.data.link);
        return upload;
      }

    } catch (error) {
      clearFile()
      console.log(error);
    }
  }

  const profileUpdate = async (link:string) => {

    let params = {
      userId : $auth._id,
      profileUrl : link+"?format=webp&width=80&height=80"
    }

    try {
      const response = await axios.put('/api/admin/user/update', params);
      if(response.status == 200){
        $auth.profileUrl = link;
        clearFile()
      }

    } catch (error) {
      console.log(error);
      clearFile()
    }
  }

  function clearFile() {
    $isProfileOpen = false;
    profileFile.value = "";
  }

  let profileFile:any;
  function isProfileOpenToggle() { 
    $isProfileOpen = !$isProfileOpen
  }

  const errorImage = (e:any) => {
    e.target.src = dummyAvatar;
  }
</script>
<!-- Sidebar -->
{#if isMobile}
    <div class="absolute flex flex-col top-14 left-0 w-64 bg-blue-800 dark:bg-gray-700 h-full text-white transition-all duration-300 border-none z-50 sidebar" style={isSidebar ? "transform: translateX(0)" : "transform: translateX(-100%)"}>
        <div class="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow">
          <ul class="flex flex-col py-4 space-y-1">
            <li class="px-5 hidden md:block">
              <div class="flex flex-row items-center h-8">
                <div class="text-sm font-light tracking-wide text-gray-400 uppercase">Main</div>
              </div>
            </li>
            {#if $authToken}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <li class="grid grid-row-2 justify-items-center h-40 border-b-2">
              <div class="flex flex-row items-center h-8 py-10">
                {#if $auth.profileUrl}
                <div class="relative">
                  <div class="flex items-center">
                      <button on:click={() => isProfileOpenToggle()}><img class="w-20 h-20 rounded-full overflow-hidden processing" src={$auth.profileUrl} alt="profile" on:error|once={errorImage} /></button>
                      {#if $isProfileOpen}
                      <div class="absolute inset-x-0 top-0 z-10 w-full h-full origin-top transform transition opacity-100 scale-100">
                        <div class="overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-900 ring-opacity-5 dark:bg-black">
                          <div class="flex flex-col -space-y-2">
                            <div class="group relative flex-1 cursor-pointer px-2 py-2">
                              <div class="flex items-center space-x-2">
                                <label for="user-photo" class="relative flex h-full w-full items-center justify-center rounded-md bg-blue-500 text-white shadow-sm hover:bg-blue-600">
                                  <p class="flex flex-col text-center px-1 py-1">
                                    <span class="text-xs font-semibold">이미지<br>업로드</span>
                                    <span class="text-xs"><br>권장 사이즈 80px<br>최대 2MB</span>
                                  </p>
                                  <input type="file" on:change={profileUpload} accept="image/bmp, image/jpg, image/jpeg, image/png, image/webp" id="user-photo" name="user-photo" class="hidden" bind:this={profileFile}>
                                  <!-- <button type="button" class="absolute inset-0 h-full w-full cursor-pointer border-gray-300 opacity-80" on:click={profileUpload}></button> -->
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/if}
                    </div>
                  </div>
                  {:else}
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <div class="relative">
                    <div class="flex items-center">
                      <button on:click={() => isProfileOpenToggle()}><img class="w-20 h-20 rounded-full overflow-hidden processing" src={dummyAvatar} alt="profile" /></button>
                      {#if $isProfileOpen}
                      <div class="absolute inset-x-0 top-0 z-10 w-full h-full origin-top transform transition opacity-100 scale-100">
                        <div class="overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-900 ring-opacity-5 dark:bg-black">
                          <div class="flex flex-col -space-y-2">
                            <div class="group relative flex-1 cursor-pointer px-2 py-2">
                              <div class="flex items-center space-x-2">
                                <label for="user-photo" class="relative flex h-full w-full items-center justify-center rounded-md bg-blue-500 text-white shadow-sm hover:bg-blue-600">
                                  <p class="flex flex-col text-center px-1 py-1">
                                    <span class="text-xs font-semibold">이미지<br>업로드</span>
                                    <span class="text-xs"><br>권장 사이즈 150px<br>최대 2MB</span>
                                  </p>
                                  <input type="file" on:change={profileUpload} accept="image/bmp, image/jpg, image/jpeg, image/png, image/webp" id="user-photo" name="user-photo" class="hidden" bind:this={profileFile}>
                                  <!-- <button type="button" class="absolute inset-0 h-full w-full cursor-pointer border-gray-300 opacity-80" on:click={profileUpload}></button> -->
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/if}
                    </div>
                  </div>
                {/if}
              </div>
              <span class="text-sm tracking-wide truncate">{$auth.nickName}</span>
            </li>
            {/if}
            <li>
              <a href="/" on:click={() => onSideBar(ALL)} class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-700 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6" class:border-blue-500={$itemFooterSelected===ALL} class:text-white-800={$itemFooterSelected===ALL} class:bg-blue-700={$itemFooterSelected===ALL}>
                <span class="inline-flex justify-center items-center ml-4">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                </span>
                <span class="ml-2 text-sm tracking-wide truncate">Home</span>
              </a>
            </li>
            <li>
              <a href="/notice" on:click={() => onSideBar(NOTICE)} class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-700 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6" class:border-blue-500={$itemFooterSelected===NOTICE} class:text-white-800={$itemFooterSelected===NOTICE} class:bg-blue-700={$itemFooterSelected===NOTICE}>
                <span class="inline-flex justify-center items-center ml-4">
                  <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" /></svg>          
                </span>
                <span class="ml-2 text-sm tracking-wide truncate">공지사항</span>
                <span class="hidden md:block px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-blue-500 bg-indigo-50 rounded-full">New</span>
              </a>
            </li>
            <li>
              <a href="/questions" on:click={() => onSideBar(QUESTIONS)} class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-700 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6" class:border-blue-500={$itemFooterSelected===QUESTIONS} class:text-white-800={$itemFooterSelected===QUESTIONS} class:bg-blue-700={$itemFooterSelected===QUESTIONS}>
                <span class="inline-flex justify-center items-center ml-4">
                  <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>                  
                </span>
                <span class="ml-2 text-sm tracking-wide truncate">Q&A게시판</span>
                <span class="hidden md:block px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-blue-500 bg-indigo-50 rounded-full">New</span>
              </a>
            </li>
            <li>
              <a href="/free" on:click={() => onSideBar(FREE)} class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-700 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6" class:border-blue-500={$itemFooterSelected===FREE} class:text-white-800={$itemFooterSelected===FREE} class:bg-blue-700={$itemFooterSelected===FREE}>
                <span class="inline-flex justify-center items-center ml-4">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                </span>
                <span class="ml-2 text-sm tracking-wide truncate">커뮤니티</span>
              </a>
            </li>
            <li>
              <a href="/lecture" on:click={() => onSideBar(LECTURE)} class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-700 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6" class:border-blue-500={$itemFooterSelected===LECTURE} class:text-white-800={$itemFooterSelected===LECTURE} class:bg-blue-700={$itemFooterSelected===LECTURE}>
                <span class="inline-flex justify-center items-center ml-4">
                  <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" /></svg>
                </span>
                <span class="ml-2 text-sm tracking-wide truncate">강의콘텐츠</span>
                <!-- <span class="hidden md:block px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-blue-500 bg-indigo-50 rounded-full">New</span> -->
              </a>
            </li>
            <li>
              <a href="/attendance" on:click={() => onSideBar(ATTENDANCE)} class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-700 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6" class:border-blue-500={$itemFooterSelected===ATTENDANCE} class:text-white-800={$itemFooterSelected===ATTENDANCE} class:bg-blue-700={$itemFooterSelected===ATTENDANCE}>
                <span class="inline-flex justify-center items-center ml-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                  </svg>  
                </span>
                <span class="ml-2 text-sm tracking-wide truncate">출석부</span>
              </a>
            </li>
            {#if $authToken}
            <li>
              <a href="/reportCard" on:click={() => onSideBar(REPORTCARD)} class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-700 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6" class:border-blue-500={$itemFooterSelected===REPORTCARD} class:text-white-800={$itemFooterSelected===REPORTCARD} class:bg-blue-700={$itemFooterSelected===REPORTCARD}>
                <span class="inline-flex justify-center items-center ml-4">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                </span>                                
                <span class="ml-2 text-sm tracking-wide truncate">성적</span>
              </a>
            </li>
            {/if}
            <!-- <li>
              <a href="/notification" on:click={() => onSideBar(NONE)} class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-700 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6">
                <span class="inline-flex justify-center items-center ml-4">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                </span>
                <span class="ml-2 text-sm tracking-wide truncate">알림</span>
                <span class="hidden md:block px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-red-500 bg-red-50 rounded-full">1.2k</span>
              </a>
            </li> -->
            <!-- <li class="px-5 hidden md:block">
              <div class="flex flex-row items-center mt-5 h-8">
                <div class="text-sm font-light tracking-wide text-gray-400 uppercase">설정</div>
              </div>
            </li> -->
            {#if $authToken}
            <li>
              <a href="/profile" on:click={() => onSideBar(PROFILE)} class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-700 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6" class:border-blue-500={$itemFooterSelected===PROFILE} class:text-white-800={$itemFooterSelected===PROFILE} class:bg-blue-700={$itemFooterSelected===PROFILE}>
                <span class="inline-flex justify-center items-center ml-4">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </span>
                <span class="ml-2 text-sm tracking-wide truncate">마이페이지</span>
              </a>
            </li>
            {/if}
            <!-- <li>
              <a href="/settings" on:click={() => onSideBar(NONE)} class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-700 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6">
                <span class="inline-flex justify-center items-center ml-4">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </span>
                <span class="ml-2 text-sm tracking-wide truncate">설정</span>
              </a>
            </li> -->
            {#if $authToken}
            <li>
              <a href="#null" on:click={onLogout} class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-700 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6">
                <span class="inline-flex justify-center items-center ml-4">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </span>
                <span class="ml-2 text-sm tracking-wide truncate">Logout</span>
              </a>
            </li>
            {:else}
            <li class="flex flex-col-2 justify-around">
              <a class="flex w-20 h-10 mt-2 items-center justify-center rounded-3xl border border-gray-500/30 bg-white px-2 py-0.5 text-xs text-center font-medium text-gray-900 shadow-sm hover:bg-gray-100 focus:outline-none dark:border-gray-500/70 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-600 sm:flex"
                href="/login"
                on:click={closedSidebar}>
                로그인
              </a>
              <a class="flex w-20 h-10 mt-2 items-center justify-center rounded-3xl border border-transparent bg-blue-500 px-2 py-0.5 text-xs font-medium text-white hover:bg-blue-400 focus:outline-none focus:ring-offset-0 sm:flex"
                  href="/signup"
                  on:click={closedSidebar}>
                회원가입
              </a>
            </li>
            {/if}
          </ul>
          <p class="mb-14 px-5 py-3 hidden md:block text-center text-xs">Copyright @2023</p>
        </div>
      </div>
      <!-- ./Sidebar -->
{/if}  