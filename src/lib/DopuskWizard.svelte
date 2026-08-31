<script lang="ts">
	/*
	 * Чек-лист допуска — главный инструмент сайта (волна 16).
	 *
	 * Раньше здесь стоял ценовой визард «тоннаж → тип объекта → цена». Он отвечал на вопрос
	 * «сколько стоит час», на который на этом рынке отвечают все. Реальный стопор в Нижнекамске
	 * и Альметьевске другой: технику не пускают на объект, пока не оформлены допуск и наряд.
	 * Поэтому движок сохранён (пошаговый выбор, прогресс, live-регион, возврат назад), а вопросы
	 * и выдача переписаны: на выходе — список того, ЧТО НУЖНО ОФОРМИТЬ, с основанием по каждому
	 * пункту. Расчёт стоимости никуда не делся, но ушёл вторым, свёрнутым блоком: ставка × смена
	 * считается ровно так же, как считалась (проверенная арифметика не тронута).
	 */

	type Req = {
		what: string;
		basis: string;
		who: string;
	};

	type Zone = {
		value: string;
		label: string;
		note?: string;
		reqs: Req[];
		href: string;
		hrefLabel: string;
	};

	// Ставки и формула — без изменений с прошлых волн: ставка за час × 8-часовая смена.
	const classes = [
		{ value: '20', label: '16–25 т', rate: 2500 },
		{ value: '40', label: '25–50 т', rate: 4000 },
		{ value: '100', label: '50–200 т', rate: 7000 },
	];

	const zones: Zone[] = [
		{
			value: 'gaz',
			label: 'Взрывопожароопасная или газоопасная зона действующего производства',
			note: 'Территория нефтехимии Нижнекамска — типовой случай.',
			href: '/obekty-opo/gazoopasnaya-zona/',
			hrefLabel: 'Полный разбор: газоопасная зона',
			reqs: [
				{
					what: 'Отнесение работы к I или II группе газоопасных работ',
					basis: 'п. 12 и перечень газоопасных работ (п. 16) ФНП, утв. приказом Ростехнадзора №528',
					who: 'Руководитель эксплуатирующей организации',
				},
				{
					what: 'Наряд-допуск на проведение газоопасных работ (для I группы)',
					basis: 'приложение №2 к ФНП №528; на сетях газораспределения — приложение №1 к ФНП №531',
					who: 'Подписывает руководитель подразделения, согласовывает ПАСС(Ф), утверждает руководитель организации',
				},
				{
					what: 'Целевой инструктаж по охране труда до начала работ',
					basis: 'п. 19 Правил, утв. постановлением Правительства РФ №2464',
					who: 'Предприятие-заказчик, с записью в наряде-допуске',
				},
				{
					what: 'СИЗ и бригада не менее двух человек',
					basis: 'п. 37 ФНП №528',
					who: 'Подрядчик — по условиям, вписанным в наряд',
				},
				{
					what: 'Окно работ: рабочий день, дневная смена',
					basis: 'запрет на ночное время и грозу, ФНП №528',
					who: 'Учитывается при согласовании даты, а не в день выезда',
				},
				{
					what: 'Искрогаситель на выхлопе техники с ДВС',
					basis: 'условие службы промышленной безопасности площадки',
					who: 'Подрядчик — проверяем на этапе подбора машины',
				},
			],
		},
		{
			value: 'prom',
			label: 'Промплощадка предприятия вне газоопасной зоны',
			note: 'Автопром Набережных Челнов, цеховой монтаж, склады.',
			href: '/obekty-opo/promploshchadka/',
			hrefLabel: 'Полный разбор: промплощадка',
			reqs: [
				{
					what: 'Письменное подтверждение, что точка работ не отнесена к газоопасным',
					basis: 'перечень газоопасных работ предприятия, п. 16 ФНП №528',
					who: 'Служба промышленной безопасности предприятия',
				},
				{
					what: 'Внутренний допуск подрядчика и вводный инструктаж',
					basis: 'внутренний регламент предприятия, публичной формы нет',
					who: 'Служба охраны труда предприятия',
				},
				{
					what: 'Пропуск на технику и людей',
					basis: 'пропускной режим предприятия',
					who: 'Бюро пропусков заказчика — по списку от нас',
				},
				{
					what: 'Целевой инструктаж, если работа отнесена к повышенной опасности',
					basis: 'п. 19 Правил, утв. постановлением Правительства РФ №2464',
					who: 'Предприятие-заказчик',
				},
			],
		},
		{
			value: 'promysel',
			label: 'Промысловый объект добычи (куст скважин, площадка на месторождении)',
			note: 'Альметьевское направление, юго-восток республики.',
			href: '/obekty-opo/promysel/',
			hrefLabel: 'Полный разбор: промысел',
			reqs: [
				{
					what: 'Допуск на конкретную точку промысла',
					basis: 'регламент организации, эксплуатирующей участок; единого стандарта на месторождение нет',
					who: 'Эксплуатирующая организация',
				},
				{
					what: 'Согласование маршрута подачи техники',
					basis: 'внутрипромысловые дороги и переезды принадлежат эксплуатирующей организации',
					who: 'Совместно — мы и диспетчер площадки',
				},
				{
					what: 'Подтверждение площадки под выносные опоры',
					basis: 'требование эксплуатирующей организации к планировке точки',
					who: 'Заказчик — до выезда, не по факту прибытия',
				},
				{
					what: 'Наряд-допуск, если точка отнесена к газоопасным',
					basis: 'приложение №2 к ФНП №528',
					who: 'Эксплуатирующая организация',
				},
			],
		},
		{
			value: 'city',
			label: 'Обычная стройплощадка или городской объект',
			note: 'Казань, жилая и коммерческая стройка по республике.',
			href: '/obekty-opo/obychnaya-stroyka/',
			hrefLabel: 'Полный разбор: обычная стройка',
			reqs: [
				{
					what: 'Сверх федерального пакета — ничего',
					basis: 'документы на технику и оператора обязательны на любом объекте',
					who: 'Подрядчик',
				},
				{
					what: 'Проверка адреса по границам зон охраны — только для исторической части Казани',
					basis: 'приказ Минкультуры России №1311 от 11.05.2023 (ред. 15.12.2023)',
					who: 'Мы — до подтверждения заявки',
				},
				{
					what: 'Апрельское ограничение 6 т на ось — при подаче между городами',
					basis: 'постановление КМ РТ №237 от 19.03.2026, порядок — №372 от 31.05.2013',
					who: 'Учитывается при выборе машины и даты',
				},
			],
		},
	];

	const timings = [
		{ value: 'day', label: 'Рабочий день, дневная смена' },
		{ value: 'offhours', label: 'Вечер, ночь или выходной' },
	];

	let step = $state(1);
	let zone = $state<string | null>(null);
	let timing = $state<string | null>(null);
	let cls = $state<string | null>(null);

	// Контейнер шага (см. bind:this ниже) переживает смену step — меняется только его
	// содержимое ({#if step === 1}/{:else if …}). Кнопка, на которую был нажат клик,
	// наоборот, всякий раз размонтируется вместе со старым шагом, и без явного переноса
	// фокус проваливается в <body> (проверено в живом DOM: document.activeElement === body
	// после клика). Для пользователя клавиатуры это означает, что следующий Tab уводит его
	// в самое начало страницы — на skip-ссылку, — а не продолжает с того места, где он
	// был. Перенос фокуса на сам контейнер шага после каждого перехода чинит это: Tab
	// после смены шага идёт дальше по новому содержимому. aria-live="polite" на этом же
	// узле продолжает озвучивать смену вопроса, как и раньше.
	let stage: HTMLDivElement | undefined = $state();

	const picked = $derived(zones.find((z) => z.value === zone) ?? null);
	const pickedRate = $derived(classes.find((c) => c.value === cls) ?? null);
	const shift = $derived(pickedRate ? pickedRate.rate * 8 : 0);
	const offHoursBlocked = $derived(zone === 'gaz' && timing === 'offhours');

	function pickZone(value: string) {
		zone = value;
		step = 2;
		stage?.focus();
	}
	function pickTiming(value: string) {
		timing = value;
		step = 3;
		stage?.focus();
	}
	function back() {
		if (step > 1) step -= 1;
		stage?.focus();
	}
	function restart() {
		step = 1;
		zone = null;
		timing = null;
		cls = null;
		stage?.focus();
	}
