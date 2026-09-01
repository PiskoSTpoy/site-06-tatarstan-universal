<script lang="ts">
	import DopuskWizard from '$lib/DopuskWizard.svelte';
	import Sources from '$lib/Sources.svelte';
	import HeroIllustration from '$lib/HeroIllustration.svelte';
	import CraneParamPicker from '$lib/CraneParamPicker.svelte';

	// Волна 34: схема крана в первом экране становится кликабельной — CraneParamPicker
	// держит своё open-состояние снаружи ($bindable), чтобы схема «приближалась» (zoomed)
	// ровно пока открыта панель параметров, а не жила отдельной анимацией сама по себе.
	let paramsOpen = $state(false);
	import RigSummary from '$lib/RigSummary.svelte';
	import PermitStatus from '$lib/PermitStatus.svelte';
	import { countUp } from '$lib/countUp';
	import { tilt } from '$lib/tilt';

	const SITE = 'https://kran-rt.ru';
	const CHECKED = '21.08.2026';

	// Обработчик заявок — маленький серверный скрипт на площадке Cloudflare. Он нужен ровно
	// затем, чтобы токен Telegram-бота лежал на сервере, а не в клиентском JS, где его увидел бы
	// любой посетитель через код страницы: скрипт принимает заявку и пересылает её сообщением в
	// рабочий чат диспетчера. Адрес ниже — рабочий, не плейсхолдер.
	const LEAD_ENDPOINT = 'https://kran-network-leads.kran-network-leads.workers.dev/submit';

	// Волна 16 (структурное расхождение). Главная перевёрнута: раньше она открывалась
	// сетевым hero с иллюстрацией крана, бегущей строкой, полосой цифр и ценовым визардом —
	// то есть отвечала на вопрос «сколько стоит час», как и восемь соседних сайтов сети.
	// Теперь первым блоком идёт чек-лист допуска: на промышленной площадке Татарстана кран
	// останавливает не цена, а отсутствие оформленного наряда. Убраны hero-сетка с SVG-сценой
	// и свечением, marquee, stat-bar и секция «как работаем» с шагами 01–04.
	//
	// Волна 19 (восстановление визуального слоя). Структура волны 16 не тронута — тот же
	// порядок секций. Возвращён инженерно-схемный визуальный язык сайта: hero-иллюстрация
	// крана (первый экран), терминальный индикатор статуса допуска и честная плашка метрик
	// (#permit), count-up для чисел, текстовый маркер «>» на hover вместо тени. Модули
	// lib/tilt.ts, lib/countUp.ts, lib/motion.ts, которые волна 16 удалила как мёртвый код,
	// физически не сохранились ни на одном сайте сети (проверено — их нет нигде), поэтому
	// motion.ts и countUp.ts написаны заново по документации волны 13-D в content-plan.md
	// (та же математика: (depth − 0.6) × amplitude для параллакса, посимвольное восстановление
	// исходной строки в count-up). lib/tilt.ts сознательно не восстановлен: пункт 5 этой волны
	// заменяет 3D-наклон с бликом терминальным маркером «>» — они взаимоисключающие языки
	// hover-реакции, а не два слоя одного и того же.
	//
	// Волна 128. Часть A: фоновое видео в первом экране — ночной облёт нефтеперерабатывающего
	// завода дроном. Тема выбрана под собственную ось сайта: газоопасные объекты нефтехимии
	// (см. #obekty/#permit), а не абстрактный кран на фоне неба. Видео лежит фоном ВСЕЙ секции
	// open (текстовая колонка + существующая HeroIllustration) внутри рамочной панели
	// .open__panel — панель читается как экран консоли с живым фоном, а не как постер под
	// заголовком. Часть B: 3D-тилт — новый для сайта механизм (до этого на наведение отвечал
	// только терминальный маркер «>» на строках-реестрах), реализован в lib/tilt.ts и применён
	// к НОВЫМ карточкам классов парка ниже (#fleet-teaser) — не трогает .kind/.links/.cities.

	const title = 'Допуск крана на объект в Татарстане — что нужно оформить';
	const description =
		'Кран в Казани, Нижнекамске, Челнах и Альметьевске. Отвечаем на вопрос, который решает дату выезда: какие допуски нужны на вашем типе объекта.';

	// Единый источник данных для реестра объектов (#obekty) И терминального индикатора
	// статуса допуска (#permit, PermitStatus.svelte) — один и тот же разбор четырёх типов
	// объектов, что уже опубликован постранично в /obekty-opo/*, не два независимых списка.
	const kinds = [
		{
			href: '/obekty-opo/gazoopasnaya-zona/',
			code: 'I',
			name: 'Газоопасная зона действующего производства',
			key: 'Наряд-допуск на смену, согласование с газоспасательной службой, дневное окно работ',
			regime: 'Наряд-допуск, группа I (ФНП №528)',
			basis: 'приложение №2 к ФНП №528 / приложение №1 к ФНП №531',
			status: 'required' as const,
			statusLabel: 'ТРЕБУЕТСЯ',
		},
		{
			href: '/obekty-opo/promploshchadka/',
			code: 'II',
			name: 'Промплощадка вне газоопасной зоны',
			key: 'Внутренний допуск подрядчика, инструктаж, пропускной режим, ППР на подъём',
			regime: 'Внутренний допуск подрядчика, не наряд по ФНП',
			basis: 'регламент предприятия, публичной формы нет',
			status: 'internal' as const,
			statusLabel: 'ВНУТРЕННИЙ ДОПУСК',
		},
		{
			href: '/obekty-opo/promysel/',
			code: 'III',
			name: 'Промысловый объект добычи',
			key: 'Допуск на конкретную точку, согласование маршрута, площадка под выносные опоры',
			regime: 'Наряд-допуск — только если точка газоопасна',
			basis: 'приложение №2 к ФНП №528, по факту классификации точки',
			status: 'conditional' as const,
			statusLabel: 'ЗАВИСИТ ОТ ТОЧКИ',
		},
		{
			href: '/obekty-opo/obychnaya-stroyka/',
			code: 'IV',
			name: 'Обычная стройплощадка и город',
			key: 'Только федеральный пакет; в историческом центре Казани — проверка зон охраны',
			regime: 'Только федеральный пакет документов',
			basis: 'наряд-допуск по ФНП №528 не применяется',
			status: 'none' as const,
			statusLabel: 'НЕ ТРЕБУЕТСЯ',
		},
	];

	// Честная плашка метрик — продуктовые факты, не выдуманный масштаб бизнеса. Все три
	// значения уже подтверждены остальным контентом сайта: 2 регламента см. #permit и
	// /obekty-opo/gazoopasnaya-zona/, 1 город разобран детально — /geo/nizhnekamsk/
	// (единственная страница нефтехимии с тем же уровнем детализации, что у наряда-допуска),
	// дата — тот же CHECKED, что стоит в Sources на этой и всех вложенных страницах.
	const metrics = [
		{ value: '2', label: 'регламента под наряд-допуск', detail: 'ФНП №531 · приказ №528' },
		{ value: '1', label: 'город разобран детально', detail: 'Нижнекамск — нефтехимия' },
	];

	const cities = [
		{ href: '/geo/nizhnekamsk/', name: 'Нижнекамск', tag: 'нефтехимия и переработка' },
		{ href: '/geo/naberezhnye-chelny/', name: 'Набережные Челны', tag: 'автопром и поставщики' },
		{ href: '/geo/kazan/', name: 'Казань', tag: 'город и зоны охраны кремля' },
		{ href: '/geo/almetevsk/', name: 'Альметьевск', tag: 'промысел и соцстройка' },
		{ href: '/geo/zainsk/', name: 'Заинск', tag: 'энергетика: модернизация ГРЭС' },
	];

	// Волна 128 — три карточки классов парка (тот же реестр, что подробно разобран на
	// /park/, здесь — сжатая витрина с наклоном при наведении). Иконки — схемные силуэты
	// (та же линия, что у HeroIllustration.svelte: только stroke var(--accent)/var(--line-strong)
	// на var(--surface)), а не фото: волна 109 на /park/ уже искала свободно лицензированные
	// фото именно этих трёх моделей на Wikimedia Commons и не нашла ни одной — подставлять
	// чужую модель под чужим именем сайт принципиально не делает (см. figcaption /park/).
	const fleetTeaser = [
		{
			href: '/park/klintsy-ks-35719/',
			code: 'К',
			name: 'Клинцы КС-35719-7-02',
			stat: '16 т',
			key: 'Опорный контур 4,3×5,2 м — историческая часть Казани',
			shape: 'light' as const,
		},
		{
			href: '/park/ivanovets-ks-6476/',
			code: 'А',
			name: 'Ивановец КС-6476',
			stat: '50 т',
			key: 'Шасси МЗКТ-69234 (8×4) — промысел Альметьевска',
			shape: 'heavy' as const,
		},
		{
			href: '/park/xcmg-quy150/',
			code: 'Г',
			name: 'XCMG QUY150',
			stat: '150 т',
			key: 'Гусеничный, 0,093 МПа на грунт — нефтехимия Нижнекамска',
			shape: 'crawler' as const,
		},
	];

	const faqs = [
		{
			q: 'Что вообще такое наряд-допуск и почему о нём речь на первом экране?',
			a: 'Это документ, который оформляется перед началом газоопасной работы и определяет условия её безопасного проведения: ответственных, состав бригады, средства защиты, порядок действий при опасности. Рекомендуемый образец — приложение №2 к ФНП, утверждённым приказом Ростехнадзора от 15.12.2020 №528. Для крановой заявки это главный фактор срока: без наряда работа на газоопасной точке физически не начнётся, а оформляется он совместно с предприятием.',
		},
		{
			q: 'Наряд-допуск удорожает смену?',
			a: 'Нет. Оформление наряда-допуска не влияет на тариф крана вообще — оно влияет на дату начала работ и на то, сколько раз процедуру придётся повторить: наряд действует одну смену, поэтому у трёхдневного монтажа будет три наряда. Стоимость считается по классу техники и восьмичасовой смене, и этот расчёт лежит вторым, свёрнутым блоком в чек-листе выше.',
		},
		{
			q: 'Можно ли поставить работы на ночь, чтобы не останавливать производство?',
			a: 'Для газоопасных работ — нет. Правила прямо не допускают их проведение в ночное время и во время грозы; неотложные работы в тёмное время суток возможны только по письменному разрешению лица, утвердившего наряд-допуск, и в присутствии представителя аварийно-спасательной службы. Плановый монтаж под это исключение не подпадает, поэтому объём делится на дневные смены.',
		},
	];

	// Волна 20: главная — не детальная страница по наряду-допуску, полный текст ФНП №528/№531
	// уже процитирован на /dopusk/ построчно (basis у каждого пункта чек-листа). Здесь не повторяем
	// оба источника целиком (урок Волны 17 про дубли между хабом и деталями) — даём короткую ссылку.
	const sources = [
		{
			label: 'Полный список норм с пунктами (ФНП №528, №531 и другие) — в чек-листе допуска',
			href: '/dopusk/',
		},
		{
			label: 'Приволжское управление Ростехнадзора — надзорный орган для Республики Татарстан',
			href: 'http://www.privol.gosnadzor.ru/',
		},
	];

	// Заявка уходит в lead-relay (см. LEAD_ENDPOINT выше). Сообщение о результате — прямо на
	// странице в role="status", а не alert(): скринридер объявит его сам (WCAG 4.1.3), текст
	// можно перечитать, и он не блокирует страницу модальным окном. Пока эндпоинт — плейсхолдер,
	// fetch всегда упадёт по сети, и сработает тот же честный фоллбэк, что был у демо-формы:
	// заявка не потеряется молча, будет явно сказано позвонить.
	let orderNotice = $state('');
	let orderSending = $state(false);

	async function submitOrder(e: SubmitEvent) {
		e.preventDefault();
		if (orderSending) return;
		const form = e.currentTarget as HTMLFormElement;
		const data = new FormData(form);

		// honeypot: поле "website" человек не видит и не заполняет (aria-hidden + вне таб-порядка),
		// боты обычно заполняют все поля формы. Заполненное поле = бот, и обработчик МОЛЧА
		// отбрасывает отправку: форма очищается и показывает ровно тот же ответ, что при успехе.
		// Сообщать боту, что он опознан, нельзя — иначе автор скрипта просто уберёт это поле
		// из списка заполняемых, и ловушка перестанет работать. Наружу не уходит ничего.
		if ((data.get('website') ?? '').toString().trim() !== '') {
			orderNotice = 'Заявка отправлена, мы перезвоним.';
			form.reset();
			return;
		}

		const payload = {
			site: 'kranrt',
			name: (data.get('name') ?? '').toString().trim(),
			phone: (data.get('phone') ?? '').toString().trim(),
			comment: (data.get('object') ?? '').toString().trim(),
			page: location.pathname,
		};

		orderSending = true;
		orderNotice = '';
		try {
			// ЗАЩИТА ОТ ОТПРАВКИ ТЕСТОВЫХ ЗАЯВОК В БОЕВОЙ ПРИЁМНИК.
			// Обработчик заявок пересылает заявку живому человеку в рабочий чат. Любая
			// проверка формы с локального dev-сервера доходила до него как настоящий лид:
			// так уже случилось трижды. Ниже запрос физически не уходит, если страница
			// открыта не на боевом домене. Вся остальная логика (статусы, разблокировка
			// кнопки, разбор ответа) работает как обычно — форму можно проверять, не мусоря
			// в чате. Молча: никакой отметки в консоли обёртка не оставляет.
			const leadRelayFetch = (url: string, init?: RequestInit): Promise<Response> => {
			  const h = typeof location !== 'undefined' ? location.hostname : '';
			  const isLocal =
			    /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/.test(h) ||
			    h.endsWith('.local') ||
			    (typeof location !== 'undefined' && location.protocol === 'file:');
			  if (isLocal) {
			    return Promise.resolve(
			      new Response(JSON.stringify({ ok: true, dryRun: true }), {
			        status: 200,
			        headers: { 'Content-Type': 'application/json' },
			      }),
			    );
			  }
			  return fetch(url, init);
			};
			const res = await leadRelayFetch(LEAD_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			const result = res.ok ? await res.json().catch(() => null) : null;
			if (!result || result.ok !== true) throw new Error('lead_relay_failed');
			orderNotice = 'Заявка отправлена, мы перезвоним.';
			form.reset();
		} catch {
			orderNotice = 'Заявка не отправлена, позвоните: +7 (969) 084-97-90';
		} finally {
			orderSending = false;
		}
	}

	// WebSite описывает сайт целиком — поэтому объявляется один раз, здесь, на главной, а не
	// на каждой странице из лейаута, как было раньше. publisher ссылается на тот же узел
	// организации, который лейаут выводит на всех страницах (#organization).
	const websiteLd = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': SITE + '/#website',
		name: 'KRAN-RT',
		url: SITE,
		inLanguage: 'ru-RU',
		publisher: { '@id': SITE + '/#organization' },
	};

	const faqLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a },
		})),
	};
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="{SITE}/" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	{@html `<script type="application/ld+json">${JSON.stringify(websiteLd)}<\/script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(faqLd)}<\/script>`}
</svelte:head>

