<script lang="ts">
	/*
	 * Контакты. Страница собирает в одном месте то, что до неё было размазано по шапке, подвалу
	 * и разметке LocalBusiness, и ничего не добавляет от себя: телефон тот же, что в шапке,
	 * география — те же пять городов, что в разделе /geo/, надзорный орган — тот же, что в
	 * источниках на /dopusk/ и /faq/.
	 *
	 * Реквизиты (наименование, ИНН, ОГРН, юридический адрес, корпоративная почта на своём
	 * домене) — честно пустые строки с пометкой «заполняется при запуске». Это данные
	 * заказчика: сайт стоит на технической заглушке домена, юрлицо не подставлено. Написать
	 * сюда правдоподобный ИНН значило бы дать посетителю проверяемо ложные сведения о
	 * контрагенте — ровно то, ради чего страницу контактов и читают.
	 */
	import Pairs from '$lib/Pairs.svelte';

	const SITE = 'https://kran-rt.ru';
	const PHONE_HREF = 'tel:+79690849790';
	const PHONE_TEXT = '+7 (969) 084-97-90';

	const title = 'Контакты — KRAN-RT, аренда кранов в Татарстане';
	const description =
		'Телефон диспетчера, география работы по Республике Татарстан и порядок приёма заявок. Реквизиты юридического лица заполняются при запуске сайта.';

	const requisites = [
		{ k: 'Наименование', v: '— заполняется при запуске: юридическое лицо, от имени которого работает сайт' },
		{ k: 'ИНН / ОГРН', v: '— заполняется при запуске по данным ЕГРЮЛ' },
		{ k: 'Юридический адрес', v: '— заполняется при запуске' },
		{ k: 'Почта на собственном домене', v: '— заполняется вместе с боевым доменом: сейчас сайт стоит на технической заглушке адреса' },
	];

	const cities = [
		{ href: '/geo/kazan/', name: 'Казань', note: 'стройка в городе, объекты «Казаньоргсинтеза»' },
		{ href: '/geo/nizhnekamsk/', name: 'Нижнекамск', note: 'нефтехимия, газоопасная зона' },
		{ href: '/geo/naberezhnye-chelny/', name: 'Набережные Челны', note: 'автопром и промплощадки' },
		{ href: '/geo/almetevsk/', name: 'Альметьевск', note: 'нефтепромысел, завод «Алнас»' },
		{ href: '/geo/zainsk/', name: 'Заинск', note: 'энергетика, Заинская ГРЭС' },
	];

	const breadcrumbLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Главная', item: `${SITE}/` },
			{ '@type': 'ListItem', position: 2, name: 'Контакты', item: `${SITE}/kontakty/` },
		],
	};
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="{SITE}/kontakty/" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumbLd)}<\/script>`}
</svelte:head>

<main>
	<nav class="crumbs wrap" aria-label="Хлебные крошки">
		<a href="/">Главная</a><span>/</span><span>Контакты</span>
	</nav>

	<section class="section wrap" style="padding-top:8px">
		<div class="section-head">
			<span class="eyebrow">Связь · Республика Татарстан</span>
			<h1>Контакты</h1>
			<!-- Лид — прямой извлекаемый ответ с числом (§5.4 п.1): сам номер и режим приёма
			     заявок стоят в первых двух предложениях, а не за прокруткой. Ниже те же данные
			     продублированы карточкой — так их видит человек, здесь их забирает LLM. -->
			<p>
				Диспетчер по Республике Татарстан: <a class="kt__lead-tel" href={PHONE_HREF}>{PHONE_TEXT}</a> — заявки принимаем
				круглосуточно, перезваниваем в течение рабочего дня.</p>
			<p>Обязательное поле в форме одно, телефон;
				география разобрана по пяти городам республики, а режим допуска на объекте выясняется до расчёта, а не
				по факту приезда крана.
			</p>
			<p>
				Быстрее всего — позвонить: по телефону сразу видно, какой у объекта режим допуска и что нужно
				оформить. Заявку с сайта тоже принимаем, ответ по ней приходит звонком.
			</p>
		</div>

		<div class="kt">
			<div class="kt__card">
				<p class="kt__label">Телефон диспетчера</p>
				<a class="kt__phone" href={PHONE_HREF}>{PHONE_TEXT}</a>
				<p class="kt__note">
					Заявки принимаем круглосуточно. Перезваниваем в течение рабочего дня — тем же порядком, что
					описан у формы на главной.
				</p>
			</div>
			<div class="kt__card">
				<p class="kt__label">Заявка с сайта</p>
				<a class="btn" href="/#order">Оставить заявку →</a>
				<p class="kt__note">
					Обязательное поле одно — телефон. Что происходит с данными формы, описано в
					<a href="/politika-obrabotki-personalnyh-dannyh/">политике обработки персональных данных</a>.
				</p>
			</div>
		</div>
	</section>

	<section class="section wrap" style="padding-top:0;max-width:900px">
		<h2 class="kt__h">Где работаем</h2>
		<p class="kt__sub">
			Республика Татарстан. Пять городов разобраны отдельными страницами — там же указан режим
			допуска, который на этих объектах встречается чаще всего.
		</p>
		<ul class="kt__cities">
			{#each cities as c (c.href)}
				<li>
					<a href={c.href}><b>{c.name}</b><span>{c.note}</span></a>
				</li>
			{/each}
		</ul>

		<h2 class="kt__h" style="margin-top:44px">Реквизиты</h2>
		<p class="kt__sub">
			Пока сайт не опубликован на боевом домене, реквизиты не заполнены. Пустая строка здесь честнее
			правдоподобного числа: по этим данным заказчик проверяет контрагента перед договором.
		</p>
		<Pairs items={requisites} keyHead="Реквизит" valueHead="Значение" label="Реквизиты юридического лица" />

		<h2 class="kt__h" style="margin-top:44px">Надзорный орган</h2>
		<p class="kt__sub">
			Подъёмные сооружения и газоопасные работы на территории республики поднадзорны
			<a href="http://www.privol.gosnadzor.ru/" target="_blank" rel="noopener"
				>Приволжскому управлению Ростехнадзора<span class="sr-only"> (откроется в новой вкладке)</span
				></a
			>. Туда же уходит жалоба, если подрядчик работает без оформленного наряда-допуска — как это
			устроено, разобрано в статье про
			<a href="/blog/koap-otvetstvennost-naryad-dopusk/">ответственность по КоАП</a>.
		</p>
	</section>
</main>

<style>
	.kt {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
		gap: 16px;
		max-width: 900px;
	}
	.kt__card {
		border: 1px solid var(--line-strong);
		background: var(--surface);
		padding: clamp(18px, 3vw, 26px);
	}
	.kt__label {
		font-family: var(--mono);
		font-size: var(--fs-2);
		letter-spacing: 0.09em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 12px;
	}
	.kt__phone {
		display: inline-block;
		font-family: var(--mono);
		font-size: clamp(1.15rem, 3.4vw, 1.5rem);
		letter-spacing: 0.02em;
		text-decoration: none;
		min-height: 44px;
	}
	.kt__note {
		margin-top: 14px;
		font-size: var(--fs-3);
		line-height: 1.6;
		color: var(--muted);
	}
	.kt__note a {
		color: var(--accent);
	}
	/* Номер стоит внутри лида, набранного цветом --muted: без собственного цвета он
	   читался бы как обычный текст с подчёркиванием. Подчёркивание при этом остаётся —
	   цвет не должен быть единственным признаком ссылки (WCAG 1.4.1). */
	.kt__lead-tel {
		color: var(--accent);
		font-family: var(--mono);
		white-space: nowrap;
	}
	.kt__h {
		font-size: var(--fs-7);
		margin-bottom: 10px;
	}
	.kt__sub {
		color: var(--muted);
		font-size: var(--fs-4);
		max-width: 68ch;
		margin-bottom: 18px;
	}
	.kt__sub a {
		color: var(--accent);
	}
	.kt__cities {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--line-strong);
	}
	.kt__cities li {
		border-bottom: 1px solid var(--line);
	}
	.kt__cities li:last-child {
		border-bottom: 1px solid var(--line-strong);
	}
	.kt__cities a {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 4px 14px;
		min-height: 48px;
		padding: 12px 0;
		text-decoration: none;
	}
	.kt__cities b {
		font-family: var(--mono);
		font-size: var(--fs-4);
		letter-spacing: 0.02em;
	}
	.kt__cities span {
		font-size: var(--fs-3);
		color: var(--muted);
	}
	/* Терминальный маркер «>» перед активным пунктом — тот же язык hover, что у списков
	   на главной, вместо сетевой тени. */
	.kt__cities a:hover b::before,
	.kt__cities a:focus-visible b::before {
		content: '> ';
		color: var(--accent);
	}
	.kt__cities a:hover b {
		color: var(--accent);
	}
</style>