</script>

<div class="dw" id="checklist">
	<div class="dw__head">
		<span class="dw__marker" aria-hidden="true">01</span>
		<div>
			<p class="dw__title">Чек-лист допуска</p>
			<p class="dw__sub">Два вопроса — и список того, что нужно оформить, чтобы кран пустили на объект.</p>
		</div>
	</div>

	<!-- role="progressbar" стоит на самой полосе: у этой роли дочерние элементы презентационные,
	     и подписи шагов внутри обёртки выпали бы из озвучки скринридера. -->
	<div class="dw__progress">
		<div
			class="dw__track"
			role="progressbar"
			aria-valuenow={step}
			aria-valuemin="1"
			aria-valuemax="3"
			aria-valuetext="Шаг {step} из 3"
			aria-label="Прогресс чек-листа допуска"
		>
			<div class="dw__fill" style="width:{((step - 1) / 2) * 100}%"></div>
		</div>
		<div class="dw__legend">
			<span class:is-on={step >= 1}>01 Зона</span>
			<span class:is-on={step >= 2}>02 Время</span>
			<span class:is-on={step >= 3}>03 Что оформить</span>
		</div>
	</div>

	<!-- Шаг подменяется по клику; сама кнопка при этом размонтируется, поэтому фокус явно
	     переносится на этот контейнер (см. stage?.focus() в обработчиках) — иначе он
	     проваливался бы в <body> и Tab уводил бы пользователя клавиатуры в начало страницы.
	     Без live-региона пользователь скринридера не узнал бы, что вопрос сменился (WCAG 4.1.3). -->
	<div class="dw__stage" aria-live="polite" tabindex="-1" bind:this={stage}>
		{#if step === 1}
			<div class="dw__step">
				<p class="dw__q" id="dw-q1">Где физически стоит и работает кран?</p>
				<div class="dw__opts" role="group" aria-labelledby="dw-q1">
					{#each zones as z (z.value)}
						<button
							type="button"
							class="dw__opt"
							class:is-on={zone === z.value}
							aria-pressed={zone === z.value}
							onclick={() => pickZone(z.value)}
						>
							<b>{z.label}</b>
							{#if z.note}<span>{z.note}</span>{/if}
						</button>
					{/each}
				</div>
			</div>
		{:else if step === 2}
			<div class="dw__step">
				<p class="dw__q" id="dw-q2">Когда планируются работы?</p>
				<div class="dw__opts" role="group" aria-labelledby="dw-q2">
					{#each timings as t (t.value)}
						<button
							type="button"
							class="dw__opt"
							class:is-on={timing === t.value}
							aria-pressed={timing === t.value}
							onclick={() => pickTiming(t.value)}
						>
							<b>{t.label}</b>
						</button>
					{/each}
				</div>
				<button type="button" class="dw__back" onclick={back}>← Назад: зона работ</button>
			</div>
		{:else if step === 3 && picked}
			<div class="dw__step">
				<p class="dw__out-head">
					Что нужно оформить <span class="dw__out-count">{picked.reqs.length} {picked.reqs.length === 1 ? 'пункт' : picked.reqs.length < 5 ? 'пункта' : 'пунктов'}</span>
				</p>

				{#if offHoursBlocked}
					<p class="dw__warn">
						Газоопасные работы по наряду-допуску ведутся в рабочие дни в дневную смену: ночное время и гроза
						запрещены ФНП №528. Исключение — неотложные работы по письменному разрешению лица, утвердившего
						наряд, и в присутствии представителя ПАСС(Ф). Плановый подъём под это исключение не подпадает,
						поэтому дату переносим на день.
					</p>
				{/if}

				{#if zone === 'gaz'}
					<p class="dw__warn">
						Территория действующего нефтехимического производства: наряд-допуск оформляется совместно с
						предприятием и действует одну смену. На цену крана это не влияет — влияет на срок начала работ.
					</p>
				{/if}

				<ol class="dw__list">
					{#each picked.reqs as r (r.what)}
						<li class="dw__req">
							<b>{r.what}</b>
							<span class="dw__req-basis">Основание: {r.basis}</span>
							<span class="dw__req-who">Оформляет: {r.who}</span>
						</li>
					{/each}
				</ol>

				<a class="dw__more" href={picked.href}>{picked.hrefLabel} →</a>

				<!-- Стоимость. Второй, свёрнутый блок: она нужна, но не она держит эту страницу. -->
				<details class="dw__cost">
					<summary>Прикинуть стоимость смены</summary>
					<div class="dw__cost-body">
						<p class="dw__q" id="dw-q3">Класс техники</p>
						<div class="dw__opts dw__opts--row" role="group" aria-labelledby="dw-q3">
							{#each classes as c (c.value)}
								<button
									type="button"
									class="dw__opt dw__opt--slim"
									class:is-on={cls === c.value}
									aria-pressed={cls === c.value}
									onclick={() => (cls = c.value)}
								>
									<b>{c.label}</b>
									<span>от {c.rate.toLocaleString('ru-RU')} ₽/час</span>
								</button>
							{/each}
						</div>
						{#if pickedRate}
							<p class="dw__sum">
								<span class="dw__sum-label">{pickedRate.label} · ставка за час × 8 часов смены</span>
								<b>от {shift.toLocaleString('ru-RU')} ₽</b>
							</p>
							<p class="dw__sum-note">
								Оформление наряда-допуска в эту сумму не входит и её не меняет: это срок, а не тариф.
							</p>
						{/if}
					</div>
				</details>

				<div class="dw__actions">
					<button type="button" class="dw__back" onclick={back}>← Изменить время работ</button>
					<button type="button" class="dw__back" onclick={restart}>Начать заново</button>
				</div>
				<a class="btn" href="/#order">Отправить заявку с этим списком →</a>
			</div>
		{/if}
	</div>
</div>

<style>
	.dw {
		background: var(--surface);
		border: 1px solid var(--line-strong);
		padding: clamp(18px, 3vw, 26px);
		display: grid;
		gap: 18px;
	}

	.dw__head {
		display: flex;
		align-items: flex-start;
		gap: 14px;
	}
	.dw__marker {
		font-family: var(--mono);
		font-size: var(--fs-2);
		font-weight: 700;
		color: var(--accent);
		border: 1px solid var(--accent);
		padding: 4px 8px;
		flex-shrink: 0;
	}
	.dw__title {
		font-family: var(--mono);
		font-weight: 700;
		font-size: var(--fs-6);
	}
	.dw__sub {
		margin-top: 4px;
		color: var(--muted);
		font-size: var(--fs-3);
	}

	.dw__progress {
		display: grid;
		gap: 8px;
	}
	.dw__track {
		height: 3px;
		background: var(--line);
		position: relative;
		overflow: hidden;
	}
	.dw__fill {
		position: absolute;
		inset: 0 auto 0 0;
		height: 100%;
		background: var(--accent);
		transition: width 0.25s ease;
	}
	.dw__legend {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		font-family: var(--mono);
		font-size: var(--fs-1);
		color: var(--muted);
		letter-spacing: 0.04em;
	}
	.dw__legend span {
		transition: color 0.2s ease;
	}
	.dw__legend span.is-on {
		color: var(--accent);
		font-weight: 700;
	}

	.dw__step {
		display: grid;
		gap: 12px;
		animation: dw-in 0.18s ease;
	}
	@keyframes dw-in {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.dw__q {
		font-family: var(--mono);
		font-weight: 700;
		font-size: var(--fs-4);
	}
	.dw__opts {
		display: grid;
		gap: 8px;
	}
	.dw__opts--row {
		grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr));
	}
	.dw__opt {
		display: grid;
		gap: 4px;
		text-align: left;
		/* Волна 129: опции лежат на ЭКРАНЕ (--screen), а не на земле страницы (--bg). Внутри
		   корпуса калькулятора (--surface) это даёт настоящие два плана: раньше и корпус, и
		   опции, и предупреждение были почти одного тона, и панель читалась плоской. */
		background: var(--screen);
		/* граница опознаёт кнопку как управляющий элемент → WCAG 1.4.11 требует ≥3:1 */
		border: 1px solid var(--line-strong);
		color: var(--ink);
		padding: 12px 14px;
		min-height: 44px;
		font-family: var(--sans);
		font-size: var(--fs-3);
		cursor: pointer;
		transition: border-color 0.16s ease, box-shadow 0.16s ease, color 0.16s ease;
	}
	.dw__opt b {
		font-weight: 600;
		line-height: 1.35;
	}
	.dw__opt span {
		color: var(--muted);
		font-size: var(--fs-2);
	}
	/* Было: box-shadow: 0 0 0 1px accent, 0 0 16px -6px rgba(...) — кольцо и ореол с нулевым
	   смещением, то есть свечение как украшение, без источника света. Стало: то же кольцо
	   плюс общий токен --glow, у которого есть и смещение вниз, и мягкое размытие. Свет на
	   сайте падает из одной точки — сверху, — и тени это подтверждают. */
	.dw__opt:hover {
		border-color: var(--accent);
		box-shadow: 0 0 0 1px var(--accent), var(--glow);
	}
	.dw__opt:active {
		border-color: var(--accent-deep);
		box-shadow: none;
		transform: translateY(1px);
	}
	.dw__opt.is-on {
		border-color: var(--accent);
		color: var(--accent);
	}
	.dw__opt.is-on span {
		color: var(--accent);
	}
	.dw__opt--slim {
		font-size: var(--fs-3);
	}

	.dw__out-head {
		font-family: var(--mono);
		font-weight: 700;
		font-size: var(--fs-4);
		display: flex;
		align-items: baseline;
		gap: 10px;
		flex-wrap: wrap;
	}
	.dw__out-count {
		font-size: var(--fs-1);
		font-weight: 700;
		color: var(--accent);
		border: 1px solid var(--accent);
		padding: 2px 7px;
	}

	/* Предупреждение о наряде-допуске. Было — цветная полоса 3px по левому краю: приём,
	   который стоит на каждом втором сгенерированном сайте и ничего не сообщает, кроме
	   «это важно». Стало — строка терминала: собственный экран, полная обводка акцентом
	   и маркер [!] тем же шрифтом, что промпты «$» и «>» в индикаторе допуска. Это словарь
	   ЭТОГО сайта, а не общий словарь всплывающих плашек. */
	.dw__warn {
		position: relative;
		font-size: var(--fs-3);
		line-height: 1.55;
		background: var(--screen);
		border: 1px solid var(--accent);
		padding: 12px 14px 12px 44px;
		color: var(--ink);
	}
	.dw__warn::before {
		content: '[!]';
		position: absolute;
		left: 13px;
		top: 12px;
		font-family: var(--mono);
		font-weight: 700;
		color: var(--accent);
	}
	/* Маркер декоративный: смысл несёт сам текст предупреждения, а VoiceOver зачитал бы
	   «скобка восклицательный знак скобка». Тот же приём, что уже стоит у маркеров «>». */
	@supports (content: 'x' / 'y') {
		.dw__warn::before {
			content: '[!]' / '';
		}
	}

	/* Список требований — «строки документа», а не карточки: числовой маркер слева, требование
	   жирным, под ним основание и исполнитель мелким моноширинным. Тот же визуальный язык, что
	   у .req на страницах /obekty-opo/ и /dopusk/. */
	.dw__list {
		list-style: none;
		margin: 0;
		padding: 0;
		counter-reset: dwreq;
		border-top: 1px solid var(--line);
	}
	.dw__req {
		counter-increment: dwreq;
		position: relative;
		display: grid;
		gap: 3px;
		padding: 12px 0 12px 34px;
		border-bottom: 1px solid var(--line);
	}
	.dw__req::before {
		content: counter(dwreq, decimal-leading-zero);
		position: absolute;
		left: 0;
		top: 13px;
		font-family: var(--mono);
		font-size: var(--fs-1);
		font-weight: 700;
		color: var(--accent);
	}
	.dw__req b {
		font-size: var(--fs-4);
		font-weight: 600;
		line-height: 1.4;
	}
	.dw__req-basis,
	.dw__req-who {
		font-family: var(--mono);
		font-size: var(--fs-1);
		line-height: 1.45;
		color: var(--muted);
	}

	.dw__more {
		justify-self: start;
		font-family: var(--mono);
		font-size: var(--fs-2);
		font-weight: 700;
		color: var(--accent);
		text-underline-offset: 3px;
		min-height: 44px;
		display: inline-flex;
		align-items: center;
	}

	.dw__cost {
		border: 1px dashed var(--line-strong);
		padding: 0 14px;
	}
	.dw__cost summary {
		cursor: pointer;
		list-style: none;
		font-family: var(--mono);
		font-size: var(--fs-2);
		font-weight: 700;
		color: var(--muted);
		min-height: 44px;
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.dw__cost summary::-webkit-details-marker {
		display: none;
	}
	.dw__cost summary::after {
		content: '+';
		margin-left: auto;
		font-family: var(--mono);
		font-weight: 700;
		color: var(--accent);
	}
	.dw__cost[open] summary::after {
		content: '−';
	}
	.dw__cost summary:hover {
		color: var(--accent);
	}
	.dw__cost-body {
		display: grid;
		gap: 10px;
		padding-bottom: 16px;
	}
	.dw__sum {
		border-top: 1px dashed var(--line);
		padding-top: 12px;
	}
	.dw__sum-label {
		display: block;
		font-family: var(--mono);
		font-size: var(--fs-1);
		color: var(--muted);
	}
	.dw__sum b {
		display: block;
		margin-top: 4px;
		font-family: var(--mono);
		font-size: var(--fs-8);
		color: var(--accent);
	}
	.dw__sum-note {
		font-size: var(--fs-2);
		color: var(--muted);
	}

	.dw__back {
		justify-self: start;
		background: none;
		border: none;
		color: var(--muted);
		font-family: var(--mono);
		font-size: var(--fs-2);
		cursor: pointer;
		padding: 4px 0;
		text-decoration: underline;
		text-underline-offset: 3px;
		/* без min-height тап-таргет текстовой кнопки ≈18px — заметно ниже 44px из WCAG 2.5.5 */
		min-height: 44px;
		display: inline-flex;
		align-items: center;
	}
	.dw__back:hover {
		color: var(--accent);
	}
	.dw__actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 10px;
	}

	/* prefers-reduced-motion: снимаем переходы и появление шага. Цвет и рамка остаются —
	   это не движение, и информацию о состоянии терять нельзя. */
	@media (prefers-reduced-motion: reduce) {
		.dw__step {
			animation: none;
		}
		.dw__fill,
		.dw__legend span,
		.dw__opt {
			transition: none;
		}
	}
</style>
