<script lang="ts">
  import "../../app.css";
  import "$lib/styles/main.scss";

  import Sidebar from '$components/Sidebar.svelte';
  import Header from "$components/Header.svelte";
  import Footer from "$components/Footer.svelte";
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { itemFooterSelected } from '$stores';
  import { authToken, auth } from '$stores';

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
    
  let isDark = getTheme();

  const setTheme = (value:any) => {
      localStorage.setItem('dark', value);
  };


  const toggleTheme = () => {
      isDark = !isDark;
      setTheme(isDark);
  };

  onMount(() => {
      checkMobile();
      window.addEventListener('resize', checkMobile);
      loading = false;
      isSidebar = false;
  });

  const onSideBar = (_id:string) => {
      isSidebar = !isSidebar;
      if(isSidebar){
        document.body.classList.add("sidebar-open");
      } else{
        document.body.classList.remove("sidebar-open");

        //푸터 선택 변경
        if(typeof _id === 'string'){
          itemFooterSelected.selectFooter(_id)
        }
      }
  }
  
  function checkMobile() {
 		isMobile = window.innerWidth < 768;
	}

  function closedSidebar() {
    isSidebar = false;
    document.body.classList.remove("sidebar-open");
  }

</script>
{#await initAuth() then initAuth}
<div class:dark={isDark} class:loading={loading} class:scrollbar-hidden={isMobile} class:sidebar-open={isSidebar}>

  <!-- 사이드바 dim처리 -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="bg-[rgba(0,0,0,0.3)] top-0 left-0 absolute h-full w-full z-10 md:hidden" class:hidden={!isSidebar} on:click={closedSidebar}></div>

  <Header isDark={isDark} toggleTheme={toggleTheme} onSideBar={onSideBar} />
  <Sidebar isSidebar={isSidebar} onSideBar={onSideBar} />

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-white dark:bg-gray-700 text-black dark:text-white" on:click={closedSidebar}>    
    <div class="mt-16 mb-20 mx-4 lg:ml-80 lg:mr-72">
        <slot/>
    </div>
  </div>
  <Footer/>
</div>
{/await}