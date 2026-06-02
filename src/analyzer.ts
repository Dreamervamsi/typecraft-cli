import ts from 'typescript';
import fs from 'node:fs';

export type Finding = {
  kind:
    | 'missing-param-type'
    | 'missing-return-type'
    | 'missing-variable-type'
    | 'missing-object-type'
    | 'missing-class-property-type';
  message: string;
  line: number;
  file: string;
  code: string;
};

export function analyzeFiles(files: string[]): Finding[] {
  const findings: Finding[] = [];

  for (const filepath of files) {
    if (!fs.existsSync(filepath)) continue;
    const sourceCode = fs.readFileSync(filepath, 'utf-8');

    const sourceFile = ts.createSourceFile(
      filepath,
      sourceCode,
      ts.ScriptTarget.Latest,
      true,
    );

    function visit(node: ts.Node): void {
      // Functions: param types + return type
      if (
        ts.isFunctionDeclaration(node) ||
        ts.isArrowFunction(node) ||
        ts.isMethodDeclaration(node) ||
        ts.isFunctionExpression(node)
      ) {
        
        node.parameters.forEach((param) => {
          if (param.dotDotDotToken) return;

          if (!param.type) {
            const fnName =
              ts.isFunctionDeclaration(node) && node.name
                ? node.name.getText(sourceFile)
                : 'anonymous';
            const paramName = param.name.getText(sourceFile);
            const { line } = sourceFile.getLineAndCharacterOfPosition(
              param.getStart(sourceFile),
            );

            findings.push({
              kind: 'missing-param-type',
              message: `Param "${paramName}" in fn "${fnName}" has no type`,
              line: line + 1,
              file: filepath,
              code: sourceCode
                .split('\n')
                .slice(Math.max(0, line - 1), line + 3)
                .join('\n'),
            });
          }
        });

        if (!node.type) {
          const isCallback =
            (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) &&
            node.parent != null &&
            ts.isCallExpression(node.parent);

          if (!isCallback) {
            const fnName =
              ts.isFunctionDeclaration(node) && node.name
                ? node.name.getText(sourceFile)
                : 'anonymous';
            const { line } = sourceFile.getLineAndCharacterOfPosition(
              node.getStart(sourceFile),
            );

            findings.push({
              kind: 'missing-return-type',
              message: `Fn "${fnName}" has no return type`,
              line: line + 1,
              file: filepath,
              code: sourceCode
                .split('\n')
                .slice(line, line + 4)
                .join('\n'),
            });
          }
        }
      }

      // ─── 2. Variable declarations with no type annotation ──────────────────
      else if (ts.isVariableDeclaration(node)) {
        if (!node.type && node.initializer) {
          const init = node.initializer;

          // Arrow functions / function expressions assigned to a variable are
          // handled by the function branch above — skip here.
          const isFunc =
            ts.isArrowFunction(init) || ts.isFunctionExpression(init);

          // Object literals are handled by branch 3 — skip here.
          const isObj = ts.isObjectLiteralExpression(init);

          // Simple primitive literals: TS infers these perfectly.
          const isPrimitive =
            ts.isStringLiteral(init) ||
            ts.isNumericLiteral(init) ||
            init.kind === ts.SyntaxKind.TrueKeyword ||
            init.kind === ts.SyntaxKind.FalseKeyword ||
            init.kind === ts.SyntaxKind.NullKeyword ||
            init.kind === ts.SyntaxKind.UndefinedKeyword;

          const isWellInferred =
            ts.isCallExpression(init) ||
            ts.isAwaitExpression(init) ||
            ts.isAsExpression(init) ||
            ts.isTypeAssertionExpression(init) ||
            ts.isBinaryExpression(init) ||
            ts.isConditionalExpression(init) ||
            ts.isTemplateExpression(init) ||
            ts.isPrefixUnaryExpression(init) ||
            ts.isPostfixUnaryExpression(init) ||
            ts.isPropertyAccessExpression(init) ||
            ts.isElementAccessExpression(init) ||
            ts.isNewExpression(init) ||
            ts.isArrayLiteralExpression(init) ||
            ts.isNonNullExpression(init) ||
            ts.isParenthesizedExpression(init);

          if (!isFunc && !isObj && !isPrimitive && !isWellInferred) {
            const varName = node.name.getText(sourceFile);
            const { line } = sourceFile.getLineAndCharacterOfPosition(
              node.getStart(sourceFile),
            );

            findings.push({
              kind: 'missing-variable-type',
              message: `Variable "${varName}" has no type annotation`,
              line: line + 1,
              file: filepath,
              code: sourceCode
                .split('\n')
                .slice(line, line + 2)
                .join('\n'),
            });
          }
        }
      }

      // ─── 3. Object literals assigned to untyped variables ──────────────────
      else if (ts.isObjectLiteralExpression(node)) {
        const parent = node.parent;
        if (
          parent != null &&
          ts.isVariableDeclaration(parent) &&
          !parent.type
        ) {
          const varName = parent.name.getText(sourceFile);
          const { line } = sourceFile.getLineAndCharacterOfPosition(
            node.getStart(sourceFile),
          );
          const props = node.properties
            .map((p) => p.name?.getText(sourceFile))
            .filter(Boolean)
            .join(', ');

          findings.push({
            kind: 'missing-object-type',
            message: `Object "${varName}" has no interface/type — properties: { ${props} }`,
            line: line + 1,
            file: filepath,
            code: sourceCode
              .split('\n')
              .slice(Math.max(0, line - 1), line + 4)
              .join('\n'),
          });
        }
      }

      // ─── 4. Class properties with no type annotation ───────────────────────
      else if (ts.isPropertyDeclaration(node)) {
        if (!node.type) {
          const propName = node.name.getText(sourceFile);
          const className =
            ts.isClassDeclaration(node.parent) && node.parent.name
              ? node.parent.name.getText(sourceFile)
              : 'UnknownClass';
          const { line } = sourceFile.getLineAndCharacterOfPosition(
            node.getStart(sourceFile),
          );

          findings.push({
            kind: 'missing-class-property-type',
            message: `Class property "${propName}" in "${className}" has no type`,
            line: line + 1,
            file: filepath,
            code: sourceCode
              .split('\n')
              .slice(Math.max(0, line - 1), line + 2)
              .join('\n'),
          });
        }
      }

      // Recurse into all child nodes
      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  }

  return findings;
}