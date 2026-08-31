<script lang="ts">
	import { page } from '$app/state';
	import NotFound from '$lib/NotFound.svelte';
</script>

<svelte:head>
	<title>Страница не найдена — KRAN-RT</title>
	<meta name="description" content="По этому адресу на сайте ничего нет. Разделы сайта и телефон диспетчера — на этой странице." />
</svelte:head>

<main>
	<NotFound status={page.status} />
</main>
