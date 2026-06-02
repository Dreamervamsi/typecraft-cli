import glob from 'fast-glob';

export async function scanFiles(): Promise<string[]> {
  const cwd: string = process.env.INIT_CWD ?? process.cwd();

  return glob(['**/*.ts', '**/*.tsx'], {
    cwd,
    ignore: ['**/node_modules/**', '**/dist/**', '**/*.d.ts'],
    absolute: true,
  });
}