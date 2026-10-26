<script lang="ts">
	import BlogArticleLayout from '$lib/BlogArticleLayout.svelte';
	import Sources from '$lib/Sources.svelte';
	import { slugify } from '$lib/slug';

	const CHECKED = '26.10.2026';
	const PUBLISHED = '2026-10-26T07:00:00+03:00';
	const SITE = 'https://kran-rt.ru';
	const SLUG = 'gruz-vblizi-steny-kolonny-stanka-p129-p134';

	// Волна 74 (26.10.2026), статья 1 из 3: how-to. ФНП №461 (legalacts.ru, curl 26.10.2026, нумерация действующей
	// редакции): п. 129 — при подъёме груза краном, стоящим вблизи стены, колонны, штабеля, ж/д вагона, станка или другого
	// оборудования, нельзя находиться людям (в том числе стропальщику) между грузом и этими частями здания или оборудованием;
	// требование действует и при опускании, и при перемещении; п. 134 — ограничители, указатели и регистраторы не
	// используются для учёта веса грузов (материалов). Числовых зазоров в пп. 129 и 134 нет — не подставлялись.
	// Расстановка стропальщика, зона у стены и правило «взвешивать отдельно» — выводы KRAN-RT, помечены в тексте.
	const sources = [
		{
			label: 'Приказ Ростехнадзора от 26.11.2020 №461 «Об утверждении ФНП «Правила безопасности опасных производственных объектов, на которых используются подъёмные сооружения» — пп. 129, 134 (legalacts.ru)',
			href: 'https://legalacts.ru/doc/prikaz-rostekhnadzora-ot-26112020-n-461-ob-utverzhdenii-federalnykh/'
		}
	];

	const title = 'Где стоять стропальщику у стены: п. 129 ФНП №461';
	const description =
		'П. 129 ФНП №461: между грузом и стеной, колонной или станком людей быть не должно ни при подъёме, ни при опускании. Что делает KRAN-RT до подъёма.';

	const lead =
		'П. 129 ФНП №461 запрещает находиться людям, включая стропальщика, между поднимаемым грузом и стеной, колонной, штабелем, вагоном или станком, рядом с которыми стоит кран. Запрет действует и при подъёме, и при опускании, и при перемещении. KRAN-RT разбирает пункт, показывает, где стропальщику стоять, и объясняет, почему п. 134 не позволяет считать вес по ограничителю.';

	const headingsText = [
		'Что запрещает п. 129 ФНП №461 при подъёме у стены',
		'Какие объекты рядом с краном п. 129 приравнивает к стене',
		'Где стоять стропальщику, если груз идёт вдоль стены',
		'Почему запрет действует и при опускании груза',
		'Можно ли считать вес груза по ограничителю: п. 134'
	];
	const headings = headingsText.map((text) => ({ text, id: slugify(text) }));

	const matrixCaption = 'Что п. 129 и п. 134 ФНП №461 требуют при подъёме у препятствия';

	const matrix = [
		{
			k: 'Подъём груза краном, стоящим вблизи стены, колонны, штабеля, вагона, станка',
			v: 'Людей, в том числе стропальщика, между грузом и этими частями здания или оборудованием быть не должно',
			p: 'П. 129'
		},
		{
			k: 'Опускание и перемещение того же груза',
			v: 'Запрет на нахождение людей между грузом и препятствием действует и на этих операциях',
			p: 'П. 129'
		},
		{
			k: 'Учёт веса груза',
			v: 'Ограничители, указатели и регистраторы не используются для учёта веса грузов и материалов',
			p: 'П. 134'
		}
	];

	const faqs = [
		{
			q: 'Можно ли стропальщику стоять между грузом и стеной?',
			a: 'Нельзя: п. 129 ФНП №461 запрещает нахождение людей, в том числе стропальщика, между поднимаемым грузом и стеной, колонной, штабелем или оборудованием. Автокраны KRAN-RT работают по этому правилу и при подъёме, и при опускании.'
		},
		{
			q: 'Какие предметы рядом с краном считаются препятствием по п. 129?',
			a: 'Пункт называет стену, колонну, штабель, железнодорожный вагон, станок и «другое оборудование». KRAN-RT читает формулировку широко: любой предмет, который при ходе груза может зажать человека, попадает под запрет.'
		},
		{
			q: 'Действует ли запрет, когда груз только опускают?',
			a: 'Да, п. 129 прямо распространяет требование на опускание и перемещение груза. Крановщики Клинцов КС-35719-7-02 и Ивановца КС-6476 в KRAN-RT не начинают движение, пока люди не вышли из зазора.'
		},
		{
			q: 'Каким зазором между грузом и стеной определяется безопасность?',
			a: 'Числового зазора в п. 129 ФНП №461 нет, поэтому KRAN-RT не называет «безопасное число» и ссылается на ППР и инструкцию объекта. Если зазора для прохода нет, груз подают другим путём.'
		},
		{
			q: 'Можно ли определять вес груза по показаниям ограничителя?',
			a: 'Нельзя: п. 134 ФНП №461 запрещает использовать ограничители, указатели и регистраторы для учёта веса. KRAN-RT берёт массу груза из документов заказчика, а прибор использует только как защиту крана.'
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
	eyebrow="Безопасность подъёма"
	crumbLabel="Груз у стены, колонны, станка"
	{lead}
	published={PUBLISHED}
	checked={CHECKED}
	{headings}
	currentSlug={SLUG}
	ctaText="Нужен подъём у стены или оборудования — отправить заявку →"
	ctaHref="/#order"
>
	<h2 id={headings[0].id} style="margin:36px 0 16px">{headings[0].text}</h2>
	<p>П. 129 ФНП №461 защищает людей от зажатия грузом: если кран стоит вблизи стены, колонны, штабеля, вагона или станка, между поднимаемым грузом и этим препятствием не должен находиться никто, включая стропальщика. KRAN-RT применяет пункт как условие начала движения.</p>
	<p>Рядом стоит п. 134 о весе груза: приборы крана не заменяют учёт массы. Таблица ниже сводит оба требования в проверку, которую KRAN-RT проводит перед подъёмом.</p>
	<div class="cmp-wrap">
		<table class="cmp">
			<caption>{matrixCaption}</caption>
			<thead>
				<tr>
					<th scope="col">Ситуация</th>
					<th scope="col">Требование ФНП №461</th>
					<th scope="col">Пункт</th>
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
	<p>П. 129 ФНП №461 перечисляет препятствия: стена, колонна, штабель, железнодорожный вагон, станок и «другое оборудование». KRAN-RT читает список как открытый, потому что смысл пункта — не допустить человека в зону, где груз может прижать его к жёсткому предмету.</p>
	<p>На площадке нефтехимии такими предметами бывают опоры эстакад, обвязка аппаратов и соседние ёмкости; на стройке Казани — перекрытия и штабели блоков. Перед выездом KRAN-RT просит заказчика отметить на схеме площадки такие места рядом с точкой стоянки автокрана и траекторией груза; о том, как считается зона вокруг крана, — в статье <a href="/blog/opasnaya-zona-raboty-krana/" style="color:var(--accent)">«Опасная зона работы крана»</a>.</p>

	<h2 id={headings[2].id} style="margin:36px 0 16px">{headings[2].text}</h2>
	<p>Из п. 129 следует, что стропальщик в KRAN-RT не стоит в зазоре между грузом и препятствием ни на одном этапе хода. Правильная позиция — с открытой стороны груза, откуда виден крановщик и есть путь отхода. Так KRAN-RT читает пункт для практики; расстояния норма не задаёт.</p>
	<p>Если груз идёт вдоль стены и открытой стороны у него нет, KRAN-RT предлагает заказчику изменить траекторию или подать груз другим путём. Кантование у стены разобрано в статье <a href="/blog/kantovka-gruza-kranom-p114/" style="color:var(--accent)">«Кантовка груза краном»</a>, сигналы крановщику — в статье <a href="/blog/signaly-stropalshchika-i-kranovshchika-p248/" style="color:var(--accent)">«Сигналы стропальщика и крановщика»</a>.</p>

	<h2 id={headings[3].id} style="margin:36px 0 16px">{headings[3].text}</h2>
	<p>П. 129 ФНП №461 заканчивается фразой, что требование выполняется и при опускании, и при перемещении груза. Значит, человек не должен входить в зазор между грузом и стеной и тогда, когда стропальщик подходит принимать груз у места установки.</p>
	<p>Ивановец КС-6476 и Клинцы КС-35719-7-02 у KRAN-RT опускают груз до тех пор, пока стропальщик не подаст сигнал из безопасной позиции, а не из зазора. Числового зазора между грузом и стеной в п. 129 нет, поэтому KRAN-RT не называет «безопасное число» и опирается на ППР объекта; про ППР — в статье <a href="/blog/ppr-na-rabotu-krana-fnp-461/" style="color:var(--accent)">«ППР на работу крана»</a>.</p>

	<h2 id={headings[4].id} style="margin:36px 0 16px">{headings[4].text}</h2>
	<p>П. 134 ФНП №461 однозначен: ограничители, указатели и регистраторы не должны использоваться для учёта веса грузов и материалов. Прибор на кране защищает кран от перегруза, но не заменяет взвешивание или накладную, поэтому KRAN-RT не принимает его показания как массу груза для расчёта.</p>
	<p>Практический вывод KRAN-RT: массу груза заказчик указывает в заявке по паспорту изделия или по накладной, а проверка прибора до подъёма — отдельная процедура, разобранная в статье <a href="/blog/ogranichitel-gruzopodemnosti-proverka-do-podyoma/" style="color:var(--accent)">«Что проверить в ограничителе до подъёма»</a>. Условия выезда — в разделах <a href="/park/" style="color:var(--accent)">«Парк»</a> и <a href="/dopusk/" style="color:var(--accent)">«Допуск»</a>.</p>

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
		note="Разбор пп. 129 и 134 ФНП №461 силами KRAN-RT по тексту на legalacts.ru (нумерация действующей редакции). Числового зазора в п. 129 нет — в статье он не приводится. Позиция стропальщика с открытой стороны груза, просьба отметить препятствия на схеме и правило «масса — из документов заказчика» — выводы KRAN-RT, в нормах их нет."
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
