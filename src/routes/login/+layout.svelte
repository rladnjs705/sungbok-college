<script lang="ts">
    import "../../app.css";
    import "$lib/styles/main.scss";
    import { authToken, auth } from '$stores';
    $: {
      if($authToken){
          auth.createAuth();
      } else {
          auth.resetAuth();
      }
    }
</script>
<slot/>