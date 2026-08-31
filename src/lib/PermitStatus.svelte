<script lang="ts">
	/*
	 * Статус допуска — терминальный индикатор (волна 19: восстановление визуального слоя).
	 *
	 * Не выдумывает новую классификацию: переиспользует ровно тот разбор режимов допуска,
	 * что уже опубликован постранично в /obekty-opo/*. Четыре объекта — те же I–IV, что в
	 * реестре секции #obekty на главной. Переключатель наглядно показывает главный факт
	 * раздела #permit: наряд-допуск нужен не всегда и не «на кран», а на конкретный тип
	 * точки работ.
	 */
	import { untrack } from 'svelte';

	export type PermitKind = {
		code: string;
		name: string;
		regime: string;
		basis: string;
		status: 'required' | 'conditional' | 'internal' | 'none';
		statusLabel: string;
	};

	let { items }: { items: PermitKind[] } = $props();

	// untrack: нужно ровно однократное начальное значение (первый объект реестра), а не
	// реактивная зависимость от items — items не меняется после монтирования, а без
	// untrack компилятор предупреждает о «захвате только начального значения» так, будто
	// это могло быть ошибкой (svelte(state_referenced_locally)).
	let active = $state(untrack(() => items[0]?.code ?? ''));
	const current = $derived(items.find((i) => i.code === active) ?? items[0]);

	const statusWord: Record<PermitKind['status'], string> = {
		required: 'true',
		conditional: 'maybe',
		internal: 'internal',
		none: 'false',
	};
</script>

<div class="ps">
	<div class="ps__tabs" role="group" aria-label="Тип объекта">
		{#each items as k (k.code)}
			<button
				type="button"
				class="ps__tab"
				class:is-on={active === k.code}
				aria-pressed={active === k.code}
				onclick={() => (active = k.code)}
			>
				<span aria-hidden="true">{k.code}</span>
				<span class="sr-only">{k.name}</span>
			</button>
		{/each}
	</div>

	<!-- aria-live: переключение объекта не двигает фокус, поэтому смену статуса нужно
	     объявить отдельно (WCAG 4.1.3), как уже сделано в DopuskWizard.svelte. -->
	{#if current}
		<div class="ps__term" aria-live="polite" data-status={current.status}>
			<p class="ps__line ps__line--cmd">
				<span class="ps__prompt" aria-hidden="true">$</span> проверка_допуска --объект={current.code}
			</p>
			<p class="ps__line"><span class="ps__prompt" aria-hidden="true">&gt;</span> объект: {current.name}</p>
			<p class="ps__line"><span class="ps__prompt" aria-hidden="true">&gt;</span> режим: {current.regime}</p>
			<p class="ps__line"><span class="ps__prompt" aria-hidden="true">&gt;</span> основание: {current.basis}</p>
			<p class="ps__line ps__line--status">
				<span class="ps__prompt" aria-hidden="true">&gt;</span> наряд-допуск:
				<b class="ps__badge" data-word={statusWord[current.status]}>{current.statusLabel}</b>
				<span class="ps__cursor" aria-hidden="true"></span>
			</p>
		</div>
	{/if}
</div>

<style>
	/* Волна 129. Индикатор перестал быть прямоугольником одного тона: корпус — металл
	   (--surface), лента вкладок на нём, а сам вывод — вставленный ЭКРАН (--screen, глубже
	   фона страницы). Раньше корпус был цвета --bg, вкладки --surface, и активная вкладка
	   становилась --bg — то есть «выбранное» показывалось тем, что вкладка сливалась с фоном
	   страницы, а не с экраном под ней. Теперь активная вкладка сливается с экраном: она
	   физически его продолжение. Контраст на --screen выше прежнего по всем парам
	   (--muted 5.31 против 4.75, --accent 9.62 против 8.60 — замерено). */
	.ps {
		background: var(--surface);
		border: 1px solid var(--line-strong);
		box-shadow: var(--lift);
		max-width: 620px;
	}
	.ps__tabs {
		display: flex;
		border-bottom: 1px solid var(--line-strong);
	}
	.ps__tab {
		flex: 1;
		min-height: 44px;
		background: var(--surface);
		border: none;
		border-right: 1px solid var(--line-strong);
		color: var(--muted);
		font-family: var(--mono);
		font-weight: 700;
		font-size: var(--fs-3);
		cursor: pointer;
		transition: background-color 0.16s ease, color 0.16s ease;
	}
	.ps__tab:last-child {
		border-right: none;
	}
	.ps__tab:hover {
		color: var(--ink);
	}
	.ps__tab.is-on {
		background: var(--screen);
		color: var(--accent);
		box-shadow: inset 0 -2px 0 var(--accent);
	}
	.ps__tab:active {
		background: var(--screen);
		color: var(--accent-deep);
	}

	.ps__term {
		background: var(--screen);
		padding: 16px clamp(14px, 3vw, 20px) 18px;
		display: grid;
		gap: 8px;
	}
	.ps__line {
		font-family: var(--mono);
		font-size: var(--fs-3);
		line-height: 1.55;
		color: var(--ink-2);
		overflow-wrap: break-word;
	}
	.ps__line--cmd {
		color: var(--muted);
	}
	.ps__prompt {
		color: var(--accent);
		margin-right: 4px;
	}
	.ps__line--status {
		margin-top: 4px;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 6px 8px;
	}
	.ps__badge {
		font-family: var(--mono);
		font-size: var(--fs-2);
		font-weight: 700;
		letter-spacing: 0.03em;
		padding: 3px 9px;
		border: 1px solid currentcolor;
	}
	.ps__badge[data-word='true'] {
		color: #ff9a6b;
	}
	.ps__badge[data-word='maybe'] {
		color: #ffd166;
	}
	.ps__badge[data-word='internal'] {
		color: var(--ink);
	}
	.ps__badge[data-word='false'] {
		color: var(--accent);
	}

	/* Мигающий маркер CLI-курсора — единственный анимируемый элемент индикатора. */
	.ps__cursor {
		display: inline-block;
		width: 8px;
		height: 15px;
		background: var(--accent);
		animation: ps-blink 1s step-end infinite;
	}
	@keyframes ps-blink {
		0%,
		49% {
			opacity: 1;
		}
		50%,
		100% {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ps__cursor {
			animation: none;
			opacity: 1;
		}
		.ps__tab {
			transition: none;
		}
	}
</style>
