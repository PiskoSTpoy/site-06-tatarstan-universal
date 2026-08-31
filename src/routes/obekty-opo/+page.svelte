<script lang="ts">
	import Sources from '$lib/Sources.svelte';

	const SITE = 'https://kran-rt.example';
	const CHECKED = '21.08.2026';

	const title = 'Объекты и режимы допуска в Татарстане — четыре типа площадок';
	const description =
		'Газоопасная зона, промплощадка вне неё, промысел, обычная стройка: по каждому типу объекта РТ — какие требования допуска действуют и кто оформляет.';
	const kinds = [
		{
			href: '/obekty-opo/gazoopasnaya-zona/',
			code: 'I',
			name: 'Взрывопожароопасная и газоопасная зона действующего производства',
			where: 'Нижнекамск: нефтехимия и переработка',
			key: 'Наряд-допуск по ФНП №528, ПАСС(Ф), дневная смена',
			count: '7 требований',
		},
		{
			href: '/obekty-opo/promploshchadka/',
			code: 'II',
			name: 'Промплощадка предприятия вне газоопасной зоны',
			where: 'Набережные Челны: автопром и поставщики компонентов',
			key: 'Внутренний допуск, инструктаж, пропускной режим',
			count: '6 требований',
		},
		{
			href: '/obekty-opo/promysel/',
			code: 'III',
			name: 'Промысловый объект добычи',
			where: 'Альметьевский район: точки на месторождении',
			key: 'Допуск эксплуатирующей организации на точку, маршрут подачи',
			count: '6 требований',
		},
		{
			href: '/obekty-opo/obychnaya-stroyka/',
			code: 'IV',
			name: 'Обычная стройплощадка и городской объект',
			where: 'Казань и города республики',
			key: 'Федеральный пакет; в историческом центре — проверка зон охраны',
			count: '4 требования',
		},
	];

	const sources = [
		{
			label: 'Приказ Ростехнадзора от 15.12.2020 №528 — деление газоопасных работ на группы I и II',
			href: 'https://www.consultant.ru/document/cons_doc_LAW_372483/',
		},
		{
			label: 'Официальные данные о территории Республики Татарстан (67 836,2 км²; 460 км с запада на восток)',
			href: 'https://torgprednn.tatarstan.ru/aboutrt',
		},
		{
			label: 'Приволжское управление Ростехнадзора — надзор в РТ, Марий Эл и Чувашии',
			href: 'http://www.privol.gosnadzor.ru/',
		},
	];

	const breadcrumbLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Главная', item: `${SITE}/` },
			{ '@type': 'ListItem', position: 2, name: 'Объекты и режимы допуска', item: `${SITE}/obekty-opo/` },
		],
	};
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="{SITE}/obekty-opo/" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumbLd)}<\/script>`}
</svelte:head>

<main>
	<nav class="crumbs wrap" aria-label="Хлебные крошки">
		<a href="/">Главная</a><span>/</span><span>Объекты и режимы допуска</span>
	</nav>

	<section class="section wrap" style="padding-top:8px">
		<div class="section-head">
			<span class="eyebrow">Реестр объектов</span>
			<h1>Четыре типа объектов — четыре режима допуска</h1>
			<!-- Волна 133 (мобильная). Лид занимал восемь строк на 375px и девять на 320px, и
			     реестр — единственный смысловой элемент страницы — начинался за сгибом. Выше
			     остаётся первая фраза (три строки), вторая перенесена под реестр: она и по
			     смыслу итог перечисленных четырёх строк, а не препятствие перед ними. Ни одно
			     слово не удалено. -->
			<p>
				Разделение здесь не по технике и не по отраслям, а по тому, что определяет допуск.
			</p>
		</div>

		<ol class="regs">
			{#each kinds as k (k.href)}
				<li class="reg">
					<a class="reg__link" href={k.href}>
						<span class="reg__code" aria-hidden="true">{k.code}</span>
						<span class="reg__body">
							<span class="reg__name">{k.name}</span>
							<span class="reg__where">{k.where}</span>
							<span class="reg__key">{k.key}</span>
						</span>
						<span class="reg__count">{k.count}</span>
					</a>
				</li>
			{/each}
		</ol>

		<!-- Вторая фраза лида. Не удалена — перенесена сюда, под реестр. -->
		<p class="lead-rest">
			Один и тот же пятидесятитонник заходит на 4 разных объекта с 4 разными наборами документов, и разница
			между ними — не в кране, а в том, как классифицирована точка, где он будет стоять.
		</p>
	</section>

	<section class="section wrap prose" style="padding-top:0;max-width:840px">
		<h2 style="margin-bottom:16px">Почему в Татарстане это делится именно так</h2>
		<p>
			Республика вытянута на 460 км с запада на восток при площади 67 836 км² и живёт не одним центром, а тремя
			промышленными полюсами: переработка Нижнекамска, автопром Набережных Челнов, добыча юго-востока.</p>
		<p>Полюса
			устроены по-разному не географически, а нормативно: в первом случае решение о допуске принимает служба
			промышленной безопасности по классификации зоны, во втором — служба охраны труда по внутреннему регламенту, в
			третьем — организация, эксплуатирующая конкретную точку месторождения. Четвёртый тип, обычная городская
			стройка, вообще не добавляет ничего сверх федеральных требований — и это тоже полезно знать заранее, чтобы не
			закладывать в график лишние дни.
		</p>
		<p>
			Практический вывод простой и он же неудобный для быстрой продажи: назвать срок по одному слову «завод»
			нельзя. «Завод» в Нижнекамске и «завод» в Челнах — это разные наборы документов и разные сроки, а точка на
			промысле в 30 км от Альметьевска может оказаться и тем и другим одновременно, если она классифицирована как
			газоопасная.
		</p>

		<h2 style="margin:36px 0 16px">Что общего у всех четырёх</h2>
		<ul>
			<li>
				<b>Федеральный пакет на технику и оператора</b> обязателен везде и ни в одном из четырёх случаев не
				заменяется допуском площадки. Техническое освидетельствование и аттестация оператора — отдельный,
				независимый слой.
			</li>
			<li>
				<b>Надзорный орган один</b> — Приволжское управление Ростехнадзора, в зоне ответственности которого
				Татарстан, Марий Эл и Чувашия. Расхождения на практике возникают не между ведомствами, а между
				внутренними регламентами предприятий.
			</li>
			<li>
				<b>Первым выясняется тип объекта, а не тоннаж.</b> От классификации зависит и набор документов, и срок, и
				иногда сама машина: технику с двигателем внутреннего сгорания не пускают в наружную взрывоопасную зону
				без искрогасителя на выхлопе. Какие конкретно модели закрывают какой тип объекта — в разделе
				<a href="/park/" style="color:var(--accent)">«Парк техники»</a>.
			</li>
		</ul>

		<p style="margin-top:24px">
			Полный список того, что оформляется на промышленном объекте, с основаниями и сроками, собран в
			<a href="/dopusk/" style="color:var(--accent)">чек-листе допуска</a>; разбор самих бланков — в разделе
			<a href="/formy/" style="color:var(--accent)">«Формы и бланки»</a>.
		</p>

		<Sources
			items={sources}
			date={CHECKED}
			note="Количество требований в списке выше — это число пунктов на соответствующей странице, а не норматив: набор зависит от классификации конкретной точки работ."
		/>
	</section>

	<section class="section wrap" style="padding-top:0">
		<a class="btn" href="/#order">Назвать объект — скажем, что нужно оформить →</a>
	</section>
</main>

<style>
	/* Хвост лида под реестром — примечание к только что перечисленным строкам, поэтому
	   кегль на ступень ниже первой фразы. */
	.lead-rest {
		margin-top: clamp(18px, 2.5vw, 26px);
		max-width: 74ch;
		color: var(--ink-2);
		font-size: var(--fs-4);
		line-height: 1.6;
	}

	/* Реестр объектов. Не карточки: строки таблицы-описи с римским кодом слева и счётчиком
	   требований справа — тот же язык, что у нумерованных строк требований на вложенных
	   страницах. Ссылкой является вся строка. */
	.regs {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--line-strong);
	}
	.reg {
		border-bottom: 1px solid var(--line);
	}
	.reg:last-child {
		border-bottom: 1px solid var(--line-strong);
	}
	.reg__link {
		display: grid;
		grid-template-columns: 46px 1fr auto;
		align-items: start;
		gap: 4px 18px;
		padding: 20px 8px 20px 0;
		text-decoration: none;
		transition: background-color 0.16s ease;
	}
	.reg__link:hover {
		background: var(--surface);
	}
	.reg__link:hover .reg__name {
		color: var(--accent);
	}
	.reg__code {
		font-family: var(--mono);
		font-size: var(--fs-6);
		font-weight: 700;
		color: var(--accent);
		border-right: 1px solid var(--line-strong);
		padding-right: 14px;
		line-height: 1.4;
	}
	.reg__body {
		display: grid;
		gap: 5px;
		min-width: 0;
	}
	.reg__name {
		font-family: var(--mono);
		font-weight: 700;
		font-size: var(--fs-5);
		line-height: 1.35;
		transition: color 0.16s ease;
	}
	.reg__where {
		font-size: var(--fs-3);
		color: var(--ink-2);
	}
	.reg__key {
		font-family: var(--mono);
		font-size: var(--fs-1);
		color: var(--muted);
		line-height: 1.45;
	}
	.reg__count {
		font-family: var(--mono);
		font-size: var(--fs-1);
		font-weight: 700;
		color: var(--muted);
		white-space: nowrap;
		padding-top: 3px;
	}
	@media (max-width: 720px) {
		.reg__link {
			grid-template-columns: 34px 1fr;
			row-gap: 8px;
		}
		.reg__code {
			padding-right: 10px;
		}
		.reg__count {
			grid-column: 2;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.reg__link,
		.reg__name {
			transition: none;
		}
	}
</style>
