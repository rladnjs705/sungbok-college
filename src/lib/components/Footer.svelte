<script lang="ts">
    export let isSidebar:any;
</script>
<footer class="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white flex items-center justify-around border-t" class:sidebar-background={isSidebar}>
    <!-- 각 아이콘을 반복해서 표시하고 클릭하면 해당 페이지로 이동합니다. -->
    <a href="#null" class="h-10 w-10">Icon 1</a>
    <a href="#null" class="h-10 w-10">Icon 2</a>
    <a href="#null" class="h-10 w-10">Icon 3</a>
    <a href="#null" class="h-10 w-10">Icon 4</a>
    <a href="#null" class="h-10 w-10">Icon 5</a>
</footer>

<style>
    .sidebar-background{
        background-color: rgb(185, 183, 183);
    }
  </style>