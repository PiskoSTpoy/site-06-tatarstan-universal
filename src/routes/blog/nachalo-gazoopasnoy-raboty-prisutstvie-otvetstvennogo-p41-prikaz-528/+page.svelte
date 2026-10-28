<script lang="ts">
	import BlogArticleLayout from '$lib/BlogArticleLayout.svelte';
	import Sources from '$lib/Sources.svelte';
	import { slugify } from '$lib/slug';

	const CHECKED = '28.10.2026';
	const PUBLISHED = '2026-10-28T14:12:00+03:00';
	const SITE = 'https://kran-rt.ru';
	const SLUG = 'nachalo-gazoopasnoy-raboty-prisutstvie-otvetstvennogo-p41-prikaz-528';

	// Волна 76 (28.10.2026), статья 3 из 3: промышленная. П. 41 приказа Ростехнадзора №528 (legalacts.ru, curl 28.10.2026):
	// работа начинается в присутствии лица, ответственного за проведение работ; постоянное присутствие этого лица и
	// представителя ПАСС(Ф) на месте работ и периодичность их контроля определяются нарядом-допуском с учётом характера
	// работы. П. 40: вход в газоопасное место — только с разрешения ответственного и в СИЗ, надетых за пределами опасной зоны.
	// П. 36: меры, исключающие допуск лиц, не занятых работой. Числовой периодичности в п. 41 нет — не подставлялась.
	// Правила для экипажа крана и список вопросов перед выездом — выводы KRAN-RT.
	const sources = [
		{
			label: 'Приказ Ростехнадзора от 15.12.2020 №528 «Об утверждении ФНП «Правила безопасного ведения газоопасных, огневых и ремонтных работ» — пп. 36, 40, 41 (legalacts.ru)',
			href: 'https://legalacts.ru/doc/prikaz-rostekhnadzora-ot-15122020-n-528-ob-utverzhdenii-federalnykh/'
		}
	];

	const title = 'Кто присутствует при начале газоопасной работы: п. 41';
	const description =
		'П. 41 приказа №528: газоопасная работа начинается при ответственном; постоянное присутствие и периодичность контроля задаёт наряд-допуск. Разбор KRAN-RT.';

	const lead =
		'П. 41 приказа Ростехнадзора №528 не разрешает начинать газоопасную работу без лица, ответственного за её проведение, а постоянное присутствие этого лица и представителя ПАСС(Ф) на месте и периодичность их контроля отдаёт наряду-допуску. KRAN-RT подаёт кран с экипажем на такие площадки, и эта статья объясняет, чего экипажу ждать от наряда на старте.';

	const headingsText = [
		'Что п. 41 приказа №528 требует в момент начала газоопасной работы',
		'Чем постоянное присутствие отличается от периодического контроля',
		'Где фиксируется присутствие ответственного и ПАСС(Ф)',
		'Как п. 41 связан с входом в газоопасное место и допуском посторонних',
		'Что экипажу крана и заказчику выяснить до выезда на газоопасную площадку'
	];
	const headings = headingsText.map((text) => ({ text, id: slugify(text) }));

	const matrixCaption = 'Что п. 41 приказа №528 оставляет на усмотрение наряда-допуска, а что требует прямо';

	const matrix = [
		{
			k: 'Начало работы',
			v: 'Только в присутствии лица, ответственного за проведение работ',
			p: 'Требует п. 41 прямо'
		},
		{
			k: 'Постоянное присутствие ответственного и представителя ПАСС(Ф)',
			v: 'Определяется нарядом-допуском с учётом характера работы',
			p: 'Решает наряд'
		},
		{
			k: 'Периодичность контроля со стороны этих лиц',
			v: 'Определяется нарядом-допуском с учётом характера работы',
			p: 'Решает наряд'
		}
	];

	const faqs = [
		{
			q: 'Можно ли начать газоопасную работу, если ответственного нет на месте?',
			a: 'Нет: п. 41 приказа №528 требует начинать работу в присутствии лица, ответственного за её проведение. KRAN-RT поэтому не даёт экипажу команду на первый подъём, пока ответственный не подтвердил начало.'
		},
		{
			q: 'Должен ли ответственный находиться на площадке всё время?',
			a: 'Пункт 41 этого сам не решает: постоянное присутствие и периодичность контроля определяются нарядом-допуском с учётом характера работы. Для конкретной площадки ответ нужно искать в тексте наряда, а не в общей норме.'
		},
		{
			q: 'Что такое ПАСС(Ф) в приказе №528?',
			a: 'Это собственная профессиональная аварийно-спасательная служба или формирование эксплуатирующей организации, аттестованные на ведение газоспасательных работ. Расшифровка дана в тексте приказа; KRAN-RT пересказывает её без дополнений.'
		},
		{
			q: 'Через сколько минут ответственный должен проверять работу?',
			a: 'В п. 41 приказа №528 числа нет: периодичность задаёт наряд-допуск. KRAN-RT не называет минуты и часы из памяти, чтобы не подменять документ предприятия.'
		},
		{
			q: 'Кто из экипажа крана отвечает за проверку присутствия ответственного?',
			a: 'Приказ этого не определяет. KRAN-RT предлагает записать в наряде или в заявке, кто из экипажа получает подтверждение начала работы от ответственного, и считать это условием первого подъёма.'
		}
	];

	const breadcrumbLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Главная', item: `${SITE}/` },
			{ '@type': 'ListItem', position: 2, name: 'Блог', item: `${SITE}/blog/` },
			{ '@type': 'ListItem', position: 3, name: title, item: `${SITE}/blog/${SLUG}/` }
		]
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
		dateModified: PUBLISHED
	};
	const faqLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
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
	eyebrow="Газоопасные работы"
	crumbLabel="Присутствие ответственного"
	{lead}
	published={PUBLISHED}
	checked={CHECKED}
	{headings}
	currentSlug={SLUG}
	ctaText="Нужен кран с экипажем на газоопасную площадку — отправить заявку →"
	ctaHref="/#order"
