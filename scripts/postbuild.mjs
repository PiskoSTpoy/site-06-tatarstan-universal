// Постобработка сборки. Запускается из npm run build сразу после vite build.
//
// Делает ровно три вещи, которые SvelteKit сам сделать не может:
//
// 1. build/404.html. adapter-static кладёт туда SPA-оболочку без title, description, JSON-LD
//    и телефона. Вместо неё берём предрендеренный маршрут /404/ и вырезаем клиентский
//    бутстрап: получается статическая страница, которая одинаково выглядит у поисковика,
//    у человека с выключенным JS и у браузера, пришедшего по любому несуществующему адресу
//    (гидрировать себя как маршрут /404/ она не пытается — скрипта в ней уже нет).
//    Каталог build/404/ удаляется, чтобы у страницы не было второго индексируемого адреса.
//
// 2. build/sitemap.xml с честным lastmod. Google учитывает lastmod, только если тот
//    последовательно и проверяемо точен; одинаковая у всех страниц дата сборки обесценивает
//    сигнал для всего домена. Поэтому дата берётся из mtime ИСХОДНОГО файла страницы
//    (src/routes/<путь>/+page.svelte), а не из момента сборки: две сборки подряд без правок
//    контента дают побайтово одинаковый sitemap.
//
//    Оговорка, которую честнее назвать вслух: mtime — это дата правки файла маршрута, а не
//    «дата последнего изменения контента» в широком смысле. Если страница поменялась из-за
//    правки общего компонента ($lib) или общего лейаута, её lastmod не сдвинется. Обратное
//    (сдвиг lastmod без изменения контента — например, от правки комментария) тоже возможно.
//    Точнее этого без ручного поля «дата обновления» в каждой странице не сделать, а
//    выдумывать дату сборки — хуже, чем не иметь lastmod вовсе.
//
// 3. Уборка недостижимых чанков клиента. Vite собирает клиентский бандл для ВСЕХ маршрутов,
//    даже если у маршрута `csr = false` и его чанк не подключён ни к одной странице. На этом
//    сайте клиентский рендер включён только на главной, а переходы по ссылкам — обычная
//    навигация браузера (data-sveltekit-reload), поэтому чанки остальных 37 маршрутов не
//    может запросить никто: ни разметка, ни роутер. Это мёртвый код, который Rollup не умеет
//    вытрясти сам, — 550 КБ из 695 КБ всего JS сборки. Список «живых» файлов считается не
//    вручную, а обходом: что реально упомянуто в HTML + транзитивно то, что эти файлы
//    импортируют. Ниже удаляется строго остаток.

import { readdirSync, statSync, readFileSync, writeFileSync, rmSync, existsSync, unlinkSync } from 'node:fs';
import { join, sep, relative } from 'node:path';

const BUILD = 'build';
const ROUTES = join('src', 'routes');
const SITE = 'https://kran-rt.example';

// ── 1. build/404.html ────────────────────────────────────────────────────────
const src404 = join(BUILD, '404', 'index.html');
if (!existsSync(src404)) {
	console.error('postbuild: не найден build/404/index.html — маршрут /404/ не предрендерился');
	process.exit(1);
}

let html = readFileSync(src404, 'utf8');
const before = html.length;

