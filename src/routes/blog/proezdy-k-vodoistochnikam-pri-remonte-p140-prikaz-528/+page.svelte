<script lang="ts">
	import BlogArticleLayout from '$lib/BlogArticleLayout.svelte';
	import Sources from '$lib/Sources.svelte';
	import { slugify } from '$lib/slug';

	const CHECKED = '29.10.2026';
	const PUBLISHED = '2026-10-29T09:50:00+03:00';
	const SITE = 'https://kran-rt.ru';
	const SLUG = 'proezdy-k-vodoistochnikam-pri-remonte-p140-prikaz-528';

	// Волна 77 (29.10.2026), статья 3 из 3: промышленная. П. 140 приказа Ростехнадзора №528 (legalacts.ru, curl 29.10.2026):
	// при выполнении ремонтных работ не следует допускать загромождения дорог, проездов и подъездов к источникам наружного
	// противопожарного водоснабжения, а также к территории ремонтируемого объекта оборудованием, материалами, металлоломом.
	// П. 139 (изменение обстановки в ремонтной зоне) — уже разобран отдельной статьёй. Расстояний, ширины проезда и числа
	// гидрантов в пункте нет — не подставлялись. Правила для стоянки крана и опор — выводы KRAN-RT.
	const sources = [
		{
			label: 'Приказ Ростехнадзора от 15.12.2020 №528 «Об утверждении ФНП «Правила безопасного ведения газоопасных, огневых и ремонтных работ» — пп. 139, 140 (legalacts.ru)',
			href: 'https://legalacts.ru/doc/prikaz-rostekhnadzora-ot-15122020-n-528-ob-utverzhdenii-federalnykh/'
		}
	];

	const title = 'Где ставить кран при ремонте, не закрывая проезд: п. 140';
	const description =
		'П. 140 приказа №528: при ремонте не загромождать дороги, проезды и подъезды к пожарным водоисточникам и объекту. Что это значит для крана.';

	const lead =
		'П. 140 приказа Ростехнадзора №528 не допускает загромождения дорог, проездов и подъездов к источникам наружного противопожарного водоснабжения и к территории ремонтируемого объекта оборудованием, материалами и металлоломом. KRAN-RT ставит кран на остановочных ремонтах нефтехимии, и эта статья объясняет, как пункт ограничивает выбор стоянки и опор.';

	const headingsText = [
		'Что запрещает п. 140 приказа №528 при ремонтных работах',
		'Относится ли кран с опорами к оборудованию по п. 140',
		'Чем п. 140 отличается от п. 139 при изменении обстановки',
		'Что согласовать с заказчиком перед постановкой крана на ремонтную площадку'
	];
	const headings = headingsText.map((text) => ({ text, id: slugify(text) }));

	const matrixCaption = 'Что п. 140 приказа №528 называет прямо, а что остаётся на усмотрение площадки';

	const matrix = [
		{
			k: 'Дороги, проезды и подъезды к источникам наружного противопожарного водоснабжения',
			v: 'Не следует допускать загромождения оборудованием, материалами, металлоломом',
			p: 'Требует п. 140 прямо'
		},
		{
			k: 'Подъезды к территории ремонтируемого объекта',
			v: 'Не следует допускать загромождения оборудованием, материалами, металлоломом',
			p: 'Требует п. 140 прямо'
		},
		{
			k: 'Ширина проезда, расстояние до гидранта, число проездов',
			v: 'В пункте не указаны',
			p: 'Решает проект ремонта и правила предприятия'
		}
	];

	const faqs = [
		{
			q: 'Можно ли ставить кран на проезд к пожарному гидранту во время ремонта?',
			a: 'Нет, если стоянка и опоры загромождают проезд или подъезд к источнику наружного противопожарного водоснабжения: п. 140 приказа №528 этого не допускает. KRAN-RT поэтому запрашивает у заказчика схему проездов до выбора стоянки.'
		},
		{
			q: 'Входит ли кран в понятие «оборудование» из п. 140?',
			a: 'Пункт перечисляет оборудование, материалы и металлолом, не называя кран отдельно. KRAN-RT трактует это так, что любая техника, стоящая на проезде, загромождает его, и размещает кран вне проезда.'
		},
		{
			q: 'Какая минимальная ширина проезда нужна по п. 140?',
			a: 'В п. 140 приказа №528 нет ширины проезда и расстояния до гидранта. Эти значения задают проект ремонта, правила предприятия и документы пожарной безопасности; KRAN-RT цифры по памяти не называет.'
		},
		{
			q: 'К какому виду ремонта применим п. 140?',
			a: 'Пункт говорит о выполнении ремонтных работ вообще, без деления на плановые, внеплановые и аварийно-восстановительные. KRAN-RT применяет его ко всем видам, которые разобраны в отдельной статье о видах ремонта.'
		},
		{
			q: 'Кто отвечает за проезды на площадке ремонта?',
			a: 'Пункт не называет ответственного поимённо. KRAN-RT просит записать в заявке или наряде, кто на площадке согласовывает размещение техники и материалов, и считает это условием постановки крана.'
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
	eyebrow="Ремонтные работы"
	crumbLabel="Проезды при ремонте"
	{lead}
	published={PUBLISHED}
	checked={CHECKED}
	{headings}
	currentSlug={SLUG}
	ctaText="Нужен кран на остановочный ремонт — отправить заявку →"
	ctaHref="/#order"
>
	<h2 id={headings[0].id} style="margin:36px 0 16px">{headings[0].text}</h2>
	<p>П. 140 приказа №528 формулирует запрет через слова «не следует допускать»: при выполнении ремонтных работ нельзя загромождать дороги, проезды и подъезды к источникам наружного противопожарного водоснабжения, а также к территории ремонтируемого объекта оборудованием, материалами, металлоломом. KRAN-RT читает это как требование к расположению всей техники и складов на ремонтной площадке.</p>
	<p>В таблице KRAN-RT отделено то, что пункт требует прямо, от того, что он оставляет проекту ремонта и правилам предприятия.</p>
	<div class="cmp-wrap">
		<table class="cmp">
			<caption>{matrixCaption}</caption>
			<thead>
				<tr>
					<th scope="col">Предмет</th>
					<th scope="col">Что сказано в норме</th>
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
	<p>Кран в п. 140 приказа №528 не назван, но KRAN-RT понимает слово «оборудование» широко. Автокран, выносные опоры и подкладки под ними, стоящие на проезде или на подъезде к гидранту, перекрывают путь так же, как складированные материалы. Это толкование KRAN-RT, а не буква пункта.</p>
	<p>Поэтому KRAN-RT выбирает стоянку так, чтобы колёса, опоры и зона вылета стрелы не перекрывали отмеченные проезды. Подготовку площадки под опоры описывает статья <a href="/blog/ppr-na-rabotu-krana-fnp-461/" style="color:var(--accent)">о ППР на работу крана</a>, а особенности остановочного ремонта — <a href="/blog/kran-na-ostanovochnyy-remont/" style="color:var(--accent)">«Кран на остановочный ремонт»</a>.</p>

	<h2 id={headings[2].id} style="margin:36px 0 16px">{headings[2].text}</h2>
	<p>П. 139 приказа №528 велит исполнителям немедленно прекратить работу при парении или утечке и выйти в безопасное место, а п. 140 действует до такой ситуации и заранее держит проезды открытыми. Вместе пункты дают последовательность: свободный проезд до происшествия, остановка и выход при нём.</p>
	<p>Реакцию на изменение обстановки KRAN-RT разобрал в статье <a href="/blog/izmenenie-obstanovki-remontnaya-zona-p139/" style="color:var(--accent)">«Парение и утечка в ремонтной зоне»</a>. Для экипажа крана практический вывод один: путь отхода и путь подъезда пожарной техники не должны пересекаться со стоянкой крана.</p>

	<h2 id={headings[3].id} style="margin:36px 0 16px">{headings[3].text}</h2>
	<p>Перед постановкой крана на ремонтную площадку KRAN-RT просит заказчика ответить на три вопроса: где на плане проезды и подъезды к пожарным водоисточникам, где разрешена стоянка техники, кто согласовывает размещение материалов рядом с краном. Если плана нет, KRAN-RT фиксирует это в заявке и не занимает спорные места.</p>
	<p>Перечень из трёх вопросов — вывод KRAN-RT, а не текст пункта. Он дополняет сведения об остановочном ремонте из статьи <a href="/blog/ostanovochnyy-remont-plan-podgotovki-i-ppr-pp-109-114-prikaz-528/" style="color:var(--accent)">о плане подготовки и ППР</a>. Если простой возник из-за отсутствия плана, оплату объясняет материал <a href="/blog/prostoy-krana-po-vine-zakazchika/" style="color:var(--accent)">«Простой крана по вине заказчика»</a>.</p>

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
		note="Разбор пп. 139, 140 приказа Ростехнадзора №528 силами KRAN-RT по тексту на legalacts.ru (нумерация действующей редакции). Ширины проезда, расстояний до гидранта и числа проездов в пункте нет — в разборе они не приводятся. Отнесение крана и опор к «оборудованию» и перечень вопросов до постановки крана — выводы KRAN-RT. Не заменяет проект ремонта и правила пожарной безопасности предприятия."
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
