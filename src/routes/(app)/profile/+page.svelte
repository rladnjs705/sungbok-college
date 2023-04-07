<script lang="ts">
    import { Notyf } from 'notyf';
    import 'notyf/notyf.min.css';
    const notyf = new Notyf({
      duration: 3000,
      position: {
        x: 'right',
        y: 'top',
      }
    });

    let formData = {
      email: '',
      userName: '',
      content: ''
    };
  
    let errorMessage = '';
  
    async function handleSubmit(e:any) {
      e.preventDefault();
  
      const response = await fetch('/api/user/mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        formData.content ='';
        formData.userName ='';
        formData.email ='';
        notyf.success("이메일이 전송되었습니다.");
      } else {
        const error = await response.json();
        errorMessage = error.message;
      }
    }
</script>
<div class="bg-gray-100 py-8">
    <form class="mx-auto max-w-xl shadow-lg p-8 bg-white rounded-lg" on:submit={handleSubmit}>
        <h2 class="text-2xl font-bold mb-6">이메일 보내기</h2>
        <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="name">
            이름
        </label>
            <input class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="userName" bind:value={formData.userName}  required type="text" placeholder="이름">
        </div>
        <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="email">
            이메일
        </label>
            <input class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" bind:value={formData.email} required type="email" placeholder="이메일">
        </div>
        <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="message">
            내용
        </label>
            <textarea class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="content" bind:value={formData.content} placeholder="내용을 입력하세요." required></textarea>
        </div>
        {#if errorMessage}
            <div class="error">{errorMessage}</div>
        {/if}
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Send
        </button>
    </form>
</div>