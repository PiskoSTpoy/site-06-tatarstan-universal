<script lang="ts">
	import { posts } from '$lib/posts';
	import Sources from '$lib/Sources.svelte';

	const SITE = 'https://kran-rt.example';
	const CHECKED = '12.08.2026';

	const title = 'Блог: наряд-допуск на газоопасные работы — разборы';
	const description =
		'Четыре статьи одной темы: когда крану нужен наряд-допуск, по какому регламенту его оформляют, что грозит за нарушение и кто его согласовывает.';
	// Волна 20: хаб /blog/ — точка навигации к статьям, не собственный разбор норм. Полные
	// подписи и ссылки на приказы №528/№531 уже даны в каждой статье — здесь не повторяем блок
	// целиком (урок Волны 17 про дубли между хабом и деталями), а указываем, где смотреть.
	// Волна 22: добавлены ссылки на две новые статьи (ответственность по КоАП, ПАСС(Ф)) тем же
	// принципом — короткая подпись + ссылка, без копирования содержания статьи в хаб.
	const sources = [
		{
			label: 'Оба документа процитированы и разобраны построчно — в статье «ФНП №531 или приказ №528»',
			href: '/blog/fnp-531-ili-528-naryad-dopusk/',
		},
		{
			label: 'Практика применения приказа №528 на площадках нефтехимии — в статье «Наряд-допуск на газоопасные работы»',
			href: '/blog/naryad-dopusk-gazoopasnye-raboty/',
		},
		{
			label: 'Санкции ст. 9.1 КоАП за нарушение процедуры — в статье «Что грозит по КоАП»',
			href: '/blog/koap-otvetstvennost-naryad-dopusk/',
		},
		{
			label: 'Роль газоспасательного формирования в согласовании — в статье «Кто такое ПАСС(Ф)»',
			href: '/blog/pass-f-gazospasatelnaya-sluzhba/',
		},
	];

	const breadcrumbLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Главная', item: `${SITE}/` },
			{ '@type': 'ListItem', position: 2, name: 'Блог', item: `${SITE}/blog/` },
		],
	};
	const listLd = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		itemListElement: posts.map((p, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: p.title,
			url: `${SITE}${p.href}`,
		})),
	};
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="{SITE}/blog/" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumbLd)}<\/script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(listLd)}<\/script>`}
</svelte:head>

<main>
	<nav class="crumbs wrap" aria-label="Хлебные крошки">
		<a href="/">Главная</a><span>/</span><span>Блог</span>
	</nav>

	<section class="section wrap" style="padding-top:8px">
		<div class="section-head">
			<span class="eyebrow">Блог</span>
			<h1>Четыре статьи вместо двадцати</h1>
			<p>
				Блог здесь узкий намеренно: все 4 статьи разбирают одну тему — наряд-допуск на газоопасные работы, ту самую
				процедуру, которая на площадках нижнекамской нефтехимии определяет дату выезда техники.</p>
			<p>Первые две отвечают
				на «что это» и «по какому регламенту», следующие две — на «что будет, если нарушить» и «кто, кроме
				предприятия и подрядчика, в этом участвует».</p>
			<p>Всё остальное на сайте построено вокруг практики, а не теории:
				чек-лист, режимы допуска по типам объектов и разбор бланков.
			</p>
		</div>
		<div class="posts">
			{#each posts as p (p.href)}
				<a class="post-card box" href={p.href}>
					<span class="post-card__tag">{p.tag}</span>
					<h2>{p.title}</h2>
					<p>{p.excerpt}</p>
					<span class="post-card__more">Читать →</span>
				</a>
			{/each}
		</div>
	</section>

	<section class="section wrap prose" style="padding-top:0;max-width:840px">
		<h2 style="margin-bottom:16px">Где что лежит на этом сайте</h2>
		<p>
			Тема одна, но у неё четыре разных практических среза, и держать их в одной статье бессмысленно — читателю
			нужен разный уровень детализации в зависимости от того, на каком он этапе:
		</p>
		<ul>
			<li>
				<b>Статьи блога</b> — теория: что относится к газоопасным работам, зачем нужен наряд-допуск, чем
				отличаются два регламента, по которым он оформляется, что грозит по КоАП за нарушение процедуры и кто
				согласовывает наряд со стороны газоспасательной службы.
			</li>
			<li>
				<b><a href="/dopusk/">Чек-лист допуска</a></b> — девять пунктов с основаниями и сроками: что должно быть
				оформлено, прежде чем кран зайдёт за проходную.
			</li>
			<li>
				<b><a href="/obekty-opo/">Объекты и режимы допуска</a></b> — то же самое, но разложенное по четырём типам
				площадок республики: газоопасная зона, промплощадка вне неё, промысел, обычная стройка.
			</li>
			<li>
				<b><a href="/formy/">Формы и бланки</a></b> — сами документы: кто подписывает наряд-допуск, сколько он
				живёт, чем отличается от пропуска и что чаще всего заполняют неправильно.
			</li>
		</ul>

		<h2 style="margin:36px 0 16px">Чего в блоге нет и почему</h2>
		<p>
			Здесь нет статьи про техническое освидетельствование крана по ФНП №461: тема одинаковая от Калининграда
			до Анадыря и полностью изложена в самих правилах — приказ Ростехнадзора от 26.11.2020 №461. Нет и разбора
			ветровых ограничений: предельная скорость для конкретной машины стоит в её паспорте и приоритетна над
			любым общим числом, так что статья тут заменяется одной строкой. Пересказ норматива — это не статья,
			а дубль первоисточника, только с риском опечатки в цифре.
		</p>
		<p>
			Что осталось нашим: наряд-допуск на газоопасные работы и всё, что вокруг него, — потому что за этим стоит
			реальная региональная практика, а не поисковый запрос. Республика с концентрацией нефтехимии в Нижнекамске
			даёт достаточно материала, чтобы писать об этом от первого лица.
		</p>

		<Sources
			items={sources}
			date={CHECKED}
			note="Обе статьи опираются на действующие редакции приказов №528 и №531; при изменении нормативки материалы обновляются, а дата проверки сдвигается."
		/>
	</section>

	<section class="section wrap" style="padding-top:0">
		<a class="btn" href="/#order">Объект под наряд-допуск — обсудить →</a>
	</section>
</main>

<style>
	.posts {
		display: grid;
		gap: 16px;
	}
	.post-card {
		display: block;
		padding: 28px;
		text-decoration: none;
	}
	.post-card__tag {
		font-family: var(--mono);
		font-size: var(--fs-1);
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent);
	}
	.post-card h2 {
		margin-top: 10px;
		font-size: var(--fs-6);
		font-family: var(--mono);
		text-transform: none;
	}
	.post-card p {
		margin-top: 10px;
		color: var(--muted);
		font-size: var(--fs-4);
		max-width: 70ch;
		font-family: var(--sans);
	}
	.post-card__more {
		display: inline-block;
		margin-top: 14px;
		color: var(--accent);
		font-weight: 700;
		font-size: var(--fs-3);
		font-family: var(--mono);
	}
</style>
