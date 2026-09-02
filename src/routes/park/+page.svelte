<script lang="ts">
	/*
	 * Волна 23 — новая ось роста «Парк техники». До этой волны сайт разбирал только допуск
	 * (что оформить), но ни разу — саму технику (что заходит на объект). Хаб держит ту же
	 * документную оптику, что /obekty-opo/: не витрина с ценами, а реестр моделей,
	 * каждая привязана к конкретному классу объектов, уже описанному на сайте.
	 *
	 * Волна 24 — третья модель. КС-35719-7-02 закрывает нижний край диапазона 16–200 т и
	 * выполняет обещание, данное этим же хабом в волне 23 («туда едет колёсный кран умеренного
	 * класса; вопрос конкретной модели — это уже вопрос заявки») — теперь модель названа.
	 *
	 * Design-code: реиспользован HeroIllustration.svelte (5-слойный SVG крана, волна 19) в
	 * интро-колонке — тот же инженерно-схемный язык, что на главной, без новой иллюстрации.
	 * count-up (атрибут data-countup, отрабатывает static/enh.js) — на ключевых цифрах парка,
	 * тот же паттерн, что у честной плашки метрик на главной (#permit).
	 *
	 * Волна 33 — независимая рыночная цена, третья колонка реестра. До этой волны в `park/` не
	 * было ни одной цены (Grep дал 0 совпадений на сайте). Числа здесь — не новые расчёты, а
	 * компактный повтор того, что уже обосновано источниками на страницах моделей (тот же
	 * паттерн, что у поля `stat`: тоннаж тоже сначала разобран на подстранице, здесь — сжатая
	 * цифра). Полное обоснование, WebSearch-источники и сверка с расчётной ставкой DopuskWizard —
	 * в комментариях начала файла каждой модели. Цена собрана из открытых прайсов
	 * (kazankran.ru, tatavtobaza.ru, kranmar.ru), а не перенесена с чужого сайта.
	 */
	import Sources from '$lib/Sources.svelte';
	import HeroIllustration from '$lib/HeroIllustration.svelte';

	const SITE = 'https://kran-rt.ru';
	const CHECKED = '17.08.2026';

	const title = 'Парк техники в Татарстане: два автокрана и гусеничный кран';
	const description =
		'Клинцы КС-35719-7-02, Ивановец КС-6476 и гусеничный XCMG QUY150: подбор техники для центра Казани, промысла и нефтехимии Нижнекамска.';
	const fleet = [
		{
			href: '/park/klintsy-ks-35719/',
			code: 'К',
			name: 'Автокран Клинцы КС-35719-7-02',
			where: 'Историческая часть Казани · типовая городская стройка',
			key: '16 т, опорный контур 4,3 × 5,2 м — заходит туда, куда тяжёлый класс не заходит по контуру',
			stat: '16 т',
			price: 'от 20 000 ₽/смена',
		},
		{
			href: '/park/ivanovets-ks-6476/',
			code: 'А',
			name: 'Автокран Ивановец КС-6476',
			where: 'Промысел Альметьевска · обычная стройка городов республики',
			key: '50 т, шасси МЗКТ-69234 (8×4) — доедет туда, куда автокран на дорожном шасси не всегда доедет',
			stat: '50 т',
			price: 'от 40 000 ₽/смена',
		},
		{
			href: '/park/xcmg-quy150/',
			code: 'Г',
			name: 'Гусеничный кран XCMG QUY150',
			where: 'Тяжёлый монтаж на нефтехимии Нижнекамска',
			key: '150 т, давление на грунт 0,093 МПа — там, где грузоподъёмности автокрана уже не хватает',
			stat: '150 т',
			price: 'от 72 000 ₽/смена',
		},
	];

	// Волна 133 (мобильная). На кадре 375×812 строка реестра читалась как «Автокран Клинцы
	// КС-35719-7-» / «02»: собственный дефис модельного индекса — законная точка переноса по
	// UAX#14, и запретить её нечем, кроме white-space: nowrap на самом токене (hyphens: manual
	// управляет только АВТОматическими переносами и на существующий дефис не действует).
	// Поэтому индекс модели — последнее слово названия — выносится в отдельный неразрывный
	// span. Само название в данных не тронуто: разбор чисто отображательный.
	const splitModel = (n: string) => {
		const i = n.lastIndexOf(' ');
		return i < 0 ? { head: '', tail: n } : { head: n.slice(0, i), tail: n.slice(i + 1) };
	};

	const metrics = [
		{ value: '3', label: 'модели разобраны подробно', detail: 'от 16 до 150 т' },
		{ value: '150', label: 'т — верхняя граница парка', detail: 'XCMG QUY150, гусеничный' },
	];

	const sources = [
		{
			label: 'Автокран Клинцы КС-35719-7-02 — грузоподъёмность, опорный контур, габариты, масса',
			href: 'https://www.rbauto.ru/catalog/autocranes/14-17-tonn/avtokran-ks-35719-7-02/',
		},
		{
			label: 'Автокран Ивановец КС-6476 — грузоподъёмность, шасси МЗКТ-69234, длина стрелы и гуська',
			href: 'https://kran-master74.ru/heavy/truck_cranes/ivanovets/avtokran_ivanovets_ks_6476_50_t/',
		},
		{
			label: 'Гусеничный кран XCMG QUY150 — грузоподъёмность, вылет, давление на грунт',
			href: 'https://xcmgru.ru/catalogue/gusenichnie_krani/783_xcmg_quy150/',
		},
		{
			label: 'ГОСТ Р 53323-2009 «Огнепреградители и искрогасители» — требования к искрогасителям сухого типа',
			href: 'https://docs.cntd.ru/document/1200071870',
		},
		{
			label: 'Аренда автокрана в Казани — тариф 16-тонного класса, источник цены Клинцы КС-35719-7-02',
			href: 'https://kazankran.ru/',
		},
		{
			label: 'Прайс-лист аренды спецтехники в Татарстане — источник цены Ивановца КС-6476 и вилка сравнения для XCMG QUY150',
			href: 'https://tatavtobaza.ru/prajs/',
		},
		{
			label: 'Аренда крана 150 тонн — национальный бенчмарк, источник цены XCMG QUY150',
			href: 'https://kranmar.ru/truck_crane/arenda-krana-150-tonn/',
		},
	];

	const breadcrumbLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Главная', item: `${SITE}/` },
			{ '@type': 'ListItem', position: 2, name: 'Парк техники', item: `${SITE}/park/` },
		],
	};
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="{SITE}/park/" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image:alt" content={title} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumbLd)}<\/script>`}
</svelte:head>

