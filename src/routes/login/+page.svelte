<script lang="ts">
    import { goto } from '$app/navigation';
    import { authToken, auth } from '$stores';
    import { extractErrors, loginValidateSchema } from '$utils/validates.js';
    import Swal from 'sweetalert2';
    import logo from "$lib/images/logo.png";
    import { onMount } from 'svelte';
    import 'sweetalert2/src/sweetalert2.scss';
    import { env } from '$env/dynamic/public';
    import { Browser } from '@capacitor/browser';

  let formValues = {
    userEmail: '',
    password: ''
  }


  onMount(() => {
    document.body.classList.remove("sidebar-open");
  })
  
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
    const kakaoLogin = async () => {
      try {
        const clientId = env.PUBLIC_KAKAO_CLIENT_ID;;
        const redirectUrl = env.PUBLIC_KAKAO_REDIRECT_URL;
        const url = "https://kauth.kakao.com/oauth/authorize?client_id="+clientId+"&redirect_uri="+redirectUrl+"&response_type=code";
        try {
          await Browser.open({ url: url});
        } catch (error) {
          location.href = url;
        }

      } catch (error) {
        console.log(error);
      }
    }

    const naverLogin = async () => {
      try {
        const clientId = env.PUBLIC_NAVER_CLIENT_ID;
        const redirectUrl = env.PUBLIC_NAVER_REDIRECT_URL;
        const url = "https://nid.naver.com/oauth2.0/authorize?client_id="+clientId+"&redirect_uri="+redirectUrl+"&response_type=code";
        try {
          await Browser.open({ url: url});
        } catch (error) {
          location.href = url;
        }
      } catch (error) {
        console.log(error);
      }
    }

    const googleLogin = async () => {
      try {
        const clientId = env.PUBLIC_GOOGLE_CLIENT_ID;
        const redirectUrl = env.PUBLIC_GOOGLE_REDIRECT_URL;
        const scope = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
        const url = "https://accounts.google.com/o/oauth2/v2/auth?client_id="+clientId+"&redirect_uri="+redirectUrl+"&response_type=code&scope="+scope;
        try {
          await Browser.open({ url: url});
        } catch (error) {
          location.href = url;
        }
      } catch (error) {
        console.log(error);
      }
    }

    const clearError = () => {
        errors = {};
    }
  </script>
