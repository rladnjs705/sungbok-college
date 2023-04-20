<script lang="ts">
    import DetailList from '$components/board/DetailList.svelte';
    import type { PageData } from './$types';
    import { ADMIN, REPORT } from '$utils/constans';
    import { auth, authToken } from '$stores';
    
    export let data: PageData;
    const boardType = REPORT;
    const boardList = data.list.response.content;
    const response = data.list.response;
    const categories = data.categories.response;
    const list = {
        title: "리포트",
        list : boardList,
        boardType:boardType,
    }
</script>
{#if $auth.role == ADMIN || $authToken}
    <DetailList list={list} categories={categories} boardType={boardType} response={response}/>
{:else}
    <a
        class="text-base font-medium text-blue-500 hover:text-blue-400 dark:hover:text-blue-200"
        href="/login">로그인 후 이용해 주세요</a>
{/if}