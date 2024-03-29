<script lang="ts">
  import "../../app.css";
  import "$lib/styles/main.scss";
  import "suneditor/dist/css/suneditor.min.css"
  import 'sweetalert2/src/sweetalert2.scss';

  import Sidebar from '$components/Sidebar.svelte';
  import Header from "$components/Header.svelte";
  import Footer from "$components/Footer.svelte";
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { itemFooterSelected, itemCategorySelected,boardDetailList, pageNumber, isProfileOpen } from '$stores';
  import { authToken, auth, isDark } from '$stores';
  import { ALL, FREE, LECTURE, NOTICE, QUESTIONS } from "$lib/utils/constans";
  import Analytics from "$components/Analytics.svelte";
  $: {
      if($authToken){
          auth.createAuth();
      } else {
          auth.resetAuth();
      }
  }

  const initAuth = async () => {
      if($authToken) {
          await auth.createAuth();
      }
      return;
  }

  let loading = true;
  let isSidebar = false;
  let isMobile = true;

  const getTheme = () => {
      const defaultValue = '';
      const isThemeToken = browser ? window.localStorage.getItem('dark') ?? defaultValue : defaultValue;
      if (isThemeToken) {
        return JSON.parse(isThemeToken);
      }
      return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    };
    
  $isDark = getTheme();

  const setTheme = (value:any) => {
      localStorage.setItem('dark', value);
  };


  const toggleTheme = () => {
      $isDark = !$isDark;
      setTheme($isDark);
  };

  onMount(() => {
      checkMobile();
      window.addEventListener('resize', checkMobile);
      loading = false;
      isSidebar = false;
      $isProfileOpen = false;
  });

  const onSideBar = (_id:string) => {
      isSidebar = !isSidebar;
      $isProfileOpen = false;
      if(isSidebar){
        document.body.classList.add("sidebar-open");
      } else{
        document.body.classList.remove("sidebar-open");

        //푸터 선택 변경
        if(typeof _id === 'string'){
          itemFooterSelected.selectFooter(_id)
          itemCategorySelected.selectCategory(ALL);
          if(_id === NOTICE || _id === QUESTIONS || _id === LECTURE || _id === FREE){
            boardDetailList.getBoardDetailList(_id,ALL);
          }
          $pageNumber = 1;
        }
      }
  }
  
  function checkMobile() {
 		isMobile = window.innerWidth < 768;
	}

  function closedSidebar() {
    isSidebar = false;
    $isProfileOpen = false;
    document.body.classList.remove("sidebar-open");
  }

</script>
<svelte:head>
    <!-- 페이지-->
    <title>새벽이슬</title>
    <meta name="description" content="새벽이슬 청년들의 커뮤니티 사이트 입니다.">
    <meta name="naver-site-verification" content="5042180a7970682db78bf757929d44ddd4c9f4ee" />

    <!-- meta -->
    <meta property="og:url" content="https://port-0-sungbok-college-1jx7m2gldi7x7be.gksl2.cloudtype.app/">
    <meta property="og:title" content="새벽이슬">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://optimizeimage-6vca6cxsga-du.a.run.app/The_dew_Logo.png?width=200&height=200">
    <meta property="og:description" content="새벽이슬 청년들의 커뮤니티 사이트 입니다.">	

    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2423848008470963"
     	crossorigin="anonymous"></script>
    
    <link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml" />
    <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
</svelte:head>
<Analytics />
{#await initAuth() then initAuth}
<div class:dark={$isDark} class:loading={loading} class:scrollbar-hidden={isMobile} class:sidebar-open={isSidebar}>

  <!-- 사이드바 dim처리 -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="bg-[rgba(0,0,0,0.3)] top-0 left-0 absolute h-full w-full z-10 md:hidden" class:hidden={!isSidebar} on:click={closedSidebar}></div>

  <Header isDark={$isDark} toggleTheme={toggleTheme} onSideBar={onSideBar} />
  <Sidebar isSidebar={isSidebar} onSideBar={onSideBar} closedSidebar={closedSidebar}/>

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-white dark:bg-gray-700 text-black dark:text-white" on:click={closedSidebar}>    
    <div class="mt-16 mb-20 mx-4 xl:ml-80 xl:mr-72">
        <slot/>
    </div>
  </div>
  <Footer/>
</div>
{/await}