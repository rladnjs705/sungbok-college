<script lang="ts">
    import type { PageData } from './$types';
    import Create from "$components/button/group/Create.svelte";
    import suneditor from "suneditor";
    import {ko} from 'suneditor/src/lang';
    import plugins from 'suneditor/src/plugins';
    import { extractErrors, noticeValidateSchema } from '$utils/validates';
    import { auth } from '$stores';
    import axios from 'axios';
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import Swal from "sweetalert2";
    import { REPORT } from '$lib/utils/constans';
    import { Notyf } from 'notyf';
    import 'notyf/notyf.min.css';
    const notyf = new Notyf({
        duration: 3000,
        position: {
        x: 'right',
        y: 'top',
        }
    });

    export let data: PageData;
    let editor:any;
    let container: HTMLElement;
    const cancelLink = "/notice";

    let errors:any = {};

    let arr:any = [];

    let addValues = {
        categoryId: '',
        title: '',
        content: '',
        boardType: REPORT,

        media : arr,

        //유저정보
        userId: 0,
        email: '',
        userName: '',
        nickName: '',
        role: '',
        isSecret: false,
    }
    
    onMount(() => {
        editor = suneditor.create('editor',{
            lang: ko,
            height: "50vh",
            width: "100%",
            plugins: plugins,
            videoWidth:'100%',
            youtubeQuery: 'autoplay=1&mute=1&enableisapi=1',
            buttonList: [
            ['undo', 'redo', 'font', 'fontSize'],
            ['bold', 'underline', 'italic', 'strike'], 
            ['removeFormat','image', 'video','codeView']],
            placeholder: '내용을 입력해주세요.'
        });
    })

    const onAddBoard = async () => {
        try {
            const response = await axios.post("/api/user/board/create", addValues);
            if(response.status == 200){
                //notyf.success("생성되었습니다.");
                goto(`/${addValues.boardType}`);
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

    const onSubmitAddBoard = async () => {
        try {
            if(editor.getContents()=="<p><br></p>"|| editor.getContents()==""){
                addValues.content = '';
            }else{
                addValues.content = editor.getContents();
            }
            addValues.userId = Number($auth._id);
            addValues.email = $auth.email;
            addValues.nickName = $auth.nickName;
            addValues.userName = $auth.userName;
            addValues.role = $auth.role;
            if($auth._id != ''){
                await noticeValidateSchema.validate(addValues, {abortEarly: false});
                await onAddBoard();
            }else {
                console.log("유저아이디 없음")
                goto("/login");
            }
        } catch (error) {
            console.log(error);
            errors = extractErrors(error);
        }
    }

    const onUploadFile = async (e:any) => {
        const files  = e.target.files;
        try {
            if(!files || files.length === 0){
                return;
            }
            for (let i = 0; i < files.length; i++){
                const file = files[i];

                // Check file extension
                const allowedExtensions = ["pdf", "hwp", "docs", "png", "jpg", "jpeg", "xls", "xlsx", "word"];
                const fileExtension = file.name.split(".").pop().toLowerCase();
                if (!allowedExtensions.includes(fileExtension)) {
                    notyf.error('이미지 및 문서 파일만 업로드 가능합니다.');
                    return;
                }

                // Check file size (in bytes)
                const allowedSize = 5 * 1024 * 1024; // 5mb
                if (file.size > allowedSize) {
                    notyf.error('파일 크기가 큽니다. 5mb아래로 업로드 해주세요.');
                    return;
                }

                const formData = new FormData();
                formData.append('file', files[i]);
                await axios.post('/api/admin/upload/files', formData, {
                    headers: {
                    'Content-Type': 'multipart/form-data'
                    }
                }).then((res) => {
                    if(res.status == 200){
                        let media = {
                            refType : '100',
                            refSeq : 0,
                            mediaOrder : 0,
                            originalFileName : '',
                            savedFileName : '',
                            mediaSize : 0,
                            mediaPath : '',
                            delYn : 'N',
                            registerId: '',
                            updateId: ''
                        }
                        media.originalFileName = file.name;
                        media.savedFileName = res.data.data.savedFileName;
                        media.mediaPath = res.data.data.link;
                        media.mediaSize = file.size;
                        media.registerId = $auth.email;
                        media.updateId = $auth.email;
                        addValues.media[i] = media;
                        
                    } else{
                        notyf.error('서버 에러입니다. 관리자에게 문의해 주세요.');
                    }
                });
                console.log(addValues);
            }
        } catch (error) {
            console.log(error);
        }
    }

</script>

<div class="md:mx-8">
    <div class="space-y-11">
        <div class="grid grid-cols-1 gap-y-7">
            <div class="space-y-2 mt-3">
                <h3 class="text-xl font-medium sm:text-3xl sm:leading-10">리포트</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    리포트를 등록하여 과제를 제출해 주세요.
                    리포트는 자신과 강사님만 볼 수 있습니다.
                </p>
            </div>
            <div class="space-y-1">
                <label for="categoryId" class="text-sm font-medium text-gray-700 dark:text-gray-200">토픽</label>
                <select id="categoryId" class="block w-full rounded-md border-gray-500/30 pl-3 pr-10 text-base placeholder-gray-500/80 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-0 dark:bg-gray-500/20" name="categoryId" bind:value={addValues.categoryId}>
                    <option value="" class="dark:bg-gray-500">토픽을 선택해주세요.</option>
                    {#if data}
                        {#each data.item.response as category} 
                            <option value={category.categoryId} class="dark:bg-gray-500">{category.categoryName}</option>
                        {/each}
                    {/if}
                </select>
                {#if errors.categoryId}
                    <div class="text-red-500">{errors.categoryId}</div>
                {/if}
            </div>
            <div class="space-y-1">
                <label
                    for="filePath"
                    class="text-sm font-medium text-gray-700 dark:text-gray-200"
                    >파일</label>
                <input type="file" id="filePath" class="block w-full appearance-none rounded-md border border-gray-500/30 pl-3 pr-10 text-base placeholder-gray-500/80 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-0 dark:bg-gray-500/20" on:change={onUploadFile} class:inputError={errors.filePath} multiple required>
                {#if errors.filePath}
                    <div class="invalid-feedback was-validated">{errors.filePath}</div>
                {/if}
                {#if addValues.media}
                    {#each addValues.media as media}
                        {#if media.mediaPath}
                        <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                            <span class="text-gray-600">{media.originalFileName}</span>
                        </div>
                        {/if}
                    {/each}
                {/if}
            </div>
            <div class="space-y-1">
                <label
                    for="title"
                    class="text-sm font-medium text-gray-700 dark:text-gray-200"
                    >제목</label>
                <!-- svelte-ignore a11y-autofocus -->
                <input
                    type="text"
                    id="title"
                    placeholder="제목을 입력해주세요."
                    class="block w-full appearance-none rounded-md border border-gray-500/30 pl-3 pr-10 text-base placeholder-gray-500/80 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-0 dark:bg-gray-500/20"
                    name="title"
                    class:border-red-500={errors.title}
                    bind:value={addValues.title}
                    maxlength="50"
                     />
                {#if errors.title}
                    <div class="text-red-500">{errors.title}</div>
                {/if}
            </div>
            <div class="space-y-1">
                <label
                    for="text"
                    class="text-sm font-medium text-gray-700 dark:text-gray-200"
                    >본문</label>
                <div class="remirror-theme relative z-0 rounded-md border border-gray-500/30 shadow-sm dark:border-gray-500/70" class:border-red-500={errors.content}>
                    <div class="min-h-[50vh]">
                        <textarea id="editor" bind:this={editor}></textarea>
                    </div>
                </div>
                {#if errors.content}
                    <div class="text-red-500">{errors.content}</div>
                {/if}
            </div>
        </div>
        <Create link={cancelLink} onAddBoard={onSubmitAddBoard} />
    </div>
</div>
