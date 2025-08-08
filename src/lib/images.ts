const IK_ENDPOINT = 'https://ik.imagekit.io/dmnjbbzfp';

type BuildOptions = {
    w?: number;
    q?: number;
    dpr?: number;
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
};

function getPathnameFromUrl(url: string): string {
    try {
        const u = new URL(url);
        return u.pathname || '';
    } catch {
        return '';
    }
}

function stripLeadingSlash(input: string): string {
    return input.replace(/^\/+/, '');
}

function removeProductImagesPrefix(pathname: string): string {
    return pathname.replace(/^\/?product-images\/?/i, '');
}

function normalizeToIkPath(src: string): string | null {
    if (!src) return null;

    if (src.startsWith(IK_ENDPOINT)) {
        const pathname = getPathnameFromUrl(src);
        return stripLeadingSlash(pathname);
    }

    if (/^https?:\/\/svelte-store\.ianbytes\.com/i.test(src)) {
        const pathname = getPathnameFromUrl(src);
        const file = removeProductImagesPrefix(pathname);
        return stripLeadingSlash(file);
    }

    if (/^\/product-images\//i.test(src)) {
        const file = removeProductImagesPrefix(src);
        return stripLeadingSlash(file);
    }

    if (!src.includes('/')) {
        return src;
    }

    return null;
}

function buildTransform({ w, q, dpr, format }: BuildOptions): string {
    const parts = [
        `f-${format ?? 'auto'}`,
        `q-${q ?? 75}`,
        dpr ? `dpr-${dpr}` : ''
    ].filter(Boolean);
    if (w) parts.push(`w-${w}`);
    return parts.join(',');
}

export function ikUrl(src: string, opts: BuildOptions = {}): string {
    const file = normalizeToIkPath(src);
    if (!file) return src;

    const tr = buildTransform(opts);
    const trPart = tr ? `/tr:${tr}` : '';
    return `${IK_ENDPOINT}${trPart}/${file}`;
}

export function ikSrcSet(src: string, widths: number[] = [320, 480, 768, 1024, 1280]): string {
    const file = normalizeToIkPath(src);
    if (!file) return '';

    return widths
        .map((w) => {
            const tr = buildTransform({ w });
            return `${IK_ENDPOINT}/tr:${tr}/${file} ${w}w`;
        })
        .join(', ');
}

export const IK_ENDPOINT_BASE = IK_ENDPOINT;


