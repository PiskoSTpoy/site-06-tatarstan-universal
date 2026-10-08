<script lang="ts">
	import BlogArticleLayout from '$lib/BlogArticleLayout.svelte';
	import Sources from '$lib/Sources.svelte';
	import { slugify } from '$lib/slug';

	const CHECKED = '08.10.2026';
	const PUBLISHED = '2026-10-08T07:01:00+03:00';
	const SITE = 'https://kran-rt.ru';
	const SLUG = 'nds-22-arenda-krana-s-ekipazhem-2026';

	// Волна 62 (08.10.2026), статья 2 из 3: коммерческая. Ст. 164 НК РФ (zakonrf.info/nk/164/, загружено
	// 08.10.2026, кодировка windows-1251): основная ставка НДС — 20% до конца 2025 года и 22% с 1 января
	// 2026; льготная 10% — для ограниченного перечня социально значимых товаров. Ст. 168 НК (сроки
	// счёта-фактуры) на zakonrf.info не загрузилась — сроки в статье не приводятся. Переходные случаи
	// (аванс в 2025, оказание в 2026) и освобождение от НДС (УСН и др.) в статье не разбираются и не
	// сверены. Цены KRAN-RT не называются: пример — условная сумма для арифметики.
	const sources = [
		{
			label: 'Налоговый кодекс РФ, ст. 164 — ставки НДС (zakonrf.info, сверено 08.10.2026)',
			href: 'https://zakonrf.info/nk/164/',
		},
	];

	const title = 'НДС при аренде крана с экипажем в 2026: 22% в счёте';
	const description =
		'С 1 января 2026 года основная ставка НДС — 22% (ст. 164 НК РФ). Как считать сумму для аренды крана с экипажем и что проверить в счёте.';

	const lead =
		'С 1 января 2026 года основная ставка НДС в России — 22%, до конца 2025 года была 20% (ст. 164 НК РФ). Пониженная 10% в этой статье касается перечня социально значимых товаров, а не крановых работ. Для аренды крана с экипажем удобнее, когда в счёте сумма без НДС, ставка и сумма налога показаны отдельными строками. Пример ниже — условная сумма для арифметики, а не цена KRAN-RT.';

	const headingsText = [
		'Какая ставка применяется с 1 января 2026',
		'Как считают сумму: пример на условной сумме',
		'Когда НДС в счёт не выделяют',
		'Что проверить в договоре и счёте',
		'Чего статья не решает',
	];
	const headings = headingsText.map((text) => ({ text, id: slugify(text) }));

	const matrixCaption = 'Условная сумма аренды крана с экипажем 100 000 руб. без НДС: до и после смены ставки';

	const matrix = [
		{ item: 'Сумма без НДС', before: '100 000 руб.', after: '100 000 руб.' },
		{ item: 'НДС', before: '20 000 руб. (20%)', after: '22 000 руб. (22%)' },
		{ item: 'Итого с НДС', before: '120 000 руб.', after: '122 000 руб.' },
	];

	const faqs = [
		{
			q: 'Сколько НДС с аренды крана с экипажем в 2026 году?',
			a: 'Если поставщик выделяет НДС, основная ставка — 22% от суммы без налога (ст. 164 НК РФ). Льготная 10% в этой статье связана с перечнем социально значимых товаров, а не с крановыми услугами.',
		},
		{
			q: 'Почему в счёте прошлого года стояла ставка 20%?',
			a: 'До конца 2025 года основная ставка НДС составляла 20%, с 1 января 2026 года — 22% (ст. 164 НК РФ). Для работ, оказанных с 2026 года, применяется новая ставка; переходные случаи по датам оплаты и оказания статья не разбирает.',
		},
		{
			q: 'Можно ли платить за кран по ставке 10%?',
			a: 'Нет оснований для такой ставки в этой статье. Ст. 164 НК РФ относит пониженную 10% к ограниченному перечню социально значимых товаров, а услуги крана с экипажем в этот перечень не входят.',
		},
		{
			q: 'Что делать, если в счёте НДС не выделен?',
			a: 'Спросить поставщика, на каком основании НДС не выделен. Основания освобождения в статье не разобраны, их стоит сверить с бухгалтером по актуальной редакции Налогового кодекса.',
		},
	];

	const breadcrumbLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Главная', item: `${SITE}/` },
			{ '@type': 'ListItem', position: 2, name: 'Блог', item: `${SITE}/blog/` },
			{ '@type': 'ListItem', position: 3, name: title, item: `${SITE}/blog/${SLUG}/` },
		],
	};
	const articleLd = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: title,
		description,
		image: `${SITE}/og-cover.png`,
		author: { '@type': 'Organization', name: 'Инженерная служба KRAN-RT', '@id': `${SITE}/#organization` },
		publisher: { '@id': `${SITE}/#organization` },
		mainEntityOfPage: `${SITE}/blog/${SLUG}/`,
		inLanguage: 'ru-RU',
		datePublished: PUBLISHED,
		dateModified: PUBLISHED,
	};
	const faqLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
	};
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="{SITE}/blog/{SLUG}/" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image:alt" content={title} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumbLd)}<\/script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(articleLd)}<\/script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
</svelte:head>

