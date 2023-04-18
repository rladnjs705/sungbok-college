<script lang="ts">
    import Hangul from 'hangul-js'; // Hangul.js 라이브러리는 이렇게 import하면 됩니다.
    import { onMount } from 'svelte';

    let wordList:any[]=[];
    export let inputText = ''; // 검색어 입력란에서 글자를 받아내는 변수입니다.
    export let addTags:any;

    onMount(async () => {
        try {
            await fetch('/api/user/board/tags') // 태그리스트 가져오기
            .then(response => response.json())
            .then(data => {
                wordList = data.response.hashTag;
            });
        } catch (error) {
            console.log(error)
        }
    })

    function matchedWords( searchText:string ) { // 검색어가 음소단위로 입력될 때마다 호출되는 함수입니다.
        let searcher = new Hangul.Searcher(searchText); // 함수가 호출되면 일단 검색어 문자열을 음소단위로 분리해놓습니다.
        let output:any[] = [];    // 검색어가 포함된 단어들을 담아낼 배열 변수입니다.
        let search_v = -1;  // 검색 대상 단어에 검색어의 위치값을 담아두는 변수이며, default -1은 검색어가 포함되어 있지 않다는 의미입니다.
        wordList.forEach( (word:string) => { // 검색 대상 단어들을 하나씩 확인합니다.

            search_v = searcher.search(word); // 검색 대상 단어에 검색어 위치값을 받아냅니다.
            if (search_v >= 0) { // 검색어 위치값이 0 이상이면 검색 대상 단어에 검색어의 음소나 음절이 존재한다는 의미입니다.
                output.push({ text: word, id: search_v }); // 검색어의 음소나 음절이 포함된 단어를 검색 결과 배열에 담습니다. 검색어 위치값도 챙깁니다.
            }
        })
        output.sort(function (a,b){ return a.text < b.text ? -1 : a.text > b.text ? 1 : 0; }); // 검색어의 음소나 음절이 포함된 단어들을 일단 가나다 순으로 정렬합니다.
        output.sort(function (a,b){ return a.id - b.id }); // 검색 결과 단어들을 검색어 위치값 순으로 정렬합니다. 이렇게 해야 검색어의 음소에 가장 가까운 단어가 최상단에 배치됩니다.
        return output; // 검색 결과를 내보냅니다.
    }
    function makeBold( targetWord:string ) { // 검색된 문자열에서 검색어의 음소나 음절이 포함된 부분에 강조 표시하는 함수입니다.
        let shift = 0; // 검색된 문자열에서 검색어 음절 앞뒤 위치를 보정해주는 변수입니다.
        let strArray = targetWord.split(''); // 검색된 문자열을 음절 단위로 나누어 배열에 담습니다.
        const boldPoints = Hangul.rangeSearch(targetWord, inputText); // 검색된 문자열에서 검색어 음절의 앞뒤 위치값들을 배열에 담습니다.
        boldPoints.forEach( indexs => {
            strArray.splice(indexs[0]+(shift++),0,'<b style="color:#1E94FC;">'); // 검색어 음절 앞에 강조 표시를 위한 HTML 태그를 삽입합니다.
            strArray.splice(indexs[1]+1+(shift++),0,'</b>'); // 검색어 음절 뒤에 강조 표시 종료 태그를 삽입합니다.
        })
        return `${strArray.join('')}`; // 검색어 음절들이 강조 표시된 문자열을 String으로 변환해서 내보냅니다.
    }
</script>
<span class="absolute top-10 left-0 h-24 z-10 overflow-y-scroll bg-white border border-gray-100 w-full p-2" class:hidden={inputText == ''}>
    {#each matchedWords(inputText) as matched_word}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p class="inputText" on:click={() => addTags(matched_word.text)}>
            {@html makeBold(matched_word.text)} <br>
        </p>
    {/each}
</span>

<style>
    .inputText {
        cursor: pointer;
    }
    .inputText:hover {
        background-color: rgba(229, 231, 235);
    }
</style>