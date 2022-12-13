declare module 'xml-but-prettier' {
  const format: (
    value: string,
    options: { textNodesOnSameLine: boolean; indentor: string }
  ) => string;
  export default format;
}
