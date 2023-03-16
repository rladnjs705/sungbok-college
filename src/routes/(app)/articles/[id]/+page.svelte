<script lang="ts">
    import { page } from "$app/stores";
    import Disqus from 'svelte-disqus';
    const id = $page.params.id;

</script>
<!-- <div id="disqus_thread"></div> -->
<Disqus
  shortname="sungbok"
  identifier={id}
  title="새벽이슬"
  url="https://port-0-sungbok-college-1jx7m2gldi7x7be.gksl2.cloudtype.app"
  lang="ko"
/>
{id}