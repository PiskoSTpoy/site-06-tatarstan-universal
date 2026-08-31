<script lang="ts">
	/*
	 * Содержимое страницы «не найдено» — один текст на два входа:
	 *   · src/routes/+error.svelte — ошибка при клиентской навигации внутри уже открытого сайта;
	 *   · src/routes/404/ — предрендеренная страница, которую scripts/postbuild.mjs кладёт в
	 *     build/404.html, чтобы хостинг отдавал по несуществующему адресу настоящую страницу,
	 *     а не пустую SPA-заглушку без title, описания и телефона.
	 * Дублировать разметку в двух местах не нужно — отсюда общий компонент.
	 */
	let { status = 404 }: { status?: number | string } = $props();
</script>

<section class="section wrap nf">
	<span class="eyebrow">{status}</span>
	<h1>Такой страницы нет</h1>
	<p class="nf__lead">
		Возможно, ссылка устарела или в адресе опечатка. Вот основные разделы — с них проще всего найти
		нужное:
	</p>
	<div class="nf__links">
		<a class="btn" href="/">На главную</a>
		<a class="btn" href="/dopusk/">Чек-лист допуска</a>
		<a class="btn" href="/obekty-opo/">Объекты и режимы допуска</a>
		<a class="btn" href="/formy/">Формы и бланки</a>
		<a class="btn" href="/park/">Парк техники</a>
		<a class="btn" href="/blog/">Блог</a>
	</div>
	<p class="nf__call">
		Если ищете конкретный документ или не уверены, какой режим допуска у вашего объекта, — быстрее
		позвонить: <a href="tel:+79690849790">+7 (969) 084-97-90</a>.
	</p>
</section>

<style>
	.nf {
		text-align: center;
	}
	.nf h1 {
		margin-top: 14px;
	}
	.nf__lead {
		color: var(--muted);
		margin-top: 14px;
		max-width: 60ch;
		margin-inline: auto;
	}
	.nf__links {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		justify-content: center;
		margin-top: 30px;
	}
	.nf__call {
		margin-top: 28px;
		font-size: var(--fs-4);
		color: var(--muted);
	}
	.nf__call a {
		color: var(--accent);
		font-family: var(--mono);
		white-space: nowrap;
	}
</style>
