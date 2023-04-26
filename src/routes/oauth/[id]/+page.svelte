<script lang="ts">
	import { page } from '$app/stores';
    import { goto } from "$app/navigation";
    import { authToken, auth } from '$stores';
    import axios from "axios";
    import { onMount } from "svelte";
    import Swal from 'sweetalert2';

    onMount(async () => {
        const queryParams = new URLSearchParams(window.location.search);

        const id = String($page.params.id);
    
        if(queryParams.get("error")){
            console.error(queryParams.get("error_description"));
        } else{
            const code = queryParams.get("code");
            const state = queryParams.get("state") == null ? "" : queryParams.get("state");
            let csrfToken;
            if(localStorage.getItem("csrfToken")){
                csrfToken = localStorage.getItem("csrfToken");
            } else {
                csrfToken = "";
            }
    
            if(state === csrfToken) {
                try {
                    await axios.get("/api/login/oauth2/code/"+id+"?code="+code)
                    .then(response => {
                        
                        authToken.saveAuthToken(response.data.data);
                        auth.createAuth();
                        goto("/");
                    })
                    .catch(async (error) => {
                        console.log(error.response);
                        const result = await sweetConfirm('로그인 에러입니다. 다시 로그인해주세요.');
                        if(result.value){
                            goto("/login");
                        }
                    })
                } catch (error) {
                    console.log(error)
                }
            } else{
                console.error("Invalid CSRF token");
            }
        }
    })

    const sweetConfirm = async (msg:string) => {
        return Swal.fire({
            text: msg,
            icon: 'warning',
            confirmButtonText: "예"
        });
    }

</script>