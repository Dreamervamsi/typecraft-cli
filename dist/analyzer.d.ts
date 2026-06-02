export type Finding = {
    kind: 'missing-param-type' | 'missing-return-type' | 'missing-variable-type' | 'missing-object-type' | 'missing-class-property-type';
    message: string;
    line: number;
    file: string;
    code: string;
};
export declare function analyzeFiles(files: string[]): Finding[];
//# sourceMappingURL=analyzer.d.ts.map