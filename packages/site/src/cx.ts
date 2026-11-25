export const cx = (...c: Array<string | false | undefined | null>) => c.filter(Boolean).join(' ');