<div class="flex justify-center px-6 pb-16 mt-2">
    <div class="w-full max-w-md">
        <a href="/">
            <img class="mx-auto h-32 w-auto" src={logo} alt="Sungbok" />
        </a>
        <h2 class="mt-2 text-center text-2xl font-bold sm:text-3xl">
            새벽이슬에 오신것을 환영합니다.
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            새벽이슬은 성복교회 청년부를 위한
        </p>
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
            컨텐츠 공유 플랫폼입니다.
        </p>

        <div class="mt-8">
          <span class="text-sm font-medium">SNS 로그인</span>
          <div class="mt-1 grid grid-cols-3 gap-3">
            <a class="inline-flex w-full justify-center rounded-md border border-gray-500/30 px-4 py-2 text-gray-700 shadow-sm hover:border-gray-500/70 dark:bg-gray-700 dark:text-gray-300" href="#null" on:click={googleLogin}>
              <span class="sr-only">Sign in with Google</span>
              <svg class="h-5 w-5" viewBox="0 0 18 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1394_6209)">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M17.4982 9.20447C17.4982 8.56603 17.4427 7.95303 17.3405 7.36377H9.17188V10.8451H13.84C13.639 11.9702 13.0278 12.9232 12.1094 13.5616V15.8194H14.9129C16.5528 14.2526 17.4991 11.9456 17.4991 9.20447H17.4982Z" fill="currentColor"></path>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.17299 17.9998C11.5148 17.9998 13.4784 17.1935 14.9132 15.8191L12.1097 13.5613C11.3326 14.1014 10.3398 14.4202 9.17218 14.4202C6.91286 14.4202 5.00082 12.8372 4.31853 10.71H1.42188V13.0416C2.84937 15.9828 5.78198 17.9998 9.17299 17.9998Z" fill="currentColor"></path>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M4.32 10.7101C4.14677 10.17 4.0479 9.59348 4.0479 8.99999C4.0479 8.40649 4.14677 7.82994 4.32 7.28986V4.95825H1.42252C0.835016 6.17323 0.5 7.54761 0.5 8.99999C0.5 10.4524 0.835016 11.8267 1.42252 13.0417L4.32 10.7101Z" fill="currentColor"></path>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.17299 3.57965C10.4461 3.57965 11.59 4.0341 12.4888 4.9252L14.9769 2.34348C13.4743 0.891945 11.5107 0 9.17299 0C5.78198 0 2.84937 2.01705 1.42188 4.95827L4.31935 7.28987C5.00164 5.1626 6.91368 3.57965 9.17299 3.57965Z" fill="currentColor"></path>
                </g>
                <defs>
                  <clipPath id="clip0_1394_6209"><rect width="17" height="18" fill="currentColor" transform="translate(0.5)"></rect></clipPath>
                </defs>
              </svg>
            </a>
            <a class="inline-flex w-full justify-center rounded-md border border-gray-500/30 px-4 py-2 text-gray-700 shadow-sm hover:border-gray-500 dark:bg-gray-700 dark:text-gray-300" href="#null" on:click={naverLogin}>
              <span class="sr-only">Sign in with Naver</span>
              <svg class="h-5 w-5" viewBox="-1 -1 17 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M9.88343 0V7.06382L5.13527 0H0V14H5.11657V6.93618L9.8666 14H15V0H9.88343Z" fill="currentColor"></path>
              </svg>
            </a>
            <a class="inline-flex w-full justify-center rounded-md border border-gray-500/30 px-4 py-2 text-gray-700 shadow-sm hover:border-gray-500 dark:bg-gray-700 dark:text-gray-300" href="#null" on:click={kakaoLogin}>
              <span class="sr-only">Sign in with Kakao</span>
              <svg class="h-5 w-5" viewBox="0 0 22 21" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1394_6217)">
                  <path d="M11 0C4.92473 0 0 4.04523 0 9.03544C0 12.2837 2.08683 15.1299 5.2182 16.7227C4.98798 17.6156 4.38507 19.9561 4.26426 20.457C4.11553 21.0787 4.48366 21.0705 4.72471 20.9029C4.9139 20.772 7.73926 18.7767 8.95819 17.9152C9.6198 18.017 10.3019 18.0709 11 18.0709C17.0753 18.0709 22 14.0251 22 9.03544C22 4.04582 17.0753 0 11 0Z" fill="currentColor"></path>
                  <path d="M6.57195 6.37451H3.35566C3.05306 6.37451 2.80859 6.62911 2.80859 6.94293C2.80859 7.25674 3.05363 7.51134 3.35566 7.51134H4.40135V11.5151C4.40135 11.6608 4.45834 11.8041 4.55863 11.9077C4.65665 12.0107 4.79398 12.0699 4.93474 12.0699H5.05156C5.19175 12.0699 5.32851 12.0107 5.4271 11.9077C5.52739 11.8041 5.58438 11.6614 5.58438 11.5151V7.51134H6.57195C6.87454 7.51134 7.11958 7.25674 7.11958 6.94293C7.11958 6.62911 6.87454 6.37451 6.57195 6.37451Z" fill="white" class="block dark:hidden"></path>
                  <path d="M14.3034 11.0004H12.8075V6.9114C12.8075 6.57035 12.542 6.29443 12.2143 6.29443C11.8866 6.29443 11.6211 6.57035 11.6211 6.9114V11.319C11.6211 11.3533 11.6251 11.3853 11.6302 11.4179C11.6245 11.4498 11.6211 11.483 11.6211 11.5162C11.6211 11.8016 11.8428 12.0325 12.1174 12.0325H14.3034C14.5787 12.0325 14.7998 11.8016 14.7998 11.5162C14.7998 11.2308 14.5781 11.0004 14.3034 11.0004Z" fill="white" class="block dark:hidden"></path>
                  <path d="M19.0842 11.1881L17.4174 8.91329L18.9235 7.34778C19.1275 7.1364 19.1275 6.79239 18.9235 6.58042C18.7195 6.36845 18.389 6.36845 18.1844 6.58042L16.3198 8.51777V6.9114C16.3198 6.57035 16.0543 6.29443 15.7266 6.29443C15.3989 6.29443 15.1328 6.57035 15.1328 6.9114V11.4546C15.1328 11.7956 15.3984 12.0716 15.7266 12.0716C16.0548 12.0716 16.3198 11.7962 16.3198 11.4546V10.0531L16.6589 9.70138L18.2357 11.8513C18.4112 12.0946 18.7446 12.145 18.9788 11.9608C19.213 11.7779 19.2603 11.4321 19.0842 11.1881Z" fill="white" class="block dark:hidden"></path>
                  <path d="M11.1745 11.3357L9.57146 6.77887C9.57146 6.77887 9.56747 6.77532 9.56633 6.77355C9.46375 6.49585 9.168 6.29395 8.81525 6.29395C8.42376 6.29395 8.10008 6.54263 8.03568 6.86769C8.02486 6.89197 8.01403 6.91624 8.00491 6.94229L6.42868 11.3357C6.33124 11.624 6.47712 11.939 6.7535 12.0403C7.03045 12.1415 7.33419 11.9899 7.43163 11.7022L7.7046 10.8934H9.89856L10.1709 11.7022C10.2684 11.9899 10.5721 12.1415 10.8491 12.0403C11.126 11.939 11.2719 11.624 11.1745 11.3357ZM8.05278 9.86016L8.79018 7.67413C8.79873 7.67413 8.80557 7.6765 8.81411 7.6765L9.55094 9.86016H8.05335H8.05278Z" fill="white" class="block dark:hidden"></path>
                  <path d="M6.57195 6.37451H3.35566C3.05306 6.37451 2.80859 6.62911 2.80859 6.94293C2.80859 7.25674 3.05363 7.51134 3.35566 7.51134H4.40135V11.5151C4.40135 11.6608 4.45834 11.8041 4.55863 11.9077C4.65665 12.0107 4.79398 12.0699 4.93474 12.0699H5.05156C5.19175 12.0699 5.32851 12.0107 5.4271 11.9077C5.52739 11.8041 5.58438 11.6614 5.58438 11.5151V7.51134H6.57195C6.87454 7.51134 7.11958 7.25674 7.11958 6.94293C7.11958 6.62911 6.87454 6.37451 6.57195 6.37451Z" fill="rgb(17 24 39 / var(--tw-bg-opacity))" class="hidden dark:block"></path>
                  <path d="M14.3034 11.0004H12.8075V6.9114C12.8075 6.57035 12.542 6.29443 12.2143 6.29443C11.8866 6.29443 11.6211 6.57035 11.6211 6.9114V11.319C11.6211 11.3533 11.6251 11.3853 11.6302 11.4179C11.6245 11.4498 11.6211 11.483 11.6211 11.5162C11.6211 11.8016 11.8428 12.0325 12.1174 12.0325H14.3034C14.5787 12.0325 14.7998 11.8016 14.7998 11.5162C14.7998 11.2308 14.5781 11.0004 14.3034 11.0004Z" fill="rgb(17 24 39 / var(--tw-bg-opacity))" class="hidden dark:block"></path><path d="M19.0842 11.1881L17.4174 8.91329L18.9235 7.34778C19.1275 7.1364 19.1275 6.79239 18.9235 6.58042C18.7195 6.36845 18.389 6.36845 18.1844 6.58042L16.3198 8.51777V6.9114C16.3198 6.57035 16.0543 6.29443 15.7266 6.29443C15.3989 6.29443 15.1328 6.57035 15.1328 6.9114V11.4546C15.1328 11.7956 15.3984 12.0716 15.7266 12.0716C16.0548 12.0716 16.3198 11.7962 16.3198 11.4546V10.0531L16.6589 9.70138L18.2357 11.8513C18.4112 12.0946 18.7446 12.145 18.9788 11.9608C19.213 11.7779 19.2603 11.4321 19.0842 11.1881Z" fill="rgb(17 24 39 / var(--tw-bg-opacity))" class="hidden dark:block"></path><path d="M11.1745 11.3357L9.57146 6.77887C9.57146 6.77887 9.56747 6.77532 9.56633 6.77355C9.46375 6.49585 9.168 6.29395 8.81525 6.29395C8.42376 6.29395 8.10008 6.54263 8.03568 6.86769C8.02486 6.89197 8.01403 6.91624 8.00491 6.94229L6.42868 11.3357C6.33124 11.624 6.47712 11.939 6.7535 12.0403C7.03045 12.1415 7.33419 11.9899 7.43163 11.7022L7.7046 10.8934H9.89856L10.1709 11.7022C10.2684 11.9899 10.5721 12.1415 10.8491 12.0403C11.126 11.939 11.2719 11.624 11.1745 11.3357ZM8.05278 9.86016L8.79018 7.67413C8.79873 7.67413 8.80557 7.6765 8.81411 7.6765L9.55094 9.86016H8.05335H8.05278Z" fill="rgb(17 24 39 / var(--tw-bg-opacity))" class="hidden dark:block"></path></g><defs><clipPath id="clip0_1394_6217">
                    <rect width="22" height="21" fill="white"></rect>
                  </clipPath>
                </defs>
              </svg>
            </a>
          </div>
        </div>

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