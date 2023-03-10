<script lang="ts">

    function onClick(e:any) {
        const content = document.querySelectorAll(".footer");

        for(let element of content) {
            element.children[0].classList.remove("on");
            element.children[1].classList.remove("on");
        }

        e.currentTarget.children[0].classList.add("on")
        e.currentTarget.children[1].classList.add("on")
    }
</script>
<footer class="fixed flex justify-around items-center md:hidden bottom-0 left-0 right-0 h-16 bg-white border-t">
    <!-- 각 아이콘을 반복해서 표시하고 클릭하면 해당 페이지로 이동합니다. -->
    <a href="/notice" class="h-10 w-30 grid grid-row-2 justify-items-center footer" on:click={onClick}>
        <svg class="w-7 h-7 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" /></svg>          
        <p3 class="mt-1 text-gray-500 text-[11px] tracking-wide">공지사항</p3>
    </a>
    <a href="/questions" class="h-10 w-30 grid grid-row-2 justify-items-center footer"on:click={onClick}>
        <svg class="w-7 h-7 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>                  
        <p3 class="mt-1 text-gray-500 text-[11px] tracking-wide">Q&A게시판</p3>
    </a>
    <a href="/" class="h-10 w-30 grid grid-row-2 justify-items-center footer" on:click={onClick}>   
        <svg class="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        <p3 class="mt-1 text-gray-500 text-[11px] tracking-wide">홈</p3>
    </a>
    <a href="/attendance" class="h-10 w-30 grid grid-row-2 justify-items-center footer" on:click={onClick}>
        <svg class="w-7 h-7 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" /></svg>
        <p3 class="mt-1 text-gray-500 text-[11px] tracking-wide">강의콘텐츠</p3>
    </a>
    <a href="/profile" class="h-10 w-30 grid grid-row-2 justify-items-center footer" on:click={onClick}>
        <svg class="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        <p3 class="mt-1 text-gray-500 text-[11px] tracking-wide">마이페이지</p3>
    </a>
</footer>