<script lang="ts">
	/*
	 * Волна 28 — технический чертёж модели парка. Три страницы /park/* (волны 23-24) до сих
	 * пор не имели ни одной иллюстрации — только таблица характеристик (Pairs.svelte).
	 *
	 * Техника чертежа: пунктирная рамка, угловые L-образные
	 * регистрационные метки, размерная линия с засечками на концах, приём «только острые
	 * углы» (stroke-linejoin: miter, stroke-linecap: square — эта модель ничего не варит,
	 * не отливает и не гнёт со скруглением), решётчатая стрела гусеничного крана как два
	 * рельса + зигзаг-раскосы. Палитра — собственный терминальный тёмно-зелёный язык сайта
	 * (--accent, --surface, --mono, который уже держит здесь h1-h3, без отдельного
	 * --display), и функция latticeParts параметризована по толщине решётки (два прежних
	 * магических числа 15/5 стали параметрами lattice*), чтобы гусеничный QUY150 (150 т)
	 * получил заметно более массивную стрелу, чем силуэты автокранов рядом.
	 *
	 * Это НЕ фотография техники — честная схема силуэта по характеристикам, уже указанным
	 * текстом на странице модели (Pairs.svelte, та же страница). Компонент не хранит
	 * собственных цифр: все подписи приходят пропами и обязаны совпадать с таблицей
	 * характеристик — фактчек делает страница, не эта иллюстрация.
	 *
	 * Один параметризуемый компонент вместо трёх независимых SVG: одинаковая рамка/толщина
	 * линий/палитра на всех карточках парка, а разные силуэты — за счёт геометрии (число
	 * осей, тип хода, угол и длина стрелы, наличие гуська), как и у реальных кранов этого
	 * класса.
	 */
	interface Gusek {
		label: string;
		kink?: number; // угол излома гуська относительно стрелы, градусы
		len?: number; // длина гуська в единицах viewBox (визуальная, не масштаб)
	}

	interface Props {
		capacity: string; // бейдж грузоподъёмности, напр. «50 т»
		kind?: 'mobile' | 'crawler';
		axles?: number; // для mobile: 3–5
		wheelsLarge?: boolean; // вездеходные шины покрупнее
		boomAngle?: number; // угол стрелы к горизонту, градусы
		boomLen?: number; // длина стрелы в единицах viewBox
		boomHalfWidth?: number; // полутолщина стрелы у основания (mobile)
		latticeBase?: number; // полутолщина решётчатой стрелы у основания (crawler)
		latticeTip?: number; // полутолщина решётчатой стрелы у оголовка (crawler)
		gusek?: Gusek;
		ropeStrands?: number; // число ниток каната у крюка (визуально ограничено 4)
		chassisLabel?: string; // подпись шасси/хода, снизу слева
		boomDimLabel?: string; // подпись горизонтальной размерной линии (длина/вылет стрелы)
		heightDimLabel?: string; // подпись вертикальной размерной линии (высота подъёма)
		noteNearTip?: string; // короткая заметка у оголовка стрелы
		noteNearHook?: string; // короткая заметка у крюка/груза
		noteNearBase?: string; // короткая заметка у поворотной платформы/базы
		caption?: string;
	}

	let {
		capacity,
		kind = 'mobile',
		axles = 3,
		wheelsLarge = false,
		boomAngle = 58,
		boomLen = 220,
		boomHalfWidth = 9,
		latticeBase = 15,
		latticeTip = 5,
		gusek,
		ropeStrands = 1,
		chassisLabel,
		boomDimLabel,
		heightDimLabel,
		noteNearTip,
		noteNearHook,
		noteNearBase,
		caption = 'Схема силуэта по характеристикам этой модели, указанным в таблице выше, — не фотография техники: реальных снимков парка на сайте нет и не будет.'
	}: Props = $props();

	const VBW = 760;
	const VBH = 320;
	const PAD = 8;
	const groundY = 248;

	// ── Рамка чертежа: пунктир + четыре угловые регистрационные метки ──────────
	const leg = 24;
	const corners = [
		`M${PAD},${PAD + leg} V${PAD} H${PAD + leg}`,
		`M${VBW - PAD - leg},${PAD} H${VBW - PAD} V${PAD + leg}`,
		`M${VBW - PAD},${VBH - PAD - leg} V${VBH - PAD} H${VBW - PAD - leg}`,
		`M${PAD + leg},${VBH - PAD} H${PAD} V${VBH - PAD - leg}`
	].join(' ');

	// ── Тригонометрия стрелы: общая для mobile (сплошная сужающаяся) и crawler
	//    (решётчатая, рельсы + раскосы). Свободные функции — без ссылок на пропы,
	//    поэтому им не нужен $derived. ─────────────────────────────────────────
	const rad = (deg: number) => (deg * Math.PI) / 180;
	function polar(px: number, py: number, angleDeg: number, len: number) {
		const r = rad(angleDeg);
		return { x: px + Math.cos(r) * len, y: py - Math.sin(r) * len };
	}
	function dirOf(angleDeg: number) {
		const r = rad(angleDeg);
		return { x: Math.cos(r), y: -Math.sin(r) };
	}
	function perpOf(angleDeg: number) {
		const r = rad(angleDeg);
		return { x: Math.sin(r), y: Math.cos(r) };
	}
	function fmt(n: number) {
		return n.toFixed(1);
	}
	function dimH(x1: number, x2: number, y: number, tick = 6) {
		return `M${fmt(x1)},${fmt(y - tick)} L${fmt(x1)},${fmt(y + tick)} M${fmt(x1)},${fmt(y)} L${fmt(x2)},${fmt(y)} M${fmt(x2)},${fmt(y - tick)} L${fmt(x2)},${fmt(y + tick)}`;
	}
	function dimV(y1: number, y2: number, x: number, tick = 6) {
		return `M${fmt(x - tick)},${fmt(y1)} L${fmt(x + tick)},${fmt(y1)} M${fmt(x)},${fmt(y1)} L${fmt(x)},${fmt(y2)} M${fmt(x - tick)},${fmt(y2)} L${fmt(x + tick)},${fmt(y2)}`;
	}
	function latticeParts(px: number, py: number, angleDeg: number, len: number, halfBase: number, halfTip: number, segments: number) {
		const d = dirOf(angleDeg);
		const p = perpOf(angleDeg);
		const rail1: { x: number; y: number }[] = [];
		const rail2: { x: number; y: number }[] = [];
		const zig: { x: number; y: number }[] = [];
		for (let i = 0; i <= segments; i++) {
			const t = i / segments;
			const hw = halfBase + (halfTip - halfBase) * t;
			const cx = px + d.x * len * t;
			const cy = py + d.y * len * t;
			const p1 = { x: cx + p.x * hw, y: cy + p.y * hw };
			const p2 = { x: cx - p.x * hw, y: cy - p.y * hw };
			rail1.push(p1);
			rail2.push(p2);
			zig.push(i % 2 === 0 ? p1 : p2);
		}
		return { rail1, rail2, zig };
	}
	const ptsToStr = (pts: { x: number; y: number }[]) => pts.map((p) => `${fmt(p.x)},${fmt(p.y)}`).join(' ');

	// ── Вся геометрия, зависящая от пропов, — в одном $derived.by. Пропы этого
	//    компонента на практике статичны (страница передаёт литералы один раз),
	//    но svelte-check честно требует $derived для любого значения, читающего
	//    $props() вне замыкания (state_referenced_locally) — иначе 0 warnings не
	//    получить. Один общий объект вместо десятка отдельных $derived проще
	//    читать, чем россыпь мелких рун. ──────────────────────────────────────
	const geo = $derived.by(() => {
		const chassisX0 = 70;
		const chassisW = kind === 'mobile' ? 250 + (axles - 3) * 40 : 0;
		const wheelR = wheelsLarge ? 17 : 13;
		const chassisBottomY = groundY - wheelR - 3;
		const chassisH = 28;
		const chassisY = chassisBottomY - chassisH;
		const wheelXs =
			kind === 'mobile'
				? Array.from({ length: axles }, (_, i) => {
						const margin = 28;
						const span = chassisW - margin * 2;
						const step = axles > 1 ? span / (axles - 1) : 0;
						return chassisX0 + margin + i * step;
					})
				: [];

		const cabW = 40;
		const cabH = 34;
		const cabX = chassisX0 + 4;
		const cabY = chassisY - cabH + 4;

		// ── Гусеничный ход: шестиугольник с острыми торцами (без скругления —
		//    то же правило «только прямые углы»). ────────────────────────────
		const trackX0 = 90;
		const trackLen = 300;
		const trackH = 34;
		const trackY0 = groundY - trackH;
		const slant = 16;
		const trackPts = [
			[trackX0 + slant, trackY0],
			[trackX0 + trackLen - slant, trackY0],
			[trackX0 + trackLen, trackY0 + trackH / 2],
			[trackX0 + trackLen - slant, trackY0 + trackH],
			[trackX0 + slant, trackY0 + trackH],
			[trackX0, trackY0 + trackH / 2]
		]
			.map((p) => p.join(','))
			.join(' ');
		const treadXs = Array.from({ length: 8 }, (_, i) => trackX0 + 24 + i * ((trackLen - 48) / 7));

		const turretW = 150;
		const turretH = 30;
		const turretX = trackX0 + trackLen * 0.24;
		const turretY = trackY0 - turretH - 2;
		const cwtW = 40;
		const cwtH = 26;

		// ── Точка поворота (пивот) стрелы: у mobile — на шасси, у crawler — на
		//    правом краю поворотной платформы. ────────────────────────────────
		const pivot =
			kind === 'mobile'
				? { x: chassisX0 + chassisW * 0.32, y: chassisY - 2 }
				: { x: turretX + turretW * 0.82, y: turretY };

		const dir = dirOf(boomAngle);
		const perp = perpOf(boomAngle);
		const boomHalfTip = Math.max(2.4, boomHalfWidth * 0.32);
		const tip = polar(pivot.x, pivot.y, boomAngle, boomLen);

		let effTip = tip;
		let gusekLine: { from: { x: number; y: number }; to: { x: number; y: number } } | null = null;
		if (gusek) {
			const gAngle = boomAngle + (gusek.kink ?? 10);
			const gLen = gusek.len ?? 50;
			const gTip = polar(tip.x, tip.y, gAngle, gLen);
			gusekLine = { from: tip, to: gTip };
			effTip = gTip;
		}

		// ── Стрела mobile: сплошной сужающийся четырёхугольник + два стыка
		//    секций (визуальный намёк на телескопирование). ───────────────────
		const boomQuad = [
			{ x: pivot.x + perp.x * boomHalfWidth, y: pivot.y + perp.y * boomHalfWidth },
			{ x: tip.x + perp.x * boomHalfTip, y: tip.y + perp.y * boomHalfTip },
			{ x: tip.x - perp.x * boomHalfTip, y: tip.y - perp.y * boomHalfTip },
			{ x: pivot.x - perp.x * boomHalfWidth, y: pivot.y - perp.y * boomHalfWidth }
		]
			.map((p) => `${fmt(p.x)},${fmt(p.y)}`)
			.join(' ');
		const jointLines = [0.38, 0.7].map((t) => {
			const cx = pivot.x + dir.x * boomLen * t;
			const cy = pivot.y + dir.y * boomLen * t;
			const hw = boomHalfWidth + (boomHalfTip - boomHalfWidth) * t;
			return `M${fmt(cx + perp.x * hw)},${fmt(cy + perp.y * hw)} L${fmt(cx - perp.x * hw)},${fmt(cy - perp.y * hw)}`;
		});

		// ── Стрела crawler: решётчатая — два рельса + зигзаг-раскосы. ─────────
		const lattice = kind === 'crawler' ? latticeParts(pivot.x, pivot.y, boomAngle, boomLen, latticeBase, latticeTip, 8) : null;

		// ── Канат, крюк, груз — акцентный цвет. ────────────────────────────────
		const ropeLen = 46;
		const loadY = Math.min(effTip.y + ropeLen, groundY - 14);
		const loadW = 24;
		const loadH = 16;
		const strands = Math.min(Math.max(ropeStrands, 1), 4);
		const strandTops = Array.from({ length: strands }, (_, i) => {
			const offset = strands > 1 ? (i - (strands - 1) / 2) * 6 : 0;
			return { x: effTip.x + offset, y: effTip.y + 4 };
		});
		const strandConverge = { x: effTip.x, y: loadY - 14 };

		return {
			chassisX0,
			chassisW,
			wheelR,
			chassisBottomY,
			chassisH,
			chassisY,
			wheelXs,
			cabW,
			cabH,
			cabX,
			cabY,
			trackX0,
			trackLen,
			trackH,
			trackY0,
			trackPts,
			treadXs,
			turretW,
			turretH,
			turretX,
			turretY,
			cwtW,
			cwtH,
			pivot,
			tip,
			effTip,
			gusekLine,
			boomQuad,
			jointLines,
			lattice,
			ropeLen,
			loadY,
			loadW,
			loadH,
			strands,
			strandTops,
			strandConverge
		};
	});

	// ── Размерные линии: рисуются только если страница передала подпись —
	//    компонент не восполняет отсутствующие в тексте цифры. ────────────────
	const dimHY = groundY + 14;
	const dimVX = VBW - PAD - 40;
