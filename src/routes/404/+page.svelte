<script lang="ts">
	/*
	 * Источник для build/404.html.
	 *
	 * adapter-static с fallback:'404.html' кладёт по этому имени пустую SPA-оболочку: ни title,
	 * ни description, ни JSON-LD, ни телефона — всё это дорисовывается JavaScript уже в
	 * браузере. Для хостинга, поисковика и человека с выключенным JS это страница ни о чём.
	 * Поэтому настоящая страница «не найдено» собирается как обычный предрендеренный маршрут,
	 * а scripts/postbuild.mjs переносит её в build/404.html и вырезает клиентский бутстрап
	 * SvelteKit: по несуществующему адресу отдаётся статический HTML, который не пытается
	 * гидрировать себя как маршрут /404/. Сам каталог build/404/ после переноса удаляется,
	 * чтобы у страницы не было второго, индексируемого адреса.
	 */
	import NotFound from '$lib/NotFound.svelte';

	const title = 'Страница не найдена — KRAN-RT';
	const description =
		'По этому адресу на сайте ничего нет: ссылка устарела или в адресе опечатка. Разделы сайта и телефон диспетчера — на этой странице.';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="robots" content="noindex, follow" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
</svelte:head>

<main>
	<NotFound status={404} />
</main>