<main>
	<nav class="crumbs wrap" aria-label="Хлебные крошки">
		<a href="/">Главная</a><span>/</span><span>Парк техники</span>
	</nav>

	<section class="section wrap" style="padding-top:8px">
		<div class="hub__grid">
			<div class="hub__col">
				<span class="eyebrow">Парк техники · 3 модели разобраны подробно</span>
				<h1>Парк техники — какая машина заходит на какой объект</h1>

				<!-- Ценовая шкала парка сразу под заголовком. До этой волны первая цена страницы
				     лежала на 1193-й точке — четвёртый экран телефона; человек, пришедший за
				     «сколько стоит смена», уходил раньше. Строки собираются из того же массива
				     fleet, что и реестр ниже: ни одного нового числа, и разойтись с реестром они
				     физически не могут. -->
				<p class="rates__unit">Смена 8 часов</p>
				<ul class="rates" aria-label="Стоимость смены по классам парка">
					{#each fleet as f (f.href)}
						<li class="rate">
							<a class="rate__link" href={f.href}>
								<span class="rate__stat">{f.stat}</span>
								<!-- Единица тарификации вынесена в подпись над рядом, а не повторяется
								     в каждой ячейке: строка «от 20 000 ₽/смена» в ячейке шириной 96px
								     на 375px ломается как «от 20 000 ₽/» + «смена». Само число и его
								     «от» приходят из того же массива fleet — режется только повтор
								     единицы, который теперь стоит один раз наверху. -->
								<span class="rate__price">{f.price.replace('/смена', '')}</span>
							</a>
						</li>
					{/each}
				</ul>
				<p class="rates__note">
					Ориентир по независимым рыночным источникам, не наш фиксированный прайс: обоснование каждого
					числа — на странице конкретной модели.
				</p>

				<p class="hub__lead">
					Раздел «Объекты и режимы допуска» показывает, что один и тот же кран заходит на 4 типа площадок
					республики по 4 разным наборам документов.
				</p>
			</div>
			<div class="hub__art" aria-hidden="true">
				<HeroIllustration />
			</div>
		</div>
	</section>

	<section class="section wrap" style="padding-top:0">
		<!-- Третья фраза прежнего лида. Не удалена — придвинута вплотную к реестру, который
		     она и объявляет («ниже три реальных примера»): в прежнем виде между этой фразой и
		     списком стояли ещё шесть строк прозы и SVG-иллюстрация. -->
		<p class="fleet__intro">
			Разница не абстрактная — ниже три реальных примера техники и то, что именно у каждой проверяют перед
			выездом.
		</p>
		<ol class="fleet">
			{#each fleet as f (f.href)}
				<li class="fleet__item">
					<a class="fleet__link" href={f.href}>
						<span class="fleet__code" aria-hidden="true">{f.code}</span>
						<span class="fleet__body">
							<span class="fleet__name"
								>{splitModel(f.name).head}
								<span class="nb">{splitModel(f.name).tail}</span></span
							>
							<span class="fleet__where">{f.where}</span>
							<span class="fleet__key">{f.key}</span>
						</span>
						<span class="fleet__stat"
							>{f.stat}<span class="fleet__price">{f.price}</span></span
						>
					</a>
				</li>
			{/each}
		</ol>

		<!-- Вторая фраза прежнего лида (шесть строк на телефоне). Не удалена — перенесена под
		     реестр: там она читается как итог только что перечисленных трёх строк, а не как
		     препятствие перед ними. -->
		<p class="fleet__after">
			Здесь — обратная сторона того же вопроса: чем сама машина отличается для тесной площадки
			исторического центра Казани, промысловой точки под Альметьевском и тяжёлого монтажа на
			нефтехимии Нижнекамска.
		</p>

		<ul class="metrics marks" aria-label="Ключевые цифры парка">
			{#each metrics as m (m.label)}
				<li class="metric">
					<p class="metric__value" role="img" aria-label="{m.value} — {m.label}">
						<span data-countup aria-hidden="true">{m.value}</span>
					</p>
					<p class="metric__label">{m.label}</p>
					<p class="metric__detail">{m.detail}</p>
				</li>
			{/each}
		</ul>
	</section>

	<!-- Волна 109: атмосферное фото. Поиск реального фото трёх моделей парка на Wikimedia
	     Commons (allcategories/categorymembers/search, кириллица и латиница — подробности
	     в content-plan.md, раздел «Волна 109») результата не дал: ни у одной из трёх моделей
	     нет свободно лицензированного снимка именно этой модели. Похожая модель не подставлена.
	     Единственный визуальный элемент этой волны — нейтральное сток-фото крюка стрелы на
	     фоне неба, без брендов и геопривязки, честно подписанное как иллюстрация, а не парк
	     компании. -->
	<section class="section wrap" style="padding-top:0">
		<figure class="park-atmo">
<!-- <picture> ради формата, а не ради арт-дирекшна: кадр один и тот же, меняется только
			     кодек. WebP весит 74 КБ против 164 КБ у JPEG; браузер без поддержки WebP молча
			     пропускает <source> и берёт <img>. width/height/alt/loading остаются на <img> —
			     именно он и есть изображение, <picture> лишь выбирает источник. -->
			<picture>
				<source srcset="/images/park/park-hero.webp" type="image/webp" />
				<img
					src="/images/park/park-hero.jpg"
					alt="Крюк подъёмной стрелы крана на фоне синего неба"
					width="1920"
					height="2880"
					loading="lazy"
				/>
			</picture>
			<figcaption>
				Иллюстративное фото — не единица нашего парка и не съёмка в Татарстане: нейтральный кадр стрелы
				без опознаваемых брендов, чтобы показать характер техники раздела. Автор Sleurink .JPEG, <a
					href="https://www.pexels.com/photo/metal-hook-under-the-blue-sky-13059616/"
					target="_blank"
					rel="noopener">Pexels License<span class="sr-only"> (откроется в новой вкладке)</span></a
				>.
			</figcaption>
		</figure>
	</section>

	<section class="section wrap prose" style="padding-top:0;max-width:840px">
		<h2 style="margin-bottom:16px">Почему в парке нет одной универсальной машины</h2>
		<p>
			Сайт называется «универсальный» не потому, что одна машина закрывает любой объект, а потому что на четырёх
			типах площадок республики нужны разные классы техники — и разница не только в тоннаже.
		</p>
		<p>
			На <a href="/obekty-opo/promysel/">промысловый объект</a> под Альметьевском чаще едет колёсный автокран:
			точки на месторождении рассредоточены, между ними — внутрипромысловые дороги, часто грунтовые, а площадку
			под выносные опоры готовит не всегда та же служба, что вызывает технику (см.
			<a href="/geo/almetevsk/">«Кран в Альметьевске»</a>). Шасси повышенной проходимости здесь не роскошь, а
			условие выезда — разбор конкретной модели на такой базе ниже, у Ивановца КС-6476.
		</p>
		<p>
			На тяжёлый монтаж на территории нефтехимического комбината — колонны, реакторы, крупные технологические
			модули — грузоподъёмности из диапазона 16–200 т, которого достаточно для
			<a href="/obekty-opo/obychnaya-stroyka/">обычной стройплощадки</a>, может не хватить одновременно по
			вылету, высоте подъёма и массе поднимаемого узла.</p>
		<p>Здесь работает гусеничный кран: при сопоставимой
			собственной массе у него ниже давление на грунт, но выше масса единиц транспортировки — машина приезжает
			на объект частями, и монтаж начинается не со смены, а с нескольких дней сборки крана на площадке.
		</p>
		<p>
			В историческом центре Казани, где действуют зоны охраны Казанского кремля, гусеничная техника —
			редкость: стеснённая площадка и историческое покрытие не рассчитаны ни на ширину гусеничного хода, ни на
			время его сборки-разборки. Туда едет колёсный кран умеренного класса — <a href="/park/klintsy-ks-35719/"
				>Клинцы КС-35719-7-02</a
			>: опорный контур 4,3 × 5,2 метра и полная масса 19,6 тонны, что почти вдвое меньше, чем у Ивановца
			КС-6476 (см. <a href="/geo/kazan/">«Кран в Казани»</a> — там же проверка адреса по границам зон охраны).
		</p>

		<h2 style="margin:36px 0 16px">Общее требование для всех трёх машин — вход в газоопасную зону</h2>
		<p>
			Что бы ни стояло на площадке — колёсный кран лёгкого класса, колёсный кран тяжёлого класса или
			гусеничный — правило одно: технику с двигателем внутреннего сгорания не пускают в наружную взрывоопасную
			зону без искрогасителя на выхлопе (см.
			<a href="/obekty-opo/gazoopasnaya-zona/">«Газоопасная зона действующего производства»</a>).</p>
		<p>Это не заводская
			опция крана, а отдельное сертифицированное устройство: общие технические требования к искрогасителям
			сухого типа на выхлопных коллекторах транспортных средств и силовых агрегатов задаёт ГОСТ Р 53323-2009,
			действующий с 1 января 2010 года. Стандарт распространяется на все три машины этого раздела одинаково —
			в основе каждой двигатель внутреннего сгорания, и требование от класса и типа хода не
			зависит.
		</p>
		<p>
			На проходной «Нижнекамскнефтехима» или «Казаньоргсинтеза» это одно из первого, что проверяет служба
			промышленной безопасности предприятия, и выясняется это обычно там же — то есть слишком поздно, если не
			уточнить заранее. Подробнее о том, как это выглядит на конкретном городе, — на странице
			<a href="/geo/nizhnekamsk/">«Кран в Нижнекамске»</a>.
		</p>

		<Sources
			items={sources}
			date={CHECKED}
			note="Диапазон 16–200 т на странице «Обычная стройплощадка» — рыночный диапазон парка региона, а не характеристика конкретной машины; здесь разобраны три конкретные модели — нижний край диапазона, середина и верхний край. Цена в реестре — ориентир по независимым рыночным источникам, не наш фиксированный прайс; полное обоснование каждого числа — на странице конкретной модели."
		/>
	</section>

	<section class="section wrap" style="padding-top:0">
		<a class="btn" href="/#order">Назвать объект — подберём модель →</a>
		<p class="afterlink">
			Нужен башенный кран, манипулятор или автовышка — это уже не парк этого сайта:
			<a href="/partnerskaya-set/">как мы закрываем такие заявки через партнёрскую сеть</a>.
		</p>
	</section>
</main>

<style>
	.hub__grid {
		display: grid;
		gap: clamp(28px, 4vw, 48px);
		align-items: start;
	}
	.hub__art {
		border: 1px solid var(--line);
		background: var(--surface);
	}
	@media (min-width: 900px) {
		.hub__grid {
			grid-template-columns: 1.15fr 0.85fr;
		}
		.hub__art {
			margin-top: 4px;
		}
	}
	.hub__col p {
		margin-top: 16px;
		max-width: 68ch;
		color: var(--ink-2);
		font-size: var(--fs-5);
		line-height: 1.65;
	}

	/* Ценовая шкала первого экрана. Три ячейки в ряд: наверху класс (крупная цифра —
	   тот же приём, что у .metric__value ниже по странице), под ним цена. На 320px ряд
	   не ломается: «от 72 000 ₽/смена» переносится внутри ячейки, а не выталкивает соседей. */
	.rates__unit {
		margin-top: 18px;
		font-family: var(--mono);
		font-size: var(--fs-1);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent);
	}
	.hub__col .rates__unit {
		margin-top: 18px;
		font-size: var(--fs-1);
		line-height: 1.4;
	}
	.rates {
		list-style: none;
		margin: 6px 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		border: 1px solid var(--line-strong);
		background: var(--surface);
	}
	.rate + .rate {
		border-left: 1px solid var(--line);
	}
	.rate__link {
		display: grid;
		gap: 3px;
		padding: 10px 8px 12px;
		background: var(--screen);
		height: 100%;
		text-decoration: none;
		transition: background-color 0.16s ease;
	}
	.rate__link:hover,
	.rate__link:focus-visible {
		background: var(--surface);
	}
	.rate__stat {
		font-family: var(--mono);
		font-size: var(--fs-7);
		line-height: 1.2;
		color: var(--accent);
		-webkit-text-stroke: 0.6px currentColor;
	}
	.rate__price {
		font-family: var(--mono);
		font-size: var(--fs-2);
		line-height: 1.4;
		color: var(--ink-2);
	}
	.rate__link:hover .rate__price {
		color: var(--ink);
	}
	/* Волна 133. Ниже 360px ценовая ячейка сужается до 96px, из которых 16px съедают поля,
	   а строка «от 20 000 ₽» моноширинным кеглем 12,5px занимает 86px — знак рубля срывался
	   на вторую строку в каждой из трёх ячеек, и ряд читался как «от 20 000» / «₽».
	   Прежняя волна лечила ровно этот дефект на 375px, вынеся «/смена» в подпись над рядом;
	   на 320px не хватает ещё восьми пикселей. Кегль на ступень ниже и поля на 3px уже дают
	   79px против 87px доступных — с запасом. nowrap здесь не годится: ячейка жёсткая (1fr),
	   и неразрывная строка вылезла бы за край экрана вместо переноса. */
	@media (max-width: 359px) {
		.rate__link {
			padding: 10px 5px 12px;
		}
		.rate__price {
			font-size: var(--fs-1);
		}
	}
	.rates__note {
		margin-top: 8px;
		font-size: var(--fs-1);
		line-height: 1.5;
		color: var(--muted);
		max-width: 62ch;
	}
	/* Перебивает .hub__col p — оговорка и лид не должны идти одним кеглем прозы. */
	.hub__col .rates__note {
		margin-top: 8px;
		font-size: var(--fs-1);
		line-height: 1.5;
	}

	/* Строка, объявляющая реестр. Моноширинный набор и мелкий кегль ставят её в один
	   регистр со списком, а не с прозой лида, — она подпись к описи, а не абзац. */
	.fleet__intro {
		margin: 0 0 14px;
		max-width: 68ch;
		font-family: var(--mono);
		font-size: var(--fs-3);
		line-height: 1.55;
		color: var(--ink-2);
	}
	.fleet__after {
		margin-top: 20px;
		max-width: 68ch;
		color: var(--ink-2);
		font-size: var(--fs-5);
		line-height: 1.65;
	}

	/* Реестр из двух моделей — тот же язык, что реестр объектов на /obekty-opo/ (строки описи,
	   ссылкой вся строка), плюс четвёртая колонка с ключевой цифрой класса машины. */
	.fleet {
		list-style: none;
		margin: clamp(24px, 3vw, 32px) 0 0;
		padding: 0;
		border-top: 1px solid var(--line-strong);
	}
	.fleet__item {
		border-bottom: 1px solid var(--line);
	}
	.fleet__item:last-child {
		border-bottom: 1px solid var(--line-strong);
	}
	.fleet__link {
		display: grid;
		grid-template-columns: 46px 1fr auto;
		align-items: start;
		gap: 4px 18px;
		padding: 20px 8px 20px 0;
		text-decoration: none;
		transition: background-color 0.16s ease;
	}
	.fleet__link:hover {
		background: var(--surface);
	}
	.fleet__link:hover .fleet__name {
		color: var(--accent);
	}
	.fleet__code {
		font-family: var(--mono);
		font-size: var(--fs-6);
		font-weight: 700;
		color: var(--accent);
		border-right: 1px solid var(--line-strong);
		padding-right: 14px;
		line-height: 1.4;
	}
	.fleet__body {
		display: grid;
		gap: 5px;
		min-width: 0;
	}
	.fleet__name {
		font-family: var(--mono);
		font-weight: 700;
		font-size: var(--fs-5);
		line-height: 1.35;
		transition: color 0.16s ease;
	}
	.fleet__where {
		font-size: var(--fs-3);
		color: var(--ink-2);
	}
	.fleet__key {
		font-family: var(--mono);
		font-size: var(--fs-1);
		color: var(--muted);
		line-height: 1.45;
	}
	.fleet__stat {
		font-family: var(--mono);
		font-size: var(--fs-5);
		font-weight: 700;
		color: var(--accent);
		white-space: nowrap;
		padding-top: 3px;
		text-align: right;
	}
	/* Волна 33: цена — второй, более тихий параметр под тоннажом в той же ячейке реестра,
	   тот же приём, что уже даёт .fleet__key под .fleet__name — компактная строка, не карточка. */
	.fleet__price {
		display: block;
		margin-top: 3px;
		font-size: var(--fs-1);
		font-weight: 400;
		color: var(--muted);
		white-space: nowrap;
	}
	@media (max-width: 720px) {
		.fleet__link {
			grid-template-columns: 34px 1fr;
			row-gap: 8px;
		}
		.fleet__code {
			padding-right: 10px;
		}
		.fleet__stat {
			grid-column: 2;
			text-align: left;
		}
		/* Мобильная волна, находка с кадра 375×812. В реестре парка ЦЕНА была самым мелким и
		   самым тихим текстом строки: --fs-1 (11,5px) цветом --muted — под тоннажом, набранным
		   --fs-5 полужирным акцентом. На широком экране «второй, более тихий параметр» читается,
		   на телефоне 11,5px приглушённым моноширинным — это фактически сноска, и именно она
		   отвечает на вопрос, ради которого человек открыл раздел аренды.
		   Цена поднимается на две ступени кегля и на цвет прозы. Иерархию это не ломает:
		   тоннаж остаётся крупнее, полужирным и акцентным — цена по-прежнему второй параметр,
		   но её теперь видно.
		   Строка .fleet__key (характеристика машины) поднимается на одну ступень и цвет
		   сохраняет: это действительно деталь, но 11,5px на телефоне не читается ничем. */
		.fleet__price {
			font-size: var(--fs-3);
			color: var(--ink-2);
		}
		.fleet__key {
			font-size: var(--fs-2);
		}
	}

	/* Волна 129: локальная копия плашки цифр удалена — определение одно, в lib/app.css.
	   Здесь остаётся только то, чем эта плашка отличается от той, что на главной: ширина. */
	.metrics {
		--plate-max: 520px;
	}

	/* Волна 109: атмосферное фото — карточка того же языка, что .craneart в ParkCraneArt.svelte
	   (рамка + surface + подпись мелким шрифтом снизу), но с фото вместо схемы. Портретный кадр
	   намеренно не обрезан под ленту: кран вертикален, и обрезка съела бы стрелу. */
	.park-atmo {
		max-width: 420px;
		margin: clamp(24px, 3vw, 32px) 0 0;
		border: 1px solid var(--line-strong);
		background: var(--surface);
		padding: clamp(10px, 2.4vw, 18px);
	}
	.park-atmo img {
		display: block;
		width: 100%;
		height: auto;
		border: 1px solid var(--line);
	}
	.park-atmo figcaption {
		margin-top: 10px;
		font-size: var(--fs-2);
		line-height: 1.5;
		color: var(--muted);
		max-width: 60ch;
	}
	.park-atmo figcaption a {
		color: var(--muted);
		text-underline-offset: 2px;
	}
	.park-atmo figcaption a:hover {
		color: var(--accent);
	}

	@media (prefers-reduced-motion: reduce) {
		.fleet__link {
			transition: none;
		}
	}

	.afterlink {
		margin-top: 18px;
		max-width: 68ch;
		font-size: var(--fs-3);
		color: var(--muted);
	}
	.afterlink a {
		color: var(--accent);
	}
</style>

