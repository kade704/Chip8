<script lang="ts">
    import type { Snippet } from "svelte";
    import "../app.css";

    type Props = {
        children: Snippet;
    };

    let { children }: Props = $props();
</script>

<div class="bg-neutral-900 w-full h-screen">
    {@render children()}
</div>
