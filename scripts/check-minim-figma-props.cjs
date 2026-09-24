const fs = require('node:fs');
const ts = require('typescript');

const input = process.argv[2];
if (!input) throw new Error('Usage: node scripts/check-minim-figma-props.cjs snapshot.json');
const snapshot = JSON.parse(fs.readFileSync(input, 'utf8'));
const pages = snapshot.pages || snapshot;
const config = ts.readConfigFile('packages/core/tsconfig.json', ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, 'packages/core');
const program = ts.createProgram(
  [...parsed.fileNames, 'packages/themes/minim/src/token-colors.ts'],
  {...parsed.options, paths: {'@astryxdesign/core/*': ['./packages/core/src/*']}, pathsBasePath: process.cwd()},
);
const checker = program.getTypeChecker();
const camel = (name) => name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const kebab = (value) => value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/_/g, '-').toLowerCase();
const aliases = {
  'menu-divider': 'DropdownMenuDividerProps',
  'menu-item': 'DropdownMenuItemProps',
  'menu-checkbox-item': 'DropdownMenuCheckboxItemProps',
  'menu-radio-item': 'DropdownMenuRadioItemProps',
  'switch-control': 'SwitchProps',
  'slot-checkbox-content': 'CheckboxInputProps',
  'slot-radio-content': 'RadioListItemProps',
  'tree-list-item': 'TreeListItemInternalProps',
};
const results = [];
for (const page of pages) for (const row of page.rows) {
  if (!row.source) continue;
  const source = program.getSourceFile(row.source.match(/^.*?\.tsx?/)?.[0] || row.source);
  if (!source) { results.push({id: row.id, name: row.name, error: 'source missing'}); continue; }
  const base = row.name.split('/').at(-1);
  const target = aliases[base] || camel(base).replace(/^./, (c) => c.toUpperCase()) + 'Props';
  const declarations = source.statements.filter((n) =>
    (ts.isInterfaceDeclaration(n) || ts.isTypeAliasDeclaration(n)) && n.name.text === target);
  if (!declarations.length) { results.push({id: row.id, name: row.name, error: 'props declaration missing', target}); continue; }
  const type = checker.getTypeAtLocation(declarations[0]);
  for (const [key, figma] of Object.entries(row.props)) {
    const name = key.split('#')[0];
    const symbol = type.getProperty(camel(name));
    if (!symbol) continue; // Presence controls and composition helpers are documented separately.
    const propType = checker.getTypeOfSymbolAtLocation(symbol, declarations[0]);
    const parts = propType.isUnion() ? propType.types : [propType];
    const values = parts.filter((p) => p.isStringLiteral() || p.isNumberLiteral() || p.flags & ts.TypeFlags.BooleanLiteral)
      .map((p) => kebab(p.value === undefined ? p.intrinsicName : String(p.value)));
    const isClosed = parts.every((p) => p.isStringLiteral() || p.isNumberLiteral() || p.flags & (ts.TypeFlags.BooleanLiteral | ts.TypeFlags.Undefined | ts.TypeFlags.Null));
    if (figma.type === 'VARIANT' && isClosed && values.length) {
      const optionalStatus = name === 'status' && parts.some((p) => p.flags & ts.TypeFlags.Undefined);
      const invalid = figma.values.filter((v) => !values.includes(v) && !(v === 'none' && optionalStatus));
      if (invalid.length) results.push({id: row.id, name: row.name, property: name, invalid, allowed: values});
    }
  }
}
console.log(JSON.stringify(results, null, 2));
process.exitCode = results.length ? 1 : 0;