>
	<h2 id={headings[0].id} style="margin:36px 0 16px">{headings[0].text}</h2>
	<p>Первое предложение п. 41 приказа №528 звучит жёстко: работа должна начинаться в присутствии лица, ответственного за проведение работ. KRAN-RT понимает это как условие старта, которое нельзя заменить телефонным звонком или записью в наряде, сделанной накануне.</p>
	<p>Остальные два вопроса пункта — постоянное присутствие и периодичность контроля — пункт сам не закрывает, а передаёт наряду-допуску. Таблица показывает, что в пункте жёстко, а что оставлено документу площадки.</p>
	<div class="cmp-wrap">
		<table class="cmp">
			<caption>{matrixCaption}</caption>
			<thead>
				<tr>
					<th scope="col">Предмет</th>
					<th scope="col">Что сказано в п. 41</th>
					<th scope="col">Кто решает</th>
				</tr>
			</thead>
			<tbody>
				{#each matrix as r (r.k)}
					<tr><th scope="row">{r.k}</th><td>{r.v}</td><td>{r.p}</td></tr>
				{/each}
			</tbody>
		</table>
	</div>

	<h2 id={headings[1].id} style="margin:36px 0 16px">{headings[1].text}</h2>
	<p>Постоянное присутствие значит, что ответственный (и представитель ПАСС(Ф), если наряд его называет) находится на месте всю работу; периодический контроль значит, что он приходит с интервалом. KRAN-RT так объясняет различие, а выбор между вариантами п. 41 оставляет наряду с оговоркой «с учётом характера выполняемой работы».</p>
	<p>Числа интервала в пункте нет, и KRAN-RT его не придумывает. Для экипажа крана важно иное: наряд должен ясно говорить, как часто ответственный подходит к месту подъёма, иначе вопрос «можно ли продолжать без него» остаётся без ответа. О сроке самого наряда читайте в статье <a href="/blog/srok-deystviya-naryada-dopuska-gazoopasnye-raboty/" style="color:var(--accent)">«Срок действия наряда-допуска»</a>.</p>

	<h2 id={headings[2].id} style="margin:36px 0 16px">{headings[2].text}</h2>
	<p>По тексту п. 41 присутствие и периодичность определяются нарядом-допуском на проведение газоопасных работ, значит, ответ лежит в самом наряде, а не в инструкции предприятия или в устной договорённости. KRAN-RT просит заказчика прислать копию наряда или его проект до подтверждения выезда.</p>
	<p>Кто назначает ответственного и кто за подготовку работ отвечает, показано в статье <a href="/blog/otvetstvennye-za-podgotovku-i-provedenie-gazoopasnoy-raboty/" style="color:var(--accent)">«Ответственные за подготовку и проведение газоопасной работы»</a>. Правила хранения экземпляров — в <a href="/blog/oformlenie-naryada-dopuska-ekzemplyary-hranenie/" style="color:var(--accent)">материале об оформлении наряда</a>.</p>

	<h2 id={headings[3].id} style="margin:36px 0 16px">{headings[3].text}</h2>
	<p>Соседний п. 40 приказа №528 разрешает входить в газоопасное место только с разрешения лица, ответственного за проведение работ, и в средствах индивидуальной защиты, надетых за пределами опасной зоны. Вместе с п. 41 это даёт цепочку: разрешение на вход, присутствие при старте, контроль по наряду.</p>
	<p>П. 36 добавляет цель: меры, исключающие допуск на место работы лиц, не занятых её выполнением. Экипаж KRAN-RT входит в число исполнителей только после указания в наряде, как показано в статье <a href="/blog/sostav-brigady-i-opros-ispolnitelej-gazoopasnye-pp-37-39-prikaz-528/" style="color:var(--accent)">про состав бригады по пп. 37–39</a>.</p>

	<h2 id={headings[4].id} style="margin:36px 0 16px">{headings[4].text}</h2>
	<p>До выезда KRAN-RT заказчику стоит выяснить три вещи: кто в наряде назван ответственным за проведение работ, указано ли постоянное присутствие или периодичность контроля и участвует ли ПАСС(Ф). Если хотя бы на один вопрос нет ответа, KRAN-RT не начинает подъём и фиксирует причину в заявке.</p>
	<p>Предложение остановиться до появления ответственного — правило KRAN-RT, а не норма приказа, и оно помогает избежать простоя из-за спора на площадке. Как оплачивается ожидание, объясняет статья <a href="/blog/prostoy-krana-po-vine-zakazchika/" style="color:var(--accent)">«Простой крана по вине заказчика»</a>, а порядок допуска техники — страница <a href="/dopusk/" style="color:var(--accent)">«Допуск»</a>.</p>

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
		note="Разбор пп. 36, 40, 41 приказа Ростехнадзора №528 силами KRAN-RT по тексту на legalacts.ru (нумерация действующей редакции). Числовой периодичности контроля и состава ПАСС(Ф) на конкретной площадке в пункте нет — в разборе они не приводятся. Объяснение различия постоянного присутствия и периодического контроля, правило не начинать подъём без ответственного и перечень вопросов до выезда — выводы KRAN-RT. Не заменяет наряд-допуск и инструкции предприятия."
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
		min-width: 420px;
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
