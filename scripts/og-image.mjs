/**
 * og-image.mjs — статичная OG-картинка 1200×630 для превью ссылки в мессенджерах и соцсетях.
 * Без неё ссылка на сайт разворачивается голым текстом.
 *
 * Сборка — SVG → PNG через sharp. Именно PNG: Telegram, VK и WhatsApp растровые og:image
 * понимают, а SVG в og:image игнорирует почти всё.
 *
 * ПРО ШРИФТЫ, честно. librsvg внутри sharp берёт гарнитуры из системы, а не из static/fonts,
 * поэтому Play и PT Mono с сайта здесь недоступны — указаны системные Segoe UI / Consolas
 * с фолбэком. Кириллица в этой связке проверена глазами на готовом файле, а не «должна
 * работать». Если сборка переедет на машину без этих гарнитур, картинку надо пересмотреть,
 * а не выкладывать вслепую.
 *
 * ПРО СОДЕРЖАНИЕ. На картинке нет ни одного факта, которого нет на самом сайте: имя бренда,
 * заголовок главной, четыре города из описания главной и тема сайта. Ни парка, ни стажа,
 * ни телефона — их на картинке быть не должно, пока они не подтверждены заказчиком.
 *
 * Запуск: node scripts/og-image.mjs   (или npm run og)
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'static', 'og-cover.png');

// Палитра — ровно та же, что в design-code.md и в app.css.
const BG = '#0F1512';
const SURFACE = '#161D19';
const INK = '#E8ECE9';
const ACCENT = '#3ECF8E';
const MUTED = '#7C8A82';
const LINE = '#24312A';

const SANS = "'Segoe UI', 'Noto Sans', Arial, sans-serif";
const MONO = "Consolas, 'DejaVu Sans Mono', 'Courier New', monospace";

// Координатная сетка — тот же приём, что на фоне страниц сайта.
let grid = '';
for (let x = 0; x <= 1200; x += 40) {
	grid += `<line x1="${x}" y1="0" x2="${x}" y2="630" stroke="${LINE}" stroke-width="1"/>`;
}
for (let y = 0; y <= 630; y += 40) {
	grid += `<line x1="0" y1="${y}" x2="1200" y2="${y}" stroke="${LINE}" stroke-width="1"/>`;
}

// Схема стрелового крана — решётчатая стрела, как в HeroIllustration на главной.
const boom = `
	<g transform="translate(830 96)" fill="none" stroke="${ACCENT}" stroke-width="4" stroke-linejoin="round">
		<path d="M 40 300 L 250 40"/>
		<path d="M 74 300 L 284 40"/>
		<path d="M 40 300 L 74 300 M 75 264 L 109 264 M 110 228 L 144 228 M 145 192 L 179 192
		         M 180 156 L 214 156 M 215 120 L 249 120 M 250 84 L 284 84 M 250 40 L 284 40"/>
		<path d="M 267 40 L 267 118"/>
		<path d="M 247 118 h 40 v 30 h -40 Z"/>
		<path d="M 8 300 h 108 v 44 H 8 Z"/>
		<path d="M 0 356 h 132" stroke-width="6"/>
	</g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
	<rect width="1200" height="630" fill="${BG}"/>
	${grid}
	<rect x="0" y="0" width="1200" height="8" fill="${ACCENT}"/>
	${boom}

	<!-- левая колонка: марка, заголовок, города -->
	<text x="80" y="112" font-family="${MONO}" font-size="26" letter-spacing="7" fill="${ACCENT}">KRAN-RT</text>
	<line x1="80" y1="140" x2="240" y2="140" stroke="${ACCENT}" stroke-width="2"/>

	<text x="80" y="236" font-family="${SANS}" font-size="60" font-weight="700" fill="${INK}">Допуск крана</text>
	<text x="80" y="308" font-family="${SANS}" font-size="60" font-weight="700" fill="${INK}">на объект</text>
	<text x="80" y="380" font-family="${SANS}" font-size="60" font-weight="700" fill="${ACCENT}">в Татарстане</text>

	<text x="80" y="452" font-family="${MONO}" font-size="24" fill="${MUTED}">Казань · Нижнекамск · Челны · Альметьевск</text>

	<!-- плашка темы сайта -->
	<rect x="80" y="500" width="632" height="66" fill="${SURFACE}" stroke="${LINE}" stroke-width="2"/>
	<rect x="80" y="500" width="4" height="66" fill="${ACCENT}"/>
	<text x="108" y="541" font-family="${MONO}" font-size="23" fill="${INK}">наряд-допуск на газоопасные работы</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(OUT);
console.log(`og-image: ${path.relative(ROOT, OUT)} — 1200×630`);

/*
 * apple-touch-icon.png — иконка для «на экран Домой» в iOS. SVG-фавиконку Safari для этой
 * роли не берёт, поэтому тот же знак сайта (терминальная подсказка «>_») растрируется в
 * 180×180. Отдельного рисунка нет и не нужно: источник один — static/favicon.svg.
 */
const ICON_SRC = path.join(ROOT, 'static', 'favicon.svg');
const ICON_OUT = path.join(ROOT, 'static', 'apple-touch-icon.png');
await sharp(ICON_SRC, { density: 720 }).resize(180, 180).png({ compressionLevel: 9 }).toFile(ICON_OUT);
console.log(`og-image: ${path.relative(ROOT, ICON_OUT)} — 180×180`);