<main>
	<!-- Первый экран — инструмент, а не витрина: заголовок, одна фраза контекста и сразу чек-лист.
	     Схемная иллюстрация крана справа (десктоп) / под чек-листом (мобильный) — то же самое
	     инженерно-схемное направление, что и выноски раздела #permit, никакой самостоятельной
	     идеи витрины она не несёт.

	     Волна 128: панель .open__panel — рамочный «терминал» с фоновым видео позади ВСЕЙ
	     секции (текст + иллюстрация), а не только позади иллюстрации.
	     .open__media держит постер как CSS background-image ПОД
	     видео всегда: это и есть reduced-motion-фоллбэк без единой строки JS (см. media-запрос
	     в конце styles этого файла). preload="none" — видео не тянет байты, пока страница не
	     решила его показать; браузер сам качает его по autoplay-политике при отрисовке. -->
	<section class="section wrap open" style="padding-block:clamp(28px,4vw,44px) 0">
		<div class="open__panel">
			<div class="open__media" aria-hidden="true">
				<video
					class="open__video"
					autoplay
					muted
					loop
					playsinline
					preload="none"
					poster="/images/hero/hero-refinery-poster.webp"
					aria-hidden="true"
					tabindex="-1"
				>
					<source src="/videos/hero-refinery.mp4" type="video/mp4" />
				</video>
				<div class="open__scrim"></div>
			</div>
			<!-- Регистрационные метки первого экрана. Отдельным слоем, а не классом на самой
			     панели: фон панели перекрыт слоем видео (.open__media, inset: 0), и метки,
			     нарисованные фоном панели, оказались бы под ним. Здесь они лежат НАД видео и
			     под контентом, не ловят указатель и не попадают в дерево доступности. -->
			<div class="open__marks marks" aria-hidden="true"></div>
			<div class="open__grid">
				<div class="open__col">
					<span class="eyebrow">Республика Татарстан · допуск техники на объект</span>
					<h1>Кран не останавливает цена. Его останавливает допуск</h1>

					<!-- Приборная сводка выезда. Стоит ВЫШЕ лида сознательно: на кадре 375×812 всё,
					     что уезжает ниже лида, уходит за сгиб, а именно эти две строки отвечают на
					     вопросы «что арендуем» и «за сколько». Обе цифры уже опубликованы на сайте:
					     16–150 т — метрика парка («от 16 до 150 т», /park/), 20 000 ₽ — нижняя цена
					     реестра парка (Клинцы КС-35719-7-02). Ничего нового не введено. -->
					<RigSummary
						art
						rows={[
							{ label: 'Парк', value: '16–150 т' },
							{ label: 'Смена 8 часов', value: 'от 20 000 ₽', strong: true },
						]}
						note="Цена — ориентир по независимым рыночным источникам, не наш фиксированный прайс:"
						noteHref="/park/"
						noteLink="разбор по трём моделям парка"
					/>

					<div class="open__tool">
						<DopuskWizard />
					</div>

					<!-- Волна 133 (мобильная). Лид переехал СЮДА, под инструмент, — тем же приёмом,
					     каким волна 132 увела вниз его вторую половину (.open__after). На кадре
					     375×812 он стоял между ценой и чек-листом и занимал шесть строк (семь на
					     320px): вместе с трёхстрочной оговоркой о цене это 9 строк серой прозы,
					     из-за которых первый вопрос визарда — то, что заголовок прямо обещает
					     («Ответьте на 2 вопроса») — начинался на 774-й точке, то есть целиком за
					     сгибом; теперь на 602-й. Текст не сокращён ни на слово: он объясняет обещание страницы,
					     а не несёт его, и на этом месте читается ровно так же. -->
					<p class="open__lead">
						На нефтехимии Нижнекамска, промплощадках Челнов и точках промысла под Альметьевском дату выезда определяет
						не тоннаж и не ставка за час, а то, оформлены ли наряд-допуск, инструктаж и пропуска.
					</p>

					<!-- Вторая половина прежнего лида. Не удалена — перенесена сюда, под инструмент.
					     Над чек-листом она стояла бы вплотную к его собственной подписи («Два
					     вопроса — и список того, что нужно оформить…»), то есть две почти
					     одинаковые фразы подряд; здесь она добавляет то, чего в подписи нет, —
					     «с основанием по каждому пункту», — и ведёт дальше, к полному списку. -->
					<p class="open__after">
						Ответьте на 2 вопроса — покажем, что нужно именно на вашем объекте, с основанием по каждому
						пункту. Нужен полный список со сроками и ссылками на нормы — он на отдельной странице:
						<a href="/dopusk/">чек-лист допуска, девять пунктов</a>.
					</p>
				</div>
				<div class="open__art">
					<HeroIllustration zoomed={paramsOpen} />
					<CraneParamPicker bind:open={paramsOpen} />
				</div>
			</div>
		</div>
		<!-- Подпись источника видео — по конвенции сайта (figcaption /park/, не через Sources:
		     тот привязан к дате проверки нормативных фактов, чужая семантика для атрибуции медиа). -->
		<p class="open__credit">
			Фон — ночной облёт нефтеперерабатывающего завода дроном, иллюстративное видео (не наш объект и не
			съёмка в Татарстане). Автор Tom Fisk, <a href="https://www.pexels.com/license/" target="_blank" rel="noopener"
				>Pexels License<span class="sr-only"> (откроется в новой вкладке)</span></a
			>, <a href="https://www.pexels.com/video/drone-footage-of-an-oil-refinery-at-night-10386895/" target="_blank" rel="noopener"
				>страница видео<span class="sr-only"> (откроется в новой вкладке)</span></a
			>.
		</p>
	</section>

	<section class="section wrap" id="obekty">
		<div class="section-head">
			<span class="eyebrow">Объекты</span>
			<h2>Четыре типа объектов — четыре набора документов</h2>
			<p>
				Один и тот же кран заходит на них по-разному. Разница не в технике, а в том, кто и по какому документу
				принимает решение о допуске.
			</p>
		</div>
		<ol class="kinds">
			{#each kinds as k (k.href)}
				<li>
					<a class="kind" href={k.href}>
						<span class="kind__code" aria-hidden="true">{k.code}</span>
						<span class="kind__body">
							<span class="kind__name">{k.name}</span>
							<span class="kind__key">{k.key}</span>
						</span>
					</a>
				</li>
			{/each}
		</ol>
	</section>

	<!-- Волна 129. Секция вынесена на вторую землю (.section--plane, фон --plane во всю ширину
	     окна с продолжением координатной сетки) и получила разрежённый ритм: это смысловой центр
	     сайта, и раньше он ничем не отличался от соседей — восемь секций подряд стояли на одном
	     фоне с одинаковым padding-block. Земля требует разметки «секция → .wrap внутри»,
	     иначе фон лёг бы только под колонку контента. -->
	<section class="section section--wide section--plane" id="permit">
		<div class="wrap">
		<div class="section-head">
			<span class="eyebrow">Промышленная безопасность</span>
			<h2>Наряд-допуск — то, что реже объясняют</h2>
		</div>

		<!-- Честная плашка метрик: продуктовые факты сайта, не выдуманный масштаб бизнеса.
		     Числа считаны из уже опубликованного контента, а не придуманы для витрины. -->
		<ul class="metrics marks" aria-label="Ключевые цифры сайта">
			{#each metrics as m (m.label)}
				<li class="metric">
					<p class="metric__value" role="img" aria-label="{m.value} — {m.label}">
						<span use:countUp aria-hidden="true">{m.value}</span>
					</p>
					<p class="metric__label">{m.label}</p>
					<p class="metric__detail">{m.detail}</p>
				</li>
			{/each}
			<li class="metric metric--date">
				<p class="metric__value metric__value--date">{CHECKED}</p>
				<p class="metric__label">норматив проверен</p>
				<p class="metric__detail">источники — внизу секции</p>
			</li>
		</ul>

		<!-- Терминальный индикатор статуса допуска: те же четыре объекта, что в реестре
		     #obekty выше, наглядно показывают, какой тип точки требует наряд-допуска. -->
		<div class="permit-status">
			<p class="permit-status__caption">Статус допуска по типу объекта</p>
			<PermitStatus items={kinds} />
		</div>

		<div class="prose">
			<p>
				Газоопасными считаются работы с риском выделения вредных веществ, взрывоопасных газов или снижения
				содержания кислорода ниже 20% по объёму. Определение привязано к месту и условиям, а не к типу техники:
				обычный автокран на обычном монтаже попадает под этот режим ровно так же, как специализированная машина,
				если точка работ находится во взрывопожароопасной или газоопасной зоне предприятия.
			</p>
			<p>
				Такие работы делятся на две группы: I проводятся с оформлением наряда-допуска, II — без наряда, но с
				обязательной регистрацией в журнале перед началом. Наряд выдаётся на каждое место и вид работ каждой
				бригаде и действует одну смену; продлить его можно не более чем на одну дневную рабочую смену, если
				объём и условия не изменились.</p>
			<p>Подписывает документ руководитель структурного подразделения,
				согласовывает аварийно-спасательная служба, утверждает руководитель эксплуатирующей организации.
			</p>
			<p>
				Для заявки на кран отсюда следует три практичных вывода. Первый: срок начала работ определяет не наличие
				машины, а готовность допуска. Второй: у многодневной работы будет несколько нарядов, и в акте имеет
				смысл ссылаться на их номера. Третий: ночную смену на газоопасной точке планировать нельзя — правила
				прямо не допускают такие работы в ночное время и во время грозы.
			</p>
		</div>
		<Sources items={sources} date={CHECKED} />
		</div>
	</section>

	<!-- Сжатый ритм: раздел форм продолжает мысль предыдущего (тот же документ, вид сбоку),
	     а не открывает новую тему — интервал перед ним должен это показывать. -->
	<section class="section section--tight wrap" id="formy">
		<div class="section-head">
			<span class="eyebrow">Формы</span>
			<h2>Разбор самих бланков</h2>
			<p>Слово «допуск» на площадке означает минимум три разных документа. Что чем является:</p>
		</div>
		<ul class="links">
			<li><a href="/formy/naryad-dopusk-blank/">Наряд-допуск: кто подписывает, сколько экземпляров, сколько живёт</a></li>
			<li><a href="/formy/naryad-i-propusk/">Наряд-допуск, наряд по охране труда и пропуск — три разных документа</a></li>
			<li><a href="/formy/oshibki-zapolneniya/">Семь ошибок, из-за которых наряд не работает</a></li>
			<li><a href="/formy/">Карта форм: приложения №1–5 к ФНП №528 и приложения к ФНП №531</a></li>
		</ul>
	</section>

	<!-- Разрежённый ритм: смена темы с документов на географию. -->
	<section class="section section--wide wrap" id="geo">
		<div class="section-head">
			<span class="eyebrow">География</span>
			<h2>Города и их режимы</h2>
			<p>
				Республика вытянута на 460 км с запада на восток и живёт тремя промышленными полюсами. Адрес мы
				спрашиваем раньше тоннажа — он определяет и логистику, и набор документов.
			</p>
		</div>
		<ul class="cities">
			{#each cities as c (c.href)}
				<li>
					<a href={c.href}><b>{c.name}</b><span>{c.tag}</span></a>
				</li>
			{/each}
		</ul>
	</section>

	<section class="section section--tight wrap" id="faq">
		<div class="section-head">
			<span class="eyebrow">Вопросы</span>
			<h2>Частые вопросы</h2>
		</div>
		<div class="faq" style="max-width:820px">
			{#each faqs as f (f.q)}
				<details class="faq__item">
					<summary>{f.q}</summary>
					<p>{f.a}</p>
				</details>
			{/each}
		</div>
	</section>

	<!-- Волна 128, часть B — витрина трёх классов парка со схемными карточками и 3D-наклоном
	     при наведении (mousemove/mouseleave, ±8°, use:tilt). Новый элемент разметки — не
	     трогает терминальный маркер «>» на .kind/.links/.cities выше. Полный разбор каждой
	     модели — на /park/, здесь три карточки — сжатая витрина перед заявкой: порядок
	     хвоста главной «норма → техника → заявка». -->
	<section class="section section--plane" id="fleet-teaser">
		<div class="wrap">
		<div class="section-head">
			<span class="eyebrow">Парк техники</span>
			<h2>Три класса — под три типа площадки</h2>
			<p>Схема, не фото: свободно лицензированных снимков именно этих моделей не нашлось (см. подпись на /park/).</p>
		</div>
		<ul class="fleet-tilt">
			{#each fleetTeaser as f (f.href)}
				<li>
					<a class="fleet-tilt__card" href={f.href} use:tilt>
						<span class="fleet-tilt__icon" aria-hidden="true">
							{#if f.shape === 'light'}
								<svg viewBox="0 0 96 64" focusable="false">
									<rect x="10" y="40" width="46" height="14" rx="2" class="ft__body" />
									<circle cx="22" cy="56" r="7" class="ft__wheel" />
									<circle cx="44" cy="56" r="7" class="ft__wheel" />
									<line x1="30" y1="40" x2="80" y2="14" class="ft__boom" />
									<line x1="80" y1="14" x2="80" y2="30" class="ft__cable" />
								</svg>
							{:else if f.shape === 'heavy'}
								<svg viewBox="0 0 96 64" focusable="false">
									<rect x="6" y="36" width="58" height="16" rx="2" class="ft__body" />
									<rect x="52" y="24" width="14" height="16" class="ft__counter" />
									<circle cx="18" cy="56" r="7" class="ft__wheel" />
									<circle cx="34" cy="56" r="7" class="ft__wheel" />
									<circle cx="52" cy="56" r="7" class="ft__wheel" />
									<line x1="40" y1="36" x2="86" y2="8" class="ft__boom" />
									<line x1="86" y1="8" x2="86" y2="26" class="ft__cable" />
								</svg>
							{:else}
								<svg viewBox="0 0 96 64" focusable="false">
									<rect x="10" y="44" width="40" height="8" class="ft__track" />
									<line x1="10" y1="44" x2="10" y2="52" class="ft__track" />
									<line x1="50" y1="44" x2="50" y2="52" class="ft__track" />
									<rect x="18" y="30" width="20" height="14" rx="2" class="ft__body" />
									<line x1="30" y1="30" x2="70" y2="6" class="ft__boom" />
									<line x1="70" y1="6" x2="70" y2="22" class="ft__cable" />
								</svg>
							{/if}
						</span>
						<span class="fleet-tilt__code" aria-hidden="true">{f.code}</span>
						<span class="fleet-tilt__name">{f.name}</span>
						<span class="fleet-tilt__stat">{f.stat}</span>
						<span class="fleet-tilt__key">{f.key}</span>
					</a>
				</li>
			{/each}
		</ul>
		</div>
	</section>

	<section class="section section--wide wrap" id="order">
		<div class="section-head">
			<span class="eyebrow">Заявка</span>
			<h2>Оставить заявку</h2>
			<p>Назовите адрес и тип объекта — вернёмся со списком того, что нужно оформить, и реалистичным сроком.</p>
		</div>
		<!-- Подписи полей видимые, а не только placeholder: placeholder исчезает при вводе, и
		     человек перестаёт понимать, что он заполняет (WCAG 3.3.2 + когнитивная доступность).
		     autocomplete — WCAG 1.3.5 Identify input purpose. -->
		<form class="order-form" onsubmit={submitOrder}>
			<div class="field">
				<label for="order-name">Ваше имя / компания</label>
				<input type="text" id="order-name" name="name" autocomplete="name" />
			</div>
			<div class="field">
				<label for="order-phone"
					>Телефон <span aria-hidden="true">*</span><span class="sr-only">, обязательное поле</span></label
				>
				<input type="tel" id="order-phone" name="phone" autocomplete="tel" required aria-describedby="order-phone-hint" />
				<p id="order-phone-hint" class="field__hint">
					Например: +7 900 123-45-67. Перезвоним по нему в течение рабочего дня.
				</p>
			</div>
			<div class="field">
				<label for="order-object">Объект / предприятие</label>
				<input type="text" id="order-object" name="object" autocomplete="organization" />
			</div>
			<!-- Honeypot: обычное человекочитаемое поле для бота, скрытое от людей — визуально
			     (.sr-only) и из вспомогательных технологий (aria-hidden + tabindex="-1"), но
			     остаётся в DOM и в FormData, поэтому автозаполнение форм ботами его находит.
			     Настоящий пользователь никогда его не увидит и не заполнит. -->
			<div class="field sr-only" aria-hidden="true">
				<label for="order-website">Сайт компании</label>
				<input type="text" id="order-website" name="website" tabindex="-1" autocomplete="off" />
			</div>
			<!-- Согласие на обработку ПД. Чекбокс обязателен (required) и НЕ предзаполнен: заранее
			     проставленная отметка не является согласием, данным свободно и однозначно. Рядом
			     ДВЕ раздельные ссылки — на согласие и на политику: с 01.09.2025 это два разных
			     документа, и одной ссылкой «политика и согласие» их подменять нельзя. -->
			<label class="consent">
				<input type="checkbox" name="consent" required />
				<span>
					Даю <a href="/soglasie-na-obrabotku-personalnyh-dannyh/">согласие на обработку персональных
						данных</a
					>
					и ознакомлен с
					<a href="/politika-obrabotki-personalnyh-dannyh/">политикой обработки персональных данных</a>
				</span>
			</label>
			<button class="btn" type="submit" disabled={orderSending}>
				{orderSending ? 'Отправляем…' : 'Отправить заявку →'}
			</button>
		</form>
		<!-- Live-регион присутствует в DOM всегда (пустой), иначе скринридер не объявит текст,
		     появившийся вместе с самим контейнером. Пустой — нулевой высоты, вёрстку не двигает. -->
		<div class="order-notice" role="status">
			{#if orderNotice}<p>{orderNotice}</p>{/if}
		</div>
	</section>
</main>

<style>
	/* Волна 128 — рамочная панель первого экрана: видео позади ВСЕЙ секции (текст +
	   иллюстрация), но НЕ full-bleed на весь вьюпорт: edge-to-edge
	   сломал бы уже устоявшийся язык сайта «контент внутри обведённых панелей»
	   (.open__art/.hub__art/.metrics и т.д.). border-color чуть ярче обычного (--accent при
	   малой непрозрачности через var(--line-strong) недостаточно контрастен на видео) —
	   тонкая зелёная рамка читается как «экран терминала», а не случайная обводка. */
	.open__panel {
		position: relative;
		overflow: hidden;
		border: 1px solid var(--line-strong);
		background: var(--surface);
		padding: clamp(20px, 4vw, 40px);
	}
	.open__media {
		position: absolute;
		inset: 0;
		z-index: 0;
		/* Постер как CSS background-image лежит ПОД видео всегда — это и есть
		   reduced-motion-фоллбэк без единой строки JS: медиа-запрос ниже прячет только
		   <video>, фон панели остаётся кадром завода.
		   Два объявления подряд — это и есть согласование формата: браузер без image-set()
		   останавливается на первой строке и берёт JPEG, браузер с поддержкой перезаписывает
		   её WebP (−34% веса). Атрибут poster у <video> формата не согласует вовсе, поэтому
		   там указан сразу WebP: если он не поддерживается, постер просто не отрисуется, а
		   под видео и так лежит этот же кадр в JPEG. */
		background: url('/images/hero/hero-refinery-poster.jpg') center / cover no-repeat;
		background-image: image-set(
			url('/images/hero/hero-refinery-poster.webp') type('image/webp'),
			url('/images/hero/hero-refinery-poster.jpg') type('image/jpeg')
		);
	}
	.open__video {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.open__scrim {
		position: absolute;
		inset: 0;
		/* Темнее слева, где текст (WCAG 1.4.3 на белом/светлом ink поверх видео), светлее
		   справа, где схемная SVG-иллюстрация и так читается на почти любом фоне.
		   Диагональ, а не равномерная заливка: равномерная погасила бы и сам кадр. */
		background: linear-gradient(
			100deg,
			rgba(10, 15, 12, 0.92) 0%,
			rgba(10, 15, 12, 0.86) 38%,
			rgba(10, 15, 12, 0.55) 68%,
			rgba(10, 15, 12, 0.3) 100%
		);
	}
	/* Мобильная затемняющая подложка. Диагональный градиент выше рассчитан на ДВЕ колонки:
	   темно слева, где текст, светло справа, где схемная SVG. На телефоне колонка одна и
	   занимает всю ширину панели — правые 30 % затемнения оказывались ПОД текстом, и серая
	   проза (--muted, .open__after) ложилась на светлое пятно завода: на кадре 375×812
	   строка «Нужен полный список со сроками…» читалась поверх освещённой колонны установки.
	   На мобильном подложка вертикальная: вверху, где кран и h1 (--ink), видео ещё живёт,
	   ниже — почти сплошная земля под мелкий и серый набор. */
	@media (max-width: 760px) {
		.open__scrim {
			background: linear-gradient(
				180deg,
				rgba(10, 15, 12, 0.82) 0%,
				rgba(10, 15, 12, 0.93) 34%,
				rgba(10, 15, 12, 0.96) 100%
			);
		}
	}
	.open__marks {
		position: absolute;
		inset: 9px;
		z-index: 1;
		pointer-events: none;
		--mkc: var(--line-strong);
		--mk: 16px;
	}
	.open__grid {
		position: relative;
		z-index: 2;
		display: grid;
		gap: clamp(28px, 4vw, 48px);
		align-items: start;
	}
	.open__credit {
		margin-top: 10px;
		max-width: 74ch;
		font-size: var(--fs-1);
		line-height: 1.5;
		color: var(--muted);
	}
	.open__credit a {
		color: var(--muted);
		text-underline-offset: 2px;
	}
	.open__credit a:hover {
		color: var(--accent);
	}
	.open__art {
		border: 1px solid var(--line);
		background: var(--surface);
	}
	@media (min-width: 900px) {
		.open__grid {
			grid-template-columns: 1.15fr 0.85fr;
		}
		.open__art {
			margin-top: 4px;
		}
	}

	.open h1 {
		font-size: clamp(1.6rem, 3.6vw, 2.4rem);
		margin-top: 14px;
		max-width: 24ch;
	}
	/* Волна 133. На 320px тот же кегль давал заголовку ПЯТЬ строк (151px), на 360px — четыре:
	   clamp упирается в нижнюю границу 1.6rem и ниже 420px уже не реагирует на ширину, хотя
	   именно там колонка сжимается сильнее всего. Ступенька вниз только на самых узких
	   экранах — заголовок держится в четырёх строках на 360 и на 320, а на 375+ кегль
	   прежний, там пересчитывать нечего. */
	@media (max-width: 365px) {
		.open h1 {
			font-size: 1.42rem;
		}
	}
	/* Лид стоит ПОД инструментом (см. разметку): он объясняет обещание страницы, а не несёт
	   его. Отступ сверху равен отступу самого инструмента — визард и текст под ним читаются
	   как две ступени одного блока, а не как слипшаяся пара. */
	.open__lead {
		margin-top: clamp(22px, 3vw, 30px);
		max-width: 68ch;
		color: var(--ink-2);
		font-size: var(--fs-5);
		line-height: 1.65;
	}
	/* На телефоне лид набирается на ступень ниже (--fs-4 против --fs-5): под инструментом
	   он идёт в паре с ещё более мелким .open__after, и одинаковая с h1-колонкой ширина
	   при крупном кегле давала бы два почти одинаковых по весу абзаца подряд. */
	@media (max-width: 760px) {
		.open__lead {
			font-size: var(--fs-4);
			line-height: 1.62;
		}
	}
	.open__tool {
		margin-top: clamp(24px, 3vw, 34px);
		max-width: 720px;
	}
	.open__after {
		margin-top: 18px;
		max-width: 68ch;
		font-size: var(--fs-3);
		color: var(--muted);
	}
	.open__after a {
		color: var(--accent);
	}

	/* Типы объектов — строки описи, ссылкой является вся строка. Ни карточек, ни наклона,
	   ни блика: язык раздела допуска — документ, а не витрина. Активная строка обозначается
	   терминальным маркером «>» слева (волна 19) — гутер под него зарезервирован всегда,
	   поэтому появление маркера не двигает соседний текст (0 CLS). */
	.kinds {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--line-strong);
		max-width: 900px;
	}
	.kinds li {
		border-bottom: 1px solid var(--line);
	}
	.kinds li:last-child {
		border-bottom: 1px solid var(--line-strong);
	}
	.kind {
		position: relative;
		display: grid;
		grid-template-columns: 44px 1fr;
		gap: 4px 16px;
		align-items: start;
		padding: 18px 8px 18px 18px;
		text-decoration: none;
		transition: background-color 0.16s ease;
	}
	.kind::before {
		content: '>';
		position: absolute;
		left: 0;
		top: 18px;
		font-family: var(--mono);
		font-weight: 700;
		color: var(--accent);
		opacity: 0;
		transition: opacity 0.16s ease;
	}
	.kind:hover::before,
	.kind:focus-visible::before {
		opacity: 1;
	}
	.kind:hover {
		background: var(--surface);
	}
	.kind:hover .kind__name {
		color: var(--accent);
	}
	.kind__code {
		font-family: var(--mono);
		font-size: var(--fs-6);
		font-weight: 700;
		color: var(--accent);
		border-right: 1px solid var(--line-strong);
		padding-right: 12px;
		line-height: 1.45;
	}
	.kind__body {
		display: grid;
		gap: 5px;
		min-width: 0;
	}
	.kind__name {
		font-family: var(--mono);
		font-weight: 700;
		font-size: var(--fs-5);
		line-height: 1.35;
		transition: color 0.16s ease;
	}
	.kind__key {
		font-size: var(--fs-3);
		line-height: 1.5;
		color: var(--muted);
	}

	.links {
		list-style: none;
		margin: 0;
		padding: 0;
		max-width: 820px;
		display: grid;
	}
	.links li {
		border-bottom: 1px solid var(--line);
	}
	.links li:first-child {
		border-top: 1px solid var(--line-strong);
	}
	.links li:last-child {
		border-bottom: 1px solid var(--line-strong);
	}
	.links a {
		position: relative;
		display: flex;
		align-items: center;
		min-height: 52px;
		padding: 10px 0 10px 18px;
		font-family: var(--mono);
		font-size: var(--fs-4);
		font-weight: 600;
		line-height: 1.45;
		text-decoration: none;
	}
	.links a::before {
		content: '>';
		position: absolute;
		left: 0;
		font-weight: 700;
		color: var(--accent);
		opacity: 0;
		transition: opacity 0.16s ease;
	}
	.links a:hover::before,
	.links a:focus-visible::before {
		opacity: 1;
	}
	.links a:hover {
		color: var(--accent);
	}

	/* ВЫЕЗД ЗА КРАЙ ЭКРАНА НА 320px — замерено до правки: scrollWidth 317 при clientWidth 305,
	   вся страница ездила вбок на 12px. Причина не в max-width и не в паддингах: `1fr` это
	   `minmax(auto, 1fr)`, а `auto` не даёт колонке стать уже своего min-content. Min-content
	   ячейки — самое длинное неразрывное слово («Набережные») моноширинным кеглем плюс 46px
	   внутренних полей, и этого хватало, чтобы две колонки перестали помещаться в 269px
	   доступной ширины. minmax(0, 1fr) снимает нижний порог: колонка получает право сжаться,
	   а перенос внутри слова разрешён отдельно на самой ссылке. Тот же класс дефекта, что
	   auto-fill minmax(260px, 1fr) — сетка, которая физически не умеет быть уже своего минимума. */
	.cities {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1px;
		background: var(--line-strong);
		border: 1px solid var(--line-strong);
		max-width: 900px;
	}
	.cities a {
		position: relative;
		display: grid;
		gap: 4px;
		min-width: 0;
		overflow-wrap: break-word;
		background: var(--bg);
		padding: 18px 16px 18px 30px;
		min-height: 84px;
		align-content: center;
		text-decoration: none;
		transition: background-color 0.16s ease;
	}
	.cities a::before {
		content: '>';
		position: absolute;
		left: 14px;
		top: 18px;
		font-family: var(--mono);
		font-weight: 700;
		color: var(--accent);
		opacity: 0;
		transition: opacity 0.16s ease;
	}
	.cities a:hover::before,
	.cities a:focus-visible::before {
		opacity: 1;
	}
	.cities a:hover {
		background: var(--surface);
	}
	.cities b {
		font-family: var(--mono);
		font-size: var(--fs-5);
	}
	.cities span {
		font-size: var(--fs-2);
		color: var(--muted);
		line-height: 1.4;
	}
	.cities a:hover b {
		color: var(--accent);
	}
	@media (max-width: 760px) {
		.cities {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	/* Ниже 420px две колонки перестают быть колонками: на 320px в ячейке остаётся 88px
	   под название, а «Набережные» моноширинным кеглем занимает 100px и рвётся посередине
	   слова. Ломать топоним переносом хуже, чем поставить города в столбик. */
	@media (max-width: 420px) {
		.cities {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	.order-form {
		display: grid;
		gap: 16px;
		max-width: 420px;
	}
	.field {
		display: grid;
		gap: 6px;
	}
	.field label {
		font-family: var(--mono);
		font-size: var(--fs-2);
		font-weight: 600;
		color: var(--muted);
		letter-spacing: 0.03em;
	}
	.field__hint {
		font-size: var(--fs-1);
		color: var(--muted);
	}
	/* граница поля — единственное, по чему поле опознаётся как поле → WCAG 1.4.11, ≥3:1;
	   min-height 46px — тап-таргет по WCAG 2.5.5 */
	.order-form input {
		background: var(--screen);
		border: 1px solid var(--line-strong);
		color: var(--ink);
		padding: 12px 14px;
		min-height: 46px;
		font-family: inherit;
		font-size: var(--fs-5);
		transition: border-color 0.16s ease, box-shadow 0.16s ease;
	}
	.order-form input:hover {
		border-color: var(--accent);
	}
	/* ── Состояние ошибки поля ─────────────────────────────────────────────────
	   Раньше его не было вовсе: телефон обязателен, и единственным сообщением об ошибке
	   был всплывающий пузырь браузера — он исчезает через несколько секунд, не читается
	   скринридером как часть формы и не оставляет на поле никакого следа. :user-invalid
	   (в отличие от :invalid) срабатывает только ПОСЛЕ того, как человек поле трогал, —
	   пустая форма при загрузке не краснеет. Признак не только цветовой: рядом с рамкой
	   появляется подпись (см. .field__hint ниже), поэтому требование 1.4.1 «не только цветом»
	   выполняется. Браузер без поддержки :user-invalid просто не покажет подсветку —
	   поведение остаётся прежним, ничего не ломается. */
	.order-form input:user-invalid {
		border-color: #FF9A6B;
		/* Второй признак — толщина рамки, а не только её цвет: 1.4.1 не разрешает нести
		   смысл одним цветом. Третий — подпись под полем ниже. */
		box-shadow: inset 0 0 0 1px #FF9A6B;
	}
	.order-form .field:has(input:user-invalid) .field__hint {
		color: #FF9A6B;
	}
	.order-form .field:has(input:user-invalid)::after {
		content: 'Без номера мы не сможем перезвонить.';
		font-size: var(--fs-2);
		line-height: 1.45;
		color: #FF9A6B;
	}
	@media (prefers-reduced-motion: reduce) {
		.order-form input {
			transition: none;
		}
	}
	.order-form .btn {
		justify-self: start;
		min-height: 46px;
	}
	.order-form .btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	/* Согласие на обработку ПД. Обёрнуто в <label>, поэтому кликается вся строка, а не
	   квадрат 18px — доступное имя чекбоксу даёт сам текст рядом.
	   Правила .order-form input выше (min-height 46px, padding, рамка) написаны под текстовые
	   поля и на чекбоксе дали бы растянутый прямоугольник — здесь они сбрасываются точечно. */
	.consent {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		max-width: 420px;
		font-size: var(--fs-3);
		line-height: 1.5;
		color: var(--muted);
		cursor: pointer;
	}
	.order-form .consent input {
		flex-shrink: 0;
		width: 18px;
		height: 18px;
		min-height: 0;
		margin: 2px 0 0;
		padding: 0;
		border: none;
		accent-color: var(--accent);
		cursor: pointer;
	}
	.consent a {
		color: var(--ink);
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.consent a:hover {
		color: var(--accent);
	}
	/* Ответ формы. Та же правка, что у предупреждения в калькуляторе: вместо цветной полосы
	   слева (общее место всех сгенерированных плашек) — обведённая строка терминала с
	   маркером «>», то есть словарь этого сайта. */
	.order-notice p {
		position: relative;
		margin-top: 16px;
		max-width: 420px;
		font-size: var(--fs-3);
		line-height: 1.5;
		color: var(--ink);
		background: var(--screen);
		border: 1px solid var(--accent);
		padding: 12px 14px 12px 34px;
	}
	.order-notice p::before {
		content: '>';
		position: absolute;
		left: 14px;
		top: 12px;
		font-family: var(--mono);
		font-weight: 700;
		color: var(--accent);
	}
	@supports (content: 'x' / 'y') {
		.order-notice p::before {
			content: '>' / '';
		}
	}

	/* Волна 129: определение плашки цифр переехало в lib/app.css — она была продублирована
	   здесь и на /park/, и копии уже разошлись. Здесь остаётся только местное отличие:
	   третья ячейка — не счёт, а дата проверки нормативов, и она набирается младшим кеглем. */
	/* Дата — тоже цифра, но другого рода (отметка времени, а не счёт), поэтому она заведомо
	   младше счётных. Но и не подпись: между 52.8px счётной цифры и 17.9px прежнего --fs-6
	   разрыв был такой, что третья ячейка выглядела сломанной. 1.8rem = 28.8px — явно младше
	   и явно цифра. Проверено по ширине: 10 знаков PT Mono (шаг 0.6em при size-adjust 104%)
	   при 20.8px нижней границы clamp занимают 130px из 219px, доступных в ячейке на 320px. */
	.metric__value--date {
		font-size: clamp(1.3rem, 3.2vw, 1.8rem);
		-webkit-text-stroke: 0;
	}

	/* Терминальный индикатор статуса допуска (PermitStatus.svelte). */
	.permit-status {
		margin-top: clamp(24px, 3vw, 32px);
		display: grid;
		gap: 10px;
		max-width: 620px;
	}
	.permit-status__caption {
		font-family: var(--mono);
		font-size: var(--fs-2);
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.prose {
		margin-top: clamp(24px, 3vw, 32px);
	}

	/* Волна 128, часть B — карточки классов парка с 3D-наклоном (use:tilt в lib/tilt.ts).
	   perspective на самой карточке (не на .fleet-tilt), иначе соседние карточки в одной
	   grid-строке "тянут" перспективу друг друга при наклоне. --tilt-x/--tilt-y выставляет
	   JS на pointermove, дефолт 0deg — до JS и при prefers-reduced-motion карточка плоская. */
	.fleet-tilt {
		list-style: none;
		margin: clamp(24px, 3vw, 32px) 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
		gap: 16px;
		max-width: 900px;
	}
	/* Волна 129 — карточка класса техники перестала быть прямоугольником с рамкой 1px (четвёртой
	   такой же подряд на странице) и стала прибором с двумя планами: обойма --surface (металл,
	   3px) и вставленный в неё экран --screen. Шильдик слева — рейка, которая при наведении
	   заливается акцентом; это и есть индикатор «выбрано», а не подсветка всей рамки.
	   Регистрационные метки карточкам сознательно НЕ ставятся: они уже работают на первом экране
	   и на плашке цифр, и третье повторение превратило бы найденный приём в обои. */
	.fleet-tilt__card {
		--tilt-x: 0deg;
		--tilt-y: 0deg;
		--rail: var(--line-strong);
		display: grid;
		gap: 10px;
		position: relative;
		isolation: isolate;
		border: 1px solid var(--line-strong);
		background: var(--surface);
		padding: 23px 21px 23px 18px;
		text-decoration: none;
		box-shadow: var(--lift);
		transform: perspective(800px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
		transition: transform 0.08s linear, border-color 0.16s ease, box-shadow 0.16s ease;
		will-change: transform;
	}
	/* Экран: вставка внутрь обоймы. Отдельным слоем, а не вторым узлом разметки — карточка
	   остаётся одной ссылкой, без обёрток ради вида. */
	.fleet-tilt__card::after {
		content: '';
		position: absolute;
		inset: 3px 3px 3px 8px;
		z-index: -1;
		background: var(--screen);
		border: 1px solid var(--line);
	}
	/* Рейка-шильдик по левому краю обоймы. */
	.fleet-tilt__card::before {
		content: '';
		position: absolute;
		left: 3px;
		top: 3px;
		bottom: 3px;
		width: 2px;
		z-index: -1;
		background: var(--rail);
		transition: background-color 0.16s ease;
	}
	.fleet-tilt__card:hover,
	.fleet-tilt__card:focus-visible {
		--rail: var(--accent);
		border-color: var(--accent);
		box-shadow: var(--lift), var(--glow);
	}
	/* Нажатие: карточка «садится» в обойму — тень уходит, рейка темнеет. */
	.fleet-tilt__card:active {
		--rail: var(--accent-deep);
		box-shadow: none;
		transform: perspective(800px) translateY(1px);
	}
	.fleet-tilt__icon {
		width: 72px;
		height: 48px;
	}
	.fleet-tilt__icon svg {
		width: 100%;
		height: 100%;
		overflow: visible;
	}
	.ft__body,
	.ft__counter {
		fill: var(--bg);
		stroke: var(--line-strong);
		stroke-width: 2;
	}
	.ft__wheel {
		fill: var(--bg);
		stroke: var(--line-strong);
		stroke-width: 2;
	}
	.ft__boom {
		stroke: var(--accent);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.ft__cable {
		stroke: var(--muted);
		stroke-width: 1.5;
		stroke-dasharray: 2 3;
	}
	.ft__track {
		stroke: var(--line-strong);
		stroke-width: 3;
		fill: none;
	}
	.fleet-tilt__code {
		position: absolute;
		top: 16px;
		right: 18px;
		font-family: var(--mono);
		font-weight: 700;
		font-size: var(--fs-4);
		color: var(--accent);
	}
	.fleet-tilt__name {
		font-family: var(--mono);
		font-weight: 700;
		font-size: var(--fs-4);
		line-height: 1.3;
	}
	.fleet-tilt__stat {
		font-family: var(--mono);
		font-weight: 700;
		font-size: var(--fs-7);
		color: var(--accent);
	}
	.fleet-tilt__key {
		font-size: var(--fs-2);
		line-height: 1.5;
		color: var(--muted);
	}

	@media (max-width: 720px) {
		.kind {
			grid-template-columns: 34px 1fr;
		}
		.kind__code {
			padding-right: 10px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.kind,
		.kind::before,
		.kind__name,
		.links a::before,
		.cities a,
		.cities a::before {
			transition: none;
		}
		/* Видео скрыто — .open__media остаётся под ним со своим CSS background-image
		   постером, поэтому картинка не пропадает, просто перестаёт двигаться. Один селектор,
		   без JS: lib/tilt.ts тоже сам проверяет prefers-reduced-motion и не навешивает
		   слушатели, .fleet-tilt__card транзишен глушится здесь на случай, если пользователь
		   переключил настройку уже после монтирования (watchReducedMotion сбрасывает
		   --tilt-x/--tilt-y в 0deg, но текущий кадр transition мог быть в процессе). */
		.open__video {
			display: none;
		}
		.fleet-tilt__card {
			transition: none;
		}
	}

	/* Декоративные маркеры «>» на hover/focus не должны попадать в озвучку скринридера —
	   тот же приём, что уже установлен в app.css для .faq__item summary::after. */
	@supports (content: 'x' / 'y') {
		.kind::before,
		.links a::before,
		.cities a::before {
			content: '>' / '';
		}
	}
</style>
