<script lang="ts">
    import type { PageData } from './$types';
    import Create from "$components/button/group/Create.svelte";
    import Editor from "@toast-ui/editor";
    import { extractErrors, noticeValidateSchema } from '$utils/validates';
    import { auth } from '$stores';
    import axios from 'axios';
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import Swal from "sweetalert2";
    import { Checkbox } from 'flowbite-svelte'
    import { LECTURE } from '$lib/utils/constans';

    export let data: PageData;
    let editor:any;
    let container: HTMLElement;
    const cancelLink = "/lecture";

    let errors:any = {};
    
    // 해시태그
    let tag = '';
    let tags:string[] = [];

    let addValues = {
        categoryId: '',
        title: '',
        content: '',
        boardType: LECTURE,

        //태그정보
        hashTag: tags,

        //파일정보
        thumbnailPath: '',

        //유저정보
        userId: 0,
        email: '',
        userName: '',
        nickName: '',
        role: '',
        isSecret: false,
    }
    
    onMount(() => {
        editor = new Editor({
            el: container,
            initialValue: addValues.content,
            placeholder: '내용을 입력해주세요.',
            height: "50vh",
            initialEditType: "wysiwyg",
            previewStyle: "vertical",
            hideModeSwitch: true,
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
            if(editor.getHTML()=="<p><br></p>"|| editor.getHTML()==""){
                addValues.content = '';
            }else{
                addValues.content = editor.getHTML();
            }
            addValues.userId = Number($auth._id);
            addValues.email = $auth.email;
            addValues.nickName = $auth.nickName;
            addValues.userName = $auth.userName;
            addValues.role = $auth.role;
            addValues.hashTag = tags;
            if($auth._id != ''){
                await noticeValidateSchema.validate(addValues, {abortEarly: false});
                await onAddBoard();
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
            if(keyCode === 13 || keyCode === 32){
                tag = sanitizeTag(tag);
                if (tags.length < 5) {
                    if (tag.length > 0) {
                        if (tag.indexOf(',') > -1) {
                            let tagList = tag.split(',');
                            tagList.forEach((tag:any) => {
                                if (tag.length > 0) {
                                    tags = addIfUnique(tags, parsedTag(tag));
                                }
                            });
                            revertTag();
                        } else if (/\s/g.test(tag)) {
                            let tagList = tag.split(' ');
                            tagList.forEach((tag:any) => {
                                if (tag.length > 0) {
                                    tags = addIfUnique(tags, parsedTag(tag));
                                }
                            });
                            revertTag();
                        } else {
                            tags = addIfUnique(tags, tag);
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
        return tags.length >= 5;
    }
    
    function removeTag(index:any) {
        tags = [...tags.slice(0,index), ...tags.slice(index+1)]
    }
    
    function revertTag() {
        tag = '';
    }

    $:tag = tag.trim();
</script>

<div class="md:mx-8">
    <div class="space-y-11">
        <div class="grid grid-cols-1 gap-y-7">
            <div class="space-y-2 mt-3">
                <h3 class="text-xl font-medium sm:text-3xl sm:leading-10">강의 등록</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    강의를 등록하여 주변에 선한 영향력을 행사해 주세요.
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
                    <span class="rounded-sm text-sm text-blue-500">내용을 대표하는 태그 3개 정도 입력해주세요.</span>
                </label>
                <div class="grid grid-cols-5">
                    <div class="col-span-6">
                        {#each tags as tag, index}
                            <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibol">
                                #{tag}
                                <button
                                type="button"
                                class="flex-shrink-0 inline-flex hover:bg-indigo-400 p-1 rounded-full"
                                on:click={() => removeTag(index)}
                                >
                                X
                                </button>
                            </span>
                        {/each}
                    </div>
                </div>
                <div class="grid grid-cols-6">
                    <div class="col-span-6">
                        <div class="flex relative bg-white overflow-hidden rounded-md shadow-sm focus:outline-none focus:shadow-outline border border-gray-300">
                          <input
                            type="text"
                            class="flex-grow py-1 text-sm focus:outline-none"
                            placeholder="Type a tag and press enter"
                            bind:value={tag}
                            on:keydown={processTagsOnKeyUpEvent}
                            disabled={tagInputDisabled()}
                            maxlength="10"
                          />
                        </div>
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
                        <div id="editor" bind:this={container} />
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
        <Create link={cancelLink} onAddBoard={onSubmitAddBoard} />
    </div>
</div>