<BlogArticleLayout
	{title}
	subtitle="Инженерная служба KRAN-RT"
	eyebrow="Стоимость и договор"
	crumbLabel="НДС при аренде крана"
	{lead}
	published={PUBLISHED}
	checked={CHECKED}
	{headings}
	currentSlug={SLUG}
	ctaText="Расчёт стоимости аренды с экипажем — назвать объект и тоннаж, пришлём состав работ →"
	ctaHref="/#order"
>
	<h2 id={headings[0].id} style="margin:36px 0 16px">{headings[0].text}</h2>
	<p>Для KRAN-RT ст. 164 НК РФ устанавливает три ставки: основную, пониженную и нулевую. С 1 января 2026 года основная ставка — 22%, а до конца 2025 года — 20%. Пониженная ставка 10% действует для ограниченного перечня социально значимых товаров, и крановые работы в этот перечень не входят.</p>
	<p>Если KRAN-RT выставляет счёт за аренду крана с экипажем как плательщик НДС, основная ставка — 22% от стоимости без налога. Именно поэтому 10% для таких услуг не применяют: ставка выбирается по перечню товаров, а не по желанию сторон.</p>

	<h2 id={headings[1].id} style="margin:36px 0 16px">{headings[1].text}</h2>
	<p>Расчёт простой: для счёта KRAN-RT НДС равен ставке, умноженной на сумму без налога. Для условной суммы 100 000 руб. без НДС налог до 2026 года составлял 20 000 руб., а с 2026 года — 22 000 руб. Разница в 2 000 руб. на каждые 100 000 руб. — то, что меняется в счёте для заказчика; сумма без НДС остаётся прежней.</p>
	<div class="cmp-wrap">
		<table class="cmp">
			<caption>{matrixCaption}</caption>
			<thead>
				<tr>
					<th scope="col">Строка счёта</th>
					<th scope="col">До 2026 года (20%)</th>
					<th scope="col">С 1 января 2026 (22%)</th>
				</tr>
			</thead>
			<tbody>
				{#each matrix as r (r.item)}
					<tr><th scope="row">{r.item}</th><td>{r.before}</td><td>{r.after}</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p>Цифры таблицы не относятся к стоимости аренды KRAN-RT: цены на сайте — рыночный ориентир, а не фиксированный прайс. Что входит в стоимость крана на предприятии и от чего она зависит, разобрано в статье <a href="/blog/stoimost-krana-na-territorii-predpriyatiya/" style="color:var(--accent)">«Стоимость крана на территории предприятия»</a>.</p>

	<h2 id={headings[2].id} style="margin:36px 0 16px">{headings[2].text}</h2>
	<p>Если KRAN-RT освобождён от НДС, в счёте налог не выделяют и ставку не указывают. Основания освобождения определяет Налоговый кодекс, и в этой статье они не разобраны: ст. 164 НК РФ описывает ставки, а не условия освобождения. Поэтому основание стоит запросить письменно, а не полагаться на устный ответ.</p>
	<p>Поэтому в договоре с KRAN-RT стоит прямо записать, выделен ли НДС и по какой ставке. Разница между арендой крана и оказанием услуг с экипажем — отдельный вопрос, его разбирает статья <a href="/blog/arenda-krana-s-ekipazhem-ili-uslugi/" style="color:var(--accent)">«Аренда крана с экипажем или услуги»</a>.</p>

	<h2 id={headings[3].id} style="margin:36px 0 16px">{headings[3].text}</h2>
	<p>Ниже — 4 пункта, которые стоит сверить в счёте KRAN-RT до оплаты. Список — рекомендация, а не требование ст. 164 НК РФ; сами реквизиты счёта и срок его выставления определяет другая статья Кодекса, которую здесь не цитируем.</p>
	<ol>
		<li>Сумма без НДС, ставка (22% для услуг с 2026 года) и сумма налога указаны отдельными строками.</li>
		<li>В договоре назван состав услуги: кран, экипаж, стропальщик, ГСМ, перегон. От состава зависит, что именно облагается налогом.</li>
		<li>Если в счёте написано «без НДС», основание такого решения названо письменно.</li>
		<li>Если дата оплаты и дата оказания приходятся на разные годы, в договоре записано, какая ставка применяется; переходные случаи 2025–2026 годов сверяют с бухгалтером.</li>
	</ol>

	<h2 id={headings[4].id} style="margin:36px 0 16px">{headings[4].text}</h2>
	<p>Для счетов KRAN-RT статья не разбирает переходные случаи, когда аванс получен в 2025 году, а работы оказаны в 2026-м. Ставка в таких случаях зависит от даты оплаты и даты отгрузки, и однозначный ответ нужен на конкретных документах, а не в общем обзоре.</p>
	<p>Для KRAN-RT упрощённая система налогообложения и другие режимы освобождения здесь тоже не разобраны: их условия и пороги в статье не сверены. Что делать с краном после смены и как распределяется ответственность при аренде, описано в статье <a href="/blog/kto-otvechaet-za-bezopasnost-pri-arende-krana-p122/" style="color:var(--accent)">«Кто отвечает за безопасность при аренде крана»</a> — это уже не налоговый вопрос.</p>

	<div class="faq" style="margin-top:44px">
		<h2 style="margin-bottom:18px">Частые вопросы</h2>
		{#each faqs as f (f.q)}
			<details class="faq__item">
				<summary>{f.q}</summary>
				<p>{f.a}</p>
			</details>
		{/each}
	</div>

	<p style="margin-top:32px">Для сравнения условий аренды с экипажем и без него — в статье <a href="/blog/arenda-krana-s-ekipazhem-ili-uslugi/" style="color:var(--accent)">«Аренда крана с экипажем или услуги»</a>; для страхования при аренде с экипажем — в статье <a href="/blog/strahovanie-krana-pri-arende-s-ekipazhem/" style="color:var(--accent)">«Кто страхует кран при аренде с экипажем»</a>.</p>

	<Sources
		heading
		items={sources}
		date={CHECKED}
		note='Разбор ставок по ст. 164 НК РФ, а не консультация по налогам. Счёт, договор и выбор режима налогообложения — задача бухгалтера поставщика и заказчика.'
	/>
</BlogArticleLayout>

<style>
	.cmp-wrap {
		overflow-x: auto;
		margin: 8px 0 20px;
		-webkit-overflow-scrolling: touch;
	}
	.cmp {
		border-collapse: collapse;
		width: 100%;
		min-width: 720px;
		font-size: var(--fs-3);
	}
	.cmp caption {
		text-align: left;
		color: var(--muted);
		font-family: var(--mono);
		font-size: var(--fs-2);
		padding-bottom: 8px;
	}
	.cmp th,
	.cmp td {
		border: 1px solid var(--line-strong);
		padding: 6px 8px;
		text-align: left;
		vertical-align: top;
	}
	.cmp thead th {
		font-family: var(--mono);
		color: var(--accent);
	}
	.cmp tbody th {
		font-weight: 600;
	}
</style>