// Инлайновый бутстрап SvelteKit: <script> ... kit.start(app, element, {...}) ... </script>
html = html.replace(/[\t ]*<script>[\s\S]*?kit\.start\(app, element[\s\S]*?<\/script>\s*/g, '');
// modulepreload-ссылки на чанки, которые этой странице больше не нужны
html = html.replace(/[\t ]*<link[^>]+rel="modulepreload"[^>]*>\s*/g, '');

if (/kit\.start\(/.test(html)) {
	console.error('postbuild: клиентский бутстрап не вырезан из 404 — проверь шаблон SvelteKit');
	process.exit(1);
}

// SvelteKit ссылается на ассеты предрендеренной страницы ОТНОСИТЕЛЬНО её каталога
// (../_app/...). Для /404/index.html это верно, для build/404.html — уже нет: сервер отдаёт
// этот файл по ЛЮБОМУ несуществующему адресу, и с /a/b/c/ путь ../_app/ ушёл бы в /a/b/_app/,
// то есть страница пришла бы без стилей. Переписываем на абсолютные — они верны с любой
// глубины. Проверка ниже не даёт пропустить относительную ссылку нового вида.
html = html.replace(/(href|src|srcset)="\.\.\//g, '$1="/');
const stillRelative = html.match(/(?:href|src|srcset)="\.\.?\//g);
if (stillRelative) {
	console.error(`postbuild: в 404 остались относительные ссылки (${stillRelative.join(', ')}) — они сломают страницу на вложенных адресах`);
	process.exit(1);
}

writeFileSync(join(BUILD, '404.html'), html, 'utf8');
rmSync(join(BUILD, '404'), { recursive: true, force: true });
console.log(`postbuild: build/404.html собран из маршрута /404/ (${before} -> ${html.length} байт, без клиентского бутстрапа)`);

// ── 2. build/sitemap.xml ─────────────────────────────────────────────────────
/** Все предрендеренные страницы сборки: путь URL -> путь к index.html */
function pages(dir = BUILD, prefix = '/') {
	const out = [];
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		if (statSync(p).isDirectory()) {
			if (name === '_app') continue;
			out.push(...pages(p, prefix + name + '/'));
		} else if (name === 'index.html') {
			out.push(prefix);
		}
	}
	return out;
}

/**
 * mtime исходного файла маршрута в полном формате W3C Datetime (YYYY-MM-DDThh:mm:ssZ).
 *
 * Раньше здесь стоял .slice(0, 10) — от честного посекундного mtime оставалась одна
 * календарная дата. Пока правки сайта шли волнами по одной странице, даты различались и
 * это не было заметно; мобильная волна тронула 34 маршрута из 38 за один день — и все
 * 37 адресов карты получили ровно одно значение «2026-08-26». Для поисковика это
 * неотличимо от подстановки даты сборки: сигнал свежести обесценивается для всего домена
 * (ровно это и ловит проверка tech-sitemap-lastmod).
 *
 * Дата при этом была ПРАВДОЙ — файлы действительно правились в этот день. Врало не
 * значение, а его точность: посекундный mtime огрублялся до суток, и правки, разнесённые
 * на восемь часов, становились неразличимы. Полный W3C Datetime разрешён спецификацией
 * sitemaps.org наравне с короткой формой и принимается Google; ничего не выдумывается —
 * публикуется тот же mtime, только не обрезанный.
 *
 * Миллисекунды отбрасываются: в профиле W3C Datetime доли секунды допустимы, но никакой
 * потребитель карты их не использует, а шум в диффе они дают.
 */
function lastmod(urlPath) {
	const routeDir = urlPath === '/' ? ROUTES : join(ROUTES, urlPath.slice(1, -1).split('/').join(sep));
	const file = join(routeDir, '+page.svelte');
	if (!existsSync(file)) return null;
	return statSync(file).mtime.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

const urls = pages().sort();
const missing = [];
const lines = [
	'<?xml version="1.0" encoding="UTF-8"?>',
	'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
];
for (const u of urls) {
	const mod = lastmod(u);
	if (!mod) {
		missing.push(u);
		continue;
	}
	// changefreq и priority не пишем сознательно: Google их игнорирует, Яндекс учитывает
	// в лучшем случае как слабую подсказку, а руками поддерживать их по 35 адресам —
	// значит гарантированно разъехаться с реальностью. Точный lastmod полезнее их обоих.
	lines.push(`  <url><loc>${SITE}${u}</loc><lastmod>${mod}</lastmod></url>`);
}
lines.push('</urlset>', '');

if (missing.length) {
	console.error(`postbuild: не найден исходник маршрута для ${missing.length} адресов: ${missing.join(', ')}`);
	process.exit(1);
}

writeFileSync(join(BUILD, 'sitemap.xml'), lines.join('\n'), 'utf8');
const uniq = new Set(lines.filter((l) => l.includes('<lastmod>')).map((l) => l.match(/<lastmod>(.+?)<\/lastmod>/)[1]));
const uniqDays = new Set([...uniq].map((v) => v.slice(0, 10)));
console.log(
	`postbuild: build/sitemap.xml — ${urls.length} адресов, ${uniq.size} различных значений lastmod ` +
	`(${uniqDays.size} календарных дат)`);

// ── 3. уборка недостижимых чанков клиента ────────────────────────────────────
const IMM = join(BUILD, '_app', 'immutable');

/** Все .js сборки: путь вида `_app/immutable/nodes/2.HASH.js` -> абсолютный путь на диске */
function jsFiles(dir, out = new Map()) {
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		if (statSync(p).isDirectory()) jsFiles(p, out);
		else if (name.endsWith('.js')) out.set(relative(BUILD, p).split(sep).join('/'), p);
	}
	return out;
}

/** Все .html сборки (включая 404.html в корне) */
function htmlFiles(dir, out = []) {
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		if (statSync(p).isDirectory()) htmlFiles(p, out);
		else if (name.endsWith('.html')) out.push(p);
	}
	return out;
}

if (existsSync(IMM)) {
	const all = jsFiles(IMM);
	const byBase = new Map([...all.keys()].map((k) => [k.split('/').pop(), k]));
	const isNode = (k) => k.startsWith('_app/immutable/nodes/');

	// Затравка: то, что реально упомянуто в HTML (скрипты и modulepreload).
	const alive = new Set();
	for (const f of htmlFiles(BUILD)) {
		const html = readFileSync(f, 'utf8');
		for (const m of html.matchAll(/_app\/immutable\/[A-Za-z0-9_./-]+\.js/g)) {
			if (all.has(m[0])) alive.add(m[0]);
		}
	}
	// Узлы 0 и 1 — корневой лейаут и корневая страница ошибки. Их HTML не подключает,
	// но SvelteKit подтягивает страницу ошибки, если гидрация главной упала: удалять её
	// значило бы менять поведение, а не убирать мёртвый код.
	for (const [base, key] of byBase) if (/^[01]\./.test(base)) alive.add(key);

	// Транзитивное замыкание. Через чанки идём, через узлы — нет: узел маршрута попадает
	// в исполнение единственным путём — динамическим import() из таблицы роутера в
	// entry/app.js, а роутер на этом сайте не работает вовсе (data-sveltekit-reload).
	const queue = [...alive];
	while (queue.length) {
		const key = queue.pop();
		const body = readFileSync(all.get(key), 'utf8');
		// Имена файлов сборки бывают двух видов: `2.r1_iFanT.js` у узлов маршрутов и
		// `D7B9eqzq.js` у общих чанков. Регэксп обязан покрывать оба — иначе чанк, который
		// нужен только одному живому файлу, не попадёт в живые и будет удалён.
		for (const m of body.matchAll(/[A-Za-z0-9_$-]+(?:\.[A-Za-z0-9_$-]+)?\.js/g)) {
			const dep = byBase.get(m[0]);
			if (!dep || alive.has(dep) || isNode(dep)) continue;
			alive.add(dep);
			queue.push(dep);
		}
	}

	let removed = 0;
	let removedBytes = 0;
	for (const [key, abs] of all) {
		if (alive.has(key)) continue;
		removedBytes += statSync(abs).size;
		unlinkSync(abs);
		removed++;
	}

	// Контроль: ни одна страница не должна ссылаться на удалённый файл.
	const dangling = [];
	for (const f of htmlFiles(BUILD)) {
		const html = readFileSync(f, 'utf8');
		for (const m of html.matchAll(/_app\/immutable\/[A-Za-z0-9_./-]+\.js/g)) {
			if (!existsSync(join(BUILD, m[0].split('/').join(sep)))) dangling.push(`${relative(BUILD, f)} -> ${m[0]}`);
		}
	}
	if (dangling.length) {
		console.error(`postbuild: удалён файл, на который ссылается страница: ${dangling.join(', ')}`);
		process.exit(1);
	}

	const leftBytes = [...alive].reduce((s, k) => s + (existsSync(all.get(k)) ? statSync(all.get(k)).size : 0), 0);
	console.log(
		`postbuild: удалено ${removed} недостижимых чанков (${(removedBytes / 1024).toFixed(0)} КБ), ` +
			`в сборке осталось ${(leftBytes / 1024).toFixed(0)} КБ JS`
	);
}
