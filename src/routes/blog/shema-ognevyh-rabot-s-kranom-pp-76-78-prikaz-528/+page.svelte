<script lang="ts">
	import BlogArticleLayout from '$lib/BlogArticleLayout.svelte';
	import Sources from '$lib/Sources.svelte';
	import { slugify } from '$lib/slug';

	const CHECKED = '12.10.2026';
	const PUBLISHED = '2026-10-12T07:02:00+03:00';
	const SITE = 'https://kran-rt.ru';
	const SLUG = 'shema-ognevyh-rabot-s-kranom-pp-76-78-prikaz-528';

	// Волна 64 (12.10.2026), статья 3 из 3: промышленная. Приказ №528 (legalacts.ru, curl 12.10.2026):
	// п. 71 — наряд на огневые работы выдаётся на каждое место и характер работ каждой бригаде, действителен
	// одну смену; п. 76 — к наряду прилагается схема места, подписанная руководителем подразделения (или
	// замещающим); п. 77 — на общих коммуникациях и границах смежных объектов наряд согласуется с руководителями
	// подразделений, копия схемы передаётся смежным; п. 78 — на схеме: место работ и границы опасной зоны, места
	// отбора проб воздуха, запорная арматура и заглушки, места размещения сварочного и другого оборудования,
	// предупредительные знаки, месторасположение автомобильной техники и вспомогательного оборудования,
	// обеспечивающих проведение работ, первичные средства пожаротушения, пути эвакуации; привязка к объектам.
	// Что «автомобильная техника» включает автокран — вывод KRAN-RT; нормы называют технику общим словом.
	const sources = [
		{
			label: 'Приказ Ростехнадзора №528 — полный текст на legalacts.ru: пп. 71, 76–78',
			href: 'https://legalacts.ru/doc/prikaz-rostekhnadzora-ot-15122020-n-528-ob-utverzhdenii-federalnykh/',
		},
	];

	const title = 'Схема огневых работ с краном: что указать по п. 78 №528';
	const description =
		'П. 78 приказа №528: на схеме огневых работ указывают опасную зону, пробы воздуха, заглушки, знаки, технику, пожарные средства и пути эвакуации.';

	const lead =
		'Пункт 78 приказа Ростехнадзора №528 называет восемь элементов схемы места огневых работ: место и границы опасной зоны, места отбора проб воздуха, запорную арматуру и заглушки, оборудование для работ, знаки, автомобильную технику, первичные средства пожаротушения и пути эвакуации. Для KRAN-RT это значит: кран попадает на схему как отдельный элемент, и его стоянку согласуют заранее.';

	const headingsText = [
		'Кто подписывает схему и когда она нужна',
		'Что должно быть на схеме по п. 78',
		'Где на схеме стоит кран',
		'Когда схему передают смежным подразделениям',
		'Что подготовить заказчику до наряда',
	];
	const headings = headingsText.map((text) => ({ text, id: slugify(text) }));

	const matrixCaption = 'Элементы схемы огневых работ по п. 78 приказа №528 и что они значат для крана';

	const matrix = [
		{ item: 'Место работ и границы опасной зоны', crane: 'Стоянка и вылет стрелы вне зоны', basis: 'п. 78' },
		{ item: 'Места отбора проб воздуха', crane: 'Кран не перекрывает доступ', basis: 'п. 78' },
		{ item: 'Запорная арматура и заглушки', crane: 'Стрела не мешает доступу', basis: 'п. 78' },
		{ item: 'Сварочное и другое оборудование', crane: 'Груз к оборудованию подают по схеме', basis: 'п. 78' },
		{ item: 'Предупредительные знаки', crane: 'Знаки не закрыты краном', basis: 'п. 78' },
		{ item: 'Автомобильная техника', crane: 'Автокран нанесён отдельно', basis: 'п. 78' },
		{ item: 'Первичные средства пожаротушения', crane: 'Подъезд к ним свободен', basis: 'п. 78' },
		{ item: 'Пути эвакуации', crane: 'Кран их не перекрывает', basis: 'п. 78' },
	];

	const faqs = [
		{
			q: 'Нужна ли отдельная схема огневых работ, если кран только подаёт груз?',
			a: 'Схема нужна на любые огневые работы: п. 76 приказа №528 требует приложить её к наряду-допуску. Если рядом работает автокран KRAN-RT, п. 78 называет автомобильную технику и вспомогательное оборудование в числе обязательных элементов схемы.',
		},
		{
			q: 'Кто подписывает схему места огневых работ?',
			a: 'Руководитель структурного подразделения или лицо, его замещающее (п. 76 приказа №528). Подписывает не подрядчик KRAN-RT и не руководитель работ, а руководитель подразделения предприятия, на объекте которого вынесены огневые работы.',
		},
		{
			q: 'Нужно ли показывать на схеме, где стоит кран?',
			a: 'Да. Пункт 78 приказа №528 требует указать месторасположение автомобильной техники и вспомогательного оборудования, обеспечивающих проведение работ. Автокран KRAN-RT подпадает под это описание по выводу KRAN-RT: норма называет технику общим словом, а не по типам.',
		},
		{
			q: 'Что делать, если место огневых работ у границы с соседним цехом?',
			a: 'Наряд согласуют с руководителями смежных подразделений, а копию схемы передают им (п. 77 приказа №528). Правило относится к общим коммуникациям, границам смежных технологических объектов и местам пересечения коммуникаций; KRAN-RT собственных согласований не оформляет.',
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
	eyebrow="Газоопасные и огневые работы"
	crumbLabel="Схема огневых работ с краном"
	{lead}
	published={PUBLISHED}
	checked={CHECKED}
	{headings}
	currentSlug={SLUG}
	ctaText="Нужна стоянка крана на схеме — назвать объект и место работ →"
	ctaHref="/#order"
>
	<h2 id={headings[0].id} style="margin:36px 0 16px">{headings[0].text}</h2>
	<p>Схема места огневых работ входит в комплект наряда-допуска и подписывается руководителем структурного подразделения или лицом, его замещающим, по п. 76 приказа №528. Наряд при этом по п. 71 выдают на каждое место и характер работ каждой бригаде, и он действует одну смену. Новая смена и новое место — новая схема, а не старая с поправкой.</p>
	<p>Для KRAN-RT это определяет порядок подачи техники: заказчик получает схему до выезда крана, а не после. Подписывает её представитель предприятия, а не экипаж KRAN-RT, поэтому стоянку крана согласуют заранее, как описано в статье <a href="/blog/naryad-dopusk-na-ognevye-raboty-pri-rabote-krana/" style="color:var(--accent)">«Наряд-допуск на огневые работы при работе крана»</a>.</p>

	<h2 id={headings[1].id} style="margin:36px 0 16px">{headings[1].text}</h2>
	<p>Состав схемы приказ №528 задаёт одним перечнем в п. 78, и сокращать его нельзя. Место проведения огневых работ на схеме указывают с привязкой к существующим объектам. Ниже перечень разложен по тому, что каждый элемент значит для автокрана KRAN-RT; правая колонка — вывод KRAN-RT, а не текст нормы.</p>
	<div class="cmp-wrap">
		<table class="cmp">
			<caption>{matrixCaption}</caption>
			<thead>
				<tr>
					<th scope="col">Элемент схемы</th>
					<th scope="col">Что значит для крана</th>
					<th scope="col">Пункт</th>
				</tr>
			</thead>
			<tbody>
				{#each matrix as r (r.item)}
					<tr><th scope="row">{r.item}</th><td>{r.crane}</td><td>{r.basis}</td></tr>
				{/each}
			</tbody>
		</table>
	</div>

	<h2 id={headings[2].id} style="margin:36px 0 16px">{headings[2].text}</h2>
	<p>Кран в п. 78 прямо не назван: норма говорит о месторасположении автомобильной техники и вспомогательного оборудования, обеспечивающих проведение работ. Автокран Клинцы КС-35719-7-02 или Ивановец КС-6476 от KRAN-RT к такому описанию относится по выводу KRAN-RT, и стоянку наносят на схему отдельным знаком с привязкой к существующим объектам.</p>
	<p>Опасную зону огневых работ и опасную зону работы стрелового крана KRAN-RT считает отдельно: у крана она задана вылетом стрелы и грузом, у огневых работ — границей, которую показывает схема. Расчёт зоны крана разобран в статье <a href="/blog/opasnaya-zona-raboty-krana/" style="color:var(--accent)">«Опасная зона работы крана»</a>; площадку под опоры — в статье <a href="/blog/ploshchadka-pod-vynosnye-opory-avtokrana/" style="color:var(--accent)">«Площадка под выносные опоры автокрана»</a>.</p>

	<h2 id={headings[3].id} style="margin:36px 0 16px">{headings[3].text}</h2>
	<p>Согласование со смежными подразделениями по п. 77 приказа №528 нужно, когда огневые работы идут на общих коммуникациях, на границах смежных технологических объектов, в местах пересечения коммуникаций и линейных объектов. Тогда наряд согласуют с руководителями этих подразделений, а копию схемы передают им.</p>
	<p>Для заказчика KRAN-RT условие простое: если кран работает на такой границе, смежное подразделение должно знать, где стоит стрела и где проходит её вылет. Как та же логика работает для газоопасных работ, описано в статье <a href="/blog/skhema-mesta-i-soglasovanie-granitsa-podrazdeleniy/" style="color:var(--accent)">«Схема и согласование на границе подразделений»</a>.</p>

	<h2 id={headings[4].id} style="margin:36px 0 16px">{headings[4].text}</h2>
	<p>Подготовка стоянки крана к огневым работам в KRAN-RT идёт в четыре шага, исходя из пп. 71 и 76–78 приказа №528.</p>
	<ol>
		<li>Сообщить KRAN-RT место огневых работ, смену и подъездные пути до выезда крана на площадку.</li>
		<li>Передать KRAN-RT границы опасной зоны огневых работ, чтобы стоянку крана выбрать вне их.</li>
		<li>Убедиться, что стоянка крана нанесена на схему с привязкой к существующим объектам и подписана руководителем подразделения.</li>
		<li>Сверить схему на площадке с положением крана: знаки, места отбора проб и пути эвакуации им не закрыты.</li>
	</ol>
	<p>Срок действия наряда и его продление KRAN-RT разбирает в статье <a href="/blog/srok-deystviya-naryada-dopuska-gazoopasnye-raboty/" style="color:var(--accent)">«Срок действия наряда-допуска»</a>. Порядок работы с краном на огневых работах в тёмное время и выходные определяет отдельный п. 68 приказа №528, который здесь не пересказывается.</p>

	<div class="faq" style="margin-top:44px">
		<h2 style="margin-bottom:18px">Частые вопросы</h2>
		{#each faqs as f (f.q)}
			<details class="faq__item">
				<summary>{f.q}</summary>
				<p>{f.a}</p>
			</details>
		{/each}
	</div>

	<Sources
		heading
		items={sources}
		date={CHECKED}
		note='Разбор пунктов приказа Ростехнадзора №528, а не замена наряда-допуска предприятия. Состав схемы и согласования определяет эксплуатирующая организация по своим документам с учётом требований приказа.'
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
		min-width: 640px;
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
