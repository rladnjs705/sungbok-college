<script lang="ts">
    import Create from "$components/button/group/Create.svelte";
    import Editor from "@toast-ui/editor";
    import { extractErrors, noticeValidateSchema } from '$utils/validates';
    import axios from 'axios';
    import { onMount } from "svelte";
    import type { PageData } from './$types';

    let container: HTMLElement;
    let editor:any;
    const cancelLink = "/questions";

    let errors:any = {};
    let addValues = {
        categoryId: '',
        title: '',
        content: '',
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
            }else{
                //notyf.error(response.data.resultMsg);
            }
        } catch(error) {
            errors = extractErrors(error);
        }
    }

    const onSubmitAddBoard = async () => {
        try {
            if(editor.getText().length === 0){
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

<div class="md:mx-8">
    <div class="space-y-11">
        <div class="grid grid-cols-1 gap-y-7">
            <div class="space-y-2 mt-3">
                <h3 class="text-xl font-medium sm:text-3xl sm:leading-10">궁금증 해결하기</h3>
                <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    <strong>워니김</strong>님 성경대학에서 다른 학우들과 함께 궁금증을 해결하세요.
                </p>
            </div>
            <div class="space-y-1">
                <label
                    for="title"
                    class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >제목</label
                ><input
                    type="text"
                    id="title"
                    placeholder="제목을 입력해주세요."
                    class="block w-full appearance-none rounded-md border border-gray-500/30 pl-3 pr-10 text-base placeholder-gray-500/80 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-0 dark:bg-gray-500/20"
                    name="title"
                />
            </div>
            <div class="space-y-1">
                <label
                    for="text"
                    class="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >본문</label
                >
                <div
                    class="remirror-theme relative z-0 rounded-md border border-gray-500/30 shadow-sm dark:border-gray-500/70">
                    <div class="min-h-[50vh]">
                        <div id="editor" bind:this={container} />
                    </div>
                </div>
            </div>
        </div>
        <Create link={cancelLink} onAddBoard={onSubmitAddBoard} />
    </div>
</div>