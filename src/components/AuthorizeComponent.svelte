<script>
    import useStore from 'store/auth'
    import { onMount } from 'svelte';
    import { unloadingEvent } from 'lib/apollo-client';
    import { user } from 'store/store';

    let store = useStore.getState()
    onMount(() => {
        store.authorize()
        const unsubscribe = useStore.subscribe(
            (state) => {
                user.set(state.auth.data.authorize)
            },
            (state)  =>  state.auth
        )

        return () => unsubscribe()
    })


</script>
