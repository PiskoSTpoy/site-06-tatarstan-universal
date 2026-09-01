<script lang="ts">
	/*
	 * Разбор схемы крана по клику (волна 34). До этой волны HeroIllustration.svelte была
	 * чисто декоративной (aria-hidden, ни одной цифры — см. её собственный комментарий): человек
	 * видел выноски СТРЕЛА / АУТРИГЕРЫ / ГРУЗ / ПРОТИВОВЕС, но не мог узнать, что каждая из них
	 * значит и на что влияет при выборе техники.
	 *
	 * Данные — не новые: те же три модели и те же цифры, что уже обоснованы источниками на
	 * страницах /park/klintsy-ks-35719/, /park/ivanovets-ks-6476/, /park/xcmg-quy150/ (Sources
	 * там же). Здесь их компонует другой интерфейс — глоссарий четырёх параметров плюс три
	 * вопроса, которые уже разобраны прозой на /park/ («тесная площадка → Клинцы», «промысловые
	 * грунтовые дороги → Ивановец», «тяжёлый монтаж на нефтехимии → XCMG») — а не изобретает
	 * новую методику подбора.
	 *
	 * Клик по схеме — «приблизило»: сама SVG получает transform:scale в развёрнутом состоянии
	 * (тот же приём, что параллакс в HeroIllustration, только по клику, а не по курсору), панель
	 * параметров выезжает под ней. Схема остаётся декоративной (aria-hidden не снят) — понятной
	 * её делает подпись-кнопка поверх, а не сама разметка SVG.
	 */

	type ParamDef = {
		id: 'boom' | 'outrig' | 'load' | 'counter';
		label: string;
		short: string;
		full: string;
		range: string;
	};

	const params: ParamDef[] = [
		{
			id: 'boom',
			label: 'Стрела',
			short: 'Вылет и высота подъёма',
			full: 'Длина стрелы задаёт, на какую высоту и на каком расстоянии от машины кран поднимает груз. Чем длиннее стрела, тем дальше кран «дотягивается» через препятствие — забор, соседнее здание, — не подъезжая к самой точке работ.',
			range: 'по парку сайта: 19 м (Клинцы) → 34 м (Ивановец) → 82 м (XCMG QUY150)',
		},
		{
			id: 'outrig',
			label: 'Аутригеры',
			short: 'Опорный контур на площадке',
			full: 'Выносные опоры держат кран при подъёме — им нужна ровная площадка своего размера. Чем компактнее контур, тем в более тесный двор или историческую застройку кран может встать без перекрытия проезда.',
			range: 'по парку сайта: 4,3×5,2 м (Клинцы) — самый компактный контур',
		},
		{
			id: 'load',
			label: 'Груз',
			short: 'Грузоподъёмность',
			full: 'Максимальный вес, который кран поднимает на минимальном вылете. С увеличением вылета грузоподъёмность падает — паспортный тоннаж это верхняя граница, а не значение на любом расстоянии от машины.',
			range: 'по парку сайта: 16 т → 50 т → 150 т',
		},
		{
			id: 'counter',
			label: 'Противовес',
			short: 'Устойчивость при подъёме',
			full: 'Противовес уравновешивает груз на стреле — без него кран опрокинулся бы вперёд при подъёме на большом вылете. У тяжёлых кранов противовес соразмерно больше, а у гусеничных ход ещё и распределяет нагрузку на грунт шире, чем колёсный.',
			range: 'решает вместе с давлением на грунт: 0,093 МПа у гусеничного XCMG против точечной нагрузки колёсных шасси',
		},
	];

	type SiteKind = 'tight' | 'open' | 'heavy';
	type LoadKind = 'l16' | 'l50' | 'l150';

	type Model = {
		id: string;
		name: string;
		href: string;
		tonnage: string;
		why: string;
	};

	const models: Record<'klintsy' | 'ivanovets' | 'xcmg', Model> = {
		klintsy: {
			id: 'klintsy',
			name: 'Клинцы КС-35719-7-02',
			href: '/park/klintsy-ks-35719/',
			tonnage: '16 т',
			why: 'самый компактный контур опор (4,3×5,2 м) и наименьшая масса (19,6 т) в парке — заходит туда, куда тяжёлый класс не заходит физически.',
		},
		ivanovets: {
			id: 'ivanovets',
			name: 'Ивановец КС-6476',
			href: '/park/ivanovets-ks-6476/',
			tonnage: '50 т',
			why: 'шасси МЗКТ-69234 (8×4) повышенной проходимости — доедет по грунтовым внутрипромысловым дорогам, где обычное дорожное шасси может застрять.',
		},
		xcmg: {
			id: 'xcmg',
			name: 'Гусеничный кран XCMG QUY150',
			href: '/park/xcmg-quy150/',
			tonnage: '150 т',
			why: 'грузоподъёмность и вылет, которых не хватает автокрану на тяжёлом монтаже, при более низком давлении на грунт, чем у колёсных машин такой массы.',
		},
	};

	// Та же логика подбора, что уже прозой описана на /park/: тесная площадка → Клинцы,
	// промысел/грунтовые дороги → Ивановец, тяжёлый монтаж/нефтехимия → XCMG. Груз — вторая
	// проверка: если выбранная площадка не тянет нужный тоннаж, решает вес.
	function pickModel(site: SiteKind | null, load: LoadKind | null): Model | null {
		if (!site || !load) return null;
		if (load === 'l150' || site === 'heavy') return models.xcmg;
		if (load === 'l50' || site === 'open') return models.ivanovets;
		return models.klintsy;
	}

	// open вынесен наружу через $bindable: страница передаёт его же в HeroIllustration
	// (zoomed={open}) — клик по этой кнопке «приближает» схему выше, а не только
	// разворачивает панель под ней.
	let { open = $bindable(false) }: { open?: boolean } = $props();
	let picked = $state<ParamDef['id'] | null>(null);
	let site = $state<SiteKind | null>(null);
	let load = $state<LoadKind | null>(null);
	let panel: HTMLDivElement | undefined = $state();

	const result = $derived(pickModel(site, load));

	function toggle() {
		open = !open;
		if (open) {
			// Фокус уходит в панель только при её появлении — при закрытии остаётся на кнопке,
			// которая и так уже в фокусе (сама себя не теряет).
			requestAnimationFrame(() => panel?.focus());
		}
	}
	function reset() {
		picked = null;
		site = null;
		load = null;
	}
