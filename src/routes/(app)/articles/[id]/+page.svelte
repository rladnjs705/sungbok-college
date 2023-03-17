<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;


    let board = data.item.response;
    let category = board.boardCategoryResponseDTOList;
    let commentList = board.commentResponseDTOList;
    let userInfo = board.writer;

    console.log(board);

</script>
