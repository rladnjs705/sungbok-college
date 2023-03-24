<script lang="ts">
	import { page } from '$app/stores';
    import { onMount } from "svelte";
    import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
    import Editor from '@toast-ui/editor';
    import { auth, authToken } from '$stores';
    import { error } from '@sveltejs/kit';
    import { goto } from '$app/navigation';
    import { extractErrors, commentValidateSchema } from '$utils/validates';
    import Swal from "sweetalert2";
    import axios from 'axios';

    let editor:any;
    let container: HTMLElement;
    let commentEditor:any;
    let commentContainer:HTMLElement;
    let data: any;
    let board:any;
    let errors:any = {};
    let commentList:any;
    let userId:number;
    let heartSelected = false;
    let comments:any[]=[];
    let commentsEditor:any[]=[];

    let commentValues = {
        userId :0,
        content : '',
        commentId: null as number | null,
        parentId: null as number | null

    }

    let commentsShow:any[] = [];
    

    let placeHolderList = [
        '내용을 입력해주세요.',
        '생각의 차이를 인정하고 공감을 나눠주세요.',
        '의견은 편안하게 남겨주세요.',
        '커뮤니티를 성장시키는 의견을 공유해주세요.',
        '서로 다른 경험과 관점을 존중해요.'
    ]

    $:board;

    $:if(commentList){
        if(commentList.content.length > 0){
            for (let i=0; i<commentList.content.length; i++){
                let number = Math.floor(Math.random()*5);
                let comment = comments[i];
                let commentChildEditor = commentsEditor[i];
                if(comment){
                    new Viewer({
                        el: comment,
                        initialValue: convertHtml(commentList.content[i].content),
                    });

                    commentsEditor[i] = new Editor({
                        el: commentChildEditor,
                        initialValue: commentValues.content,
                        placeholder: placeHolderList[number],
                        initialEditType: "wysiwyg",
                        previewStyle: "vertical",
                        hideModeSwitch: true,
                        height: "16vh",
                        toolbarItems: [
                            ["heading", "bold", "italic", "strike"],
                            ["ul", "ol"],
                            ["image", "link"],
                        ],
                    });


                }
            }
        }
    }

    onMount(async ()=> {
        userId = Number($auth._id);
        const id = Number($page.params.id);
        try {
            if(!isNaN(id)){
                if(userId > 0){
                    await fetch("/api/admin/board/detail/"+id+"/"+$auth._id)
                    .then(response => response.json())
                    .then(item => {
                        data = {item};
                        board = data.item.response;
                        commentList = board.commentResponseDTOList;
                        for (let i=0; i<commentList.content.length; i++){
                            commentsShow.push(false);
                        }
                    })
                    .catch(error => console.log(error));
                }else {
                    const response = await fetch("/api/admin/board/detail/"+id);
                    const item = await response.json();
                    if(item.success == true){
                        data = {item};
                        board = data.item.response;
                        commentList = board.commentResponseDTOList;
                        for (let i=0; i<commentList.content.length; i++){
                            commentsShow.push(false)
                        }
                    }else{
                        throw error(404, {
                            message: item.error.message
                        });    
                    }
                }
                heartSelected = board.isHeart;
            } else{
                throw error(404, {
                    message: 'Not found'
                });
            }
        } catch (error) {
            console.log(error);
        }

        editor = new Viewer({
            el: container,
            initialValue: convertHtml(board.content),
        });

        let number = Math.floor(Math.random()*5);
        commentEditor = new Editor({
            el: commentContainer,
            initialValue: commentValues.content,
            placeholder: placeHolderList[number],
            initialEditType: "wysiwyg",
            previewStyle: "vertical",
            hideModeSwitch: true,
            height: "16vh",
            toolbarItems: [
                ["heading", "bold", "italic", "strike"],
                ["ul", "ol"],
                ["image", "link"],
            ],
        });
        
    })

    const boardTypeName = (boardType:string) => {
        let boardName ="";
        switch (boardType) {
            case "FREE": boardName = "커뮤니티"; break;
            case "NOTICE": boardName = "공지사항"; break;
            case "QUESTIONS": boardName = "Q&A"; break;
            case "LECTURE": boardName = "강의콘텐츠"; break;
            case "REPORTCARD": boardName = "성적"; break;
            case "ATTENDANCE": boardName = "출석"; break;
        }
        return boardName;
    }

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

    //xss 역치환
    function convertHtml(str:string){
        str = str.replace(/&lt;/g,"<");
        str = str.replace(/&gt;/g,">");
        str = str.replace(/&quot;/g,"\"");
        str = str.replace(/&#39;/g,"\'");
        return str;
    }

    const onHeartOk = async (boardId:number) => {
        
        if(boardId > 0 && userId > 0){
            let params = {
                boardId : boardId,
                userId: userId
            }

            try{
                const response = await fetch("/api/admin/heart", { 
                    method: 'DELETE',
                    headers:{ 'Content-Type' : 'application/json'},
                    body: JSON.stringify(params)
                });
                if (response.ok) {
                    heartSelected = false;
                } else{
                    heartSelected = true;
                }
            }catch(error) {
                heartSelected = true;
                console.log(error)
            }
        }
    }

    const onHeartCancel = async (boardId:number) => {
        
        if(boardId > 0 && userId > 0){
            let params = {
                boardId : boardId,
                userId: userId
            }
            try{
                const response = await fetch("/api/admin/heart", { 
                    method: 'POST', 
                    headers:{ 'Content-Type' : 'application/json'},
                    body: JSON.stringify(params)
                });
                if (response.ok) {
                    heartSelected = true;
                } else{
                    heartSelected = false;
                }
            }catch(error) {
                heartSelected = false;
                console.log(error)
            }
        }
    }

    const onAddComment = async () => {
        try {
            const response = await axios.post("/api/user/comment/"+board.id, commentValues);
            if(response.status == 200){
                const comment = response.data.response;
                commentList.content = [comment, ...commentList.content];
                location.reload();
            }else{
                console.log(response);
                Swal.fire({
                    icon: 'error',
                    text: "에러가 발생했습니다. 관리자에게 문의해주세요.",
                    timer: 3000, // 3초 후 자동으로 닫힘
                });
            }
        } catch(error) {
            errors = extractErrors(error);
        }
    }

    const onSubmitAddComment = async () => {
        try {
            if(commentEditor.getHTML()=="<p><br></p>"|| commentEditor.getHTML()==""){
                commentValues.content = '';
            }else{
                commentValues.content = commentEditor.getHTML();
            }
            commentValues.userId = userId;
            if(userId > 0){
                await commentValidateSchema.validate(commentValues, {abortEarly: false});
                await onAddComment();
            }else {
                Swal.fire({
                    icon: 'error',
                    text: "로그인이 되어있지 않습니다. 로그인 후 이용해주세요",
                    timer: 3000, // 3초 후 자동으로 닫힘
                });
                goto("/login");
            }
        } catch (error) {
            console.log(error);
            errors = extractErrors(error);
        }
    }

    const onAddChildComment = async () => {
        try {
            const response = await axios.post("/api/user/comment/"+board.id, commentValues);
            if(response.status == 200){
                location.reload();
            }else{
                console.log(response);
                Swal.fire({
                    icon: 'error',
                    text: "에러가 발생했습니다. 관리자에게 문의해주세요.",
                    timer: 3000, // 3초 후 자동으로 닫힘
                });
            }
        } catch(error) {
            errors = extractErrors(error);
        }
    }

    const onSubmitAddChildComment = async (index:number, commentId:number) => {
        try {
            if(commentsEditor[index].getHTML()=="<p><br></p>"|| commentsEditor[index].getHTML()==""){
                commentValues.content = '';
            }else{
                commentValues.content = commentsEditor[index].getHTML();
            }
            commentValues.userId = userId;
            commentValues.commentId = commentId;
            commentValues.parentId = commentId;
            if(userId > 0){
                await commentValidateSchema.validate(commentValues, {abortEarly: false});
                await onAddChildComment();
            }else {
                Swal.fire({
                    icon: 'error',
                    text: "로그인이 되어있지 않습니다. 로그인 후 이용해주세요",
                    timer: 3000, // 3초 후 자동으로 닫힘
                });
                goto("/login");
            }
        } catch (error) {
            console.log(error);
            errors = extractErrors(error);
        }
    }

    const onToogleComments = (index:number) => {
        if (commentsShow[index]) {
        // clicked on the same comment that is already open, so close it
        commentsShow[index] = false;
        } else {
            // clicked on a different comment, so close the currently open comment (if there is one)
            const openIndex = commentsShow.findIndex((isOpen, i) => isOpen && i !== index);
            if (openIndex !== -1) {
                commentsShow[openIndex] = false;
            }
            // open the clicked comment
            commentsShow[index] = true;
        }
    }

</script>
{#if board}
<div>
    <div class="relative my-7">
        <div class="absolute inset-0 flex items-center">
            <div
                class="w-full border-t border-gray-500/30 dark:border-gray-500/70"
            />
        </div>
        <div class="relative ml-2 flex text-sm font-normal sm:ml-5">
            <div
                class="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            >
                <a
                    class="text-gray-400 hover:text-blue-500 dark:hover:text-blue-200"
                    href="/{board.boardType.toLowerCase()}">{boardTypeName(board.boardType)}</a
                >
                /
                <a
                    class="text-blue-500 hover:text-blue-300 dark:hover:text-blue-200"
                    href="/{board.boardType.toLowerCase()}/{board.category.categoryEng}">{board.category.categoryName}</a
                >
            </div>
        </div>
    </div>
    <div class="mt-8 mb-6 md:mb-14 w-full sm:mt-9">
        <div class="mb-8 flex flex-wrap sm:mb-9">
            <div class="flex items-center justify-center">
                <a href="/users/155381"
                    ><img
                        class="inline-block h-10 w-10 rounded-full"
                        src="/dummy-avatar.jpg"
                        alt="프로필 사진"
                    /></a
                >
                <div class="ml-2 flex flex-1 flex-col text-base font-normal">
                    <a
                        class="pl-0.5 text-gray-900 hover:text-blue-500 dark:text-gray-100 dark:hover:text-blue-200"
                        href="#null">{board.writer.nickName}</a
                    >
                    <div
                        class="flex items-center gap-x-1 text-sm font-normal text-gray-700 dark:text-gray-300"
                    >
                        <span class="flex items-center gap-x-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 fill-red-500 text-red-500">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                            {board.likeCount}
                        </span>
                        <span>·</span>
                        <span>{displayedAt(board.createDate)}</span>
                        <span>·</span>
                        <div class="flex items-center gap-x-0.5">
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
                                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                /><path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                /></svg
                            >{board.viewCount}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <h1
            class="block break-all text-xl font-semibold"
        >
            {convertHtml(board.title)}
        </h1>
        <div
            class="my-6 text-sm text-gray-700 dark:text-gray-300 sm:my-8 sm:text-base"
        >
            <div class="remirror-theme">
                <div class="remirror-editor-wrapper">
                    <div class="remirror-theme relative">
                        <div id="container" bind:this={container} />
                    </div>
                </div>
            </div>
        </div>
        <div class="flex items-center space-x-1">
            <div class="flex flex-1 flex-wrap items-center">
                {#if board.hashTag}
                {#each board.hashTag as tag}
                <a class="my-0.5 mx-1.5 flex h-7 items-center rounded-[39px] bg-gray-100 px-3 py-1.5 text-sm font-normal text-gray-700 hover:text-blue-500 hover:no-underline dark:bg-gray-700 dark:text-gray-300 dark:hover:text-blue-200" href="/tagged/{tag}">
                    <span class="hover:no-underline">#{tag}</span>
                </a>
                {/each}
                {/if}
            </div>
            <div>
                {#if $authToken}
                    {#if heartSelected}
                        <button on:click={() => onHeartOk(board.id)} class="items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 md:w-7 md:h-7 text-red-500 fill-red-500">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </button>
                        {:else}
                        <button on:click={() => onHeartCancel(board.id)} class="items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 md:w-7 md:h-7">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </button>
                    {/if}
                {/if}
            </div>
        </div>
    </div>
    {#if authToken}
    <div class="flex">
        <div class="min-w-0 flex-1">
            <form>
                <div id="commentContainer" bind:this={commentContainer} />
                <div class="mt-3 flex items-center justify-end gap-x-4">
                    <button
                        type="button"
                        class="inline-flex items-center space-x-2 rounded-md bg-blue-500 px-8 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 disabled:bg-blue-500 disabled:opacity-40"
                        on:click={onSubmitAddComment}
                        >댓글 쓰기</button
                    >
                </div>
            </form>
        </div>
    </div>
    {/if}
    <div class="my-5 border-t border-gray-500/30 dark:border-gray-500/70"/>
    <div class="my-4 md:my-8">
        <ul class="divide-y divide-gray-500/30 dark:divide-gray-500/70">
            {#if commentList}
            {#each commentList.content as comment, index}
                <li class="py-6">
                    <div class="flex items-center space-x-2">
                        <div class="flex-shrink-0">
                            <a href="/users/{comment.writer.userId}">
                                <img class="h-8 w-8 rounded-full sm:h-12 sm:w-12" src="/dummy-avatar.jpg" alt="프로필 사진">
                            </a>
                        </div>
                        <div class="flex flex-1 flex-col text-sm font-medium md:text-base">
                            <a class="w-fit pl-0.5 text-gray-900 hover:text-blue-500 dark:text-gray-100 dark:hover:text-blue-200" href="/users/{comment.writer.userId}">{comment.writer.nickName}</a>
                            <div class="flex items-center space-x-1 text-xs font-normal text-gray-700 dark:text-gray-300">
                                <!-- <span>
                                    <svg class="inline h-3 w-3" width="9" height="12" viewBox="0 1 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <title>bolt icon</title>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.21535 0.575533C5.4443 0.647704 5.6 0.86003 5.6 1.10009V3.85009L7.8 3.85009C8.00508 3.85009 8.19313 3.96419 8.28783 4.14609C8.38254 4.328 8.36818 4.54748 8.25057 4.71549L4.40057 10.2155C4.26291 10.4122 4.0136 10.4968 3.78464 10.4246C3.55569 10.3525 3.4 10.1401 3.4 9.90009L3.4 7.15009H1.2C0.994914 7.15009 0.806866 7.03599 0.712157 6.85408C0.617448 6.67218 0.631811 6.45269 0.749418 6.28468L4.59942 0.784684C4.73708 0.588021 4.98639 0.503362 5.21535 0.575533Z" fill="currentColor"></path>
                                    </svg>875
                                </span> -->
                                <span>·</span>
                                <p class="text-gray-700 dark:text-gray-300 md:text-sm"> {displayedAt(comment.createDate)}</p>
                            </div>
                        </div>
                        <!-- <div class="relative flex items-center space-x-3 sm:space-x-7">
                            <div class="flex">
                                좋아요
                            </div>
                        </div> -->
                    </div>
                    <div class="flex">
                        <div class="remirror-editor mb-2 mt-2 flex-1 break-all text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                            <div class="remirror-theme">
                                <div class="remirror-editor-wrapper">
                                    <div class="md:text-base">
                                        <div id="comments{index}" bind:this={comments[index]}></div>
                                    </div>
                                    <div class:hidden={!commentsShow[index]}>
                                        <button class="text-xs text-gray-400 hover:text-blue-500 dark:hover:text-blue-200 sm:text-sm" on:click={()=>onToogleComments(index)} >댓글 창 닫기</button>
                                        <div id="commentsEditor{index}" bind:this={commentsEditor[index]} />
                                        <div class="mt-3 flex items-center justify-end gap-x-4">
                                            <button
                                            type="button"
                                            class="inline-flex items-center space-x-2 rounded-md bg-blue-500 px-8 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 disabled:bg-blue-500 disabled:opacity-40"
                                                on:click={() => onSubmitAddChildComment(index,comment.id)}
                                                >댓글 쓰기</button
                                                >
                                        </div>
                                    </div>
                                    <button class="text-xs text-gray-400 hover:text-blue-500 dark:hover:text-blue-200 sm:text-sm" on:click={()=>onToogleComments(index)} class:hidden={commentsShow[index]} >댓글 쓰기</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <!-- <div class="flex space-x-4">
                            <button class="text-xs font-normal text-gray-500 hover:text-blue-500 hover:no-underline focus:outline-none dark:text-gray-400 dark:hover:text-blue-200">댓글 쓰기</button>
                        </div> -->
                        <div class="ml-2.5 border-l-2 pl-4">
                            <section class="mt-5 text-sm" id="headlessui-disclosure-panel-:r2a:" data-headlessui-state="">
                                <ul class="divide-y divide-dashed divide-gray-500/30 dark:divide-gray-500/70"></ul>
                            </section>
                        </div>
                    </div>
                </li>
                {/each}
            {/if}
        </ul>
    </div>
</div>
{/if}