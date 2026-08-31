// Транслитерация кириллицы в латиницу для генерации id-slug у заголовков.
// Используется и в статьях (id на <h2>), и в оглавлении — чтобы якорные ссылки
// работали одинаково и без JavaScript.
const MAP: Record<string, string> = {
	а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y',
	к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
	х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};

export function slugify(text: string): string {
	const lower = text.toLowerCase();
	let out = '';
	for (const ch of lower) {
		if (MAP[ch] !== undefined) out += MAP[ch];
		else if (/[a-z0-9]/.test(ch)) out += ch;
		else out += '-';
	}
	return out.replace(/-+/g, '-').replace(/^-|-$/g, '');
}
