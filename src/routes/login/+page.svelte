<script lang="ts">
    import { goto } from '$app/navigation';
    import { authToken, auth } from '$stores';
    import { extractErrors, loginValidateSchema } from '$utils/validates.js';
    import Swal from 'sweetalert2';
  
  let formValues = {
    userEmail: '',
    password: ''
  }
  
  let errors:any = {}
  
  const onEnterLogin = (e:any) => {
      const keyCode = e.keyCode;
  
      if(keyCode === 13) {
        onSubmitLogin();
      }
    }
  
  async function onSubmitLogin() {
    try {
      await loginValidateSchema.validate(formValues, {abortEarly: false});
      onLogin();
    }
    catch(error) {
      errors = extractErrors(error);
    }
  }
  
  async function onLogin () {
    try {
        const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
          body: "userEmail="+formValues.userEmail+"&password="+formValues.password,
        });
  
        if (response.ok) {
          const result = await response.json();
          authToken.saveAuthToken(result.data);
          auth.createAuth();
          goto("/");
        } else {
          const result = await response.json();
          console.log(result.data.error);
          Swal.fire({
            icon: 'error',
            text: result.data.error
          });
        }
  
      } catch (error) {
        console.log(error);
        await Swal.fire({
          icon: 'error',
          text: "서버 에러입니다. 관리자에게 문의해주세요."
        });
      }
    }

    const clearError = () => {
        errors = {};
    }
  </script>
<div class="flex justify-center px-6 pb-16 mt-2">
    <div class="w-full max-w-md">
        <a href="/">
            <img class="mx-auto h-32 w-auto" src="/logo.png" alt="Sungbok" />
        </a>
        <h2 class="mt-2 text-center text-2xl font-bold sm:text-3xl">
            새벽이슬에 오신것을 환영합니다.
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            새벽이슬은 성복교회 청년부를 위한 컨텐츠 공유 플랫폼입니다.
        </p>
        <div class="mx-4 sm:mx-0">
            <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-500/30 dark:border-gray-500/70"/>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="bg-white px-2 text-gray-500 dark:bg-gray-800">새벽이슬 아이디로 로그인</span>
                </div>
            </div>
            <form class="mt-6 space-y-6" method="POST">
                <input type="hidden" name="remember" value="true" />
                <div>
                    <div class="space-y-6 rounded-md shadow-sm">
                        <div>
                            <label
                                for="user-id"
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >아이디</label
                            >
                            <div class="mt-1">
                                <input
                                    id="userId"
                                    type="text"
                                    class="block w-full appearance-none rounded-md border border-gray-500/30 px-3 py-2 text-sm placeholder-gray-500/80 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-0 dark:bg-gray-500/20 sm:text-base"
                                    placeholder="name@example.com"
                                    name="userId"
                                    bind:value={formValues.userEmail} 
                                    class:inputError={errors.userEmail} 
                                    required
                                    on:keydown={clearError}
                                />
                            </div>
                            {#if errors.userEmail}
                                <span class:text-red-500={errors.userEmail} class:text-sm={errors.userEmail}>{errors.userEmail}</span>
                            {/if}   
                        </div>
                        <div>
                            <label
                                for="password"
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >비밀번호</label
                            >
                            <div class="mt-1">
                                <input
                                    id="password"
                                    type="password"
                                    autocomplete="current-password"
                                    class="block w-full appearance-none rounded-md border border-gray-500/30 px-3 py-2 text-sm placeholder-gray-500/80 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-0 dark:bg-gray-500/20 sm:text-base"
                                    placeholder="Password"
                                    name="password"
                                    bind:value={formValues.password} 
                                    class:inputError={errors.password} 
                                    on:keydown={onEnterLogin} 
                                    on:keydown={clearError}
                                    required
                                />
                            </div>
                            {#if errors.password}
                                <span class:text-red-500={errors.password} class:text-sm={errors.password}>{errors.password}</span>
                            {/if}        
                        </div>
                    </div>
                </div>
                <!-- <div class="flex items-center justify-end">
                    <div class="space-x-2 text-sm">
                        <a class=" text-blue-500 hover:text-blue-400" 
                            href="/forgot">
                            계정찾기
                        </a>
                    </div>
                </div> -->
                <div>
                    <button
                        type="button"
                        class="flex w-full justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400 focus:outline-none disabled:bg-blue-500 disabled:opacity-40"
                        on:click={onSubmitLogin}
                        >로그인</button
                    >
                </div>
                <p class="flex items-center justify-center space-x-1 text-sm">
                    <span>아직 회원이 아니신가요?</span><a
                        class="flex items-center text-blue-500 underline hover:text-blue-400"
                        href="/signup">회원가입</a
                    >
                </p>
            </form>
        </div>
    </div>
</div>