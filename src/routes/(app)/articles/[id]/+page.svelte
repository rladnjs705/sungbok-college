<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from "svelte";
    import suneditor from "suneditor";
    import {ko} from 'suneditor/src/lang';
    import plugins from 'suneditor/src/plugins';
    import { auth, authToken, isDark } from '$stores';
    import { error } from '@sveltejs/kit';
    import { goto } from '$app/navigation';
    import { extractErrors, commentValidateSchema } from '$utils/validates';
    import Swal from "sweetalert2";
    import axios from 'axios';
    import { paginate, LightPaginationNav, DarkPaginationNav } from 'svelte-paginate';
    import {
        Menu,
        MenuButton,
        MenuItems
    } from "@rgossiaux/svelte-headlessui";
    import { ADMIN } from '$lib/utils/constans';
    import dummyAvatar from "$lib/images/dummy-avatar.jpg";

    let commentCount:number;
    let paginatedItems:any;
    let currentPage = 1
    let pageSize:number = 10
    let commentEditor:any;
    let data: any;
    let board:any;
    let errors:any = {};
    let commentList:any;
    let userId:number;
    let heartSelected = false;
    let commentsEditor:any[]=[];
    let commentsUpdateEditor:any[]=[];
    let items:any[];
    let toggleMenu = true;

    let commentValues = {
        userId :0,
        content: null as any,
        commentId: null as number | null,
        parentId: null as number | null
    }


    //댓글쓰기/닫기
    let commentsShow:any[] = [];
    //댓글수정/삭제토글
    let commentsEdit:any[] = [];
    //댓글의댓글 보이기/닫기
    let commentsChildToggle:any[] = [];

    //댓글수정시 내용,에디터 보이기용 토글
    let commentsUpdateToggle:any[] = [];
    

    let placeHolderList = [
        '내용을 입력해주세요.',
        '생각의 차이를 인정하고 공감을 나눠주세요.',
        '의견은 편안하게 남겨주세요.',
        '커뮤니티를 성장시키는 의견을 공유해주세요.',
        '서로 다른 경험과 관점을 존중해요.'
    ]

    $:if(commentList){
        items = commentList.content;
        paginatedItems = paginate({ items, pageSize, currentPage});
        console.log(paginatedItems)
    }

    onMount(async ()=> {
        userId = Number($auth._id);
        const id = Number($page.params.id);
        console.log(userId);
        console.log(id)
        try {
            if(!isNaN(id)){
                if(userId > 0){
                    console.log("들어옴?1")
                    await fetch("/api/user/board/detail/"+id+"/"+$auth._id)
                    .then(response => response.json())
                    .then(item => {
                        console.log("들어옴?2")
                        console.log(item)
                        data = {item};
                        board = data.item.response;
                        commentList = board.commentResponseDTOList;
                        for (let i=0; i<commentList.content.length; i++){
                            commentsShow[commentsShow.length] = false;
                            commentList.content[i].isShow = true;
                            commentsUpdateToggle[commentsUpdateToggle.length] = false;
                        }

                    })
                    .catch(error => console.log(error));
                }else {
                    console.log("들어옴?3")
                    const response = await fetch("/api/user/board/detail/"+id);
                    const item = await response.json();
                    console.log(item)
                    if(item.success == true){
                        data = {item};
                        board = data.item.response;
                        commentList = board.commentResponseDTOList;
                        for (let i=0; i<commentList.content.length; i++){
                            commentsShow[commentsShow.length] = false;
                            commentList.content[i].isShow = true;
                            commentsUpdateToggle[commentsUpdateToggle.length] = false;
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
    })

    onMount(() => {
        let number = Math.floor(Math.random()*5);
        commentEditor = suneditor.create('commentContainer',{
            lang: ko,
            height: "16vh",
            width: "100%",
            plugins: plugins,
            value: commentValues.content,
            videoWidth:'100%',
            youtubeQuery: 'autoplay=1&mute=1&enableisapi=1',
            buttonList: [
            ['undo', 'redo', 'font'],
            ['image', 'video','codeView'],
            ['bold', 'underline', 'italic', 'strike']],
            placeholder: placeHolderList[number]
        });

        for (let i=0; i<paginatedItems.length; i++){
            let number = Math.floor(Math.random()*5);
            if(paginatedItems.length > 0){
                
                commentsEditor[i] = suneditor.create('commentsEditor'+i,{
                    mode: "inline",
                    lang: ko,
                    height: "10vh",
                    width: "100%",
                    plugins: plugins,
                    value: '<p><span class="remirror-mention-atom remirror-mention-atom-at ProseMirror-selectednode" style="color: rgb(121, 99, 210)">@'+paginatedItems[i].writer.nickName+'</span><br></p><br/>',
                    videoWidth:'100%',
                    youtubeQuery: 'autoplay=1&mute=1&enableisapi=1',
                    buttonList: [
                    ['font'],
                    ['image', 'video','codeView']],
                    placeholder: placeHolderList[number]
                });
                
                commentsUpdateEditor[i] = suneditor.create('commentUpdateContainer'+i,{
                    mode: "inline",
                    lang: ko,
                    height: "10vh",
                    width: "100%",
                    plugins: plugins,
                    value: convertHtml(paginatedItems[i].content),
                    videoWidth:'100%',
                    youtubeQuery: 'autoplay=1&mute=1&enableisapi=1',
                    buttonList: [
                    ['font'],
                    ['image', 'video','codeView']],
                    placeholder: placeHolderList[number]
                });
            }
        }
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
                location.reload();

                const comment = response.data.response;
                commentList.content = [...commentList.content, comment];
                commentEditor.setHTML("");

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
            if(commentEditor.getContents()=="<p><br></p>"|| commentEditor.getContents()==""){
                commentValues.content = '';
            }else{
                commentValues.content = commentEditor.getContents();
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
    

    const onAddChildComment = async (index:number,parentId:number) => {
        try {
            console.log(commentList.content)
            const response = await axios.post("/api/user/comment/"+board.id, commentValues);
            if(response.status == 200){
                location.reload();

                // const comment = response.data.response;
                // comment.isShow=true;
                // let arr = [...commentList.content].reverse();
                // let idx = arr.findIndex((data:any) => data.ref == comment.ref);
                // arr.splice(idx,0,comment);
                // commentList.content = arr.reverse();
                
                // clearArticleForm();
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

    const onSubmitAddChildComment = async (index:number, commentId:number, parentId:number) => {
        try {
            if(commentsEditor[index].getContents()=="<p><br></p>"|| commentsEditor[index].getContents()==""){
                commentValues.content = '';
            }else{
                commentValues.content = commentsEditor[index].getContents();
            }
            commentValues.userId = userId;
            commentValues.commentId = commentId;
            if(parentId == 0){
                commentValues.parentId = commentId;
            } else if(parentId > 0){
                commentValues.parentId = parentId;
            }
            if(userId > 0){
                await commentValidateSchema.validate(commentValues, {abortEarly: false});
                await onAddChildComment(index,parentId);
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

    const onEditComments = (index:number) => {
        if (commentsEdit[index]) {
        // clicked on the same comment that is already open, so close it
        commentsEdit[index] = false;
        } else {
            // clicked on a different comment, so close the currently open comment (if there is one)
            const openIndex = commentsEdit.findIndex((isOpen, i) => isOpen && i !== index);
            if (openIndex !== -1) {
                commentsEdit[openIndex] = false;
            }
            // open the clicked comment
            commentsEdit[index] = true;
        }
    }

    const onChildCommentsShow = (index:number, ref:number) => {
        
        commentsChildToggle[index] = !commentsChildToggle[index];
        for (let i=0; i<commentList.content.length; i++){
            if(commentList.content[i].ref == ref && commentList.content[i].parentId > 0){
                commentList.content[i].isShow = true;
            }
        }
        for(let i=0; i<commentsShow.length; i++){
            commentsShow[i] = false;
            commentsEdit[i] = false;
        }
    }

    const onChildCommentsHide = (index:number, ref:number) => {
        
        commentsChildToggle[index] = !commentsChildToggle[index];
        for (let i=0; i<commentList.content.length; i++){
            if(commentList.content[i].ref == ref && commentList.content[i].parentId > 0){
                commentList.content[i].isShow = false;
            }
        }
        for(let i=0; i<commentsShow.length; i++){
            commentsShow[i] = false;
            commentsEdit[i] = false;
        }
    }


    function setPage(e:any) {
        currentPage = e.detail.page;
        clearArticleForm();
    }

    function clearArticleForm() {
        for(let i=0; i<commentsShow.length; i++){
            commentsShow[i] = false;
            commentsEdit[i] = false;
            commentsChildToggle[i] = false;
        }
    }

    function onUpdateComments(index:number) {
        commentsEdit[index] = !commentsEdit[index];
        commentsUpdateToggle[index] = !commentsUpdateToggle[index]
    }

    const onSubmitUpdateChildComment = async (index:number,commentId:number) => {
        try {
            if(commentsUpdateEditor[index].getContents()=="<p><br></p>"|| commentsUpdateEditor[index].getContents()==""){
                commentValues.content = '';
            }else{
                commentValues.content = commentsUpdateEditor[index].getContents();
            }
            commentValues.userId = userId;
            commentValues.commentId = commentId;
            if(userId > 0){
                await commentValidateSchema.validate(commentValues, {abortEarly: false});
                await onUpdateChildComment(index,commentId);
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

    const onUpdateChildComment = async (index:number,commentId:number) => {
        try {
            const response = await axios.put("/api/user/comment/"+commentId, commentValues);
            if(response.status == 200){
                location.reload();

                // const comment = response.data.response;
                // comment.isShow = true;

                // commentList.content = [
                //     ...commentList.content.slice(0, index),
                //     comment,
                //     ...commentList.content.slice(index+1)
                // ]

                // console.log(commentList.content)

                // commentsUpdateToggle[index] = !commentsUpdateToggle[index];
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

    const onSubmitDeleteComments = async (index:number,commentId:number) => {
        try {
            const response = await axios.delete("/api/user/comment/"+commentId);
            if(response.status == 200){
                location.reload();

                // const comment = response.data.response;
                // comment.isShow = true;

                // commentList.content = [
                //     ...commentList.content.slice(0, index),
                //     comment,
                //     ...commentList.content.slice(index+1)
                // ]

                // console.log(commentList.content)

                // commentsUpdateToggle[index] = !commentsUpdateToggle[index];
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

    const removeArticle = async (id:number) => {
        try {
            const response = await axios.delete("/api/user/board/"+id);
            if(response.status == 200){
                console.log("들어옴?")
                goto(`/${board.boardType.toLowerCase()}/${board.category.categoryEng}`)
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
                {#if board.writer.profileUrl}
                <a href="/users/{board.writer.userId}">
                    <img class="inline-block h-10 w-10 rounded-full" src={board.writer.profileUrl} alt="프로필 사진" />
                </a>
                {:else}
                <a href="#null">
                    <img class="inline-block h-10 w-10 rounded-full" src={dummyAvatar} alt="프로필 사진" />
                </a>
                {/if}
                <div class="ml-2 flex flex-1 flex-col text-base font-normal">
                    <a
                        class="pl-0.5 text-gray-900 hover:text-blue-500 dark:text-gray-100 dark:hover:text-blue-200"
                        href="#null">{board.isSecret === false ? board.writer.nickName : "익명"}</a
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
            {#if $auth.role == ADMIN || $authToken && $auth._id === board.writer.userId}
            <div class="ml-auto flex items-center gap-x-4 text-sm text-gray-700 dark:text-gray-300 sm:gap-x-5">
                <span class="sr-only">더보기</span>
                <Menu class="relative">
                    <MenuButton class="flex items-center">
                        <span class="sr-only">작성자 메뉴</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-6 w-6 text-gray-400 hover:text-blue-500 focus:outline-0 focus:ring-0 dark:hover:text-blue-200">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"></path>
                        </svg>
                    </MenuButton>
                    <MenuItems class="absolute right-0 mt-2 w-40 space-y-2 rounded-lg border border-gray-500/30 bg-white p-3 shadow-lg dark:border-gray-500/70 dark:bg-gray-800 transform opacity-100 scale-100">
                        <MenuButton on:click={() => goto(board.id+"/edit")} class="text-gray-700 dark:text-gray-300 group flex items-center space-x-2 px-2 hover:text-blue-500 dark:hover:text-blue-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-5 w-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
                            </svg>
                            <span class="font-medium">수정하기</span>
                        </MenuButton>
                        <MenuButton on:click={() => removeArticle(board.id)} class="text-gray-700 dark:text-gray-300 group flex items-center space-x-2 px-2 hover:text-blue-500 dark:hover:text-blue-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-5 w-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
                            </svg>
                            <span class="font-medium">삭제하기</span>
                        </MenuButton>
                    </MenuItems>
                </Menu>
            </div>
            {/if}
        </div>
        <h1
            class="block break-all text-xl font-semibold"
        >
            {convertHtml(board.title)}
        </h1>
        <div
            class="my-6 text-sm text-gray-700 dark:text-gray-300 sm:my-8 sm:text-base w-full h-64"
        >
            <div class="remirror-theme w-full h-full">
                <div class="remirror-editor-wrapper w-full h-full">
                    <div class="remirror-theme relative w-full h-full">
                        <div class="overflow-auto md:w-full h-full">{@html `${convertHtml(board.content)}`}</div>
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
    {#if $authToken}
    <div class="flex">
        <div class="min-w-0 flex-1">
            <form>
                <textarea id="commentContainer"></textarea>
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
            {#if paginatedItems}
            {#each paginatedItems as comment, index}
                <li class:hidden={!comment.isShow} class="py-6" style="padding-left: {comment.step > 0 ? "30" : "0"}px; border-block-style: {comment.step>0 ? "dashed" : "solid"};">
                    <div class="flex items-center space-x-2">
                        <div class="flex-shrink-0">
                            <a href="/users/{comment.writer.userId}">
                                {#if comment.writer.profileUrl}
                                    <img class="h-8 w-8 rounded-full sm:h-12 sm:w-12" src={comment.writer.profileUrl} alt="프로필 사진">
                                    {:else}
                                    <img class="h-8 w-8 rounded-full sm:h-12 sm:w-12" src={dummyAvatar} alt="프로필 사진">
                                {/if}
                            </a>
                        </div>
                        <div class="flex flex-1 flex-col font-medium">
                            <a class="w-fit pl-0.5 text-gray-900 hover:text-blue-500 dark:text-gray-100 dark:hover:text-blue-200 text-xs md:text-base" href="/users/{comment.writer.userId}">{comment.writer.nickName}</a>
                            <div class="flex items-center space-x-1 text-xs font-normal text-gray-700 dark:text-gray-300">
                                <!-- <span>
                                    <svg class="inline h-3 w-3" width="9" height="12" viewBox="0 1 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <title>bolt icon</title>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.21535 0.575533C5.4443 0.647704 5.6 0.86003 5.6 1.10009V3.85009L7.8 3.85009C8.00508 3.85009 8.19313 3.96419 8.28783 4.14609C8.38254 4.328 8.36818 4.54748 8.25057 4.71549L4.40057 10.2155C4.26291 10.4122 4.0136 10.4968 3.78464 10.4246C3.55569 10.3525 3.4 10.1401 3.4 9.90009L3.4 7.15009H1.2C0.994914 7.15009 0.806866 7.03599 0.712157 6.85408C0.617448 6.67218 0.631811 6.45269 0.749418 6.28468L4.59942 0.784684C4.73708 0.588021 4.98639 0.503362 5.21535 0.575533Z" fill="currentColor"></path>
                                    </svg>875
                                </span> -->
                                <span>·</span>
                                <p class="text-gray-700 dark:text-gray-300 text-xs"> {displayedAt(comment.createDate)}</p>
                            </div>
                        </div>
                        {#if $auth.role == ADMIN || $authToken && $auth._id === comment.writer.userId  && !comment.isDeleted}
                        <div class="relative flex items-center space-x-3 sm:space-x-7">
                            <div class="flex">
                                <Menu class="relative">
                                    <MenuButton class="flex items-center" on:click={()=>onEditComments(index)}>
                                        <span class="sr-only">작성자 메뉴</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-5 w-5 text-gray-400 hover:text-blue-500 focus:outline-0 focus:ring-0 dark:hover:text-blue-200">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"></path>
                                        </svg>
                                    </MenuButton>
                                    <MenuItems class="absolute right-0 z-10 mt-2 space-y-2 rounded-lg border border-gray-500/30 bg-white p-1 py-2 shadow-lg dark:border-gray-500/70 dark:bg-gray-800 transform opacity-100 scale-100">
                                        <MenuButton on:click={() => onUpdateComments(index)} class="text-gray-700 dark:text-gray-300 group flex w-24 items-center space-x-2 px-2 text-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-4 w-4">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
                                            </svg>
                                            <span class="font-medium">수정하기</span>
                                        </MenuButton>
                                        <MenuButton on:click={() => onSubmitDeleteComments(index,comment.id)} class="text-gray-700 dark:text-gray-300 group flex items-center space-x-2 px-2 text-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-4 w-4">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
                                            </svg>
                                            <span class="font-medium">삭제하기</span>
                                        </MenuButton>
                                    </MenuItems>
                                </Menu>
                            </div>
                        </div>
                        {/if}
                    </div>
                    <div class="flex">
                        <div class="remirror-editor mt-2 flex-1 break-all text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                            <div class="remirror-theme">
                                <div class="remirror-editor-wrapper">
                                    <div class="md:text-base">
                                        {#if !comment.isDeleted}
                                        <div class:hidden={commentsUpdateToggle[index]} class="text-xs md:text-sm">{@html `${convertHtml(comment.content)}`}</div>
                                        <div class:hidden={!commentsUpdateToggle[index]}>
                                            <textarea id="commentUpdateContainer{index}"></textarea>
                                            <div class="mt-3 flex items-center justify-end gap-x-4">
                                                <button
                                                type="button"
                                                class="inline-flex items-center space-x-2 rounded-md bg-blue-500 px-8 py-2 text-xs font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 disabled:bg-blue-500 disabled:opacity-40"
                                                    on:click={() => onSubmitUpdateChildComment(index,comment.id)}
                                                    >댓글 수정</button
                                                    >
                                            </div>
                                        </div>
                                        {:else}
                                            <div class="test-xs md:text-sm">삭제된 댓글입니다.</div>
                                        {/if}
                                    </div>
                                    <div class="mt-2" class:hidden={commentsUpdateToggle[index]}>
                                        <div class="flex">
                                            {#if comment.answerNum > 0 && !commentsChildToggle[index]}
                                            <button on:click={()=>onChildCommentsHide(index,comment.ref)} class="flex items-center justify-start gap-x-1 bg-white text-xs font-medium text-blue-500 hover:text-blue-300 hover:no-underline focus:outline-none dark:bg-gray-800" type="button">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-4 w-4">
                                                    <path fill-rule="evenodd" d="M11.47 7.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z" clip-rule="evenodd"></path>
                                                </svg>
                                                <div class="font-medium">댓글 모두 숨기기</div>
                                            </button>
                                            {:else if comment.answerNum > 0}
                                            <button  on:click={()=>onChildCommentsShow(index,comment.ref)} class="flex items-center justify-start gap-x-1 bg-white text-xs font-medium text-blue-500 hover:text-blue-300 hover:no-underline focus:outline-none dark:bg-gray-800" type="button">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="rotate-180 transform h-4 w-4">
                                                    <path fill-rule="evenodd" d="M11.47 7.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z" clip-rule="evenodd"></path>
                                                </svg>
                                                <div class="font-medium">댓글 보기</div>
                                            </button>
                                            {/if}
                                            {#if $authToken && !comment.isDeleted}
                                            <div class:ml-4={comment.answerNum > 0}>
                                                <button class:hidden={commentsShow[index]} class="text-xs text-gray-500 hover:text-blue-500 dark:hover:text-blue-200" on:click={()=>onToogleComments(index)} >댓글 쓰기</button>
                                                <button class:hidden={!commentsShow[index]} class="text-xs text-gray-400 hover:text-blue-500 dark:hover:text-blue-200" on:click={()=>onToogleComments(index)} >댓글 창 닫기</button>
                                            </div>
                                            {/if}
                                        </div>
                                        {#if $authToken && !comment.isDeleted}
                                        <div class:hidden={!commentsShow[index]} class="mt-2">
                                                <textarea id="commentsEditor{index}"></textarea>
                                            <div class="mt-3 flex items-center justify-end gap-x-4">
                                                <button
                                                type="button"
                                                class="inline-flex items-center space-x-2 rounded-md bg-blue-500 px-8 py-2 text-xs font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 disabled:bg-blue-500 disabled:opacity-40"
                                                    on:click={() => onSubmitAddChildComment(index,comment.id,comment.parentId)}
                                                    >댓글 쓰기</button
                                                    >
                                            </div>
                                        </div>
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <!-- <div class="flex space-x-4">
                            <button class="text-xs font-normal text-gray-500 hover:text-blue-500 hover:no-underline focus:outline-none dark:text-gray-400 dark:hover:text-blue-200">댓글 쓰기</button>
                        </div> -->
                        <div class="ml-2.5 border-l-2 pl-4">
                            <section class="mt-5 text-sm">
                                <ul class="divide-y divide-dashed divide-gray-500/30 dark:divide-gray-500/70"></ul>
                            </section>
                        </div>
                    </div>
                </li>
                {/each}
                <!-- Pagination -->
                {#if $isDark}
                    {#if commentList.totalElements > 0}
                    <DarkPaginationNav
                    totalItems="{commentList.totalElements}"
                        pageSize="{pageSize}"
                        currentPage="{currentPage}"
                        limit="{1}"
                        showStepOptions="{true}"
                        on:setPage="{setPage}"
                    />
                    {/if}
                    {:else}
                    {#if commentList.totalElements > 0}
                        <LightPaginationNav
                        totalItems="{commentList.totalElements}"
                        pageSize="{pageSize}"
                        currentPage="{currentPage}"
                        limit="{1}"
                        showStepOptions="{true}"
                        on:setPage="{setPage}"
                        />
                    {/if}
                {/if}
            {/if}
        </ul>
    </div>
</div>
{/if}


  