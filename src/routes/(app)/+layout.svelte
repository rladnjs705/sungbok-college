<script lang="ts">
  import "../../app.css";
  import "$lib/styles/main.scss";

  import Sidebar from '$components/Sidebar.svelte';
  import Header from "$components/Header.svelte";
  import Footer from "$components/Footer.svelte";

  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

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
  });

  const onSideBar = () => {
      isSidebar = !isSidebar;
  }
  
  function checkMobile() {
 		isMobile = window.innerWidth < 768;
	}
</script>

<div class:dark={isDark} class:loading={loading} class:scrollbar-hidden={isMobile}>
  <Header isDark={isDark} toggleTheme={toggleTheme} onSideBar={onSideBar} />
  
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-white dark:bg-gray-700 text-black dark:text-white" on:click={() => isSidebar = false} class:sidebar-background={isSidebar}>    
    <Sidebar isSidebar={isSidebar} />
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="h-full mt-14 mb-20 md:ml-64">
      <slot/>
      <!-- <div class="grid grid-cols-1 lg:grid-cols-2 p-4 gap-4">
      </div> -->
    </div>
  </div>
  <Footer isSidebar={isSidebar}/>
</div>

<style>
  .sidebar-background{
    background-color: rgb(185, 183, 183);
  }

  .scrollbar-hidden::-webkit-scrollbar {
    display: none;
  }

  .scrollbar-hidden{
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
</style>