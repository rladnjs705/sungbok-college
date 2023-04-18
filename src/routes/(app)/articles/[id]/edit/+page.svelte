<script lang="ts">
    import { page } from '$app/stores';
    import { error } from '@sveltejs/kit';
    import Create from "$components/button/group/Create.svelte";
    import suneditor from "suneditor";
    import {ko} from 'suneditor/src/lang';
    import plugins from 'suneditor/src/plugins';
    import { extractErrors, noticeValidateSchema } from '$utils/validates';
    import { auth, authToken } from '$stores';
    import axios from 'axios';
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import Swal from "sweetalert2";
    import { Checkbox } from 'flowbite-svelte'
    import { LECTURE } from '$lib/utils/constans';
    import { Notyf } from 'notyf';
    import 'notyf/notyf.min.css';
    import noImage from "$lib/images/noImage.jpg";
    import KoreanAutocomplete from '$components/board/KoreanAutocomplete.svelte';

    const notyf = new Notyf({
        duration: 3000,
        position: {
        x: 'right',
        y: 'top',
        }
    });
    
    let category:any;
    let categoryList:any;
    let editor:any;
    let container: HTMLElement;
    const id = Number($page.params.id);
    const cancelLink = "/articles/"+id;

    let errors:any = {};
    
    // 해시태그
    let tag = '';
    let tags:string[] = [];
    let removeTags:number[] = [];
    let createTags:string[] = [];
    let createTagList:string[] = [];

    let addValues = {
        categoryId: '',
        title: '',
        content: '',
        boardType: '',
        teacher:'',

        //태그정보
        hashTag: tags,
        //태그 제거 정보
        removeTags : removeTags,

        //이미지 파일정보
        thumbnailPath: '',

        //유저정보
        userId: 0,
        email: '',
        userName: '',
        nickName: '',
        role: '',
        isSecret: false,
    }

    onMount(async () => {
        addValues.userId = Number($auth._id);
        try {
            if(!isNaN(id)){
                if(addValues.userId > 0){
                    await fetch("/api/user/board/detail/"+id+"/"+$auth._id)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data.response)
                        data = data.response
                        category = data.category;
                        addValues.categoryId = data.category.categoryId;
                        addValues.title = data.title;
                        addValues.content = convertHtml(data.content);
                        addValues.boardType = data.boardType.toLowerCase();
                        tags = data.hashTags.reverse();
                        addValues.userId = data.writer.userId;
                        addValues.isSecret = data.isSecret;
                        if(data.teacher && data.teacher != ''){
                            addValues.teacher = data.teacher;
                        }

                        if(data.thumbnailPath && data.thumbnailPath != ''){
                            addValues.thumbnailPath = data.thumbnailPath;
                        }
                        
                        editor = suneditor.create('editor',{
                            lang: ko,
                            height: "50vh",
                            width: "100%",
                            plugins: plugins,
                            videoWidth:'100%',
                            value: addValues.content,
                            youtubeQuery: 'autoplay=1&mute=1&enableisapi=1',
                            buttonList: [
                            ['undo', 'redo', 'font', 'fontSize'],
                            ['bold', 'underline', 'italic', 'strike'], 
                            ['removeFormat','image', 'video','codeView']],
                            placeholder: '내용을 입력해주세요.'
                        });
                    })
                    .catch(error => console.log(error));
                    const response = await fetch("/api/user/board/category/"+category.boardType);
                    categoryList = await response.json();
                } else{
                    throw error(404, {
                        message: 'Not found'
                    });    
                }
            } else{
                throw error(404, {
                    message: 'Not found'
                });
            }
        } catch (error) {
            console.log(error)
        }

        
    })

    const onUpdateBoard = async () => {
        try {
            const response = await axios.put("/api/user/board/"+id, addValues);
            if(response.status == 200){
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

    const onSubmitUpdateBoard = async () => {
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
            addValues.hashTag = createTagList;
            addValues.removeTags = removeTags;
            if($auth._id != ''){
                await noticeValidateSchema.validate(addValues, {abortEarly: false});
                await onUpdateBoard();
            }else {
                Swal.fire({
                    icon: 'error',
                    text: "로그인이 되어있지 않습니다. 로그인 후 이용해주세요",
                    timer: 3000, // 3초 후 자동으로 닫힘
                });
            }
        } catch (error) {
            console.log(error);
            errors = extractErrors(error);
        }
    }

    //xss 역치환
    function convertHtml(str:string){
        str = str.replace(/&lt;/g,"<");
        str = str.replace(/&gt;/g,">");
        str = str.replace(/&quot;/g,"\"");
        str = str.replace(/&#39;/g,"\'");
        return str;
    }

    const handleClick = () => {
        addValues.isSecret = !addValues.isSecret;
    }

    
    function sanitizeTag(value:any) {
        return value.replace(/<[^>]*>?/gm, '').trim();
    }
    
    function parsedTag(tag:any) {
        return tag.replace(',', '').replace(' ', '');
    }
    
    function addIfUnique(array:any[], value:any) {
        return [...new Set(array).add(value)];
    }
    
    function processTagsOnKeyUpEvent(e:any) {
        const keyCode = e.keyCode;
        if(tag != ''){
            if(keyCode === 13 || keyCode === 32 || e.code == "Enter" || e.code == "Space"){
                tag = sanitizeTag(tag);
                if (tags.length+createTagList.length < 5) {
                    if (tag.length > 0) {
                        if (tag.indexOf(',') > -1) {
                            let tagList = tag.split(',');
                            tagList.forEach((tag:any) => {
                                if (tag.length > 0) {
                                    createTagList = addIfUnique(createTagList, parsedTag(tag));
                                }
                            });
                            revertTag();
                        } else if (/\s/g.test(tag)) {
                            let tagList = tag.split(' ');
                            tagList.forEach((tag:any) => {
                                if (tag.length > 0) {
                                    createTagList = addIfUnique(createTagList, parsedTag(tag));
                                }
                            });
                            revertTag();
                        } else {
                            createTagList = addIfUnique(createTagList, parsedTag(tag));
                            revertTag();
                        }
                    }
                } else {
                    revertTag();
                }
            }
        }
    }

    function processTagsFocusoutEvent(e:any) {
        const keyCode = e.keyCode;
        if(tag != ''){
            if(keyCode === 13 || keyCode === 32 || e.code == "Enter" || e.code == "Space"){
                tag = sanitizeTag(tag);
                if (tags.length+createTagList.length < 5) {
                    if (tag.length > 0) {
                        if (tag.indexOf(',') > -1) {
                            let tagList = tag.split(',');
                            tagList.forEach((tag:any) => {
                                if (tag.length > 0) {
                                    createTagList = addIfUnique(createTagList, parsedTag(tag));
                                }
                            });
                            revertTag();
                        } else if (/\s/g.test(tag)) {
                            let tagList = tag.split(' ');
                            tagList.forEach((tag:any) => {
                                if (tag.length > 0) {
                                    createTagList = addIfUnique(createTagList, parsedTag(tag));
                                }
                            });
                            revertTag();
                        } else {
                            createTagList = addIfUnique(createTagList, parsedTag(tag));
                            revertTag();
                        }
                    }
                } else {
                    revertTag();
                }
            }
        }
    }
        
    function tagInputDisabled() {
        return tags.length+createTagList.length >= 5;
    }
    
    function removeTag(index:any, boardHashTagId:number) {
        tags = [...tags.slice(0,index), ...tags.slice(index+1)]
        removeTags[removeTags.length] = boardHashTagId;
    }

    function deleteTag(index:any) {
        createTagList = [...createTagList.slice(0,index), ...createTagList.slice(index+1)]
    }
    
    function revertTag() {
        tag = '';
    }

    $:tag = tag.trim();

    const onUploadImageFile = async (e:any) => {
        const { files } = e.target;
        try {
        if(!files || files.length === 0){
            return;
        }

        const file = files[0];

        // Check file extension
        const allowedExtensions = ["bmp", "jpg", "jpeg", "png", "webp"];
        const fileExtension = file.name.split(".").pop().toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            notyf.error('이미지 파일만 업로드 가능합니다.');
            return;
        }

        // Check file size (in bytes)
        const allowedSize = 2 * 1024 * 1024; // 2MB
        if (file.size > allowedSize) {
            notyf.error('파일 크기가 큽니다. 2MB아래로 업로드 해주세요.');
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
            addValues.thumbnailPath = response.data.data.link+"?format=webp&width=170&height=160";
            return upload;
        } else{
            notyf.error('서버 에러입니다. 관리자에게 문의해 주세요.');
        }

        } catch (error) {
            console.log(error);
        }
    }

    const errorImage = (e:any) => {
        e.target.src = noImage;
    }

    const addTags = (value:string) => {
        tags = addIfUnique(tags,value);
        revertTag();
    }
</script>

<div class="md:mx-8">
    <div class="space-y-11">
        <div class="grid grid-cols-1 gap-y-7">
            <div class="space-y-2 mt-3">
                <h3 class="text-xl font-medium sm:text-3xl sm:leading-10">게시물 수정하기</h3>
                <!-- <p class="text-sm text-gray-500 dark:text-gray-400">
                    새벽이슬에서 다양한 사람을 만나고 생각의 폭을 넓혀보세요.
                </p> -->
            </div>
            <div class="space-y-1">
                <label for="categoryId" class="text-sm font-medium text-gray-700 dark:text-gray-200">토픽</label>
                <select id="categoryId" class="block w-full rounded-md border-gray-500/30 pl-3 pr-10 text-base placeholder-gray-500/80 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-0 dark:bg-gray-500/20" name="categoryId" bind:value={addValues.categoryId}>
                    <option value="" class="dark:bg-gray-500">토픽을 선택해주세요.</option>
                    {#if categoryList}
                        {#each categoryList.response as category} 
                            <option value={category.categoryId} class="dark:bg-gray-500">{category.categoryName}</option>
                        {/each}
                    {/if}
                </select>
                {#if errors.categoryId}
                    <div class="text-red-500">{errors.categoryId}</div>
                {/if}
            </div>
            {#if addValues.boardType == LECTURE}
            <div class="space-y-1">
                <label
                    for="teacher"
                    class="text-sm font-medium text-gray-700 dark:text-gray-200"
                    >강사 이름</label>
                <!-- svelte-ignore a11y-autofocus -->
                <input
                    type="text"
                    id="teacher"
                    placeholder="강사 이름을 입력해주세요."
                    class="block w-full appearance-none rounded-md border border-gray-500/30 pl-3 pr-10 text-base placeholder-gray-500/80 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-0 dark:bg-gray-500/20"
                    name="teacher"
                    class:border-red-500={errors.teacher}
                    bind:value={addValues.teacher}
                    maxlength="20"
                     />
                {#if errors.teacher}
                    <div class="text-red-500">{errors.teacher}</div>
                {/if}
            </div>
            {/if}
            {#if addValues.boardType == LECTURE}
            <div class="space-y-1">
                <label
                    for="thumbnailPath"
                    class="text-sm font-medium text-gray-700 dark:text-gray-200"
                    >썸네일</label>
                <input type="file" id="thumbnailPath" class="block w-full appearance-none rounded-md border border-gray-500/30 pl-3 pr-10 text-base placeholder-gray-500/80 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-0 dark:bg-gray-500/20" on:change={onUploadImageFile} class:inputError={errors.thumbnailPath} accept="image/*">
                {#if errors.thumbnailPath}
                    <div class="invalid-feedback was-validated">{errors.thumbnailPath}</div>
                {/if}
                {#if addValues.thumbnailPath}
                <img
                    class="h-40 w-40 rounded-md border border-gray-300 object-contain"
                    src={addValues.thumbnailPath}
                    alt="thumbnail"
                    on:error|once={errorImage}
                />
                {:else}
                <img alt=""/>
                {/if}
            </div>
            {/if}
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
                <label for="tag" class="text-sm font-medium text-gray-700 dark:text-gray-200">태그 - 
                    <span class="rounded-sm text-sm text-blue-500">내용을 대표하는 태그 3개 정도 입력해주세요.(최대 5개)</span>
                </label>
                <div class="grid grid-cols-5">
                    <div class="col-span-6">
                        {#each tags as tag, index}
                            <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibol">
                                #{tag.hashTag.name}
                                <button
                                type="button"
                                class="flex-shrink-0 inline-flex hover:bg-indigo-400 p-1 rounded-full"
                                on:click={() => removeTag(index,tag.id)}
                                >
                                X
                                </button>
                            </span>
                        {/each}
                        {#each createTagList as tag, index}
                            <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibol">
                                #{tag}
                                <button
                                type="button"
                                class="flex-shrink-0 inline-flex hover:bg-indigo-400 p-1 rounded-full"
                                on:click={() => deleteTag(index)}
                                >
                                X
                                </button>
                            </span>
                        {/each}
                    </div>
                </div>
                <div class="grid grid-cols-6">
                    <div class="col-span-6 relative">
                        <div class="flex relative bg-white overflow-hidden rounded-md shadow-sm focus:outline-none focus:shadow-outline border border-gray-300">
                          <input
                            type="text"
                            class="flex-grow py-1 text-sm focus:outline-none"
                            placeholder="Type a tag and press enter"
                            bind:value={tag}
                            on:keydown={processTagsOnKeyUpEvent}
                            on:focusout={processTagsFocusoutEvent}
                            disabled={tagInputDisabled()}
                            maxlength="10"
                          />
                        </div>
                        <KoreanAutocomplete inputText={tag} addTags={addTags}/>
                    </div>
                </div>
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
            <div class="flex items center space-y-1">
                <div class="flex flex-1 flex-wrap items-center"></div>
                <div class="inline-flex rounded">
                    <Checkbox bind:checked={addValues.isSecret} on:click={handleClick} class="dark:text-gray-200">익명</Checkbox>
                </div>
            </div>
        </div>
        <Create link={cancelLink} onAddBoard={onSubmitUpdateBoard} />
    </div>
</div>
