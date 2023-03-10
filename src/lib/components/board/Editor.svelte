<script lang="ts">
    import { onMount } from "svelte";
    import Editor from "@toast-ui/editor";

    let editor:any;
    let container: HTMLElement;
    export let theme:string ='';

    onMount(() => {
        editor = new Editor({
            el: container,
            theme: theme,
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
    });
</script>
  
<div id="editor" bind:this={container} />