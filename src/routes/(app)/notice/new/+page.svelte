<script lang="ts">
    import Create from "$components/button/group/Create.svelte";
    import Editor from "$components/board/Editor.svelte";

    const theme = "dark"
    
    const cancelLink = "/notice";
</script>

<div class="md:mx-48">
    <div class="space-y-11">
        <div class="grid grid-cols-1 gap-y-7">
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
                    class="remirror-theme relative z-0 rounded-md border border-gray-500/30 shadow-sm dark:border-gray-500/70"
                >
                    <div class="min-h-[50vh]">
                        <Editor theme={theme} />
                    </div>
                </div>
            </div>
        </div>
        <Create link={cancelLink} />
    </div>
</div>