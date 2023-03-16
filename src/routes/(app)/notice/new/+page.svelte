<script lang="ts">
    import Create from "$components/button/group/Create.svelte";
    import Editor from "@toast-ui/editor";
    import { extractErrors, noticeValidateSchema } from '$utils/validates';
    import axios from 'axios';
    import { onMount } from "svelte";
    import type { PageData } from './$types';
    import { goto } from "$app/navigation";
    import Swal from "sweetalert2";
    
    // import { Notyf } from 'notyf';
    // import 'notyf/notyf.min.css';
    // const notyf = new Notyf({
    //     duration: 3000,
    //     position: {
    //     x: 'right',
    //     y: 'top',
    //     }
    // });

    export let data: PageData;
    let editor:any;
    let container: HTMLElement;
    const cancelLink = "/notice";

    let errors:any = {};

    let addValues = {
        categoryId: '',
        title: '',
        content: '',
        boardType: 'NOTICE',
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
            toolbarItems: [
                ["heading", "bold", "italic", "strike"],
                ["ul", "ol"],
                ["image", "link"],
            ],
        });
    })

    const onAddBoard = async () => {
        try {
            const response = await axios.post("/api/admin/board/create", addValues);
            if(response.status == 200){
                //notyf.success("생성되었습니다.");
                goto("/notice");
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
            await noticeValidateSchema.validate(addValues, {abortEarly: false});
            await onAddBoard();
        } catch (error) {
            console.log(error);
            errors = extractErrors(error);
        }
    }
</script>

<div class="md:mx-48">
    <div class="space-y-11">
        <div class="grid grid-cols-1 gap-y-7">
            <div class="space-y-2 mt-3">
                <h3 class="text-xl font-medium sm:text-3xl sm:leading-10">공지사항</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    공지사항을 등록하여 새 소식, 정보를 공유해 주세요.
                </p>
            </div>
            <div class="space-y-1">
                <label for="categoryId" class="text-sm font-medium text-gray-700 dark:text-gray-300">토픽</label>
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
                    class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >제목</label>
                <input
                    type="text"
                    id="title"
                    placeholder="제목을 입력해주세요."
                    class="block w-full appearance-none rounded-md border border-gray-500/30 pl-3 pr-10 text-base placeholder-gray-500/80 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-0 dark:bg-gray-500/20"
                    name="title"
                    class:border-red-500={errors.title}
                    bind:value={addValues.title}/>
                {#if errors.title}
                    <div class="text-red-500">{errors.title}</div>
                {/if}
            </div>
            <div class="space-y-1">
                <label
                    for="text"
                    class="text-sm font-medium text-gray-700 dark:text-gray-300"
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
        </div>
        <Create link={cancelLink} onAddBoard={onSubmitAddBoard} />
    </div>
</div>