</script>

<div class="craneart">
	<!-- aria-hidden — только на самой схеме: это декоративная иллюстрация силуэта, дублирующая
	     цифры, уже написанные текстом в таблице характеристик (Pairs.svelte) на той же странице.
	     Раньше aria-hidden стоял на всём .craneart целиком и заодно скрывал caption ниже — а это
	     уникальный текст-дисклеймер («не фотография техники»), которого больше нигде на странице
	     нет: скринридер должен его услышать, поэтому caption вынесен из-под aria-hidden. -->
	<svg class="craneart__svg" viewBox={`0 0 ${VBW} ${VBH}`} role="img" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
		<rect x={PAD} y={PAD} width={VBW - 2 * PAD} height={VBH - 2 * PAD} class="ca-frame" />
		<path d={corners} class="ca-corner" />
		<line x1={PAD + 16} y1={groundY} x2={VBW - PAD - 16} y2={groundY} class="ca-ground" />

		<rect x={PAD + 16} y={PAD + 16} width="108" height="40" class="ca-badge-bg" />
		<text x={PAD + 16 + 54} y={PAD + 16 + 27} class="ca-badge-text" text-anchor="middle">{capacity}</text>

		{#if kind === 'mobile'}
			<g>
				<!-- опоры -->
				<path d={`M${geo.chassisX0 + 18},${geo.chassisBottomY} L${geo.chassisX0 - 22},${geo.chassisBottomY + 16}`} class="ca-thin" />
				<rect x={geo.chassisX0 - 28} y={geo.chassisBottomY + 13} width="10" height="6" class="ca-foot" />
				<path
					d={`M${geo.chassisX0 + geo.chassisW - 18},${geo.chassisBottomY} L${geo.chassisX0 + geo.chassisW + 22},${geo.chassisBottomY + 16}`}
					class="ca-thin"
				/>
				<rect x={geo.chassisX0 + geo.chassisW + 18} y={geo.chassisBottomY + 13} width="10" height="6" class="ca-foot" />

				<!-- шасси + кабина -->
				<rect x={geo.chassisX0} y={geo.chassisY} width={geo.chassisW} height={geo.chassisH} class="ca-chassis" />
				<rect x={geo.cabX} y={geo.cabY} width={geo.cabW} height={geo.cabH} class="ca-chassis" />

				<!-- колёса -->
				{#each geo.wheelXs as cx (cx)}
					<circle cx={cx} cy={groundY - geo.wheelR} r={geo.wheelR} class="ca-wheel" />
					<circle cx={cx} cy={groundY - geo.wheelR} r={geo.wheelR * 0.36} class="ca-wheel-hub" />
				{/each}

				<!-- стрела -->
				<polygon points={geo.boomQuad} class="ca-boom" />
				{#each geo.jointLines as d (d)}
					<path {d} class="ca-boom-joint" />
				{/each}
			</g>
		{:else}
			<g>
				<!-- гусеницы -->
				<polygon points={geo.trackPts} class="ca-track" />
				{#each geo.treadXs as x (x)}
					<line x1={x} y1={geo.trackY0 + 5} x2={x - 6} y2={geo.trackY0 + geo.trackH - 5} class="ca-track-tread" />
				{/each}
				<!-- стрелка «рама сужается для трала» — над гусеницей, у концов хода -->
				<path
					d={`M${geo.trackX0 + 46},${geo.trackY0 - 12} L${geo.trackX0 + 70},${geo.trackY0 - 12} M${geo.trackX0 + 70},${geo.trackY0 - 12} L${geo.trackX0 + 63},${geo.trackY0 - 16} M${geo.trackX0 + 70},${geo.trackY0 - 12} L${geo.trackX0 + 63},${geo.trackY0 - 8}`}
					class="ca-arrow"
				/>
				<path
					d={`M${geo.trackX0 + geo.trackLen - 46},${geo.trackY0 - 12} L${geo.trackX0 + geo.trackLen - 70},${geo.trackY0 - 12} M${geo.trackX0 + geo.trackLen - 70},${geo.trackY0 - 12} L${geo.trackX0 + geo.trackLen - 63},${geo.trackY0 - 16} M${geo.trackX0 + geo.trackLen - 70},${geo.trackY0 - 12} L${geo.trackX0 + geo.trackLen - 63},${geo.trackY0 - 8}`}
					class="ca-arrow"
				/>

				<!-- поворотная платформа + противовес + кабина оператора -->
				<rect x={geo.turretX} y={geo.turretY} width={geo.turretW} height={geo.turretH} class="ca-turret" />
				<rect x={geo.turretX - geo.cwtW + 6} y={geo.turretY + geo.turretH - geo.cwtH} width={geo.cwtW} height={geo.cwtH} class="ca-cwt" />
				<rect x={geo.pivot.x - 30} y={geo.turretY + geo.turretH - 6} width="30" height="22" class="ca-chassis" />

				<!-- решётчатая стрела: рельсы + раскосы -->
				{#if geo.lattice}
					<g>
						<polyline points={ptsToStr(geo.lattice.rail1)} class="ca-lattice-rail" />
						<polyline points={ptsToStr(geo.lattice.rail2)} class="ca-lattice-rail" />
						<polyline points={ptsToStr(geo.lattice.zig)} class="ca-lattice-zig" />
					</g>
				{/if}
			</g>
		{/if}

		<!-- гусёк — пунктир: навесное, не всегда установленное звено -->
		{#if geo.gusekLine}
			<g>
				<path d={`M${fmt(geo.gusekLine.from.x)},${fmt(geo.gusekLine.from.y)} L${fmt(geo.gusekLine.to.x)},${fmt(geo.gusekLine.to.y)}`} class="ca-gusek" />
				{#if gusek}
					<text x={fmt((geo.gusekLine.from.x + geo.gusekLine.to.x) / 2 + 8)} y={fmt((geo.gusekLine.from.y + geo.gusekLine.to.y) / 2 - 8)} class="ca-note"
						>{gusek.label}</text
					>
				{/if}
			</g>
		{/if}

		<!-- канат / крюк / груз -->
		{#if geo.strands === 1}
			<line x1={geo.effTip.x} y1={geo.effTip.y} x2={geo.effTip.x} y2={geo.loadY - geo.loadH / 2} class="ca-rope" />
		{:else}
			<g>
				{#each geo.strandTops as p, i (i)}
					<line x1={p.x} y1={p.y} x2={geo.strandConverge.x} y2={geo.strandConverge.y} class="ca-rope-thin" />
				{/each}
				<line x1={geo.strandConverge.x} y1={geo.strandConverge.y} x2={geo.effTip.x} y2={geo.loadY - geo.loadH / 2} class="ca-rope" />
			</g>
		{/if}
		<rect x={geo.effTip.x - geo.loadW / 2} y={geo.loadY - geo.loadH / 2} width={geo.loadW} height={geo.loadH} class="ca-load" />

		<!-- размерные линии — только если страница передала подпись -->
		{#if boomDimLabel}
			<g>
				<path d={dimH(geo.pivot.x, geo.effTip.x, dimHY)} class="ca-dim" />
				<text x={(geo.pivot.x + geo.effTip.x) / 2} y={dimHY + 18} class="ca-dimlabel" text-anchor="middle">{boomDimLabel}</text>
			</g>
		{/if}
		{#if heightDimLabel}
			<g>
				<path d={dimV(groundY, Math.min(geo.tip.y, geo.effTip.y), dimVX)} class="ca-dim" />
				<text x={dimVX - 10} y={(groundY + Math.min(geo.tip.y, geo.effTip.y)) / 2 + 4} class="ca-dimlabel" text-anchor="end">{heightDimLabel}</text>
			</g>
		{/if}

		<!-- точечные заметки — рядом с уже нарисованными узлами -->
		{#if noteNearTip}
			<text x={geo.tip.x - 6} y={geo.tip.y - 12} class="ca-note" text-anchor="end">{noteNearTip}</text>
		{/if}
		{#if noteNearHook}
			<text x={geo.effTip.x + geo.loadW / 2 + 10} y={geo.loadY + 4} class="ca-note">{noteNearHook}</text>
		{/if}
		{#if noteNearBase}
			<!-- Позиция над кабиной (не над пивотом стрелы): пивот — это то место, откуда
			     стартует стрела при ЛЮБОМ переданном угле, и заметка над ним рисковала бы
			     наехать на стрелу при пологих углах. Кабина всегда левее пивота и ниже
			     траектории стрелы. -->
			<text
				x={kind === 'mobile' ? geo.chassisX0 + 8 : geo.turretX + geo.turretW * 0.24}
				y={kind === 'mobile' ? geo.chassisY - 40 : geo.turretY - 12}
				class="ca-note"
				text-anchor="middle">{noteNearBase}</text
			>
		{/if}

		{#if chassisLabel}
			<text x={PAD + 16} y={VBH - PAD - 14} class="ca-chassislabel">{chassisLabel}</text>
		{/if}
	</svg>
	{#if caption}
		<p class="craneart__cap">{caption}</p>
	{/if}
</div>

<style>
	.craneart {
		margin: 8px 0 8px;
		background: var(--surface);
		border: 1px solid var(--line-strong);
		padding: clamp(10px, 2.4vw, 18px);
		overflow-x: auto;
	}
	/* min-width держит текст на схеме читаемым на узких экранах: карточка
	   скроллится сама (её ширина не завязана на ширину вьюпорта), а страница
	   в целом горизонтально не переполняется — тот же приём, что у широких таблиц. */
	.craneart__svg {
		display: block;
		width: 100%;
		min-width: 600px;
		height: auto;
	}

	.craneart__cap {
		margin-top: 10px;
		font-size: var(--fs-2);
		color: var(--muted);
		max-width: 68ch;
	}

	.craneart :is(.ca-frame) {
		fill: none;
		stroke: var(--line-strong);
		stroke-width: 1.4;
		stroke-dasharray: 2 7;
	}
	.craneart :is(.ca-corner) {
		fill: none;
		stroke: var(--accent);
		stroke-width: 2.5;
		stroke-linecap: square;
	}
	.craneart .ca-ground {
		stroke: var(--line-strong);
		stroke-width: 1.4;
	}

	.craneart .ca-badge-bg {
		fill: var(--accent);
	}
	.craneart .ca-badge-text {
		fill: var(--bg);
		font-family: var(--mono);
		font-weight: 700;
		font-size: 19px;
		text-transform: uppercase;
		dominant-baseline: middle;
	}

	.craneart :is(.ca-chassis, .ca-boom, .ca-track, .ca-turret) {
		fill: var(--surface);
		stroke: var(--ink);
		stroke-width: 2.5;
		stroke-linejoin: miter;
	}
	.craneart .ca-cwt {
		fill: var(--muted);
		stroke: var(--ink);
		stroke-width: 2;
	}
	.craneart .ca-wheel {
		fill: var(--bg);
		stroke: var(--ink);
		stroke-width: 2.5;
	}
	.craneart .ca-wheel-hub {
		fill: var(--muted);
	}
	.craneart .ca-boom-joint {
		stroke: var(--muted);
		stroke-width: 1.2;
	}
	.craneart .ca-thin {
		stroke: var(--muted);
		stroke-width: 1.1;
		fill: none;
	}
	.craneart .ca-foot {
		fill: var(--muted);
	}
	.craneart .ca-track-tread {
		stroke: var(--muted);
		stroke-width: 1;
		opacity: 0.55;
	}
	.craneart .ca-arrow {
		stroke: var(--muted);
		stroke-width: 1.3;
		fill: none;
	}
	.craneart .ca-lattice-rail {
		stroke: var(--ink);
		stroke-width: 2;
		fill: none;
	}
	.craneart .ca-lattice-zig {
		stroke: var(--muted);
		stroke-width: 1.1;
		fill: none;
	}

	.craneart .ca-gusek {
		stroke: var(--muted);
		stroke-width: 2;
		stroke-dasharray: 5 4;
		fill: none;
	}
	.craneart :is(.ca-rope, .ca-rope-thin) {
		stroke: var(--accent);
	}
	.craneart .ca-rope {
		stroke-width: 1.6;
	}
	.craneart .ca-rope-thin {
		stroke-width: 1.1;
		opacity: 0.75;
	}
	.craneart .ca-load {
		fill: var(--surface);
		stroke: var(--accent);
		stroke-width: 2.2;
	}

	.craneart .ca-dim {
		stroke: var(--line-strong);
		stroke-width: 1.4;
		fill: none;
	}
	.craneart .ca-dimlabel {
		fill: var(--muted);
		font-family: var(--mono);
		font-size: 13px;
	}
	.craneart .ca-note {
		fill: var(--ink);
		font-family: var(--mono);
		font-size: 13px;
	}
	.craneart .ca-chassislabel {
		fill: var(--muted);
		font-family: var(--mono);
		font-size: 13px;
	}

	.craneart :is(line, polyline, polygon, path, rect) {
		vector-effect: non-scaling-stroke;
	}
</style>