</script>

<div class="cpp">
	<button
		type="button"
		class="cpp__trigger"
		class:is-open={open}
		aria-expanded={open}
		aria-controls="cpp-panel"
		onclick={toggle}
	>
		<span class="cpp__trigger-mark" aria-hidden="true">{open ? '−' : '+'}</span>
		<span>
			<b>Разобрать схему по параметрам</b>
			<span>Что означает каждая выноска и какая модель парка подходит под ваш случай</span>
		</span>
	</button>

	{#if open}
		<div
			id="cpp-panel"
			class="cpp__panel"
			role="region"
			aria-label="Параметры крана"
			tabindex="-1"
			bind:this={panel}
		>
			<p class="cpp__intro">
				Четыре параметра со схемы выше — то, что физически ограничивает выбор техники, а не абстрактные
				характеристики из паспорта. Нажмите на параметр, чтобы увидеть его диапазон по трём моделям парка
				сайта.
			</p>

			<div class="cpp__terms" role="group" aria-label="Параметры схемы">
				{#each params as p (p.id)}
					<button
						type="button"
						class="cpp__term"
						class:is-on={picked === p.id}
						aria-pressed={picked === p.id}
						onclick={() => (picked = picked === p.id ? null : p.id)}
					>
						<b>{p.label}</b>
						<span>{p.short}</span>
					</button>
				{/each}
			</div>

			{#if picked}
				{@const def = params.find((p) => p.id === picked)}
				{#if def}
					<div class="cpp__def" aria-live="polite">
						<p>{def.full}</p>
						<p class="cpp__range">{def.range}</p>
					</div>
				{/if}
			{/if}

			<div class="cpp__quiz">
				<p class="cpp__q">Какая площадка?</p>
				<div class="cpp__opts" role="group" aria-label="Площадка">
					<button type="button" class="cpp__opt" class:is-on={site === 'tight'} aria-pressed={site === 'tight'} onclick={() => (site = 'tight')}>
						<b>Тесная</b><span>двор, историческая застройка, узкий проезд</span>
					</button>
					<button type="button" class="cpp__opt" class:is-on={site === 'open'} aria-pressed={site === 'open'} onclick={() => (site = 'open')}>
						<b>Открытая</b><span>промысел, грунтовые дороги, обычная стройка</span>
					</button>
					<button type="button" class="cpp__opt" class:is-on={site === 'heavy'} aria-pressed={site === 'heavy'} onclick={() => (site = 'heavy')}>
						<b>Промплощадка</b><span>тяжёлый монтаж, нефтехимия</span>
					</button>
				</div>

				<p class="cpp__q">Сколько нужно поднять?</p>
				<div class="cpp__opts" role="group" aria-label="Груз">
					<button type="button" class="cpp__opt" class:is-on={load === 'l16'} aria-pressed={load === 'l16'} onclick={() => (load = 'l16')}>
						<b>До 16 т</b>
					</button>
					<button type="button" class="cpp__opt" class:is-on={load === 'l50'} aria-pressed={load === 'l50'} onclick={() => (load = 'l50')}>
						<b>16–50 т</b>
					</button>
					<button type="button" class="cpp__opt" class:is-on={load === 'l150'} aria-pressed={load === 'l150'} onclick={() => (load = 'l150')}>
						<b>50–150 т</b>
					</button>
				</div>
			</div>

			{#if result}
				<div class="cpp__result" aria-live="polite">
					<p class="cpp__result-head">Подходит <b>{result.name}</b> <span class="cpp__result-t">{result.tonnage}</span></p>
					<p class="cpp__result-why">Почему: {result.why}</p>
					<div class="cpp__result-actions">
						<a class="cpp__more" href={result.href}>Открыть модель →</a>
						<button type="button" class="cpp__back" onclick={reset}>Начать заново</button>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.cpp {
		margin-top: 14px;
		padding: 0 clamp(12px, 2.4vw, 18px) clamp(12px, 2.4vw, 18px);
	}
	.cpp__trigger {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		width: 100%;
		text-align: left;
		background: var(--screen);
		border: 1px solid var(--line-strong);
		color: var(--ink);
		padding: 12px 14px;
		min-height: 44px;
		font-family: var(--sans);
		cursor: pointer;
		transition: border-color 0.16s ease, box-shadow 0.16s ease;
	}
	.cpp__trigger:hover,
	.cpp__trigger.is-open {
		border-color: var(--accent);
		box-shadow: 0 0 0 1px var(--accent), var(--glow);
	}
	.cpp__trigger-mark {
		font-family: var(--mono);
		font-weight: 700;
		color: var(--accent);
		border: 1px solid var(--accent);
		width: 22px;
		height: 22px;
		display: grid;
		place-items: center;
		flex-shrink: 0;
	}
	.cpp__trigger b {
		display: block;
		font-family: var(--mono);
		font-size: var(--fs-3);
		font-weight: 700;
	}
	.cpp__trigger span span {
		display: block;
		margin-top: 2px;
		font-size: var(--fs-1);
		color: var(--muted);
	}

	.cpp__panel {
		margin-top: 10px;
		background: var(--surface);
		border: 1px solid var(--line-strong);
		padding: clamp(16px, 2.4vw, 22px);
		display: grid;
		gap: 16px;
		animation: cpp-in 0.18s ease;
	}
	@keyframes cpp-in {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.cpp__intro {
		font-size: var(--fs-2);
		line-height: 1.55;
		color: var(--ink-2);
	}

	.cpp__terms {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(140px, 100%), 1fr));
		gap: 8px;
	}
	.cpp__term {
		display: grid;
		gap: 3px;
		text-align: left;
		background: var(--screen);
		border: 1px solid var(--line-strong);
		color: var(--ink);
		padding: 10px 12px;
		min-height: 44px;
		font-family: var(--sans);
		cursor: pointer;
		transition: border-color 0.16s ease, color 0.16s ease;
	}
	.cpp__term b {
		font-family: var(--mono);
		font-weight: 700;
		font-size: var(--fs-2);
	}
	.cpp__term span {
		font-size: var(--fs-1);
		color: var(--muted);
	}
	.cpp__term:hover {
		border-color: var(--accent);
	}
	.cpp__term.is-on {
		border-color: var(--accent);
		color: var(--accent);
	}
	.cpp__term.is-on span {
		color: var(--accent);
	}

	.cpp__def {
		background: var(--screen);
		border: 1px solid var(--accent);
		padding: 12px 14px;
		display: grid;
		gap: 6px;
	}
	.cpp__def p {
		font-size: var(--fs-2);
		line-height: 1.55;
		color: var(--ink);
	}
	.cpp__range {
		font-family: var(--mono);
		font-size: var(--fs-1);
		color: var(--accent);
	}

	.cpp__quiz {
		display: grid;
		gap: 8px;
		padding-top: 4px;
		border-top: 1px dashed var(--line-strong);
	}
	.cpp__q {
		font-family: var(--mono);
		font-weight: 700;
		font-size: var(--fs-2);
		margin-top: 6px;
	}
	.cpp__opts {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr));
		gap: 8px;
	}
	.cpp__opt {
		display: grid;
		gap: 3px;
		text-align: left;
		background: var(--screen);
		border: 1px solid var(--line-strong);
		color: var(--ink);
		padding: 10px 12px;
		min-height: 44px;
		font-family: var(--sans);
		font-size: var(--fs-2);
		cursor: pointer;
		transition: border-color 0.16s ease, box-shadow 0.16s ease, color 0.16s ease;
	}
	.cpp__opt b {
		font-weight: 600;
	}
	.cpp__opt span {
		color: var(--muted);
		font-size: var(--fs-1);
	}
	.cpp__opt:hover {
		border-color: var(--accent);
		box-shadow: 0 0 0 1px var(--accent), var(--glow);
	}
	.cpp__opt.is-on {
		border-color: var(--accent);
		color: var(--accent);
	}
	.cpp__opt.is-on span {
		color: var(--accent);
	}

	.cpp__result {
		background: var(--screen);
		border: 1px solid var(--accent);
		padding: 14px 16px;
		display: grid;
		gap: 6px;
	}
	.cpp__result-head {
		font-family: var(--mono);
		font-size: var(--fs-3);
		font-weight: 700;
	}
	.cpp__result-t {
		color: var(--accent);
		border: 1px solid var(--accent);
		padding: 1px 6px;
		margin-left: 6px;
		font-size: var(--fs-1);
	}
	.cpp__result-why {
		font-size: var(--fs-2);
		line-height: 1.5;
		color: var(--ink-2);
	}
	.cpp__result-actions {
		display: flex;
		align-items: center;
		gap: 16px;
		flex-wrap: wrap;
		margin-top: 4px;
	}
	.cpp__more {
		font-family: var(--mono);
		font-size: var(--fs-2);
		font-weight: 700;
		color: var(--accent);
		text-underline-offset: 3px;
		min-height: 44px;
		display: inline-flex;
		align-items: center;
	}
	.cpp__back {
		background: none;
		border: none;
		color: var(--muted);
		font-family: var(--mono);
		font-size: var(--fs-1);
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 3px;
		min-height: 44px;
		display: inline-flex;
		align-items: center;
	}
	.cpp__back:hover {
		color: var(--accent);
	}

	@media (prefers-reduced-motion: reduce) {
		.cpp__panel {
			animation: none;
		}
		.cpp__trigger,
		.cpp__term,
		.cpp__opt {
			transition: none;
		}
	}
</style>
